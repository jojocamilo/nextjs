import React from 'react';
import { Linkedin, Dribbble, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-bottom">
          <div className="footer-left">
            <span className="footer-copyright">Swiss German University</span>
            <span className="footer-contact">
              <Phone size={16} />
              <a href="tel:+628111771983">+62 811 1771 983 (Dian Karmila)</a>
            </span>
          </div>

          <div className="footer-socials">
            <a
              href="https://www.linkedin.com/school/swiss-german-university/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="footer-icon" />
            </a>
            <a
              href="https://sgu.ac.id/id/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Dribbble className="footer-icon" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
