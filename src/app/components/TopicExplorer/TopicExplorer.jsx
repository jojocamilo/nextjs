// components/TopicExplorer/TopicExplorer.jsx
'use client';

import React, { useState } from 'react';
import './TopicExplorer.css';

// Data topik yang sudah dikelompokkan
const topicsData = [
  { name: 'Artificial Intelligence', category: 'AI & Data' },
  { name: 'Machine Learning', category: 'AI & Data' },
  { name: 'Data Mining', category: 'AI & Data' },
  { name: 'Knowledge Management', category: 'AI & Data' },
  { name: 'Intelligent System', category: 'AI & Data' },
  { name: 'Cyber Security', category: 'Security' },
  { name: 'Android Security', category: 'Security' },
  { name: 'Security in Wireless', category: 'Security' },
  { name: 'IT Risk Management', category: 'Security' },
  { name: 'Cloud Computing', category: 'Infrastructure' },
  { name: 'Mobile Computing', category: 'Infrastructure' },
  { name: 'Internet of Things (IoT)', category: 'Infrastructure' },
  { name: 'Network Management', category: 'Infrastructure' },
  { name: 'Enterprise Architecture', category: 'Management' },
  { name: 'IT Governance', category: 'Management' },
  { name: 'e-Government', category: 'Management' },
  { name: 'Digital Transformation', category: 'Management' },
  { name: 'Innovation Technology', category: 'Management' },
  { name: 'Human Computer Interaction', category: 'Management' },
];

const filterCategories = ['All Topics', 'AI & Data', 'Security', 'Infrastructure', 'Management'];

const TopicExplorer = () => {
  const [activeCategory, setActiveCategory] = useState('All Topics');

  const filteredTopics = activeCategory === 'All Topics'
    ? topicsData
    : topicsData.filter(topic => topic.category === activeCategory);

  return (
    <section id="topics-section" className="topics-section">
      <div className="topics-container">
        <div className="topics-header">
          <p className="topics-subtitle">AREAS OF INTEREST</p>
          <h2 className="topics-title">Topics</h2>
          <p className="topics-description">
            Paper submissions are invited in a wide variety of topics related to information and 
            technology, as well as mechatronics systems.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="topics-filters">
          {filterCategories.map(category => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="topics-grid">
          {filteredTopics.map((topic) => (
            <div className="topic-card" key={topic.name}>
              {topic.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopicExplorer;