'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { searchPostsWithWeighting } from '../lib/blogUtils';

export const useBlogStats = slug => {
  const [stats, setStats] = useState({ views: 0, likes: 0 });
  const [loading, setLoading] = useState(true);

  // Lade Stats beim ersten Render
  useEffect(() => {
    if (slug) {
      loadStats();
    }
  }, [slug]);

  const loadStats = async () => {
    try {
      // Prüfe ob Supabase verfügbar ist und konfiguriert
      if (!supabase || !supabase.from) {
        console.warn('Supabase not available, using localStorage fallback');
        loadLocalStats();
        return;
      }

      // Test Supabase Verbindung
      const { error: testError } = await supabase
        .from('blog_stats')
        .select('count')
        .limit(1)
        .maybeSingle();

      if (testError) {
        console.warn(
          'Supabase connection test failed, using localStorage:',
          testError.message
        );
        loadLocalStats();
        return;
      }

      const now = new Date().toISOString();
      const { data: initialData, error: initialError } = await supabase
        .from('blog_stats')
        .select('views, likes')
        .eq('slug', slug)
        .single();

      if (initialError && initialError.code === 'PGRST116') {
        // Post existiert noch nicht, erstelle ihn mit 0 Werten
        const { data: newData, error: insertError } = await supabase
          .from('blog_stats')
          .insert([
            {
              slug,
              views: 0,
              likes: 0,
              created_at: now,
              updated_at: now,
            },
          ])
          .select('views, likes')
          .single();

        if (insertError) {
          console.warn(
            'Error creating blog stats, falling back to localStorage:',
            insertError.message || 'Unknown error'
          );
          loadLocalStats();
          return;
        }
        setStats(newData || { views: 0, likes: 0 });
      } else if (initialError) {
        console.warn(
          'Error loading blog stats, using localStorage fallback:',
          initialError.message
        );
        loadLocalStats();
        return;
      } else {
        setStats(initialData || { views: 0, likes: 0 });
      }
    } catch (error) {
      console.warn(
        'Error in loadStats, using localStorage fallback:',
        error.message
      );
      loadLocalStats();
    } finally {
      setLoading(false);
    }
  };

  // Fallback auf localStorage
  const loadLocalStats = () => {
    try {
      if (typeof window === 'undefined') {
        setStats({ views: 0, likes: 0 });
        setLoading(false);
        return;
      }

      const localStats = localStorage.getItem(`blog_stats_${slug}`);
      if (localStats) {
        const parsed = JSON.parse(localStats);
        setStats(parsed);
      } else {
        setStats({ views: 0, likes: 0 });
        // Speichere initiale Stats
        localStorage.setItem(
          `blog_stats_${slug}`,
          JSON.stringify({ views: 0, likes: 0 })
        );
      }
    } catch (error) {
      console.warn('Error loading localStorage stats:', error);
      setStats({ views: 0, likes: 0 });
    }
    setLoading(false);
  };

  // Speichere Stats in localStorage
  const saveLocalStats = newStats => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`blog_stats_${slug}`, JSON.stringify(newStats));
      }
    } catch (error) {
      console.warn('Error saving localStorage stats:', error);
    }
  };

  const incrementViews = async () => {
    try {
      console.log('Incrementing views for slug:', slug);

      // Prüfe ob Supabase verfügbar ist
      if (!supabase || !supabase.from) {
        return incrementViewsLocal();
      }

      // Verwende direkte Upsert-Methode statt RPC für bessere Zuverlässigkeit
      const { data: currentData, error: selectError } = await supabase
        .from('blog_stats')
        .select('views, likes')
        .eq('slug', slug)
        .single();

      let newViews = 1;
      let currentLikes = 0;

      if (!selectError && currentData) {
        newViews = (currentData.views || 0) + 1;
        currentLikes = currentData.likes || 0;
      }

      // Upsert: Update wenn existiert, Insert wenn nicht
      const { data: upsertData, error: upsertError } = await supabase
        .from('blog_stats')
        .upsert(
          {
            slug: slug,
            views: newViews,
            likes: currentLikes,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'slug',
            ignoreDuplicates: false,
          }
        )
        .select('views, likes')
        .single();

      if (upsertError) {
        console.warn(
          'Error upserting views, using localStorage:',
          upsertError.message
        );
        return incrementViewsLocal();
      }

      console.log('Views incremented successfully:', upsertData);
      setStats(upsertData);
    } catch (error) {
      console.warn(
        'Error in incrementViews, using localStorage:',
        error.message
      );
      incrementViewsLocal();
    }
  };

  // Lokale View-Incrementierung
  const incrementViewsLocal = () => {
    try {
      const currentStats = { ...stats };
      const newStats = {
        views: (currentStats.views || 0) + 1,
        likes: currentStats.likes || 0,
      };

      setStats(newStats);
      saveLocalStats(newStats);
      console.log('Views incremented locally:', newStats);
    } catch (error) {
      console.warn('Error incrementing views locally:', error);
    }
  };

  // Fallback RPC-Methode
  const incrementViewsRPC = async () => {
    try {
      const { data, error } = await supabase.rpc('increment_views', {
        post_slug: slug,
      });

      if (error) {
        console.error('RPC Error incrementing views:', error);
        // Stats neu laden als letzter Ausweg
        await loadStats();
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        setStats({
          views: data[0].views,
          likes: data[0].likes,
        });
      } else if (data && !Array.isArray(data)) {
        setStats({
          views: data.views,
          likes: data.likes,
        });
      } else {
        await loadStats();
      }
    } catch (error) {
      console.error('Error in RPC fallback:', error);
      await loadStats();
    }
  };

  const incrementLikes = async () => {
    try {
      console.log('Incrementing likes for slug:', slug);

      // Prüfe ob Supabase verfügbar ist
      if (!supabase || !supabase.from) {
        return incrementLikesLocal();
      }

      // Verwende direkte Upsert-Methode
      const { data: currentData, error: selectError } = await supabase
        .from('blog_stats')
        .select('views, likes')
        .eq('slug', slug)
        .single();

      let currentViews = 0;
      let newLikes = 1;

      if (!selectError && currentData) {
        currentViews = currentData.views || 0;
        newLikes = (currentData.likes || 0) + 1;
      }

      const { data: upsertData, error: upsertError } = await supabase
        .from('blog_stats')
        .upsert(
          {
            slug: slug,
            views: currentViews,
            likes: newLikes,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'slug',
            ignoreDuplicates: false,
          }
        )
        .select('views, likes')
        .single();

      if (upsertError) {
        console.warn(
          'Error upserting likes, using localStorage:',
          upsertError.message
        );
        return incrementLikesLocal();
      }

      console.log('Likes incremented successfully:', upsertData);
      setStats(upsertData);
    } catch (error) {
      console.warn(
        'Error in incrementLikes, using localStorage:',
        error.message
      );
      incrementLikesLocal();
    }
  };

  // Lokale Like-Incrementierung
  const incrementLikesLocal = () => {
    try {
      const currentStats = { ...stats };
      const newStats = {
        views: currentStats.views || 0,
        likes: (currentStats.likes || 0) + 1,
      };

      setStats(newStats);
      saveLocalStats(newStats);
      console.log('Likes incremented locally:', newStats);
    } catch (error) {
      console.warn('Error incrementing likes locally:', error);
    }
  };

  // Fallback RPC-Methode für Likes
  const incrementLikesRPC = async () => {
    try {
      const { data, error } = await supabase.rpc('increment_likes', {
        post_slug: slug,
      });

      if (error) {
        console.error('RPC Error incrementing likes:', error);
        await loadStats();
        return;
      }

      if (data && Array.isArray(data) && data.length > 0) {
        setStats({
          views: data[0].views,
          likes: data[0].likes,
        });
      } else if (data && !Array.isArray(data)) {
        setStats({
          views: data.views,
          likes: data.likes,
        });
      } else {
        await loadStats();
      }
    } catch (error) {
      console.error('Error in RPC fallback:', error);
      await loadStats();
    }
  };

  return {
    stats,
    loading,
    incrementViews,
    incrementLikes,
    refreshStats: loadStats,
  };
};

