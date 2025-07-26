import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { volunteerService } from '../services/volunteerService';
import { authService } from '../services/authService';

const AdminVolunteerDetails = () => {
  const { volunteerId } = useParams();
  const navigate = useNavigate();
  
  const [volunteer, setVolunteer] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (volunteerId) {
      fetchVolunteerDetails();
    }
  }, [volunteerId]);

  const fetchVolunteerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching volunteer details for ID:', volunteerId);
      const response = await volunteerService.getVolunteerByIdAdmin(volunteerId);
      
      console.log('Volunteer details response:', response);
      const volunteerData = response.data || response;
      setVolunteer(volunteerData);

      // Fetch user details for first and last name
      if (volunteerData.externalUserId) {
        try {
          const userResponse = await authService.getUserById(volunteerData.externalUserId);
          const userData = userResponse.data || userResponse || {};
          setUserDetails(userData);
        } catch (userError) {
          console.error('Error fetching user details:', userError);
          setUserDetails(null);
        }
      }
      
    } catch (error) {
      console.error('Error fetching volunteer details:', error);
      setError(
        error.response?.data?.message ||
        'Failed to load volunteer details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '?';
    const first = firstName ? firstName.charAt(0) : '';
    const last = lastName ? lastName.charAt(0) : '';
    return (first + last).toUpperCase() || '?';
  };

  const getFullName = () => {
    if (!userDetails) return 'N/A';
    return `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || 'N/A';
  };

  const getStatusInfo = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return {
          badge: 'bg-success',
          icon: 'fas fa-check-circle',
          text: 'Active'
        };
      case 'INACTIVE':
        return {
          badge: 'bg-secondary',
          icon: 'fas fa-pause-circle',
          text: 'Inactive'
        };
      case 'SUSPENDED':
        return {
          badge: 'bg-danger',
          icon: 'fas fa-ban',
          text: 'Suspended'
        };
      default:
        return {
          badge: 'bg-primary',
          icon: 'fas fa-user',
          text: status || 'Unknown'
        };
    }
  };

  const getAvailabilityStatus = (availability) => {
    return availability 
      ? { badge: 'bg-success', text: 'Available' }
      : { badge: 'bg-warning text-dark', text: 'Not Available' };
  };

  // const getRatingStars = (rating) => {
  //   if (!rating || rating === 0) return 'No ratings yet';
    
  //   const stars = [];
  //   const fullStars = Math.floor(rating);
  //   const hasHalfStar = rating % 1 !== 0;
    
  //   for (let i = 0; i < fullStars; i++) {
  //     stars.push(<i key={i} className="fas fa-star text-warning"></i>);
  //   }
    
  //   if (hasHalfStar) {
  //     stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
  //   }
    
  //   const emptyStars = 5 - Math.ceil(rating);
  //   for (let i = 0; i < emptyStars; i++) {
  //     stars.push(<i key={`empty-${i}`} className="far fa-star text-muted"></i>);
  //   }
    
  //   return (
  //     <div className="d-flex align-items-center">
  //       <div className="me-2">{stars}</div>
  //       <span className="fw-bold text-dark">({rating.toFixed(1)})</span>
  //     </div>
  //   );
  // };

  const handleBackToVolunteers = () => {
    navigate('/admin/volunteers');
  };

  const handleBackToDashboard = () => {
    navigate('/admin-dashboard');
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="text-muted">Loading Volunteer Details...</h4>
              <p className="text-muted">Please wait while we fetch the volunteer information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger text-center">
              <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
              <h4>Error Loading Volunteer</h4>
              <p>{error}</p>
              <div className="mt-4">
                <button className="btn btn-danger me-2" onClick={fetchVolunteerDetails}>
                  <i className="fas fa-sync-alt me-2"></i>Try Again
                </button>
                <button className="btn btn-secondary" onClick={handleBackToVolunteers}>
                  <i className="fas fa-arrow-left me-2"></i>Back to Volunteers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning text-center">
              <h4>Volunteer Not Found</h4>
              <p>The requested volunteer could not be found.</p>
              <button className="btn btn-secondary mt-3" onClick={handleBackToVolunteers}>
                <i className="fas fa-arrow-left me-2"></i>Back to Volunteers
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(volunteer.status);
  const availabilityInfo = getAvailabilityStatus(volunteer.availability);

  return (
    <div style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div 
                className="card-body text-white" 
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px'
                }}
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-4"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {getInitials(userDetails?.firstName, userDetails?.lastName)}
                    </div>
                    <div>
                      <h1 className="h3 mb-1">{getFullName()}</h1>
                      <p className="mb-1 opacity-90">Volunteer ID: {volunteer.volunteerId}</p>
                      <p className="mb-0 opacity-75">External User ID: {volunteer.externalUserId}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <button 
                      className="btn btn-light me-2"
                      onClick={handleBackToVolunteers}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      All Volunteers
                    </button>
                    <button 
                      className="btn btn-outline-light"
                      onClick={handleBackToDashboard}
                    >
                      <i className="fas fa-home me-2"></i>
                      Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Main Information */}
          <div className="col-lg-8 mb-4">
            {/* Personal Information */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-user me-2 text-primary"></i>
                  Personal Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">First Name</label>
                    <p className="mb-0 fs-6">{userDetails?.firstName || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Last Name</label>
                    <p className="mb-0 fs-6">{userDetails?.lastName || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">National ID</label>
                    <p className="mb-0 fs-6">{volunteer.nationalId || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Email Address</label>
                    <p className="mb-0 fs-6">{volunteer.email || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Phone Number</label>
                    <p className="mb-0 fs-6">{volunteer.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-map-marker-alt me-2 text-success"></i>
                  Address Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">City</label>
                    <p className="mb-0 fs-6">{volunteer.addressCity || 'N/A'}</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">District</label>
                    <p className="mb-0 fs-6">{volunteer.addressDistrict || 'N/A'}</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">Postal Code</label>
                    <p className="mb-0 fs-6">{volunteer.addressPostalCode || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills and Interests */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-cogs me-2 text-info"></i>
                  Skills & Interests
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-4">
                    <label className="form-label text-muted small fw-bold">Skills</label>
                    <div className="mt-2">
                      {volunteer.skills && volunteer.skills.length > 0 ? (
                        volunteer.skills.map((skill, index) => (
                          <span key={index} className="badge bg-primary me-2 mb-2 px-3 py-2">
                            <i className="fas fa-check me-1"></i>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">No skills listed</span>
                      )}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label text-muted small fw-bold">Interests</label>
                    <div className="mt-2">
                      {volunteer.interests && volunteer.interests.length > 0 ? (
                        volunteer.interests.map((interest, index) => (
                          <span key={index} className="badge bg-success me-2 mb-2 px-3 py-2">
                            <i className="fas fa-heart me-1"></i>
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">No interests listed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Status & Availability */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-info-circle me-2 text-warning"></i>
                  Status Information
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Current Status</label>
                  <div className="mt-1">
                    <span className={`badge ${statusInfo.badge} px-3 py-2`}>
                      <i className={`${statusInfo.icon} me-2`}></i>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Availability</label>
                  <div className="mt-1">
                    <span className={`badge ${availabilityInfo.badge} px-3 py-2`}>
                      <i className="fas fa-calendar-check me-2"></i>
                      {availabilityInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-chart-bar me-2 text-danger"></i>
                  Performance Metrics
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-4 text-center">
                  <h3 className="text-primary mb-1">{volunteer.totalHours || 0}</h3>
                  <small className="text-muted">Total Hours Volunteered</small>
                </div>
                <div className="mb-4 text-center">
                  <h3 className="text-success mb-1">{volunteer.assignmentsCompleted || 0}</h3>
                  <small className="text-muted">Assignments Completed</small>
                </div>
                <div className="text-center">
                  <label className="form-label text-muted small fw-bold d-block">Average Rating</label>
                  <div className="mt-2 text-center text-danger">
                    <b>{volunteer.averageRating}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-tools me-2 text-secondary"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-primary">
                    <i className="fas fa-edit me-2"></i>
                    Edit Volunteer
                  </button>
                  <button className="btn btn-info">
                    <i className="fas fa-tasks me-2"></i>
                    View Assignments
                  </button>
                  <button className="btn btn-warning">
                    <i className="fas fa-star me-2"></i>
                    View Ratings
                  </button>
                  <button className="btn btn-secondary">
                    <i className="fas fa-history me-2"></i>
                    Activity History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body text-center py-4">
                <h6 className="text-muted mb-3">Volunteer Management</h6>
                <p className="text-muted mb-3">
                  This volunteer profile contains all available information for administrative purposes.
                  Use the quick actions above to manage volunteer assignments, ratings, and status.
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <button className="btn btn-outline-primary">
                    <i className="fas fa-download me-2"></i>
                    Export Profile
                  </button>
                  <button className="btn btn-outline-info">
                    <i className="fas fa-print me-2"></i>
                    Print Profile
                  </button>
                  <button className="btn btn-outline-success">
                    <i className="fas fa-envelope me-2"></i>
                    Contact Volunteer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVolunteerDetails;