import React from 'react';
import { Linkedin, Dribbble } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-bottom">
          <div className="footer-left">
            <span className="footer-copyright">Swiss German University</span>
            <span className="footer-legal">
              <a
                href="https://github.com/GylanSalih/NextJS-Portify/tree/main"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Testing lorem ipssum */}
              </a>
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
