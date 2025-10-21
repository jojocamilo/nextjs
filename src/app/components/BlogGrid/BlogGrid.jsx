'use client';
import { useEffect, useState, useRef } from 'react';
import { useAllBlogStats, useBlogSearch } from '../../hooks/useBlogStats';
import {
  blogShortExcerpt,
  formatNumber,
  processMultipleBlogPosts,
  filterPostsByTags,
  sortBlogPosts,
  extractUniqueTags,
  calculateBlogStats,
} from '../../lib/blogUtils';
import BlogCard from '../BlogCard';
import './bloggrid.css';

const BlogGrid = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [uniqueTags, setUniqueTags] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const sectionRef = useRef(null);
  const filterRef = useRef(null);

  // Supabase Stats Hook
  const { allStats, loading: statsLoading } = useAllBlogStats();

  // Neuer Search Hook
  const { searchQuery, setSearchQuery, searchResults, isSearching } =
    useBlogSearch(blogPosts);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Lade Blog-Posts aus bloggrid.json
        const response = await fetch('/data/bloggrid.json');
        const data = await response.json();

        // Verarbeite alle Posts mit den neuen Utils
        const postsWithProcessedContent = await processMultipleBlogPosts(data);

        const tags = extractUniqueTags(postsWithProcessedContent);
        setUniqueTags(tags);

        const sortedPosts = sortBlogPosts(postsWithProcessedContent, sortOrder);
        setBlogPosts(sortedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, [sortOrder]);

  const handleMouseMove = e => {
    if (filterRef.current) {
      const rect = filterRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });
    }
  };

  // Kombinierte Filterung mit den neuen Utils
  const filteredPosts = searchResults.filter(
    post => filterPostsByTags([post], selectedTag).length > 0
  );

  // Pagination Logic
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Reset currentPage when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTag, searchQuery]);

  // Pagination handlers
  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber);
    // Scroll to top of blog grid
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Blog-Statistiken berechnen
  const blogStats = calculateBlogStats(blogPosts);

  // Echte Statistiken aus Supabase berechnen für den stats overview in der BlogGrid
  const realBlogStats = {
    totalPosts: blogPosts.length,
    totalViews: Object.values(allStats).reduce(
      (sum, stats) => sum + (stats.views || 0),
      0
    ),
    totalLikes: Object.values(allStats).reduce(
      (sum, stats) => sum + (stats.likes || 0),
      0
    ),
    engagementRate:
      blogPosts.length > 0
        ? (
            Object.values(allStats).reduce(
              (sum, stats) => sum + (stats.likes || 0),
              0
            ) / blogPosts.length
          ).toFixed(1)
        : '0.0',
  };

  return (
    <div
      ref={sectionRef}
      className={`blog-wrapper ${isVisible ? 'visible' : ''}`}
    >
      {/* Background Elements */}
      <div className="blog-background-grid"></div>
      <div className="blog-floating-orb blog-orb-1"></div>
      <div className="blog-floating-orb blog-orb-2"></div>
      <div className="blog-floating-orb blog-orb-3"></div>

      {/* Hero Header */}
      <div className="blog-hero-section">
        <div className="blog-hero-content">
          <span>Latest Articles</span>

          <h1 className="blog-hero-title">
            <span className="blog-title-line">Knowledge</span>
            <span className="blog-title-line gradient">Sharing Hub</span>
          </h1>

          <p className="blog-hero-description">
            Discover insights, tutorials, and thoughts on modern development,
            design patterns, and cutting-edge technologies.
          </p>
        </div>
      </div>

      <div className="blog-container">
        {/* Enhanced Filter Section */}
        <div
          ref={filterRef}
          className="blog-filters-card"
          onMouseMove={handleMouseMove}
          style={{
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
          }}
        >
          <div className="blog-card-glow"></div>

          <div className="blog-filters-header">
            <h3 className="blog-filters-title">Find Your Content</h3>
            <p className="blog-filters-subtitle">
              Filter and search through our articles
            </p>
          </div>

          <div className="blog-filters-top-row">
            <div className="blog-input-group">
              <div className="blog-search-icon">
                {isSearching ? '⏳' : '🔍'}
              </div>
              <input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="blog-search-input"
              />
              {isSearching && (
                <div className="blog-search-loading">
                  <div className="blog-loading-spinner"></div>
                </div>
              )}
            </div>
            <div className="blog-select-group">
              <select
                onChange={e => setSortOrder(e.target.value)}
                value={sortOrder}
                className="blog-sort-select"
              >
                <option value="latest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="blog-tag-section">
            <div className="blog-tag-header">
              <span className="blog-tag-label">Filter by topic:</span>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag('')}
                  className="blog-clear-filter"
                >
                  Clear Filter ✕
                </button>
              )}
            </div>

            <div className="blog-tag-filter">
              {uniqueTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`blog-tag-button ${selectedTag.toLowerCase() === tag.toLowerCase() ? 'active' : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="blog-results-info">
          <span className="blog-results-count">
            {isLoading
              ? 'Loading...'
              : `${filteredPosts.length} article${filteredPosts.length !== 1 ? 's' : ''} found`}
            {!isLoading && totalPages > 1 && (
              <span className="blog-page-info">
                {' '}
                • Page {currentPage} of {totalPages}
              </span>
            )}
          </span>
          {selectedTag && (
            <span className="blog-active-filter">
              Filtered by: <strong>{selectedTag}</strong>
            </span>
          )}
        </div>

        {/* Blog Statistics */}
        {!isLoading && (
          <div className="blog-stats-overview">
            <div className="blog-stat-item">
              <span className="blog-stat-label">Total Posts</span>
              <span className="blog-stat-value">
                {realBlogStats.totalPosts}
              </span>
            </div>
            <div className="blog-stat-item">
              <span className="blog-stat-label">Total Views</span>
              <span className="blog-stat-value">
                {formatNumber(realBlogStats.totalViews)}
              </span>
            </div>
            <div className="blog-stat-item">
              <span className="blog-stat-label">Total Likes</span>
              <span className="blog-stat-value">
                {formatNumber(realBlogStats.totalLikes)}
              </span>
            </div>
            <div className="blog-stat-item">
              <span className="blog-stat-label">Coming Soon</span>
              <span className="blog-stat-value">✨</span>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="blog-grid">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="blog-post-card skeleton">
                  <div className="blog-skeleton-image"></div>
                  <div className="blog-skeleton-content">
                    <div className="blog-skeleton-title"></div>
                    <div className="blog-skeleton-text"></div>
                    <div className="blog-skeleton-text short"></div>
                    <div className="blog-skeleton-footer"></div>
                  </div>
                </div>
              ))
            : currentPosts.map((post, index) => {
                // Hole die aktuellen Stats aus Supabase oder fallback zu JSON
                const currentStats = allStats[post.slug] || {
                  views: 0,
                  likes: 0,
                };

                // Erstelle ein Post-Objekt mit allen notwendigen Daten für BlogCard
                const postData = {
                  ...post,
                  views: currentStats.views,
                  likes: currentStats.likes,
                  statsLoading: statsLoading,
                };

                return (
                  <BlogCard
                    key={post.id}
                    post={postData}
                    index={index}
                    variant="default"
                    showRelevanceScore={false}
                    truncateTitle={true}
                    truncateExcerpt={true}
                    formatNumbers={true}
                  />
                );
              })}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && filteredPosts.length > 0 && (
          <div className="blog-pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="blog-pagination-btn blog-pagination-prev"
              aria-label="Previous page"
            >
              ← Previous
            </button>

            <div className="blog-pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                pageNumber => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`blog-pagination-btn blog-pagination-number ${
                          currentPage === pageNumber ? 'active' : ''
                        }`}
                        aria-label={`Go to page ${pageNumber}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="blog-pagination-ellipsis"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="blog-pagination-btn blog-pagination-next"
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="blog-no-results">
            <div className="blog-no-results-icon">📝</div>
            <h3 className="blog-no-results-title">No articles found</h3>
            <p className="blog-no-results-text">
              Try adjusting your search terms or removing filters to see more
              results.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('');
              }}
              className="blog-reset-filters"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogGrid;
