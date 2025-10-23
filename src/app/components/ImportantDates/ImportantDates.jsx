// components/ImportantDates/ImportantDates.jsx
'use client'; // Diperlukan karena kita akan menggunakan new Date() di client

import React from 'react';
import './ImportantDates.css';

const datesData = [
  {
    day: '02',
    month: 'November',
    fullDate: '2025-11-02',
    title: 'Full Paper Submission',
    description: 'Deadline for all paper submissions.',
  },
  {
    day: '14',
    month: 'November',
    fullDate: '2025-11-14',
    title: 'Acceptance Result',
    description: 'Notification of acceptance results.',
  },
  {
    day: '16',
    month: 'November',
    fullDate: '2025-11-16',
    title: 'Camera Ready Paper',
    description: 'Submission for revised, final papers.',
  },
  {
    day: '18',
    month: 'November',
    fullDate: '2025-11-18',
    title: 'Conference Day',
    description: 'The main event begins.',
  },
];

const ImportantDates = () => {
  // Dapatkan tanggal hari ini (hanya bagian tanggal, tanpa waktu)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <section id="dates-section" className="dates-section">
      <div className="dates-container">
        <div className="dates-header">
          <p className="dates-subtitle">TIMELINE</p>
          <h2 className="dates-title">Important Dates</h2>
        </div>
        <div className="dates-grid">
          {datesData.map((item, index) => {
            const itemDate = new Date(item.fullDate);
            const isPast = itemDate < today;

            return (
              <div className={`date-card ${isPast ? 'is-past' : ''}`} key={index}>
                <div className="card-calendar-top">{item.month}</div>
                <div className="card-day">{item.day}</div>
                <div className="card-info">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-description">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImportantDates;