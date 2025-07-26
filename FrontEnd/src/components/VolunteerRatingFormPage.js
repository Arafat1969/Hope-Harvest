import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';

const VolunteerRatingFormPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from navigation state
  const {
    volunteerId,
    volunteerName,
    eventId,
    eventTitle,
    teamId,
    teamName,
    leaderId
  } = location.state || {};

  // Form state
  const [ratingForm, setRatingForm] = useState({
    volunteerId: volunteerId || '',
    performanceRating: 0,
    punctualityRating: 0,
    communicationRating: 0,
    feedback: '',
    strengths: '',
    areasForImprovement: '',
    hoursWorked: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [ratingResponse, setRatingResponse] = useState(null);

  useEffect(() => {
    // Redirect if no required data
    if (!volunteerId || !eventId || !volunteerName) {
      navigate('/volunteer/dashboard');
    }
  }, [volunteerId, eventId, volunteerName, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRatingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (ratingType, value) => {
    setRatingForm(prev => ({
      ...prev,
      [ratingType]: parseInt(value)
    }));
  };

  const validateForm = () => {
    if (ratingForm.performanceRating === 0) {
      setError('Performance rating is required (1-5)');
      return false;
    }
    if (ratingForm.punctualityRating === 0) {
      setError('Punctuality rating is required (1-5)');
      return false;
    }
    if (ratingForm.communicationRating === 0) {
      setError('Communication rating is required (1-5)');
      return false;
    }
    if (!ratingForm.feedback.trim()) {
      setError('Feedback is required');
      return false;
    }
    if (ratingForm.hoursWorked && (isNaN(ratingForm.hoursWorked) || ratingForm.hoursWorked < 0)) {
      setError('Hours worked must be a valid positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const ratingsData = {
        volunteerId: ratingForm.volunteerId,
        performanceRating: ratingForm.performanceRating,
        punctualityRating: ratingForm.punctualityRating,
        communicationRating: ratingForm.communicationRating,
        feedback: ratingForm.feedback.trim(),
        strengths: ratingForm.strengths.trim() || null,
        areasForImprovement: ratingForm.areasForImprovement.trim() || null,
        hoursWorked: ratingForm.hoursWorked ? parseInt(ratingForm.hoursWorked) : null
      };

      const response = await eventService.submitMemberRatings(eventId, ratingsData);
      
      setRatingResponse(response);
      setSuccess(true);
      
      // Show success alert and redirect after 3 seconds
      setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 3000);

    } catch (error) {
      console.error('Error submitting rating:', error);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to submit rating. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (ratingType, currentRating) => {
    return [...Array(5)].map((_, index) => {
      const ratingValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          className={`btn btn-sm me-1 ${
            ratingValue <= currentRating 
              ? 'btn-warning' 
              : 'btn-outline-secondary'
          }`}
          onClick={() => handleRatingChange(ratingType, ratingValue)}
          style={{ minWidth: '40px' }}
        >
          <i className="fas fa-star"></i>
        </button>
      );
    });
  };

  const getRatingText = (rating) => {
    switch(rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Not rated';
    }
  };

  if (!volunteerId || !eventId) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Invalid Access</h4>
          <p>Rating information is missing. Please try again.</p>
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
        {/* Success Alert */}
        {success && ratingResponse && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-success alert-dismissible fade show">
                <i className="fas fa-check-circle me-2"></i>
                <strong>Rating Submitted Successfully!</strong>
                <br />
                <small>
                  Rating ID: {ratingResponse.ratingId} | 
                  Volunteer: {ratingResponse.ratedVolunteerId}
                </small>
                <br />
                <small className="text-muted">Redirecting back to event details...</small>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-danger alert-dismissible fade show">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError(null)}
                ></button>
              </div>
            </div>
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div 
                className="card-body text-white"
                style={{
                  background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)',
                  borderRadius: '12px'
                }}
              >
                <div className="d-flex align-items-center">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-4"
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      fontSize: '1.5rem'
                    }}
                  >
                    <i className="fas fa-star"></i>
                  </div>
                  <div>
                    <h1 className="h3 mb-1">Rate Team Member</h1>
                    <p className="mb-1 opacity-90">
                      <i className="fas fa-user me-2"></i>
                      {volunteerName}
                    </p>
                    <p className="mb-0 opacity-75">
                      <i className="fas fa-calendar me-2"></i>
                      {eventTitle}
                    </p>
                  </div>
                </div>
                <div className="text-end mt-3">
                  <button 
                    className="btn btn-light me-2"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Event
                  </button>
                </div>
              </div>
            </div>

            {/* Rating Form */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-clipboard-check me-2 text-warning"></i>
                  Performance Evaluation
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  {/* Context Information */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Team</label>
                      <p className="mb-0">{teamName}</p>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Event</label>
                      <p className="mb-0">{eventTitle}</p>
                    </div>
                  </div>

                  <hr className="my-4" />

                  {/* Performance Rating */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Performance Rating *
                      <span className="text-muted ms-2">({getRatingText(ratingForm.performanceRating)})</span>
                    </label>
                    <div className="d-flex align-items-center mb-2">
                      {getRatingStars('performanceRating', ratingForm.performanceRating)}
                      <span className="ms-3 text-muted small">
                        {ratingForm.performanceRating}/5
                      </span>
                    </div>
                    <small className="form-text text-muted">
                      Rate the overall performance and quality of work
                    </small>
                  </div>

                  {/* Punctuality Rating */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Punctuality Rating *
                      <span className="text-muted ms-2">({getRatingText(ratingForm.punctualityRating)})</span>
                    </label>
                    <div className="d-flex align-items-center mb-2">
                      {getRatingStars('punctualityRating', ratingForm.punctualityRating)}
                      <span className="ms-3 text-muted small">
                        {ratingForm.punctualityRating}/5
                      </span>
                    </div>
                    <small className="form-text text-muted">
                      Rate attendance and timeliness
                    </small>
                  </div>

                  {/* Communication Rating */}
                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Communication Rating *
                      <span className="text-muted ms-2">({getRatingText(ratingForm.communicationRating)})</span>
                    </label>
                    <div className="d-flex align-items-center mb-2">
                      {getRatingStars('communicationRating', ratingForm.communicationRating)}
                      <span className="ms-3 text-muted small">
                        {ratingForm.communicationRating}/5
                      </span>
                    </div>
                    <small className="form-text text-muted">
                      Rate teamwork and communication skills
                    </small>
                  </div>

                  <hr className="my-4" />

                  {/* Hours Worked */}
                  <div className="mb-4">
                    <label htmlFor="hoursWorked" className="form-label fw-bold">
                      Hours Worked
                    </label>
                    <input
                      type="number"
                      id="hoursWorked"
                      name="hoursWorked"
                      className="form-control"
                      value={ratingForm.hoursWorked}
                      onChange={handleInputChange}
                      placeholder="Enter total hours worked"
                      min="0"
                      step="0.5"
                    />
                    <small className="form-text text-muted">
                      Total hours contributed to the event (optional)
                    </small>
                  </div>

                  {/* Feedback */}
                  <div className="mb-4">
                    <label htmlFor="feedback" className="form-label fw-bold">
                      Overall Feedback *
                    </label>
                    <textarea
                      id="feedback"
                      name="feedback"
                      className="form-control"
                      rows="4"
                      value={ratingForm.feedback}
                      onChange={handleInputChange}
                      placeholder="Provide overall feedback about the volunteer's performance..."
                      required
                      maxLength={1000}
                    />
                    <div className="form-text">
                      General comments about performance ({ratingForm.feedback.length}/1000 characters)
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="mb-4">
                    <label htmlFor="strengths" className="form-label fw-bold">
                      Strengths
                    </label>
                    <textarea
                      id="strengths"
                      name="strengths"
                      className="form-control"
                      rows="3"
                      value={ratingForm.strengths}
                      onChange={handleInputChange}
                      placeholder="What did this volunteer do particularly well?"
                      maxLength={500}
                    />
                    <div className="form-text">
                      Highlight positive aspects ({ratingForm.strengths.length}/500 characters)
                    </div>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="mb-4">
                    <label htmlFor="areasForImprovement" className="form-label fw-bold">
                      Areas for Improvement
                    </label>
                    <textarea
                      id="areasForImprovement"
                      name="areasForImprovement"
                      className="form-control"
                      rows="3"
                      value={ratingForm.areasForImprovement}
                      onChange={handleInputChange}
                      placeholder="Constructive suggestions for improvement..."
                      maxLength={500}
                    />
                    <div className="form-text">
                      Constructive feedback for growth ({ratingForm.areasForImprovement.length}/500 characters)
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="d-flex gap-3 pt-3">
                    <button 
                      type="submit"
                      className="btn btn-warning flex-fill"
                      disabled={loading || success}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Submitting Rating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-star me-2"></i>
                          Submit Rating
                        </>
                      )}
                    </button>
                    <button 
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate(-1)}
                      disabled={loading}
                    >
                      <i className="fas fa-times me-2"></i>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Rating Guide */}
            <div className="card border-0 shadow-sm mt-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-light border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h6 className="mb-0 text-muted">
                  <i className="fas fa-info-circle me-2"></i>
                  Rating Guide
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <strong className="text-danger">1-2 Stars:</strong>
                    <span className="text-muted"> Needs improvement</span>
                  </div>
                  <div className="col-md-4 mb-2">
                    <strong className="text-warning">3 Stars:</strong>
                    <span className="text-muted"> Meets expectations</span>
                  </div>
                  <div className="col-md-4 mb-2">
                    <strong className="text-success">4-5 Stars:</strong>
                    <span className="text-muted"> Exceeds expectations</span>
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

export default VolunteerRatingFormPage;