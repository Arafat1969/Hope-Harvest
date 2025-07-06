import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  successCard: {
    borderRadius: '0.5rem',
    border: '1px solid #28a745'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    borderRadius: '25px',
    padding: '3rem 2rem',
    color: 'white',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  skillTag: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.875rem',
    margin: '0.25rem'
  },
  interestTag: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.875rem',
    margin: '0.25rem'
  },
  statCard: {
    background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    color: 'white',
    borderRadius: '15px',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
  }
};

const VolunteerRegistrationSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [volunteerData, setVolunteerData] = useState(null);

  useEffect(() => {
    // Get volunteer data from navigation state
    const data = location.state?.volunteerData;
    if (data) {
      setVolunteerData(data);
    } else {
      // If no data, redirect back to registration page
      navigate('/volunteer-registration');
    }
  }, [location.state, navigate]);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'inactive':
        return 'badge bg-secondary';
      default:
        return 'badge bg-primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'fas fa-check-circle';
      case 'pending':
        return 'fas fa-clock';
      case 'inactive':
        return 'fas fa-pause-circle';
      default:
        return 'fas fa-user-check';
    }
  };

  if (!volunteerData) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading volunteer profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div style={styles.heroSection}>
            <i className="fas fa-hands-helping fa-3x mb-3"></i>
            <h1 className="display-5 fw-bold mb-3">Welcome to Hope Harvest!</h1>
            <p className="lead mb-0">
              Thank you for joining our volunteer community. Together, we'll make a difference!
            </p>
          </div>
        </div>
      </div>

      {/* Volunteer Profile */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card" style={styles.successCard}>
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 text-success">
                  <i className="fas fa-user-check me-2"></i>
                  Your Volunteer Profile
                </h4>
                <span className={getStatusBadgeClass(volunteerData.status)}>
                  <i className={`${getStatusIcon(volunteerData.status)} me-1`}></i>
                  {volunteerData.status || 'Active'}
                </span>
              </div>
            </div>
            <div className="card-body">
              {/* Volunteer ID and Basic Info */}
              <div className="row mb-4">
                <div className="col-12 text-center">
                  <div className="mb-3">
                    <span className="badge bg-info fs-6">
                      <i className="fas fa-id-card me-2"></i>
                      Volunteer ID: {volunteerData.volunteerId}
                    </span>
                  </div>
                  <h3 className="text-primary mb-2">{volunteerData.email}</h3>
                  <p className="text-muted">
                    <i className="fas fa-phone me-2"></i>
                    {volunteerData.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <div style={styles.statCard}>
                    <h4>{volunteerData.totalHours || 0}</h4>
                    <small>Total Hours</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div style={styles.statCard}>
                    <h4>{volunteerData.assignmentsCompleted || 0}</h4>
                    <small>Assignments Completed</small>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div style={styles.statCard}>
                    <h4>{volunteerData.averageRating ? volunteerData.averageRating.toFixed(1) : 'N/A'}</h4>
                    <small>Average Rating</small>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="text-success mb-3">
                    <i className="fas fa-user me-2"></i>
                    Personal Information
                  </h5>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-id-badge text-primary me-3"></i>
                    <div>
                      <small className="text-muted d-block">National ID</small>
                      <span className="fw-bold">{volunteerData.nationalId}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-envelope text-primary me-3"></i>
                    <div>
                      <small className="text-muted d-block">Email</small>
                      <span className="fw-bold">{volunteerData.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="text-success mb-3">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Address Information
                  </h5>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-city text-primary me-3"></i>
                    <div>
                      <small className="text-muted d-block">City</small>
                      <span className="fw-bold">{volunteerData.addressCity}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-map text-primary me-3"></i>
                    <div>
                      <small className="text-muted d-block">District</small>
                      <span className="fw-bold">{volunteerData.addressDistrict}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-mail-bulk text-primary me-3"></i>
                    <div>
                      <small className="text-muted d-block">Postal Code</small>
                      <span className="fw-bold">{volunteerData.addressPostalCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="text-success mb-3">
                    <i className="fas fa-tools me-2"></i>
                    Your Skills ({volunteerData.skills?.length || 0})
                  </h5>
                  <div>
                    {volunteerData.skills && volunteerData.skills.length > 0 ? (
                      volunteerData.skills.map(skill => (
                        <span key={skill} style={styles.skillTag}>
                          <i className="fas fa-cog me-1"></i>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-muted">No skills added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="row mb-4">
                <div className="col-12">
                  <h5 className="text-success mb-3">
                    <i className="fas fa-heart me-2"></i>
                    Areas of Interest ({volunteerData.interests?.length || 0})
                  </h5>
                  <div>
                    {volunteerData.interests && volunteerData.interests.length > 0 ? (
                      volunteerData.interests.map(interest => (
                        <span key={interest} style={styles.interestTag}>
                          <i className="fas fa-star me-1"></i>
                          {interest}
                        </span>
                      ))
                    ) : (
                      <p className="text-muted">No interests added yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="alert alert-info">
                    <h6 className="alert-heading">
                      <i className="fas fa-info-circle me-2"></i>
                      Availability Status
                    </h6>
                    <p className="mb-0">
                      You are currently {volunteerData.availability ? 
                        <span className="text-success fw-bold">available</span> : 
                        <span className="text-warning fw-bold">unavailable</span>
                      } for volunteer assignments.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="row">
                <div className="col-12">
                  <div className="d-flex flex-wrap gap-3 justify-content-center">
                    <button
                      className="btn btn-success btn-lg"
                      onClick={() => navigate('/volunteer-dashboard')}
                      style={{ borderRadius: '25px' }}
                    >
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Go to Dashboard
                    </button>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => navigate('/volunteer-profile')}
                      style={{ borderRadius: '25px' }}
                    >
                      <i className="fas fa-user-edit me-2"></i>
                      Edit Profile
                    </button>
                    <button
                      className="btn btn-outline-success btn-lg"
                      onClick={() => navigate('/volunteer-activity')}
                      style={{ borderRadius: '25px' }}
                    >
                      <i className="fas fa-info-circle me-2"></i>
                      Learn More
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      onClick={() => navigate('/dashboard')}
                      style={{ borderRadius: '25px' }}
                    >
                      <i className="fas fa-home me-2"></i>
                      Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistrationSuccessPage;