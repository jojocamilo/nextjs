import React from 'react';
import Link from 'next/link';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { motion } from 'framer-motion';

const NavLinks = ({ className = '', isMobile = false }) => {
  const { isDarkMode } = useDarkMode();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/blog', label: 'Blog' },
    { href: '/guestbook', label: 'Guestbook' },
  ];

  const linkVariants = {
    hover: {
      y: -1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  if (isMobile) {
    return (
      <nav className={`nav-links-mobile ${className}`}>
        <ul className="space-y-6">
          {navItems.map((item, index) => (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`block text-lg font-medium transition-all duration-300 ${
                  isDarkMode
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav className={`nav-links ${className}`}>
      <ul className="flex items-center space-x-1">
        {navItems.map(item => (
          <li key={item.href} className="relative">
            <motion.div variants={linkVariants} whileHover="hover">
              <Link
                href={item.href}
                className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  isDarkMode
                    ? 'text-white/90 hover:text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            </motion.div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavLinks;
