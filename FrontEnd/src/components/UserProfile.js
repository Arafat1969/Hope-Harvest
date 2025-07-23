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
  editInput: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    outline: 'none'
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
  saveButton: {
    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 30px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
  },
  cancelButton: {
    background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 30px',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(244, 67, 54, 0.3)'
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
  const [saving, setSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    addressCity: '',
    addressPostalCode: '',
    addressCountry: ''
  });
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
        
        // Initialize edit form data with current user data
        setEditFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phoneNumber: response.data.phoneNumber || '',
          addressCity: response.data.addressCity || response.data.city || '',
          addressPostalCode: response.data.addressPostalCode || response.data.postalCode || '',
          addressCountry: response.data.addressCountry || response.data.country || ''
        });
        
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

  const handleEditModeToggle = () => {
    if (editMode) {
      // Reset form data to original values when canceling
      setEditFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        addressCity: user.addressCity || user.city || '',
        addressPostalCode: user.addressPostalCode || user.postalCode || '',
        addressCountry: user.addressCountry || user.country || ''
      });
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      // Prepare request data - send null for empty fields
      const requestData = {
        firstName: editFormData.firstName.trim() || null,
        lastName: editFormData.lastName.trim() || null,
        phoneNumber: editFormData.phoneNumber.trim() || null,
        addressCity: editFormData.addressCity.trim() || null,
        addressPostalCode: editFormData.addressPostalCode.trim() || null,
        addressCountry: editFormData.addressCountry.trim() || null
      };

      const response = await authService.updateProfile(requestData);
      
      if (response.status === 'success') {
        // Update user state with new data
        fetchUserProfile();
        setEditMode(false);
        
        // Show success message (you can customize this)
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
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

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#4CAF50';
    e.target.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e9ecef';
    e.target.style.boxShadow = 'none';
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

  if (error && !user) {
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
        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

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
              {editMode && (
                <div className="mt-3">
                  <span className="badge bg-warning text-dark">
                    <i className="fas fa-edit me-1"></i>
                    Edit Mode Active
                  </span>
                </div>
              )}
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
              onMouseEnter={(e) => !editMode && handleCardHover(e, true)}
              onMouseLeave={(e) => !editMode && handleCardHover(e, false)}
            >
              <h3 style={styles.sectionTitle}>
                <i className="fas fa-user me-3"></i>
                Personal Information
                {editMode && (
                  <span className="badge bg-primary ms-auto">Editing</span>
                )}
              </h3>
              
              {/* Full Name - Read Only */}
              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => !editMode && handleFieldHover(e, true)}
                onMouseLeave={(e) => !editMode && handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-signature me-2"></i>
                  Full Name
                </div>
                <p style={styles.fieldValue}>
                  {editMode 
                    ? `${editFormData.firstName} ${editFormData.lastName}`.trim() || 'Not provided'
                    : fullName || 'Not provided'
                  }
                </p>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div 
                    style={styles.fieldContainer}
                    onMouseEnter={(e) => !editMode && handleFieldHover(e, true)}
                    onMouseLeave={(e) => !editMode && handleFieldHover(e, false)}
                  >
                    <div style={styles.fieldLabel}>
                      <i className="fas fa-user me-2"></i>
                      First Name
                    </div>
                    {editMode ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        style={styles.editInput}
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p style={styles.fieldValue}>{user.firstName || 'Not provided'}</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div 
                    style={styles.fieldContainer}
                    onMouseEnter={(e) => !editMode && handleFieldHover(e, true)}
                    onMouseLeave={(e) => !editMode && handleFieldHover(e, false)}
                  >
                    <div style={styles.fieldLabel}>
                      <i className="fas fa-user-tag me-2"></i>
                      Last Name
                    </div>
                    {editMode ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        style={styles.editInput}
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p style={styles.fieldValue}>{user.lastName || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email - Read Only */}
              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => !editMode && handleFieldHover(e, true)}
                onMouseLeave={(e) => !editMode && handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-envelope me-2"></i>
                  Email Address (Cannot be changed)
                </div>
                <p style={styles.fieldValue}>{user.email || 'Not provided'}</p>
              </div>

              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => !editMode && handleFieldHover(e, true)}
                onMouseLeave={(e) => !editMode && handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-phone me-2"></i>
                  Phone Number
                </div>
                {editMode ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={editFormData.phoneNumber}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={styles.editInput}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p style={styles.fieldValue}>{user.phoneNumber || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="col-lg-6 mb-4">
            <div 
              style={styles.infoCard}
              onMouseEnter={(e) => !editMode && handleCardHover(e, true)}
              onMouseLeave={(e) => !editMode && handleCardHover(e, false)}
            >
              <h3 style={styles.sectionTitle}>
                <i className="fas fa-map-marker-alt me-3"></i>
                Address Information
                {editMode && (
                  <span className="badge bg-primary ms-auto">Editing</span>
                )}
              </h3>
              
              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => !editMode && handleFieldHover(e, true)}
                onMouseLeave={(e) => !editMode && handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-city me-2"></i>
                  City
                </div>
                {editMode ? (
                  <input
                    type="text"
                    name="addressCity"
                    value={editFormData.addressCity}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={styles.editInput}
                    placeholder="Enter city"
                  />
                ) : (
                  <p style={styles.fieldValue}>{user.addressCity || user.city || 'Not provided'}</p>
                )}
              </div>

              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => !editMode && handleFieldHover(e, true)}
                onMouseLeave={(e) => !editMode && handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-mail-bulk me-2"></i>
                  Postal Code
                </div>
                {editMode ? (
                  <input
                    type="text"
                    name="addressPostalCode"
                    value={editFormData.addressPostalCode}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={styles.editInput}
                    placeholder="Enter postal code"
                  />
                ) : (
                  <p style={styles.fieldValue}>{user.addressPostalCode || user.postalCode || 'Not provided'}</p>
                )}
              </div>

              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => !editMode && handleFieldHover(e, true)}
                onMouseLeave={(e) => !editMode && handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-flag me-2"></i>
                  Country
                </div>
                {editMode ? (
                  <input
                    type="text"
                    name="addressCountry"
                    value={editFormData.addressCountry}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    style={styles.editInput}
                    placeholder="Enter country"
                  />
                ) : (
                  <p style={styles.fieldValue}>{user.addressCountry || user.country || 'Not provided'}</p>
                )}
              </div>

              <div 
                style={styles.fieldContainer}
                onMouseEnter={(e) => !editMode && handleFieldHover(e, true)}
                onMouseLeave={(e) => !editMode && handleFieldHover(e, false)}
              >
                <div style={styles.fieldLabel}>
                  <i className="fas fa-map me-2"></i>
                  Complete Address
                </div>
                <p style={styles.fieldValue}>
                  {editMode 
                    ? [
                        editFormData.addressCity,
                        editFormData.addressPostalCode,
                        editFormData.addressCountry
                      ].filter(Boolean).join(', ') || 'Address not complete'
                    : [
                        user.addressCity || user.city,
                        user.addressPostalCode || user.postalCode,
                        user.addressCountry || user.country
                      ].filter(Boolean).join(', ') || 'Address not complete'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          {editMode ? (
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button 
                style={styles.saveButton}
                onClick={handleSaveProfile}
                disabled={saving}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(33, 150, 243, 0.3)';
                  }
                }}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Save Changes
                  </>
                )}
              </button>
              
              <button 
                style={styles.cancelButton}
                onClick={handleEditModeToggle}
                disabled={saving}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(244, 67, 54, 0.3)';
                  }
                }}
              >
                <i className="fas fa-times me-2"></i>
                Cancel
              </button>
            </div>
          ) : (
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button 
                style={styles.editButton}
                onClick={handleEditModeToggle}
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
                Edit Profile
              </button>
              
              <button 
                className="btn btn-outline-primary"
                onClick={fetchUserProfile}
                style={{ borderRadius: '25px', padding: '12px 30px' }}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* Edit Mode Instructions */}
        {editMode && (
          <div className="mt-4">
            <div className="alert alert-info" role="alert">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Edit Mode Active:</strong> Make your changes and click "Save Changes" to update your profile. 
              Leave fields blank if you want to remove the information. Your email address cannot be changed.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;