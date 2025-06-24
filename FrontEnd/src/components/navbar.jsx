import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import styles from './Navbar.module.css';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current page path

  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = location.pathname === '/';

  // Effect to handle scroll detection for making the navbar solid
  useEffect(() => {
    const handleScroll = () => {
      // Only makes sense to check scroll on the homepage for this effect
      if (isHomePage) {
        setIsScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]); // Re-run effect if the page changes

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      localStorage.clear();
      if (onLogout) {
        onLogout();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      if (onLogout) {
        onLogout();
      }
      navigate('/');
    }
  };

  // Helper to determine active state for NavLink
  const getNavLinkClass = ({ isActive }) =>
    `nav-link px-3 ${styles.navLink} ${isActive ? styles.activeLink : ''}`;
  
  // Determine if the bottom nav should be transparent
  const bottomNavClass = `${styles.bottomNav} ${isHomePage && !isScrolled ? styles.transparentNav : ''}`;

  return (
    <header className={styles.header}>
      {/* Top Row - Kept as is, styles moved to CSS Module */}
      <div className={`container-fluid py-2 border-bottom ${styles.topRow}`}>
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" className={styles.logoText}>
            &nbsp;HOPE HARVEST
          </Link>
          <div className="d-flex align-items-center gap-2">
            <button className={`btn ${styles.button} ${styles.buttonContact}`}>
              Contact Us
            </button>
            {isAuthenticated ? (
              <>
                <Link to={user?.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard'} className={`btn text-white ${styles.button} ${styles.buttonDashboard}`}>
                  {user?.role === 'ADMIN' ? (
                    <>
                      <i className="fas fa-gem me-1"></i>
                      Admin Dashboard
                    </>
                  ) : (
                    <>
                      <i className="fas fa-tachometer-alt me-1"></i>
                      Dashboard
                    </>
                  )}
                </Link>
                <Link to="/profile" className={`btn text-white ${styles.button} ${styles.buttonProfile}`}>
                  <i className="fas fa-user me-1"></i>
                  <span>Profile</span>
                  {user?.role === 'ADMIN' && (
                    <span className={`badge ${styles.adminBadge} ms-1`}>ADMIN</span>
                  )}
                </Link>
                <button onClick={handleLogout} className={`btn ${styles.button} ${styles.buttonLogout}`}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className={`btn text-white ${styles.button} ${styles.buttonLogin}`}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Row Navigation */}
      <nav className={`navbar navbar-expand-md navbar-dark ${bottomNavClass}`}>
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className={`navbar-toggler-icon ${styles.navbarTogglerIcon}`}></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className={`navbar-nav ${styles.navLinksContainer}`}>
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/about">About</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/campaigns">Campaigns</NavLink>
              </li>
              {user?.role !== 'ADMIN' && (
                <>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/donate">Donate</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/track-donation">Track Donation</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/volunteer-activity">Volunteer</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/apply-for-funds">Apply for Funds</NavLink>
                  </li>
                </>
              )}
              {user?.role === 'ADMIN' && (
                <>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/admin-dashboard">
                      <i className="fas fa-gem me-1"></i>Admin Panel
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/manage-users">Manage Users</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className={getNavLinkClass} to="/reports">Reports</NavLink>
                  </li>
                </>
              )}
              <li className="nav-item">
                <NavLink className={getNavLinkClass} to="/gallery">Gallery</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
