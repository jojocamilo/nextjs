// components/RundownTimeline/RundownTimeline.jsx
'use client';

import React from 'react';
import { Clock, MapPin, User, Coffee, Presentation } from 'lucide-react';
import './RundownTimeline.css';

const RundownTimeline = () => {
  const schedule = [
    {
      time: '12:30 - 13:00',
      title: 'Registration and snack distribution',
      icon: Coffee,
      type: 'break'
    },
    {
      time: '13:00 - 13:05',
      title: 'Singing national anthem “Indonesia Raya”',
      icon: User,
      type: 'event'
    },
    {
      time: '13:05 - 13:10',
      title: 'Opening by MC',
      icon: Presentation,
      type: 'keynote'
    },
    {
      time: '13:10 - 13:13',
      title: 'Opening prayer',
      icon: User,
      type: 'break'
    },
    {
      time: '13:13 - 13:17',
      title: 'Opening speech from CMEI Chairperson',
      icon: Presentation,
      type: 'session'
    },
    {
      time: '13:17 - 13:21',
      title: 'Opening speech from ACMIT Chairperson',
      icon: Coffee,
      type: 'break'
    },
    {
      time: '13:21 - 13:25',
      title: 'Opening speech from Rector Swiss German University ',
      icon: Presentation,
      location: 'Conference Rooms A & B',
      type: 'session'
    },
    {
      time: '13:25 - 13:55',
      title: 'Presentation from keynote speaker:Dr. Nashrudin Ismail, S.T., M.M. (General Manager - People Partner and Growth, PT Aplikanusa Lintasarta)on “Integrating Emerging Technologies with Human Capital for Sustainable Transformation” ',
      icon: Coffee,
      type: 'break'
    },
    {
      time: '13:55 - 14:00',
      title: 'Preparation for parallel session',
      icon: Presentation,
      type: 'session'
    },
    {
      time: '14:00 - 16:00',
      title: 'Parallel Sessions',
      location: 'Room 322 and Room 319',
      icon: Presentation,
      type: 'session'
    },
    {
      time: '16:00 - 16:15',
      title: 'Closing',
      icon: User,
      location: 'Room 322',
      type: 'event'
    }
  ];

  return (
    <section className="rundown-timeline-section">
      <div className="rundown-container">
        <div className="rundown-header">
          <p className="rundown-subtitle">CONFERENCE DAY</p>
          <h2 className="rundown-title">Event Rundown</h2>
          <p className="rundown-description">
            Plenary Session (Room 322):
          </p>
        </div>

        <div className="timeline">
          {schedule.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index} 
                className={`timeline-item ${item.type}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="timeline-marker">
                  <div className="timeline-icon">
                    <IconComponent size={20} />
                  </div>
                </div>
                <div className="timeline-content">
                  <div className="timeline-time">
                    <Clock size={16} />
                    <span>{item.time}</span>
                  </div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-description">{item.description}</p>
                  {item.location && (
                    <div className="timeline-location">
                      <MapPin size={14} />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RundownTimeline;
