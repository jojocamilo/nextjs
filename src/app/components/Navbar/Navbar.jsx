'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Link from 'next/link';
import Image from 'next/image';
// import DarkModeToggle from '../DarkModeToggle/DarkModeToggle';
// AudioIndicator removed
import styles from './Navbar.module.scss';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isScrolled, setIsScrolled] = useState(false);
  

  const navbarRef = useRef(null);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  

  const navItems = [
    { href: '#call-for-paper', label: 'Call for Paper' },
  { href: '/', label: 'Home' },
  { href: '#about-conference', label: 'About' },
  { href: '#countdown-section', label: 'Countdown' },
    { href: '#ScrollToFeatures', label: 'Speaker' },
    { href: '#guidelines-section', label: 'Guideline' },
    { href: '#dates-section', label: 'Timeline' },
    { href: '#topics-section', label: 'Topics' },
  ];

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.header
        ref={navbarRef}
        className={`${styles.navbar} ${styles['lg-block']}`}
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.container}>
          <div
            className={`${styles.navbarContent} ${
              isScrolled ? styles.scrolled : styles.notScrolled
            }`}
          >
            {/* Logo */}
            <motion.div
              className={styles.logo}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link href="/" className={styles.logoLink}>
                <Image
                  src={
                    isDarkMode
                      ? '/assets/images/logo_white.png'
                      : '/assets/images/logo_black.png'
                  }
                  alt="Portify Logo"
                  width={isScrolled ? 48 : 48}
                  height={isScrolled ? 48 : 48}
                  className={styles.logoImage}
                  priority
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className={styles.desktopNav}>
              {navItems.map(item => (
                <div key={item.href} className={styles.navItem}>
                  <Link
                    href={item.href}
                    onClick={e => {
                      // If this is an in-page anchor, smooth-scroll instead of navigating
                      if (item.href && item.href.startsWith('#')) {
                        e.preventDefault();
                        const el = document.querySelector(item.href);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`${styles.navLink} ${
                      isDarkMode ? styles.navLinkDark : styles.navLinkLight
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right Side Controls */}
            <div className={styles.rightControls} />
          </div>
        </div>
      </motion.header>

      {/* Mobile Navbar */}
      <motion.header
        className={`${styles.navbar} ${styles.mobileNavbar} ${styles['lg-hidden']}`}
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.mobileContainer}>
          <div className={styles.mobileContent}>
            {/* Mobile Logo */}
            <motion.div
              className={styles.mobileLogo}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Link href="/" className={styles.logoLink}>
                <Image
                  src={
                    isDarkMode
                      ? '/assets/images/logo_white.png'
                      : '/assets/images/logo_black.png'
                  }
                  alt="Portify Logo"
                  width={62}
                  height={62}
                  priority
                />
              </Link>
            </motion.div>


          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Navbar;
