import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          {/* About Section */}
          <div className={styles.footerSection}>
            <div className={styles.brandLogo}>
              <i className="fas fa-seedling"></i>
              Hope Harvest
            </div>
            <p className={styles.missionStatement}>
              Empowering communities through sustainable funding solutions and creating opportunities for growth and development across Bangladesh.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} title="Facebook">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/640px-Facebook_f_logo_%282019%29.svg.png" 
                  alt="Facebook"
                  className={styles.socialIcon}
                />
              </a>
              <a href="#" className={styles.socialLink} title="Twitter">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/X_logo_twitter_new_brand_icon.svg/640px-X_logo_twitter_new_brand_icon.svg.png" 
                  alt="Twitter/X"
                  className={styles.socialIcon}
                />
              </a>
              <a href="/" className={styles.socialLink} title="LinkedIn">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Linked-in-alt.svg/640px-Linked-in-alt.svg.png" 
                  alt="LinkedIn"
                  className={styles.socialIcon}
                />
              </a>
              <a href="#" className={styles.socialLink} title="Instagram">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/1200px-Instagram_icon.png?20200512141346" 
                  alt="Instagram"
                  className={styles.socialIcon}
                />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Services</h3>
            <ul className={styles.linkList}>
              <li><Link to="/apply-for-funds">Apply for Funds</Link></li>
              <li><Link to="/donate">Donate</Link></li>
              <li><Link to="/fund-management">Fund Management</Link></li>
              <li><Link to="/financial-assistance">Financial Assistance</Link></li>
              <li><Link to="/business-loans">Business Loans</Link></li>
              <li><Link to="/educational-grants">Educational Grants</Link></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Resources</h3>
            <ul className={styles.linkList}>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/docs">Documentation</Link></li>
              <li><Link to="/application-guide">Application Guide</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/success-stories">Success Stories</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className={styles.footerSection}>
            <h3 className={styles.sectionTitle}>Contact Us</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <i className="fas fa-map-marker-alt"></i>
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-phone"></i>
                <span>+880 1700-000000</span>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-envelope"></i>
                <span>info@hopeharvest.bd</span>
              </div>
              <div className={styles.contactItem}>
                <i className="fas fa-clock"></i>
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Hope Harvest. All Rights Reserved. | Empowering Communities Since 2024
          </div>
          <div className={styles.footerLinks}>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;