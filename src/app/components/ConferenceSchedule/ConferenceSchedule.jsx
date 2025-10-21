// components/ConferenceSchedule/ConferenceSchedule.jsx
import React from 'react';
import './ConferenceSchedule.css';

// --- DATA JADWAL ---
// Mengubah jadwal di sini akan otomatis memperbarui tampilan.
const scheduleData = [
  {
    category: 'Full Paper Submission',
    details: {
      title: 'Call for Paper',
      dates: [
        { dateString: '18 February - 11 July 2025', isStrikethrough: true },
        { dateString: '25 July 2025 (Extend I)', isStrikethrough: true },
        { dateString: '25 July 2025 (Extend II)', isStrikethrough: true },
        { dateString: '23 August 2025 (Extend III)', isStrikethrough: false },
      ],
    },
  },
  {
    category: 'Notification of Acceptance',
    details: {
      title: 'Paper Acceptance',
      dates: [
        { dateString: '14 June 2025', isStrikethrough: true },
        { dateString: '25 July 2025 (Extend I)', isStrikethrough: true },
        { dateString: '25 August 2025 (Extend II)', isStrikethrough: true },
        { dateString: '8 September 2025 (Extend III)', isStrikethrough: false },
      ],
    },
  },
  {
    category: 'Presenter & Participant Registration',
    details: {
      title: 'Registration',
      dates: [
        { dateString: 'until 22 September 2025 (Early Bird)', isStrikethrough: false },
        { dateString: '23 September - 15 October 2025 (Regular - Authors)', isStrikethrough: false },
        { dateString: '23 September - 18 October 2025 (Regular - Participants)', isStrikethrough: false, hasIcon: true },
      ],
    },
  },
  {
    category: 'Camera Ready',
    details: {
      title: 'Camera Ready Paper',
      dates: [
        { dateString: '30 September 2025', isStrikethrough: false },
      ],
    },
  },
  {
    category: 'Conference Event',
    details: {
      title: 'Conference Date',
      dates: [
        { dateString: '22 - 23 October 2025', isStrikethrough: false },
      ],
    },
  },
];

const ConferenceSchedule = () => {
  return (
    <section className="schedule-section">
      <div className="schedule-container">
        <header className="schedule-header">
          <div className="schedule-header-text">
            <p className="schedule-subtitle">SCHEDULE DETAILS</p>
            <h2 className="schedule-title">Information of Conference Schedules</h2>
            <div className="wavy-divider">
              <svg width="100" height="12" viewBox="0 0 100 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C2 6 15.6667 1.33333 26 6C36.3333 10.6667 49.5 2 60 6C70.5 10 84.3333 2 98 6" stroke="#4F46E5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="schedule-description">
              The conference schedule provides information on the paper submission
              timeline and important event details, including the agenda, speakers, and
              session times to help attendees stay informed and prepared.
            </p>
          </div>
          <div className="schedule-timeline">
            <div className="timeline-circle circle-1">
              <span>Timeline</span>
            </div>
            <div className="timeline-circle circle-2">
              <strong>22 October</strong>
              <span>DAY 1</span>
            </div>
            <div className="timeline-circle circle-3">
              <strong>23 October</strong>
              <span>DAY 2</span>
            </div>
          </div>
        </header>

        <main className="schedule-details">
          {scheduleData.map((item, index) => (
            <div className="schedule-row" key={index}>
              <div className="schedule-category">
                <p>{item.category}</p>
              </div>
              <div className="schedule-info">
                <h3>{item.details.title}</h3>
                <ul>
                  {item.details.dates.map((date, dateIndex) => (
                    <li key={dateIndex}>
                      {date.isStrikethrough ? <s>{date.dateString}</s> : <span>{date.dateString}</span>}
                      {date.hasIcon && <span className="schedule-icon">✅</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </main>
        
        <footer className="schedule-footer">
            <button className="schedule-button">MORE DETAILS</button>
        </footer>
      </div>
    </section>
  );
};

export default ConferenceSchedule;