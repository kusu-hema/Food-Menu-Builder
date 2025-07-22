import React from 'react';
// To Redirect the anthoer page link is used 
import { Link } from 'react-router-dom';
// react icons 
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';
 
//pages ............
import '../assets/css/style.css';

const Footer = () => {
  return (
    <>
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
