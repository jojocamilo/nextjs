'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Zap, Palette, Code, Layout, Smartphone } from 'lucide-react';
import './ProgressTimeline.css';

const ProgressTimeline = () => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Timeline data - Neueste zuerst (basierend auf echten Metadaten)
  const timelineData = [
    {
      id: 1,
      date: 'August 25, 2024',
      title: 'Blog Page & Post Design',
      description:
        'Finalized blog grid and individual post layouts with enhanced readability and modern pagination system.',
      image: '/assets/images/showcase/20.08.25_blogpage.png',
      image2: '/assets/images/showcase/20.08.25_blogpost.png',
      icon: <Zap className="timeline-icon" />,
      category: 'Blog',
    },
    {
      id: 2,
      date: 'August 10, 2024',
      title: 'Blog System Launch',
      description:
        'Launched comprehensive blog system with modern design and functionality.',
      image: '/assets/images/showcase/Blog_neu_Vrgleich.png',
      icon: <Code className="timeline-icon" />,
      category: 'Feature',
    },
    {
      id: 3,
      date: 'August 10, 2024',
      title: 'Home Page Redesign',
      description:
        'Complete home page redesign with improved layout and user experience.',
      image: '/assets/images/showcase/Home_neu_Vergleich.png',
      icon: <Layout className="timeline-icon" />,
      category: 'Redesign',
    },
    {
      id: 6,
      date: 'August 10, 2024',
      title: 'GitHub Integration',
      description:
        'Integrated portfolio with GitHub showcasing development workflow.',
      image: '/assets/images/showcase/PortfolioGithubShowcase.png',
      icon: <Code className="timeline-icon" />,
      category: 'Integration',
    },
    {
      id: 7,
      date: 'August 10, 2024',
      title: 'Advanced Showcases',
      description:
        'Further refinements with enhanced visual elements and user interactions.',
      image: '/assets/images/showcase/Showcase3.png',
      image2: '/assets/images/showcase/Showcase4.png',
      icon: <Zap className="timeline-icon" />,
      category: 'Enhancement',
    },
    {
      id: 9,
      date: 'August 10, 2024',
      title: 'Landing Page Design',
      description:
        'Created the main landing page with hero section and navigation.',
      image: '/assets/images/showcase/Showcase_Landing_Page.png',
      icon: <Layout className="timeline-icon" />,
      category: 'Design',
    },
    {
      id: 10,
      date: 'August 10, 2024',
      title: 'Menu Systems',
      description:
        'Developed responsive navigation with both black and white menu variants.',
      image: '/assets/images/showcase/black-menu.jpeg',
      image2: '/assets/images/showcase/whiteNavigation.jpeg',
      icon: <Layout className="timeline-icon" />,
      category: 'Navigation',
    },
    {
      id: 11,
      date: 'August 2, 2024',
      title: 'Showcase Evolution',
      description:
        'Major design overhaul with improved user experience and modern aesthetics.',
      image: '/assets/images/showcase/02.08_Showcase.png',
      image2: '/assets/images/showcase/02.08_Showcase2.png',
      icon: <Zap className="timeline-icon" />,
      category: 'Redesign',
    },
    {
      id: 12,
      date: 'July 15, 2024',
      title: 'Portfolio Iterations',
      description:
        'Multiple iterations of the portfolio showcasing different design approaches.',
      image: '/assets/images/showcase/Showcase1.png',
      image2: '/assets/images/showcase/Showcase2.png',
      icon: <Palette className="timeline-icon" />,
      category: 'Iteration',
    },
    {
      id: 13,
      date: 'July 10, 2024',
      title: 'About Me Page',
      description:
        'Created personal about section with professional information and skills.',
      image: '/assets/images/showcase/About_Me.jpeg',
      icon: <Palette className="timeline-icon" />,
      category: 'Content',
    },
    {
      id: 14,
      date: 'July 5, 2024',
      title: 'Single Card Design',
      description:
        'Developed detailed single project view with enhanced information display.',
      image: '/assets/images/showcase/Single_Card.png',
      icon: <Layout className="timeline-icon" />,
      category: 'Component',
    },
    {
      id: 15,
      date: 'June 20, 2024',
      title: 'Mobile Responsiveness',
      description:
        'Optimized the entire website for mobile devices and tablets.',
      image: '/assets/images/showcase/Mobile.jpeg',
      image2: '/assets/images/showcase/Mobile_Responsive.jpeg',
      icon: <Smartphone className="timeline-icon" />,
      category: 'Responsive',
    },
    {
      id: 16,
      date: 'June 15, 2024',
      title: 'Portfolio Foundation',
      description:
        'Started building the portfolio with initial design concepts and basic structure.',
      image: '/assets/images/showcase/Portfolio_29.05.png',
      icon: <Code className="timeline-icon" />,
      category: 'Development',
    },
    {
      id: 17,
      date: 'June 10, 2024',
      title: 'Dark & Light Theme',
      description:
        'Implemented theme switching with both dark and light mode variants.',
      image: '/assets/images/showcase/Landing_Page-black.jpeg',
      image2: '/assets/images/showcase/Landing_Page-white.jpeg',
      icon: <Palette className="timeline-icon" />,
      category: 'UI/UX',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.dataset.id);
            setVisibleItems(prev => [...prev, id]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  const openImageModal = (image, title) => {
    setSelectedImage({ src: image, title });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="progress-timeline">
      {/* Hero Section */}
      <div className="timeline-hero">
        <div className="timeline-hero-content">
          <Calendar className="timeline-hero-icon" />
          <h1 className="timeline-hero-title">
            <span className="timeline-title-line">Development</span>
            <span className="timeline-title-line gradient">Progress</span>
          </h1>
          <p className="timeline-hero-description">
            Journey through the evolution of Portify - from initial concepts to
            the modern, feature-rich portfolio you see today.
          </p>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="timeline-container">
        <div className="timeline-line"></div>

        {timelineData.map((item, index) => (
          <div
            key={item.id}
            className={`timeline-item ${visibleItems.includes(item.id) ? 'visible' : ''} ${
              index % 2 === 0 ? 'left' : 'right'
            }`}
            data-id={item.id}
          >
            <div className="timeline-marker">{item.icon}</div>

            <div className="timeline-content">
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <span className="timeline-date">{item.date}</span>
                  <span className="timeline-category">{item.category}</span>
                </div>

                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-description">{item.description}</p>

                <div className="timeline-images">
                  <div
                    className="timeline-image-container"
                    onClick={() => openImageModal(item.image, item.title)}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={440}
                      height={400}
                      className="timeline-image"
                    />
                    <div className="timeline-image-overlay">
                      <span>Click to expand</span>
                    </div>
                  </div>

                  {item.image2 && (
                    <div
                      className="timeline-image-container"
                      onClick={() => openImageModal(item.image2, item.title)}
                    >
                      <Image
                        src={item.image2}
                        alt={`${item.title} - Variant`}
                        width={440}
                        height={400}
                        className="timeline-image"
                      />
                      <div className="timeline-image-overlay">
                        <span>Click to expand</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeImageModal}>
          <div
            className="image-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button className="image-modal-close" onClick={closeImageModal}>
              ×
            </button>
            <Image
              src={selectedImage.src}
              alt={selectedImage.title}
              width={0}
              height={0}
              sizes="90vw"
              className="image-modal-img"
              style={{ width: 'auto', height: 'auto' }}
            />
            <p className="image-modal-title">{selectedImage.title}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTimeline;
