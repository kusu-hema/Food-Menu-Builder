import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <style>{`
        .footer {
          background-color: #f9fafb;
          color: #6b7280;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          border-top: 1px solid #e5e7eb;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.03);
          flex-wrap: wrap;
        }

        .footer-section {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .footer-section a {
          color: #6b7280;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-section a:hover {
          color: #5b28f0;
        }

        .footer-social a {
          font-size: 1.1rem;
        }

        @media (max-width: 600px) {
          .footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-section">
          <span>&copy; {new Date().getFullYear()}  Shanmukha Caterers Pvt Ltd. All rights reserved.</span>
        </div>

        <div className="footer-section">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>

        <div className="footer-section footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