// Hook für das Laden aller Blog Stats (für BlogGrid)
export const useAllBlogStats = () => {
  const [allStats, setAllStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    try {
      // Prüfe ob Supabase verfügbar ist
      if (!supabase || !supabase.from) {
        console.warn(
          'Supabase not available, using localStorage fallback for all stats'
        );
        loadAllLocalStats();
        return;
      }

      const { data, error } = await supabase
        .from('blog_stats')
        .select('slug, views, likes');

      if (error) {
        console.warn(
          'Error loading all blog stats, using localStorage fallback:',
          error.message
        );
        loadAllLocalStats();
        return;
      }

      // Konvertiere Array zu Object für einfacheren Zugriff
      const statsMap = {};
      if (data && Array.isArray(data)) {
        data.forEach(stat => {
          statsMap[stat.slug] = {
            views: stat.views || 0,
            likes: stat.likes || 0,
          };
        });
      }

      setAllStats(statsMap);
    } catch (error) {
      console.warn(
        'Error in loadAllStats, using localStorage fallback:',
        error.message
      );
      loadAllLocalStats();
    } finally {
      setLoading(false);
    }
  };

  // Lade alle Stats aus localStorage
  const loadAllLocalStats = () => {
    try {
      if (typeof window === 'undefined') {
        setAllStats({});
        setLoading(false);
        return;
      }

      const statsMap = {};
      // Durchsuche localStorage nach blog_stats_ Einträgen
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('blog_stats_')) {
          const slug = key.replace('blog_stats_', '');
          try {
            const stats = JSON.parse(localStorage.getItem(key) || '{}');
            statsMap[slug] = {
              views: stats.views || 0,
              likes: stats.likes || 0,
            };
          } catch (error) {
            console.warn(
              `Error parsing localStorage stats for ${slug}:`,
              error
            );
          }
        }
      }

      setAllStats(statsMap);
    } catch (error) {
      console.warn('Error loading all localStorage stats:', error);
      setAllStats({});
    }
    setLoading(false);
  };

  // Funktion um Stats für einzelnen Post zu aktualisieren
  const updatePostStats = (slug, newStats) => {
    setAllStats(prev => ({
      ...prev,
      [slug]: newStats,
    }));
  };

  return {
    allStats,
    loading,
    refreshAllStats: loadAllStats,
    updatePostStats,
  };
};

