import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { volunteerService } from '../services/volunteerService';
import { authService } from '../services/authService';

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [teams, setTeams] = useState([]);
  const [fundVerifications, setFundVerifications] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVolunteerData();
  }, []);

  const fetchVolunteerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user profile to extract userId
      const userResponse = await authService.getProfile();
      if (userResponse.status === 'success') {
        const userId = userResponse.data.userId || userResponse.data.id || userResponse.data.user_id;
        
        if (userId) {
          // Get volunteer profile
          const volunteerResponse = await volunteerService.getVolunteerProfile(userId);
          const volunteerData = volunteerResponse.data || volunteerResponse;
          setVolunteer(volunteerData);

          if (volunteerData?.volunteerId) {
            // Fetch teams, verifications, and ratings in parallel
            const [teamsResponse, verificationsResponse, ratingsResponse] = await Promise.allSettled([
              volunteerService.getVolunteerTeams(volunteerData.volunteerId),
              volunteerService.getVolunteerFundVerifications(volunteerData.volunteerId),
              volunteerService.getVolunteerRatings(volunteerData.volunteerId)
            ]);

            // Set teams data
            if (teamsResponse.status === 'fulfilled') {
              const teamsData = teamsResponse.value.data || teamsResponse.value || [];
              console.log('Teams Data:', teamsData);
              setTeams(Array.isArray(teamsData) ? teamsData : []);
            }

            // Set verifications data
            if (verificationsResponse.status === 'fulfilled') {
              const verificationsData = verificationsResponse.value.data || verificationsResponse.value || [];
              setFundVerifications(Array.isArray(verificationsData) ? verificationsData : []);
            }

            // Set ratings data
            if (ratingsResponse.status === 'fulfilled') {
              const ratingsData = ratingsResponse.value.data || ratingsResponse.value || [];
              setRatings(Array.isArray(ratingsData) ? ratingsData : []);
            }
          }
        } else {
          throw new Error('User ID not found');
        }
      }
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
      setError('Failed to load volunteer dashboard. You may not be registered as a volunteer.');
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleTeamClick = (team) => {
    // Navigate to VolunteerEventDetailsPage with eventId and leader status
    navigate(`/volunteer/events/${team.eventId}`, {
      state: {
        teamId: team.teamId,
        isLeader: team.leader,
        teamName: team.name,
        eventTitle: team.eventTitle
      }
    });
  };

  const handleVerificationClick = (verificationId) => {
    navigate(`/volunteer/verifications/${verificationId}`);
  };

  const handleRatingClick = (ratingId) => {
    navigate(`/volunteer/ratings/${ratingId}`);
  };

  const handleViewAllTeams = () => {
    navigate('/volunteer/teams');
  };

  const handleViewAllVerifications = () => {
    navigate('/volunteer/verifications');
  };

  const handleViewAllRatings = () => {
    navigate('/volunteer/ratings');
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      return new Date(dateTimeString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return <span className="badge bg-success">Active</span>;
      case 'INACTIVE':
        return <span className="badge bg-secondary">Inactive</span>;
      case 'PENDING':
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 'COMPLETED':
        return <span className="badge bg-primary">Completed</span>;
      case 'OVERDUE':
        return <span className="badge bg-danger">Overdue</span>;
      default:
        return <span className="badge bg-info">{status || 'Unknown'}</span>;
    }
  };

  const getRatingStars = (rating) => {
    if (!rating || rating === 0) return <span className="text-muted">No rating</span>;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-muted"></i>);
    }
    
    return (
      <div className="d-flex align-items-center">
        <div className="me-2">{stars}</div>
        <span className="text-dark">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted">Loading Volunteer Dashboard...</h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning text-center">
              <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
              <h4>Not Registered as Volunteer</h4>
              <p>{error}</p>
              <div className="mt-4">
                <button 
                  className="btn btn-primary me-2"
                  onClick={() => navigate('/volunteer-registration')}
                >
                  <i className="fas fa-user-plus me-2"></i>Register as Volunteer
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
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
        <div className="alert alert-info text-center">
          <h4>Volunteer Profile Not Found</h4>
          <p>Unable to load your volunteer profile.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/volunteer-registration')}
          >
            Register as Volunteer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 100%)', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div 
                className="card-body text-white" 
                style={{ 
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  borderRadius: '15px'
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
                        fontSize: '2rem'
                      }}
                    >
                      <i className="fas fa-hands-helping"></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-1">Volunteer Dashboard</h1>
                      <p className="mb-1 opacity-90">Volunteer ID: {volunteer.volunteerId}</p>
                      <p className="mb-0 opacity-75">Status: {getStatusBadge(volunteer.status)}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <button 
                      className="btn btn-light me-2"
                      onClick={() => navigate('/dashboard')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      User Dashboard
                    </button>
                    <button 
                      className="btn btn-outline-light"
                      onClick={() => navigate('/profile')}
                    >
                      <i className="fas fa-user me-2"></i>
                      Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card text-center border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body">
                <i className="fas fa-clock fa-2x text-primary mb-2"></i>
                <h3 className="text-primary">{volunteer.totalHours || 0}</h3>
                <small className="text-muted">Total Hours</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body">
                <i className="fas fa-tasks fa-2x text-success mb-2"></i>
                <h3 className="text-success">{volunteer.assignmentsCompleted || 0}</h3>
                <small className="text-muted">Assignments Completed</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body">
                <i className="fas fa-star fa-2x text-warning mb-2"></i>
                <h3 className="text-warning">{volunteer.averageRating?.toFixed(1) || '0.0'}</h3>
                <small className="text-muted">Average Rating</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body">
                <i className="fas fa-users fa-2x text-info mb-2"></i>
                <h3 className="text-info">{teams.length}</h3>
                <small className="text-muted">Teams Joined</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Teams Section */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
                <h5 className="mb-0 text-success">
                  <i className="fas fa-users me-2"></i>
                  My Teams
                </h5>
              </div>
              <div className="card-body">
                {teams.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-users fa-2x mb-3"></i>
                    <p>No teams assigned yet.</p>
                  </div>
                ) : (
                  <div>
                    {teams.slice(0, 4).map((team) => (
                      <div 
                        key={team.teamId} 
                        className={`border rounded p-3 mb-3 team-item ${team.leader ? 'border-warning' : ''}`}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: team.leader ? '2px solid #ffc107' : '1px solid #dee2e6',
                          backgroundColor: team.leader ? '#fff9e6' : 'white'
                        }}
                        onClick={() => handleTeamClick(team)}
                        onMouseEnter={(e) => {
                          if (team.leader) {
                            e.currentTarget.style.backgroundColor = '#fff3cd';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 193, 7, 0.3)';
                          } else {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (team.leader) {
                            e.currentTarget.style.backgroundColor = '#fff9e6';
                          } else {
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1 text-primary d-flex align-items-center">
                            {team.leader && (
                              <div className="me-2">
                                <i 
                                  className="fas fa-crown text-warning me-1" 
                                  title="Team Leader"
                                  style={{ fontSize: '1.1rem' }}
                                ></i>
                              </div>
                            )}
                            {team.name}
                          </h6>
                          {team.leader && (
                            <span className="badge bg-warning text-dark px-2 py-1">
                              <i className="fas fa-star me-1"></i>
                              Leader
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            <i className="fas fa-clock me-1 text-info"></i>
                            <strong>Event Date:</strong> {formatDateTime(team.eventStartDate)}
                          </small>
                        </div>
                        
                        <div className="mb-2">
                          <small className="text-muted d-block">
                            <i className="fas fa-map-marker-alt me-1 text-danger"></i>
                            <strong>Location:</strong> {team.locationAddress}
                          </small>
                          <small className="text-muted d-block">
                            <i className="fas fa-city me-1 text-secondary"></i>
                            <strong>Area:</strong> {team.locationCity}, {team.locationDistrict}
                          </small>
                        </div>
                        
                        {/* Role indicator */}
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div>
                            {team.leader ? (
                              <span className="badge bg-gradient bg-warning text-dark px-2 py-1">
                                <i className="fas fa-user-tie me-1"></i>
                                Leadership Role
                              </span>
                            ) : (
                              <span className="badge bg-gradient bg-success px-2 py-1">
                                <i className="fas fa-user-friends me-1"></i>
                                Team Member
                              </span>
                            )}
                          </div>
                          <div className="text-end">
                            <i className="fas fa-arrow-right text-success"></i>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {teams.length > 4 && (
                      <div className="text-center mt-3">
                        <button 
                          className="btn btn-outline-success btn-sm"
                          onClick={handleViewAllTeams}
                        >
                          View All Teams ({teams.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fund Verifications Section */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
                <h5 className="mb-0 text-warning">
                  <i className="fas fa-shield-alt me-2"></i>
                  Fund Verifications
                </h5>
              </div>
              <div className="card-body">
                {fundVerifications.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-shield-alt fa-2x mb-3"></i>
                    <p>No verifications assigned yet.</p>
                  </div>
                ) : (
                  <div>
                    {fundVerifications.slice(0, 4).map((verification) => (
                      <div 
                        key={verification.verificationId} 
                        className="border rounded p-3 mb-3 verification-item"
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '1px solid #dee2e6'
                        }}
                        onClick={() => handleVerificationClick(verification.verificationId)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fff9e6';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <h6 className="mb-1 text-warning">{verification.fullName}</h6>
                        <p className="mb-1 text-dark">{verification.purpose}</p>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-primary">{formatCurrency(verification.amount)}</span>
                          {getStatusBadge(verification.status)}
                        </div>
                        <small className="text-muted d-block">
                          <i className="fas fa-calendar-alt me-1"></i>
                          Due: {formatDate(verification.verificationDueDate)}
                        </small>
                        <div className="mt-2 text-end">
                          <i className="fas fa-arrow-right text-warning"></i>
                        </div>
                      </div>
                    ))}
                    
                    {fundVerifications.length > 4 && (
                      <div className="text-center mt-3">
                        <button 
                          className="btn btn-outline-warning btn-sm"
                          onClick={handleViewAllVerifications}
                        >
                          View All Verifications ({fundVerifications.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ratings Section */}
          <div className="col-lg-4 mb-4">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
                <h5 className="mb-0 text-info">
                  <i className="fas fa-star me-2"></i>
                  My Ratings
                </h5>
              </div>
              <div className="card-body">
                {ratings.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-star fa-2x mb-3"></i>
                    <p>No ratings received yet.</p>
                  </div>
                ) : (
                  <div>
                    {ratings.slice(0, 4).map((rating) => (
                      <div 
                        key={rating.ratingId} 
                        className="border rounded p-3 mb-3 rating-item"
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          border: '1px solid #dee2e6'
                        }}
                        onClick={() => handleRatingClick(rating.ratingId)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e6f9ff';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <h6 className="mb-1 text-info">{rating.teamName}</h6>
                        <div className="mb-2">
                          {getRatingStars(rating.overallRating)}
                        </div>
                        <small className="text-muted d-block mb-1">
                          <i className="fas fa-clock me-1"></i>
                          Hours: {rating.hoursWorked || 0}
                        </small>
                        {rating.feedback && (
                          <small className="text-muted fst-italic">
                            "{rating.feedback}"
                          </small>
                        )}
                        <div className="mt-2 text-end">
                          <i className="fas fa-arrow-right text-info"></i>
                        </div>
                      </div>
                    ))}
                    
                    {ratings.length > 4 && (
                      <div className="text-center mt-3">
                        <button 
                          className="btn btn-outline-info btn-sm"
                          onClick={handleViewAllRatings}
                        >
                          View All Ratings ({ratings.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '15px 15px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-user me-2"></i>
                  Volunteer Profile Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Contact Information</h6>
                    <p className="mb-1"><strong>Email:</strong> {volunteer.email || 'N/A'}</p>
                    <p className="mb-1"><strong>Phone:</strong> {volunteer.phoneNumber || 'N/A'}</p>
                    <p className="mb-0"><strong>National ID:</strong> {volunteer.nationalId || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Address</h6>
                    <p className="mb-1"><strong>City:</strong> {volunteer.addressCity || 'N/A'}</p>
                    <p className="mb-1"><strong>District:</strong> {volunteer.addressDistrict || 'N/A'}</p>
                    <p className="mb-0"><strong>Postal Code:</strong> {volunteer.addressPostalCode || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Skills</h6>
                    <div>
                      {volunteer.skills && volunteer.skills.length > 0 ? (
                        volunteer.skills.map((skill, index) => (
                          <span key={index} className="badge bg-primary me-2 mb-1">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">No skills listed</span>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted">Interests</h6>
                    <div>
                      {volunteer.interests && volunteer.interests.length > 0 ? (
                        volunteer.interests.map((interest, index) => (
                          <span key={index} className="badge bg-success me-2 mb-1">
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">No interests listed</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-muted">Availability Status</h6>
                    <p className="mb-0">
                      {volunteer.availability ? (
                        <span className="badge bg-success p-2">
                          <i className="fas fa-check me-2"></i>Available for Assignments
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark p-2">
                          <i className="fas fa-pause me-2"></i>Currently Not Available
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body text-center">
                <h6 className="text-muted mb-3">Quick Actions</h6>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <button className="btn btn-primary">
                    <i className="fas fa-edit me-2"></i>
                    Update Profile
                  </button>
                  <button className="btn btn-success">
                    <i className="fas fa-calendar me-2"></i>
                    View Schedule
                  </button>
                  <button className="btn btn-info">
                    <i className="fas fa-tasks me-2"></i>
                    My Assignments
                  </button>
                  <button className="btn btn-warning">
                    <i className="fas fa-clock me-2"></i>
                    Log Hours
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

export default VolunteerDashboard;