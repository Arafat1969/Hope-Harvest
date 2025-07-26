import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { volunteerService } from '../services/volunteerService';
import { authService } from '../services/authService';

const VolunteerRatingDetails = () => {
  const { ratingId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [rating, setRating] = useState(null);
  const [ratedByUser, setRatedByUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ratingId) {
      fetchRatingDetails();
    }
  }, [ratingId]);

  const fetchRatingDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await volunteerService.getRatingDetails(ratingId);
      const ratingData = response.data || response;
      setRating(ratingData);

      // Fetch the user who gave the rating
      if (ratingData.externalUserId) {
        try {
          const userResponse = await authService.getUserById(ratingData.externalUserId);
          const userData = userResponse.data || userResponse;
          setRatedByUser(userData);
        } catch (userError) {
          console.warn('Could not fetch user details:', userError);
          setRatedByUser(null);
        }
      }

    } catch (error) {
      console.error('Error fetching rating details:', error);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to load rating details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const getRatingStars = (rating, size = 'normal') => {
    if (!rating || rating === 0) {
      return (
        <div className="d-flex align-items-center">
          {[...Array(5)].map((_, index) => (
            <i key={index} className={`far fa-star text-muted ${size === 'large' ? 'fa-lg' : ''}`}></i>
          ))}
          <span className="ms-2 text-muted">No rating</span>
        </div>
      );
    }
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={i} className={`fas fa-star text-warning ${size === 'large' ? 'fa-lg' : ''}`}></i>
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <i key="half" className={`fas fa-star-half-alt text-warning ${size === 'large' ? 'fa-lg' : ''}`}></i>
      );
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className={`far fa-star text-muted ${size === 'large' ? 'fa-lg' : ''}`}></i>
      );
    }
    
    return (
      <div className="d-flex align-items-center">
        <div className="me-2">{stars}</div>
        <span className={`text-dark ${size === 'large' ? 'h5 mb-0' : ''}`}>
          ({rating.toFixed(1)}/5.0)
        </span>
      </div>
    );
  };

  const getRatingText = (rating) => {
    if (!rating || rating === 0) return 'Not rated';
    if (rating <= 1) return 'Poor';
    if (rating <= 2) return 'Fair';
    if (rating <= 3) return 'Good';
    if (rating <= 4) return 'Very Good';
    return 'Excellent';
  };

  const getRatingColor = (rating) => {
    if (!rating || rating === 0) return 'text-muted';
    if (rating <= 2) return 'text-danger';
    if (rating <= 3) return 'text-warning';
    if (rating <= 4) return 'text-info';
    return 'text-success';
  };

  const calculateOverallRating = () => {
    if (!rating) return 0;
    const { performanceRating, punctualityRating, communicationRating } = rating;
    if (!performanceRating || !punctualityRating || !communicationRating) return 0;
    return ((performanceRating + punctualityRating + communicationRating) / 3).toFixed(1);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted">Loading Rating Details...</h4>
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
              <h4>Error Loading Rating</h4>
              <p>{error}</p>
              <div className="mt-4">
                <button className="btn btn-danger me-2" onClick={fetchRatingDetails}>
                  <i className="fas fa-sync-alt me-2"></i>Try Again
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/volunteer/dashboard')}>
                  <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!rating) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Rating Not Found</h4>
          <p>The requested rating could not be found.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/volunteer/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div 
                className="card-body text-white"
                style={{
                  background: 'linear-gradient(135deg, #17a2b8 0%, #007bff 100%)',
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
                        fontSize: '2rem'
                      }}
                    >
                      <i className="fas fa-star"></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-1">Performance Rating</h1>
                      <p className="mb-1 opacity-90">Rating ID: {rating.ratingId}</p>
                      <p className="mb-0 opacity-75">
                        Team: {rating.teamName} | Event: {rating.eventName}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="mb-2">
                      <span className="badge bg-light text-dark px-3 py-2">
                        <i className="fas fa-calendar me-1"></i>
                        Performance Review
                      </span>
                    </div>
                    <button 
                      className="btn btn-light me-2"
                      onClick={() => navigate('/volunteer/dashboard')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Dashboard
                    </button>
                    <button 
                      className="btn btn-outline-light"
                      onClick={() => navigate('/volunteer/ratings')}
                    >
                      <i className="fas fa-star me-2"></i>
                      All Ratings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Main Rating Details */}
          <div className="col-lg-8 mb-4">
            {/* Overall Rating Summary */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-chart-line me-2 text-primary"></i>
                  Overall Rating Summary
                </h5>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="text-center">
                      <h2 className={`display-4 fw-bold mb-2 ${getRatingColor(rating.overallRating)}`}>
                        {rating.overallRating?.toFixed(1) || calculateOverallRating()}
                      </h2>
                      <div className="mb-2">
                        {getRatingStars(rating.overallRating || calculateOverallRating(), 'large')}
                      </div>
                      <h5 className={`mb-0 ${getRatingColor(rating.overallRating || calculateOverallRating())}`}>
                        {getRatingText(rating.overallRating || calculateOverallRating())}
                      </h5>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="border-end">
                          <h6 className="text-primary mb-1">{rating.performanceRating}/5</h6>
                          <small className="text-muted">Performance</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="border-end">
                          <h6 className="text-success mb-1">{rating.punctualityRating}/5</h6>
                          <small className="text-muted">Punctuality</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <h6 className="text-info mb-1">{rating.communicationRating}/5</h6>
                        <small className="text-muted">Communication</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Ratings */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-clipboard-check me-2 text-success"></i>
                  Detailed Performance Ratings
                </h5>
              </div>
              <div className="card-body">
                {/* Performance Rating */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 text-primary">
                      <i className="fas fa-tasks me-2"></i>
                      Performance Rating
                    </h6>
                    <span className="badge bg-primary px-3 py-2">
                      {rating.performanceRating}/5
                    </span>
                  </div>
                  <div className="mb-2">
                    {getRatingStars(rating.performanceRating)}
                  </div>
                  <small className="text-muted">
                    Overall work quality and task completion effectiveness
                  </small>
                </div>

                <hr />

                {/* Punctuality Rating */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 text-success">
                      <i className="fas fa-clock me-2"></i>
                      Punctuality Rating
                    </h6>
                    <span className="badge bg-success px-3 py-2">
                      {rating.punctualityRating}/5
                    </span>
                  </div>
                  <div className="mb-2">
                    {getRatingStars(rating.punctualityRating)}
                  </div>
                  <small className="text-muted">
                    Timeliness, attendance, and reliability in meeting deadlines
                  </small>
                </div>

                <hr />

                {/* Communication Rating */}
                <div className="mb-0">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0 text-info">
                      <i className="fas fa-comments me-2"></i>
                      Communication Rating
                    </h6>
                    <span className="badge bg-info px-3 py-2">
                      {rating.communicationRating}/5
                    </span>
                  </div>
                  <div className="mb-2">
                    {getRatingStars(rating.communicationRating)}
                  </div>
                  <small className="text-muted">
                    Teamwork, collaboration, and communication skills
                  </small>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            {rating.feedback && (
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-comment-alt me-2 text-warning"></i>
                    Overall Feedback
                  </h5>
                </div>
                <div className="card-body">
                  <div className="bg-light p-4 rounded">
                    <i className="fas fa-quote-left text-muted me-2"></i>
                    <span className="fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                      {rating.feedback}
                    </span>
                    <i className="fas fa-quote-right text-muted ms-2"></i>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths and Improvements */}
            <div className="row">
              {rating.strengths && (
                <div className="col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                    <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                      <h6 className="mb-0 text-success">
                        <i className="fas fa-thumbs-up me-2"></i>
                        Strengths
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="bg-success bg-opacity-10 p-3 rounded">
                        <p className="mb-0 text-success" style={{ whiteSpace: 'pre-wrap' }}>
                          {rating.strengths}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {rating.areasForImprovement && (
                <div className="col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
                    <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                      <h6 className="mb-0 text-warning">
                        <i className="fas fa-chart-line me-2"></i>
                        Areas for Improvement
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="bg-warning bg-opacity-10 p-3 rounded">
                        <p className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                          {rating.areasForImprovement}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Rating Summary Card */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-info-circle me-2 text-primary"></i>
                  Rating Information
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Team Name</label>
                  <p className="mb-0 fw-bold">{rating.teamName}</p>
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Event Name</label>
                  <p className="mb-0">{rating.eventName}</p>
                </div>

                {rating.hoursWorked && (
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Hours Worked</label>
                    <p className="mb-0 fs-4 fw-bold text-primary">
                      <i className="fas fa-clock me-2"></i>
                      {rating.hoursWorked} hours
                    </p>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Rating ID</label>
                  <p className="mb-0 small text-muted">{rating.ratingId}</p>
                </div>

                <div className="mb-0">
                  <label className="form-label text-muted small fw-bold">Volunteer ID</label>
                  <p className="mb-0 small text-muted">{rating.volunteerId}</p>
                </div>
              </div>
            </div>

            {/* Rated By */}
            {ratedByUser && (
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-user-tie me-2 text-secondary"></i>
                    Rated By
                  </h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                      style={{ width: '50px', height: '50px' }}
                    >
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h6 className="mb-1">
                        {ratedByUser.firstName} {ratedByUser.lastName}
                      </h6>
                      <p className="mb-0 small text-muted">
                        <i className="fas fa-envelope me-1"></i>
                        {ratedByUser.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rating Scale Guide */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h6 className="mb-0 text-muted">
                  <i className="fas fa-info-circle me-2"></i>
                  Rating Scale Guide
                </h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-12 mb-2">
                    <div className="d-flex justify-content-between align-items-center small">
                      <span className="text-danger">1-2</span>
                      <span className="text-muted">Needs Improvement</span>
                    </div>
                  </div>
                  <div className="col-12 mb-2">
                    <div className="d-flex justify-content-between align-items-center small">
                      <span className="text-warning">3</span>
                      <span className="text-muted">Meets Expectations</span>
                    </div>
                  </div>
                  <div className="col-12 mb-0">
                    <div className="d-flex justify-content-between align-items-center small">
                      <span className="text-success">4-5</span>
                      <span className="text-muted">Exceeds Expectations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h6 className="mb-0 text-dark">
                  <i className="fas fa-tools me-2 text-secondary"></i>
                  Actions
                </h6>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.print()}
                  >
                    <i className="fas fa-print me-2"></i>
                    Print Rating
                  </button>
                  <button 
                    className="btn btn-outline-info"
                    onClick={() => {
                      const data = JSON.stringify(rating, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `rating-${rating.ratingId}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <i className="fas fa-download me-2"></i>
                    Export Data
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={fetchRatingDetails}
                    disabled={loading}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    Refresh
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

export default VolunteerRatingDetails;