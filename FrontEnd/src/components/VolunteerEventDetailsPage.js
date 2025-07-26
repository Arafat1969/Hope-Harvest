import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { volunteerService } from '../services/volunteerService';
import { authService } from '../services/authService';

const VolunteerEventDetailsPage = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get team info from navigation state
  const teamInfo = location.state || {};
  
  // State management
  const [event, setEvent] = useState(null);
  const [team, setTeam] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]); // Store user details for team members
  const [currentVolunteer, setCurrentVolunteer] = useState(null);
  const [isLeader, setIsLeader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportSubmitSuccess, setReportSubmitSuccess] = useState(false);
  
  // Report form state
  const [reportForm, setReportForm] = useState({
    report: ''
  });

  useEffect(() => {
    fetchEventDetails();
    fetchEventTeam();
    fetchVolunteerProfile();
  }, [eventId]);

  useEffect(() => {
    // Set leader status from navigation state or team data
    if (teamInfo.isLeader !== undefined) {
      setIsLeader(teamInfo.isLeader);
    } else if (team && currentVolunteer) {
      const leaderVolunteerId = team.leader?.volunteerId;
      setIsLeader(leaderVolunteerId === currentVolunteer.volunteerId);
    }
  }, [team, currentVolunteer, teamInfo]);

  const fetchEventDetails = async () => {
    try {
      setEventLoading(true);
      const response = await eventService.getEventDetails(eventId);
      const eventData = response.data || response;
      setEvent(eventData);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Failed to load event details');
    } finally {
      setEventLoading(false);
    }
  };

  const fetchEventTeam = async () => {
    try {
      setTeamLoading(true);
      const response = await eventService.getEventTeam(eventId);
      const teamData = response.data || response;
      setTeam(teamData);

      // Fetch user details for team members if team exists
      if (teamData && (teamData.leader || teamData.members)) {
        const allVolunteers = [];
        if (teamData.leader) {
          allVolunteers.push(teamData.leader);
        }
        if (teamData.members) {
          allVolunteers.push(...teamData.members);
        }

        // Fetch user details for each volunteer using externalUserId
        const userPromises = allVolunteers.map(volunteer => 
          authService.getUserById(volunteer.externalUserId)
        );

        const userResponses = await Promise.allSettled(userPromises);
        const usersData = [];

        userResponses.forEach((response, index) => {
          if (response.status === 'fulfilled') {
            const userData = response.value?.data || response.value;
            usersData.push({
              ...userData,
              volunteerId: allVolunteers[index].volunteerId,
              volunteer: allVolunteers[index]
            });
          }
        });

        setTeamUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching team details:', error);
      // Don't set error here as team might not exist
    } finally {
      setTeamLoading(false);
    }
  };

  const fetchVolunteerProfile = async () => {
    try {
      const userResponse = await authService.getProfile();
      if (userResponse.status === 'success') {
        const userId = userResponse.data.userId || userResponse.data.id || userResponse.data.user_id;
        
        if (userId) {
          const volunteerResponse = await volunteerService.getVolunteerProfile(userId);
          const volunteerData = volunteerResponse.data || volunteerResponse;
          setCurrentVolunteer(volunteerData);
        }
      }
    } catch (error) {
      console.error('Error fetching volunteer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get user full name by volunteerId
  const getUserFullNameByVolunteerId = (volunteerId) => {
    const user = teamUsers.find(u => u.volunteerId === volunteerId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  // Helper function to get user details by volunteerId
  const getUserByVolunteerId = (volunteerId) => {
    return teamUsers.find(u => u.volunteerId === volunteerId);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportForm.report.trim()) {
      setError('Please provide a report before submitting.');
      return;
    }

    try {
      setReportLoading(true);
      setError(null);
      
      const reportData = {
        report: reportForm.report.trim()
      };

      await eventService.submitEventReport(eventId, reportData);
      
      setReportSubmitSuccess(true);
      
      // Refresh event details to show the submitted report
      setTimeout(() => {
        fetchEventDetails();
        setReportSubmitSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to submit report. Please try again.'
      );
    } finally {
      setReportLoading(false);
    }
  };

  const handleReportChange = (e) => {
    setReportForm({
      report: e.target.value
    });
  };

  const handleRateVolunteer = (member) => {
    const memberName = getUserFullNameByVolunteerId(member.volunteerId);
    
    navigate('/volunteers/rate', {
      state: {
        volunteerId: member.volunteerId,
        volunteerName: memberName,
        eventId: event.eventId,
        eventTitle: event.title,
        teamId: team.teamId,
        teamName: team.name,
        leaderId: team.leader?.volunteerId || currentVolunteer?.volunteerId
      }
    });
  };

  // Utility functions
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
        month: 'long',
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
        month: 'long',
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
      case 'CANCELLED':
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-info">{status || 'Unknown'}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'fas fa-play-circle';
      case 'COMPLETED':
        return 'fas fa-check-circle';
      case 'PENDING':
        return 'fas fa-clock';
      case 'CANCELLED':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  const calculateTotalBudget = () => {
    if (!event?.requiredGoods || event.requiredGoods.length === 0) return 0;
    return event.requiredGoods.reduce((total, good) => total + (good.totalPrice || 0), 0);
  };

  const isEventUpcoming = () => {
    if (!event?.startDate) return false;
    return new Date(event.startDate) > new Date();
  };

  const isEventOngoing = () => {
    if (!event?.startDate || !event?.endDate) return false;
    const now = new Date();
    return new Date(event.startDate) <= now && new Date(event.endDate) >= now;
  };

  const isEventCompleted = () => {
    if (!event?.endDate) return false;
    return new Date(event.endDate) < new Date();
  };

  if (loading || eventLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted">Loading Event Details...</h4>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger text-center">
              <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
              <h4>Error Loading Event</h4>
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/volunteer/dashboard')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Event Not Found</h4>
          <p>The requested event could not be found.</p>
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
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
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
                      <i className={getStatusIcon(event.status)}></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-1">{event.title}</h1>
                      <p className="mb-1 opacity-90">Event ID: {event.eventId}</p>
                      <p className="mb-0 opacity-75">
                        {event.locationCity}, {event.locationDistrict}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="mb-2">
                      {getStatusBadge(event.status)}
                      {isLeader && (
                        <span className="badge bg-warning text-dark ms-2 px-3 py-2">
                          <i className="fas fa-crown me-1"></i>Team Leader
                        </span>
                      )}
                      {isEventUpcoming() && (
                        <span className="badge bg-light text-dark ms-2 px-3 py-2">
                          <i className="fas fa-calendar me-1"></i>Scheduled
                        </span>
                      )}
                      {isEventOngoing() && (
                        <span className="badge bg-warning text-dark ms-2 px-3 py-2">
                          <i className="fas fa-play me-1"></i>Live Now
                        </span>
                      )}
                      {isEventCompleted() && (
                        <span className="badge bg-success ms-2 px-3 py-2">
                          <i className="fas fa-check me-1"></i>Finished
                        </span>
                      )}
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
                      onClick={() => navigate('/volunteer/teams')}
                    >
                      <i className="fas fa-users me-2"></i>
                      My Teams
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {reportSubmitSuccess && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-success alert-dismissible fade show">
                <i className="fas fa-check-circle me-2"></i>
                <strong>Report Submitted Successfully!</strong> Your event report has been submitted and saved.
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setReportSubmitSuccess(false)}
                ></button>
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

        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8 mb-4">
            {/* Event Information */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-info-circle me-2 text-primary"></i>
                  Event Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Title</label>
                    <p className="mb-0 fs-6">{event.title}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Status</label>
                    <div>{getStatusBadge(event.status)}</div>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label text-muted small fw-bold">Description</label>
                    <p className="mb-0 fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                      {event.description || 'No description provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Details */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-calendar me-2 text-success"></i>
                  Schedule Details
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Start Date & Time</label>
                    <p className="mb-0 fs-6 fw-bold text-success">
                      <i className="fas fa-play me-1"></i>
                      {formatDateTime(event.startDate)}
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">End Date & Time</label>
                    <p className="mb-0 fs-6 fw-bold text-danger">
                      <i className="fas fa-stop me-1"></i>
                      {formatDateTime(event.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-map-marker-alt me-2 text-info"></i>
                  Location Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">Address</label>
                    <p className="mb-0 fs-6">{event.locationAddress || 'N/A'}</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">City</label>
                    <p className="mb-0 fs-6">{event.locationCity || 'N/A'}</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">District</label>
                    <p className="mb-0 fs-6">{event.locationDistrict || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Goods */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-boxes me-2 text-warning"></i>
                  Required Goods ({event.requiredGoods?.length || 0} items)
                </h5>
              </div>
              <div className="card-body">
                {event.requiredGoods && event.requiredGoods.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                          <th>Unit Price</th>
                          <th>Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.requiredGoods.map((good, index) => (
                          <tr key={index}>
                            <td className="fw-bold">{good.item}</td>
                            <td>
                              <span className="badge bg-primary">
                                {good.quantity}
                              </span>
                            </td>
                            <td className="text-muted">{good.unit}</td>
                            <td className="text-success">
                              {formatCurrency(good.unitPrice)}
                            </td>
                            <td className="text-success fw-bold">
                              {formatCurrency(good.totalPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="table-light">
                        <tr>
                          <th colSpan="4" className="text-end">Total Budget:</th>
                          <th className="text-success">
                            {formatCurrency(calculateTotalBudget())}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="fas fa-box-open fa-2x mb-3"></i>
                    <p>No required goods specified for this event.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Event Report */}
            {event.report ? (
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-file-alt me-2 text-secondary"></i>
                    Event Report
                  </h5>
                </div>
                <div className="card-body">
                  <div className="bg-light p-3 rounded">
                    <p className="mb-0 fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                      {event.report}
                    </p>
                  </div>
                </div>
              </div>
            ) : isLeader && (
              /* Report Submission Form for Leaders */
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                  <h5 className="mb-0 text-warning">
                    <i className="fas fa-edit me-2"></i>
                    Submit Event Report
                  </h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Team Leader Responsibility:</strong> As the team leader, you need to submit a report about this event.
                  </div>
                  
                  <form onSubmit={handleReportSubmit}>
                    <div className="mb-3">
                      <label htmlFor="report" className="form-label fw-bold">
                        Event Report *
                      </label>
                      <textarea
                        id="report"
                        name="report"
                        className="form-control"
                        rows="8"
                        value={reportForm.report}
                        onChange={handleReportChange}
                        placeholder="Please provide a detailed report about the event execution, challenges faced, outcomes achieved, and any recommendations for future events..."
                        required
                        maxLength={2000}
                      />
                      <div className="form-text">
                        Provide a comprehensive report about the event execution. 
                        ({reportForm.report.length}/2000 characters)
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                      <button 
                        type="submit"
                        className="btn btn-success"
                        disabled={reportLoading || !reportForm.report.trim()}
                      >
                        {reportLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Submit Report
                          </>
                        )}
                      </button>
                      <button 
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setReportForm({ report: '' })}
                        disabled={reportLoading}
                      >
                        <i className="fas fa-times me-2"></i>
                        Clear
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Team Information */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-users me-2 text-primary"></i>
                  Team Information
                </h5>
              </div>
              <div className="card-body">
                {teamLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary mb-3">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading team information...</p>
                  </div>
                ) : team ? (
                  <div>
                    {/* Team Header */}
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <h6 className="text-primary mb-1">
                          <i className="fas fa-flag me-2"></i>
                          {team.name}
                        </h6>
                        <p className="text-muted small mb-0">Team ID: {team.teamId}</p>
                      </div>
                      <div className="col-md-6 text-end">
                        <span className="badge bg-info px-3 py-2">
                          <i className="fas fa-users me-1"></i>
                          {(team.leader ? 1 : 0) + (team.members ? team.members.length : 0)} Members
                        </span>
                      </div>
                    </div>

                    {/* Team Leader */}
                    {team.leader && (
                      <div className="mb-4">
                        <h6 className="text-success mb-3">
                          <i className="fas fa-crown me-2"></i>
                          Team Leader
                        </h6>
                        <div className="card border-success">
                          <div className="card-body p-3">
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3"
                                style={{ width: '50px', height: '50px' }}
                              >
                                <i className="fas fa-user-tie"></i>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1 text-success">
                                  {getUserFullNameByVolunteerId(team.leader.volunteerId)}
                                  {isLeader && (
                                    <span className="badge bg-warning text-dark ms-2">You</span>
                                  )}
                                </h6>
                                <p className="mb-1 small text-muted">
                                  <i className="fas fa-envelope me-1"></i>
                                  {team.leader.email}
                                </p>
                                <p className="mb-0 small text-muted">
                                  <i className="fas fa-phone me-1"></i>
                                  {team.leader.phoneNumber || 'Not provided'}
                                </p>
                              </div>
                              <div className="text-end">
                                <span className="badge bg-success">
                                  <i className="fas fa-crown me-1"></i>
                                  Leader
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Team Members */}
                    {team.members && team.members.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-info mb-3">
                          <i className="fas fa-users me-2"></i>
                          Team Members ({team.members.length})
                        </h6>
                        <div className="row">
                          {team.members.map((member, index) => (
                            <div key={member.volunteerId} className="col-md-6 mb-3">
                              <div className="card border-info">
                                <div className="card-body p-3">
                                  <div className="d-flex align-items-center">
                                    <div 
                                      className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center me-3"
                                      style={{ width: '40px', height: '40px' }}
                                    >
                                      <i className="fas fa-user"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                      <h6 className="mb-1 text-info">
                                        {getUserFullNameByVolunteerId(member.volunteerId)}
                                        {!isLeader && currentVolunteer && member.volunteerId === currentVolunteer.volunteerId && (
                                          <span className="badge bg-warning text-dark ms-2">You</span>
                                        )}
                                      </h6>
                                      <p className="mb-1 small text-muted">
                                        <i className="fas fa-envelope me-1"></i>
                                        {member.email}
                                      </p>
                                      <p className="mb-0 small text-muted">
                                        <i className="fas fa-phone me-1"></i>
                                        {member.phoneNumber || 'Not provided'}
                                      </p>
                                    </div>
                                    <div className="text-end">
                                      <div className="d-flex flex-column gap-2">
                                        <span className="badge bg-info">
                                          Member #{index + 1}
                                        </span>
                                        {isLeader && (
                                          <button 
                                            className="btn btn-sm btn-warning"
                                            onClick={() => handleRateVolunteer(member)}
                                            title={`Rate ${getUserFullNameByVolunteerId(member.volunteerId)}`}
                                          >
                                            <i className="fas fa-star me-1"></i>
                                            Rate
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="fas fa-users-slash fa-4x mb-4 text-secondary"></i>
                    <h5 className="mb-3">No Team Information Available</h5>
                    <p className="mb-0">Team details could not be loaded for this event.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* My Role Summary */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-warning">
                  <i className="fas fa-user-check me-2"></i>
                  My Role
                </h5>
              </div>
              <div className="card-body">
                <div className="text-center">
                  {isLeader ? (
                    <div>
                      <i className="fas fa-crown fa-3x text-warning mb-3"></i>
                      <h6 className="text-warning">Team Leader</h6>
                      <p className="small text-muted mb-3">
                        You are responsible for leading this team and managing the event execution.
                      </p>
                      <div className="d-grid gap-2">
                        {!event.report && (
                          <span className="badge bg-warning text-dark p-2">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            Report Pending
                          </span>
                        )}
                        {event.report && (
                          <span className="badge bg-success p-2">
                            <i className="fas fa-check me-1"></i>
                            Report Submitted
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-user-friends fa-3x text-info mb-3"></i>
                      <h6 className="text-info">Team Member</h6>
                      <p className="small text-muted mb-3">
                        You are a valued member of this team working towards the event's success.
                      </p>
                      <span className="badge bg-info p-2">
                        <i className="fas fa-users me-1"></i>
                        Active Member
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-success">
                  <i className="fas fa-dollar-sign me-2"></i>
                  Budget Summary
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Allocated Budget</label>
                  <p className="mb-0 fs-4 fw-bold text-success">
                    {formatCurrency(event.budgetAmount)}
                  </p>
                </div>
                
                {event.requiredGoods && event.requiredGoods.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Required Goods Total</label>
                    <p className="mb-0 fs-5 fw-bold text-info">
                      {formatCurrency(calculateTotalBudget())}
                    </p>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Budget Status</label>
                  <div>
                    {calculateTotalBudget() <= event.budgetAmount ? (
                      <span className="badge bg-success px-3 py-2">
                        <i className="fas fa-check me-1"></i>
                        Within Budget
                      </span>
                    ) : (
                      <span className="badge bg-danger px-3 py-2">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Over Budget
                      </span>
                    )}
                  </div>
                </div>

                {event.requiredGoods && event.requiredGoods.length > 0 && (
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      <strong>Items Required:</strong> {event.requiredGoods.length}
                    </small>
                  </div>
                )}
              </div>
            </div>

            {/* Team Summary */}
            {team && (
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                  <h5 className="mb-0 text-primary">
                    <i className="fas fa-users me-2"></i>
                    Team Summary
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Team Name</label>
                    <p className="mb-0 fw-bold">{team.name}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Team Leader</label>
                    <p className="mb-0">
                      {team.leader ? (
                        <span className="badge bg-success px-2 py-1">
                          {getUserFullNameByVolunteerId(team.leader.volunteerId)}
                        </span>
                      ) : (
                        <span className="text-muted">Not assigned</span>
                      )}
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Total Members</label>
                    <p className="mb-0 fs-4 fw-bold text-primary">
                      {(team.leader ? 1 : 0) + (team.members ? team.members.length : 0)}
                    </p>
                  </div>

                  <div className="row text-center">
                    <div className="col-6">
                      <div className="border-end">
                        <h6 className="text-success mb-1">{team.leader ? 1 : 0}</h6>
                        <small className="text-muted">Leader</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h6 className="text-info mb-1">{team.members ? team.members.length : 0}</h6>
                      <small className="text-muted">Members</small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-chart-bar me-2 text-warning"></i>
                  Quick Stats
                </h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6 mb-3">
                    <div className="border-end">
                      <h6 className="text-primary mb-1">{event.requiredGoods?.length || 0}</h6>
                      <small className="text-muted">Required Items</small>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <h6 className="text-success mb-1">
                      {formatCurrency(event.budgetAmount)}
                    </h6>
                    <small className="text-muted">Budget</small>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-top">
                  <small className="text-muted d-block mb-1">
                    <strong>Start:</strong> {formatDate(event.startDate)}
                  </small>
                  <small className="text-muted d-block">
                    <strong>Duration:</strong> {
                      event.startDate && event.endDate 
                        ? Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24))
                        : 'N/A'
                    } day(s)
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerEventDetailsPage;