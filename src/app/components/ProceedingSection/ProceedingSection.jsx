// components/ProceedingSection/ProceedingSection.jsx
'use client';

import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import './ProceedingSection.css';

const ProceedingSection = () => {
  return (
    <section className="proceeding-section">
      <div className="proceeding-container">
        <div className="proceeding-content">
          <div className="proceeding-icon-wrapper">
            <BookOpen size={48} />
          </div>
          <div className="proceeding-text">
            <h2 className="proceeding-title">Conference Proceedings</h2>
            <p className="proceeding-description">
              Access the published papers and research from previous ACMIT conferences. 
              View all accepted papers, presentations, and academic contributions.
            </p>
            <div className="proceeding-buttons">
              <a 
                href="https://proceedings.sgu.ac.id/acmit/index.php?journal=acmit" 
                className="proceeding-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>ACMIT Proceedings</span>
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProceedingSection;
