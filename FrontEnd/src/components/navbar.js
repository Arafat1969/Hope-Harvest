import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const styles = {
  navbarPrimary: {
    backgroundColor: "#4CAF50" 
  },
  textColor: {
    color: "#2E7D32"
  },
  buttonPrimary: {
    backgroundColor: "#81c784", 
    borderColor: "#66bb6a",
    transition: "background-color 0.3s, border-color 0.3s"
  },
  buttonOutline: {
    color: "#4CAF50",
    borderColor: "#4CAF50",
    transition: "all 0.3s"
  },
  logoText: {
    color: "#2E7D32",
    fontWeight: "bold",
    fontSize: "1.5rem"
  },
  navLink: {
    color: "#ffffff !important", 
    fontSize: "1.1rem", 
    fontWeight: "500" 
  },
  profileButton: {
    backgroundColor: "#388E3C",
    borderColor: "#2E7D32",
    color: "white",
    transition: "all 0.3s"
  }
};

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      
      // Clear localStorage
      localStorage.clear();
      
      // Call parent logout handler if provided
      if (onLogout) {
        onLogout();
      }
      
      // Redirect to home
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local storage and redirect
      localStorage.clear();
      if (onLogout) {
        onLogout();
      }
      navigate('/');
    }
  };
  return (
    <header>
      {/* Top Row */}
      <div className="container-fluid py-2 border-bottom d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={styles.logoText}>HopeHarvest</div>
        </Link>
        {/* Buttons */}
        <div>
          <button 
            className="btn me-2" 
            style={styles.buttonOutline}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#e8f5e9";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Contact Us
          </button>          {isAuthenticated ? (
            // Show different buttons based on user role
            <>
              <Link to={user?.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard'}>
                <button 
                  className="btn text-white me-2"
                  style={styles.profileButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#2E7D32";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#388E3C";
                  }}
                >
                  {user?.role === 'ADMIN' ? (
                    <>
                      <i className="fas fa-shield-alt me-1"></i>
                      Admin Dashboard
                    </>
                  ) : (
                    <>
                      <i className="fas fa-tachometer-alt me-1"></i>
                      Dashboard
                    </>
                  )}
                </button>
              </Link>
              <Link to="/profile">
                <button 
                  className="btn text-white me-2"
                  style={styles.profileButton}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#2E7D32";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#388E3C";
                  }}
                >
                  <i className="fas fa-user me-1"></i>                  { 'Profile'}
                  {user?.role === 'ADMIN' && (
                    <span className="badge bg-danger ms-1" style={{fontSize: '0.6em'}}>
                      ADMIN
                    </span>
                  )}
                </button>
              </Link>
              <button 
                className="btn btn-outline-light"
                onClick={handleLogout}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f44336";
                  e.currentTarget.style.borderColor = "#d32f2f";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "white";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            // Show login button when not authenticated
            <Link to="/login">
              <button 
                className="btn text-white" 
                style={styles.buttonPrimary}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#4CAF50";
                  e.currentTarget.style.borderColor = "#2E7D32";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#81c784";
                  e.currentTarget.style.borderColor = "#66bb6a";
                }}
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
      {/* Bottom Row Navigation */}
      <nav className="navbar navbar-expand-md navbar-dark" style={styles.navbarPrimary}>
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
            <span className="navbar-toggler-icon"></span>
          </button>          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav mx-auto" style={{ columnGap: "10px" }}>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/" style={styles.navLink}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/about" style={styles.navLink}>About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/campaigns" style={styles.navLink}>Campaigns</Link>
              </li>              {user?.role !== 'ADMIN' && (
                <>                  <li className="nav-item">
                    <Link className="nav-link px-3" to="/donate" style={styles.navLink}>Donate</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link px-3" to="/track-donation" style={styles.navLink}>Track Donation</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link px-3" to="/volunteer-activity" style={styles.navLink}>Volunteer</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link px-3" to="/apply-for-funds" style={styles.navLink}>Apply for Funds</Link>
                  </li>
                </>
              )}
              {user?.role === 'ADMIN' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link px-3" to="/admin-dashboard" style={styles.navLink}>
                      <i className="fas fa-shield-alt me-1"></i>Admin Panel
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link px-3" to="/manage-users" style={styles.navLink}>Manage Users</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link px-3" to="/reports" style={styles.navLink}>Reports</Link>
                  </li>
                </>
              )}              <li className="nav-item">
                <Link className="nav-link px-3" to="/gallery" style={styles.navLink}>Gallery</Link>
              </li>
            </ul>
          </div>
        </div>      </nav>
    </header>
  );
};

export default Navbar;