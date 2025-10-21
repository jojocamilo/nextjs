// components/AboutConference/AboutConference.jsx
import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import './AboutConference.css'; // Nama file CSS tetap sama

const topicsList = [
  'Digital Transformation', 'IT Risk Management & Security', 'Cyber Security',
  'Big Data (Data Mining)', 'Artificial Intelligence', 'Machine Learning',
  'IT Governance', 'IT Architecture', 'Intelligent System', 'Blockchain',
  'Internet of Things', 'Human Computer Interaction', 'Knowledge Management',
  'Innovation Technology'
];

// Nama komponen tetap AboutConference
const AboutConference = () => {
  return (
    <section className="about-conf-section">
      <div className="about-conf-container">
        <div className="about-conf-header">
          <p className="about-conf-subtitle">THE ANNUAL CONFERENCE</p>
          <h2 className="about-conf-title">About ACMIT</h2>
        </div>

        <div className="about-conf-layout">
          {/* === Kolom Konten Utama (Kiri) === */}
          <div className="about-conf-main-content">
            <p className="main-description">
              The Annual Conference on Management and Information Technology (ACMIT) is an annual 
              conference organized by Master of Information Technology (MIT) at Swiss German University 
              (SGU) to promote innovation and scientific excellence.
            </p>
            <h3 className="theme-title">Conference Theme</h3>
            <p className="theme-text">
              “Empowering Digital Futures: AI, Automation, and Human Capital in the Era of 
              Transformation.”
            </p>

            <h3 className="topics-title">Topics of Interest</h3>
            <div className="topics-grid">
              {topicsList.map((topic, index) => (
                <span className="topic-tag" key={index}>{topic}</span>
              ))}
            </div>
          </div>

          {/* === Kolom Sidebar "Sticky" (Kanan) === */}
          <aside className="about-conf-sidebar">
            <div className="info-block">
              <div className="info-icon"><Calendar size={20} /></div>
              <div>
                <h4>Date</h4>
                {/* Teks yang benar untuk Tanggal */}
                <p>Tuesday, 18th November 2025</p>
              </div>
            </div>
            <div className="info-block">
              <div className="info-icon"><MapPin size={20} /></div>
              <div>
                <h4>Venue</h4>
                {/* Teks yang benar untuk Venue, dengan spasi yang presisi */}
                <p style={{ lineHeight: '1.4',textAlign: 'left' }}>
                  Swiss German University
                  Prominence Tower, Alam Sutera, Tangerang
                </p>
              </div>
            </div>
            <div className="info-block">
              <div className="info-icon"><Users size={20} /></div>
              <div>
                <h4>Presentation</h4>
                {/* Teks yang benar untuk Presentasi */}
                <p>Hybrid (Online & Onsite)</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default AboutConference;