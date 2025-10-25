// components/Guidelines/Guidelines.jsx
'use client';

import React from 'react'; // Untuk saat ini, kita bisa buat tanpa state jika tidak ada interaksi klik
import { Mail, FileText, Presentation, Library, Languages, BadgeDollarSign, Download } from 'lucide-react';
import './Guidelines.css';

const guidelinesData = [
  { id: 'submission', icon: Mail, title: 'Submission Method', description: 'All submissions must be submitted via e-mail address: acmit.sgu@gmail.com' },
  { id: 'format', icon: FileText, title: 'Paper Format', description: 'All papers must be 8-20 pages long and submitted in Word format using the given template.' },
  { id: 'presentation', icon: Presentation, title: 'Presentation', description: 'Each author will have 15 minutes: 10 minutes for presentation and 5 for discussion.' },
  { id: 'publication', icon: Library, title: 'Publication', description: 'The Committee will publish the selected papers to the ACMIT 2025 Proceeding.' },
  { id: 'language', icon: Languages, title: 'Language', description: 'All paper submissions for review must be written in English.' },
  { id: 'fee', icon: BadgeDollarSign, title: 'Conference Fee', isSpecial: true, description: (
    <>
      <div className="fee-item"><p>Swiss German University (SGU) Students</p><strong>IDR 950,000</strong></div>
      <div className="fee-item"><p>Others</p><strong>IDR 1,150,000</strong></div>
      <div className="bank-details">
        <h4>Bank Account Details</h4>
        <div className="bank-info">
          <div className="bank-name">Virtual Account Bank Mandiri</div>
          <div className="account-details">
            <div>
              <div className="account-label">Account Name</div>
              <div className="account-value">LPPM Univ. Swiss German</div>
            </div>
            <div>
              <div className="account-label">Account Number</div>
              <div className="account-value">
                <span className="account-number">8945900000111222</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )},
];

const Guidelines = () => {
  return (
    <section id="guidelines-section" className="guidelines-section">
      <div className="guidelines-container">
        {/* Kolom Kiri yang 'Menempel' */}
        <div className="guidelines-sticky-nav">
          <div className="sticky-content">
            <p className="guidelines-subtitle">STEP-BY-STEP</p>
            <h2 className="guidelines-title">Guidelines & Procedures</h2>
            <nav className="guidelines-anchor-nav">
              <ul>
                {guidelinesData.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.title}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Kolom Kanan yang Bergulir */}
        <div className="guidelines-content-list">
          {guidelinesData.map((item) => (
            <div id={item.id} className={`guideline-card ${item.isSpecial ? 'is-special' : ''}`} key={item.id}>
              <div className="card-icon"><item.icon size={28} /></div>
              <h3 className="card-title">{item.title}</h3>
              <div className="card-description">{item.description}</div>
              {item.id === 'format' && (
                <div className="card-actions">
                  <a
                    className="download-btn"
                    href="/assets/ACMIT_WordTemplate_2025.docx"
                    download
                    aria-label="Download paper template (DOCX)"
                  >
                    <Download size={18} aria-hidden="true" />
                    <span>Download Template</span>
                  </a>
                </div>
              )}
              {item.id === 'submission' && (
                <div className="card-actions">
                  <a
                    className="submit-paper-button"
                    href="https://forms.gle/ZdVX3UoB4FVaBiT2A"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Submit Paper
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Guidelines;