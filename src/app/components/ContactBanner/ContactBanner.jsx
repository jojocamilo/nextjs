// components/ContactBanner/ContactBanner.jsx
'use client';

import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';
import './ContactBanner.css'; // Pastikan nama file CSS ini benar

// Nama komponen diubah menjadi ContactBanner
const ContactBanner = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Nama kelas utama diubah
    <div className="contact-banner-wrapper">
      {isOpen && (
        <div className="contact-panel">
          <div className="panel-header">
            <h4>Contact Information</h4>
            <button className="panel-close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="panel-content">
            <p>All correspondence should be sent to:</p>
            <a href="mailto:acmit.sgu@gmail.com">acmit.sgu@gmail.com</a>
          </div>
        </div>
      )}

      {/* Tombol utama (toggle) */}
      <button className="banner-toggle-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Contact Information">
        {isOpen ? <X size={24} /> : <Mail size={24} />}
      </button>
    </div>
  );
};

export default ContactBanner;