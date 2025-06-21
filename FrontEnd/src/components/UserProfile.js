import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

const styles = {
  profileContainer: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)',
    minHeight: '100vh',
    padding: '2rem 0'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    borderRadius: '20px',
    padding: '3rem 2rem',
    color: 'white',
    marginBottom: '2rem',
    position: 'relative',
    overflow: 'hidden'
  },
  heroPattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.1,
    fontSize: '10rem',
    transform: 'rotate(-15deg)'
  },
  profileImage: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '3rem',
    color: '#4CAF50',
    margin: '0 auto 1rem',
    border: '4px solid rgba(255,255,255,0.3)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    padding: '2rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(76, 175, 80, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  },
  sectionTitle: {
    color: '#2E7D32',
    fontWeight: '700',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.4rem'
  },
  fieldContainer: {
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    transition: 'all 0.3s ease'
  },
  fieldLabel: {
    color: '#6c757d',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  fieldValue: {
    color: '#212529',
    fontSize: '1.1rem',
    fontWeight: '500',
    margin: 0
  },
  editButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 30px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
  },
  statsCard: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    color: 'white',
    borderRadius: '15px',
    padding: '1.5rem',
    textAlign: 'center',
    margin: '0.5rem'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4CAF50',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '2rem auto'
  },
  badge: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600'
  }
};

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileStats, setProfileStats] = useState({
    memberSince: '',
    totalDonations: 0,
    totalAmount: 0
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile from backend API
      const response = await authService.getProfile();
      
      if (response.status === 'success') {
        setUser(response.data);
        
        // Calculate member since date
        const memberSince = response.data.createdAt 
          ? new Date(response.data.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            })
          : 'Recently';
            
        setProfileStats(prev => ({
          ...prev,
          memberSince
        }));
      } else {
        throw new Error('Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Unable to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageHover = (e, isHover) => {
    if (isHover) {
      e.target.style.transform = 'scale(1.05)';
      e.target.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
    } else {
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
    }
  };

  const handleCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
    }
  };

  const handleFieldHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.backgroundColor = '#e3f2fd';
      e.currentTarget.style.borderColor = '#4CAF50';
      e.currentTarget.style.transform = 'translateX(5px)';
    } else {
      e.currentTarget.style.backgroundColor = '#f8f9fa';
      e.currentTarget.style.borderColor = '#e9ecef';
      e.currentTarget.style.transform = 'translateX(0)';
    }
  };

  if (loading) {
    return (
      <div style={styles.profileContainer}>
        <div className="container">
          <div className="text-center">
            <div style={styles.loadingSpinner}></div>
            <h4 className="text-muted">Loading your profile...</h4>
            <p className="text-muted">Fetching your latest information</p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.profileContainer}>
        <div className="container">
          <div className="text-center">
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
              <h4>Oops! Something went wrong</h4>
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={fetchUserProfile}
              >
                <i className="fas fa-refresh me-2"></i>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userInitials = (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '');
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  return (
    <div style={styles.profileContainer}>
      <div className="container">
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <i className="fas fa-user-circle" style={styles.heroPattern}></i>
          <div className="row align-items-center">
            <div className="col-md-4 text-center">
              <div 
                style={styles.profileImage}
                onMouseEnter={(e) => handleImageHover(e, true)}
                onMouseLeave={(e) => handleImageHover(e, false)}
              >
                {userInitials || <i className="fas fa-user"></i>}
              </div>
            </div>
            <div className="col-md-8">
              <h1 className="mb-3">
                Welcome back, {user.firstName || 'User'}! 
                <span style={styles.badge} className="ms-3">
                  {user.role || 'USER'}
                </span>
              </h1>
              <p className="lead mb-3">
                <i className="fas fa-envelope me-2"></i>
                {user.email || 'No email provided'}
              </p>
              <div className="row">
                <div className="col-md-4">
                  <div style={styles.statsCard}>
                    <h4>Member Since</h4>
                    <p className="mb-0">{profileStats.memberSince}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={styles.statsCard}>
                    <h4>Profile Status</h4>
                    <p className="mb-0">
                      <i className="fas fa-check-circle me-1"></i>
                      Active
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div style={styles.statsCard}>
                    <h4>Last Updated</h4>
                    <p className="mb-0">
                      {user.updatedAt 
                        ? new Date(user.updatedAt).toLocaleDateString()
                        : 'Recently'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Personal Information */}
          <div className="col-lg-6 mb-4">
            <div 
              style={styles.infoCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <h3 style={styles.sectionTitle}>
                <i className="fas fa-user me-3"></i>
                Personal Information
              </h3>
              
              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => handleFieldHover(e, true)}
                onMouseLeave={(e) => handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-signature me-2"></i>
                  Full Name
                </div>
                <p style={styles.fieldValue}>{fullName || 'Not provided'}</p>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div 
                    style={styles.fieldContainer}
                    onMouseEnter={(e) => handleFieldHover(e, true)}
                    onMouseLeave={(e) => handleFieldHover(e, false)}
                  >
                    <div style={styles.fieldLabel}>
                      <i className="fas fa-user me-2"></i>
                      First Name
                    </div>
                    <p style={styles.fieldValue}>{user.firstName || 'Not provided'}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div 
                    style={styles.fieldContainer}
                    onMouseEnter={(e) => handleFieldHover(e, true)}
                    onMouseLeave={(e) => handleFieldHover(e, false)}
                  >
                    <div style={styles.fieldLabel}>
                      <i className="fas fa-user-tag me-2"></i>
                      Last Name
                    </div>
                    <p style={styles.fieldValue}>{user.lastName || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => handleFieldHover(e, true)}
                onMouseLeave={(e) => handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-envelope me-2"></i>
                  Email Address
                </div>
                <p style={styles.fieldValue}>{user.email || 'Not provided'}</p>
              </div>

              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => handleFieldHover(e, true)}
                onMouseLeave={(e) => handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-phone me-2"></i>
                  Phone Number
                </div>
                <p style={styles.fieldValue}>{user.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="col-lg-6 mb-4">
            <div 
              style={styles.infoCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <h3 style={styles.sectionTitle}>
                <i className="fas fa-map-marker-alt me-3"></i>
                Address Information
              </h3>
              
              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => handleFieldHover(e, true)}
                onMouseLeave={(e) => handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-city me-2"></i>
                  City
                </div>
                <p style={styles.fieldValue}>{user.addressCity || user.city || 'Not provided'}</p>
              </div>

              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => handleFieldHover(e, true)}
                onMouseLeave={(e) => handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-mail-bulk me-2"></i>
                  Postal Code
                </div>
                <p style={styles.fieldValue}>{user.addressPostalCode || user.postalCode || 'Not provided'}</p>
              </div>

              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => handleFieldHover(e, true)}
                onMouseLeave={(e) => handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-flag me-2"></i>
                  Country
                </div>
                <p style={styles.fieldValue}>{user.addressCountry || user.country || 'Not provided'}</p>
              </div>

              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => handleFieldHover(e, true)}
                onMouseLeave={(e) => handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-map me-2"></i>
                  Complete Address
                </div>
                <p style={styles.fieldValue}>
                  {[
                    user.addressCity || user.city,
                    user.addressPostalCode || user.postalCode,
                    user.addressCountry || user.country
                  ].filter(Boolean).join(', ') || 'Address not complete'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <button 
            style={styles.editButton}
            onClick={() => setEditMode(!editMode)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
            }}
          >
            <i className="fas fa-edit me-2"></i>
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
          
          <button 
            className="btn btn-outline-primary ms-3"
            onClick={fetchUserProfile}
            style={{ borderRadius: '25px', padding: '12px 30px' }}
          >
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;