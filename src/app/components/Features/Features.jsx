'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './Features.css';

// Prop isGif tetap ada untuk backward compatibility
const Card = ({ src, Nama, title, description, className, buttonHref, isGif, badge }) => {
  const [isClient, setIsClient] = useState(false);
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // =============================================
  // PERUBAHAN DIMULAI DI SINI
  // =============================================

  // 1. Tentukan apakah media adalah gambar berdasarkan prop isGif ATAU ekstensi file.
  // Ini adalah inti dari logika if/else yang Anda minta.
  const isImage = isGif || (src && ['.webp', '.jpg', '.jpeg', '.png', '.svg'].some(ext => src.toLowerCase().endsWith(ext)));

  // =============================================
  // AKHIR DARI PERUBAHAN
  // =============================================


  // Mouse tracking untuk glow effect (tidak berubah)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleMouseMove = e => {
      const rect = wrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      wrapper.style.setProperty('--mouse-x', `${x}%`);
      wrapper.style.setProperty('--mouse-y', `${y}%`);
    };

    wrapper.addEventListener('mousemove', handleMouseMove);

    return () => {
      wrapper.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  // =============================================
  // PERUBAHAN DIMULAI DI SINI
  // =============================================

  // 2. Sesuaikan event handler agar hanya berfungsi pada video (!isImage)
  const handleMouseEnter = () => {
    const video = videoRef.current;
    // Semula: if (video && !isGif)
    if (video && !isImage) {
      video.play().catch(e => {
        console.error('Error playing video:', e);
      });
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    // Semula: if (video && !isGif)
    if (video && !isImage) {
      video.pause();
      video.currentTime = 0;
    }
  };

  // =============================================
  // AKHIR DARI PERUBAHAN
  // =============================================

  return (
    <div
      ref={wrapperRef}
      className={`card-home-features-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-home-features-layout">
        <div className="card-home-features-image-container">
          {isImage ? (
            <img src={src} alt={title} className="card-home-features-image" />
          ) : isClient ? (
            <video
              ref={videoRef}
              src={src}
              loop
              muted
              className="card-home-features-image"
              onError={e => console.error('Error loading video:', e)}
            />
          ) : null}
        </div>

        <div className="card-home-features-content">
          <div className="card-home-features-text">
            {badge && (
              <div className="card-home-features-badge">{badge}</div>
            )}
            {Nama && (
              <h2 className="card-home-features-name">{Nama}</h2>
            )}
            <h3 className="card-home-features-title">{title}</h3>
            {description && (
              <p className="card-home-features-description">{description}</p>
            )}
          </div>
          <a
            href={buttonHref}
            className="card-home-features-button"
            aria-label={`View ${title} project`}
          >
            About
            <ArrowUpRight className="card-home-features-button-icon" size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

// Anda TIDAK PERLU mengubah komponen di bawah ini.
// Komponen ini akan berfungsi seperti semula.
const CardHomeFeatures = () => {
  return (
    <section className="card-home-features-section">
      {/* ... (sisa kode tidak berubah) ... */}
      <div className="card-home-features-orb card-home-features-orb-1"></div>
      <div className="card-home-features-orb card-home-features-orb-2"></div>
      <div className="card-home-features-container">
        <header className="card-home-features-intro" id="ScrollToFeatures">
          {/* ... */}
        </header>
        <div className="card-home-features-grid-large">
          <Card
            src="/assets/images/landing/Bapak.jpg"
            Nama="Dr. Nashrudin Ismail, S.T., MM."
            badge="Keynote speaker"
            title="General Manager People Partner and Growth PT Aplikanusa Lintasarta"
            description="Integrating Emerging Technologies with Human Capital for Sustainable Transformation"
            className="card-home-features-large"
            buttonHref="https://www.linkedin.com/in/nashrudin-ismail-93022a33/"
          />
        </div>
        {/* <div className="card-home-features-grid-feature">
          {/* ... (card lainnya tidak berubah) ... */}
        {/* </div> */}
        {/* <div className="card-home-features-grid-special">
          <Card
            src="/assets/animations/gifs/Ringsblack.gif"
            title="Arcadia"
            description="Immersive digital experiences that blend creativity with cutting-edge technology for lasting impact!"
            className="card-home-features-xsmall2"
            buttonHref="/project6"
            isGif={true} // Ini akan tetap berfungsi
          />
          <Card
            src="/assets/images/landing/Bapak.jpg" // Ini sekarang akan otomatis terdeteksi sebagai gambar
            title="Arcadia"
            description="Immersive digital experiences that blend creativity with cutting-edge technology for lasting impact."
            className="card-home-features-xsmall2"
            buttonHref="/project6"
            // Tidak perlu isGif={true} di sini, tapi jika ditambahkan pun tidak masalah
          />
        </div> */}
      </div>
    </section>
  );
};

export default CardHomeFeatures;