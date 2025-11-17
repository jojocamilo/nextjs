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
                href="https://docs.google.com/document/d/1AAF8_OI8VOL852nGiGqeZvMiJplGCa88/edit?usp=sharing&ouid=108070640064500548693&rtpof=true&sd=true" 
                className="proceeding-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>ACMIT 2020 Proceedings</span>
                <ExternalLink size={20} />
              </a>
              <a 
                href="https://docs.google.com/document/d/1otDwJc3a2C-E4gYDXbJ-hcUn4oOr8pDn/edit?usp=sharing&ouid=108070640064500548693&rtpof=true&sd=true" 
                className="proceeding-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>ACMIT 2021 Proceedings</span>
                <ExternalLink size={20} />
              </a>
              <a
                href="https://docs.google.com/document/d/11fWk74oNYSiZoFKUUjeh7KA633QTzJTv/edit?usp=sharing&ouid=108070640064500548693&rtpof=true&sd=true"
                className="proceeding-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>ACMIT 2022 Proceedings</span>
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