// Neue Hook-Funktionen für erweiterte Blog-Funktionalitäten
export const useBlogAnalytics = posts => {
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    averageReadTime: 0,
    engagementRate: 0,
    topPosts: [],
    tagDistribution: {},
    monthlyStats: {},
  });

  useEffect(() => {
    if (!posts || posts.length === 0) return;

    const calculateAnalytics = () => {
      // Grundstatistiken
      const totalPosts = posts.length;
      const totalViews = posts.reduce(
        (sum, post) => sum + (post.views || 0),
        0
      );
      const totalLikes = posts.reduce(
        (sum, post) => sum + (post.likes || 0),
        0
      );

      // Durchschnittliche Lesezeit
      const averageReadTime =
        posts.reduce((sum, post) => {
          const time = parseInt(post.readTime) || 3;
          return sum + time;
        }, 0) / totalPosts;

      // Top Posts nach Views
      const topPosts = [...posts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

      // Tag-Verteilung
      const tagDistribution = posts.reduce((acc, post) => {
        if (post.tags) {
          post.tags.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1;
          });
        }
        return acc;
      }, {});

      // Monatliche Statistiken
      const monthlyStats = posts.reduce((acc, post) => {
        const date = new Date(post.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!acc[monthKey]) {
          acc[monthKey] = { posts: 0, views: 0, likes: 0 };
        }

        acc[monthKey].posts += 1;
        acc[monthKey].views += post.views || 0;
        acc[monthKey].likes += post.likes || 0;

        return acc;
      }, {});

      setAnalytics({
        totalPosts,
        totalViews,
        totalLikes,
        averageReadTime: Math.round(averageReadTime),
        engagementRate:
          totalPosts > 0 ? (totalLikes / totalPosts).toFixed(2) : 0,
        topPosts,
        tagDistribution,
        monthlyStats,
      });
    };

    calculateAnalytics();
  }, [posts]);

  return analytics;
};

// Hook für Blog-Post Cache-Management
export const useBlogCache = () => {
  const [cache, setCache] = useState(new Map());
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    size: 0,
  });

  const getFromCache = useCallback(
    key => {
      if (cache.has(key)) {
        setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
        return cache.get(key);
      }
      setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      return null;
    },
    [cache]
  );

  const setInCache = useCallback(
    (key, value) => {
      const newCache = new Map(cache);
      newCache.set(key, value);

      // Cache-Größe begrenzen
      if (newCache.size > 100) {
        const firstKey = newCache.keys().next().value;
        newCache.delete(firstKey);
      }

      setCache(newCache);
      setCacheStats(prev => ({ ...prev, size: newCache.size }));
    },
    [cache]
  );

  const clearCache = useCallback(() => {
    setCache(new Map());
    setCacheStats({ hits: 0, misses: 0, size: 0 });
  }, []);

  return {
    getFromCache,
    setInCache,
    clearCache,
    cacheStats,
    cacheSize: cache.size,
  };
};

// Hook für Blog-Post Suche mit Debouncing
export const useBlogSearch = (posts, delay = 300) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(posts);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const results = searchPostsWithWeighting(posts, searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, posts, delay]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
  };
};
