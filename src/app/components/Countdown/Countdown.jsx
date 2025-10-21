// src/Pages/Home/components/Countdown/Countdown.jsx
'use client';

import React, { useState, useEffect } from 'react';
import './Countdown.css'; // <-- Pastikan import CSS ini ada kembali

const Countdown = () => {
  const targetDate = new Date('2025-11-18T23:59:59');

  const calculateTimeLeft = () => {
    // ... (Logika tidak perlu diubah)
    const difference = +targetDate - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // ... (Logika tidak perlu diubah)
    setTimeLeft(calculateTimeLeft());
    const timerInterval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const timeComponents = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section className="countdown-section">
      <div className="countdown-container">
        <h2 className="countdown-title">The Conference | 18 November 2025</h2>
        <p className="countdown-subtitle">
          Coming on!!
        </p>
        <div className="countdown-timer">
          {timeComponents.map((component, index) => (
            <React.Fragment key={component.label}>
              <div className="countdown-block">
                <span className="countdown-value">
                  {String(component.value).padStart(2, '0')}
                </span>
                <span className="countdown-label">{component.label}</span>
              </div>
              {index < timeComponents.length - 1 && (
                <span className="countdown-separator">:</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Countdown;