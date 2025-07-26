import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { authService } from '../services/authService';

const AdminEventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [team, setTeam] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]); // Store user details for team members
  const [loading, setLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teamError, setTeamError] = useState(null);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchEventTeam();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await eventService.getEventDetailsAdmin(eventId);
      const eventData = response.data || response;
      
      setEvent(eventData);
      
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError(
        error.response?.data?.message || 
        'Failed to load event details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchEventTeam = async () => {
    try {
      setTeamLoading(true);
      setTeamError(null);

      const response = await eventService.getEventTeamAdmin(eventId);
      const teamData = response.data || response;
      
      if (teamData && (teamData.leader || teamData.members)) {
        setTeam(teamData);
        
        // Fetch user details for team members
        const allVolunteers = [];
        if (teamData.leader) {
          allVolunteers.push(teamData.leader);
        }
        if (teamData.members) {
          allVolunteers.push(...teamData.members);
        }

        // Fetch user details for each volunteer
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
      } else {
        setTeam(null);
      }
      
    } catch (error) {
      console.error('Error fetching event team:', error);
      if (error.response?.status === 404) {
        setTeam(null); // No team assigned yet
        setTeamError(null);
      } else {
        setTeamError(
          error.response?.data?.message || 
          'Failed to load team details.'
        );
      }
    } finally {
      setTeamLoading(false);
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

  // Handle rating team leader
  const handleRateTeamLeader = (leader) => {
    const leaderName = getUserFullNameByVolunteerId(leader.volunteerId);
    
    navigate('/volunteers/rate', {
      state: {
        volunteerId: leader.volunteerId,
        volunteerName: leaderName,
        eventId: event.eventId,
        eventTitle: event.title,
        teamId: team.teamId,
        teamName: team.name,
        leaderId: leader.volunteerId, // Leader rating themselves or admin rating leader
        isAdminRating: true // Flag to indicate this is an admin rating
      }
    });
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
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

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      return new Date(dateTimeString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'UPCOMING':
        return <span className="badge bg-primary px-3 py-2">Upcoming</span>;
      case 'ONGOING':
        return <span className="badge bg-success px-3 py-2">Ongoing</span>;
      case 'COMPLETED':
        return <span className="badge bg-info px-3 py-2">Completed</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">{status || 'Unknown'}</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'UPCOMING':
        return 'fas fa-clock';
      case 'ONGOING':
        return 'fas fa-play-circle';
      case 'COMPLETED':
        return 'fas fa-check-circle';
      default:
        return 'fas fa-calendar';
    }
  };

  const calculateTotalBudget = () => {
    if (!event?.requiredGoods || event.requiredGoods.length === 0) {
      return event?.budgetAmount || 0;
    }
    
    const goodsTotal = event.requiredGoods.reduce((sum, good) => {
      return sum + (parseFloat(good.totalPrice) || 0);
    }, 0);
    
    return goodsTotal;
  };

  const isEventUpcoming = () => {
    return event?.status?.toUpperCase() === 'UPCOMING';
  };

  const isEventOngoing = () => {
    return event?.status?.toUpperCase() === 'ONGOING';
  };

  const isEventCompleted = () => {
    return event?.status?.toUpperCase() === 'COMPLETED';
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
              <h4 className="text-muted">Loading Event Details...</h4>
              <p className="text-muted">Please wait while we fetch the event information</p>
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
              <h4>Error Loading Event</h4>
              <p>{error}</p>
              <div className="mt-4">
                <button className="btn btn-danger me-2" onClick={fetchEventDetails}>
                  <i className="fas fa-sync-alt me-2"></i>Try Again
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/admin/events')}>
                  <i className="fas fa-arrow-left me-2"></i>Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning text-center">
              <h4>Event Not Found</h4>
              <p>The requested event could not be found.</p>
              <button 
                className="btn btn-secondary mt-3"
                onClick={() => navigate('/admin/events')}
              >
                <i className="fas fa-arrow-left me-2"></i>Back to Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)',
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
                      onClick={() => navigate('/admin/events')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      All Events
                    </button>
                    <button 
                      className="btn btn-outline-light"
                      onClick={() => navigate('/admin-dashboard')}
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
          {/* Main Details */}
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
            {event.report && (
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
            )}

            {/* Event Team */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-users me-2 text-primary"></i>
                    Event Team
                  </h5>
                </div>
              </div>
              <div className="card-body">
                {teamLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary mb-3">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading team information...</p>
                  </div>
                ) : teamError ? (
                  <div className="alert alert-success text-center">
                    <h6 className="mb-4 text-dark">
                        No team assigned yet for this event.
                    </h6>
                  <button 
                      className="btn btn-outline-success btn-md btn-center"
                      onClick={() => navigate('/admin/create/team', { 
                        state: { 
                          selectedEventId: event.eventId,
                          selectedEventTitle: event.title,
                          selectedEventLocation: `${event.locationCity}, ${event.locationDistrict}`,
                          selectedEventDate: event.startDate
                        } 
                      })}
                    >
                      <i className="fas fa-plus me-1 text-center"></i>
                      Create Team
                    </button>
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
                                <div className="d-flex flex-column gap-2">
                                  <span className="badge bg-success">
                                    <i className="fas fa-crown me-1"></i>
                                    Leader
                                  </span>
                                  <button 
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleRateTeamLeader(team.leader)}
                                    title={`Rate ${getUserFullNameByVolunteerId(team.leader.volunteerId)}`}
                                  >
                                    <i className="fas fa-star me-1"></i>
                                    Rate Leader
                                  </button>
                                </div>
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
                                      <span className="badge bg-info">
                                        Member #{index + 1}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Team Actions */}
                    <div className="mt-4 pt-3 border-top">
                      <div className="d-flex flex-wrap gap-2">
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate(`/admin/events/${eventId}/team/edit`)}
                        >
                          <i className="fas fa-edit me-1"></i>
                          Edit Team
                        </button>
                        <button 
                          className="btn btn-outline-info btn-sm"
                          onClick={() => {
                            const teamData = JSON.stringify(team, null, 2);
                            const blob = new Blob([teamData], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `team-${team.teamId}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <i className="fas fa-download me-1"></i>
                          Export Team
                        </button>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={fetchEventTeam}
                        >
                          <i className="fas fa-sync-alt me-1"></i>
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <i className="fas fa-users-slash fa-4x mb-4 text-secondary"></i>
                    <h5 className="mb-3">No Team Assigned</h5>
                    <p className="mb-4">This event doesn't have a team assigned yet. Create a team to manage this event effectively.</p>
                    
                    <div className="row justify-content-center mb-4">
                      <div className="col-md-8">
                        <div className="card border-0 bg-light">
                          <div className="card-body p-3">
                            <h6 className="text-primary mb-2">
                              <i className="fas fa-calendar me-2"></i>
                              {event.title}
                            </h6>
                            <p className="small text-muted mb-2">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {event.locationCity}, {event.locationDistrict}
                            </p>
                            <p className="small text-muted mb-0">
                              <i className="fas fa-clock me-1"></i>
                              {new Date(event.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                      <button 
                        className="btn btn-primary btn-lg px-4"
                        onClick={() => navigate('/admin/create/team', { 
                          state: { 
                            selectedEventId: event.eventId,
                            selectedEventTitle: event.title,
                            selectedEventLocation: `${event.locationCity}, ${event.locationDistrict}`,
                            selectedEventDate: event.startDate
                          } 
                        })}
                      >
                        <i className="fas fa-plus me-2"></i>
                        Create Team for this Event
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/admin/events')}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Events
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-3 border-top">
                      <small className="text-muted">
                        <strong>Benefits of creating a team:</strong><br/>
                        • Assign specific volunteers to manage the event<br/>
                        • Designate a team leader for coordination<br/>
                        • Track team performance and responsibilities
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Rest of the component remains the same */}
          <div className="col-lg-4">
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

            {/* Event Actions */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-tools me-2 text-secondary"></i>
                  Event Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate(`/admin/events/${eventId}/edit`)}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Edit Event
                  </button>
                  {team ? (
                    <button 
                      className="btn btn-info"
                      onClick={() => navigate(`/admin/events/${eventId}/team`)}
                    >
                      <i className="fas fa-users me-2"></i>
                      Manage Team
                    </button>
                  ) : (
                    <button 
                      className="btn btn-success"
                      onClick={() => navigate('/admin/create/team', { 
                        state: { 
                          selectedEventId: event.eventId,
                          selectedEventTitle: event.title,
                          selectedEventLocation: `${event.locationCity}, ${event.locationDistrict}`,
                          selectedEventDate: event.startDate
                        } 
                      })}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Create Team
                    </button>
                  )}
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => window.print()}
                  >
                    <i className="fas fa-print me-2"></i>
                    Print Details
                  </button>
                  <button 
                    className="btn btn-outline-info"
                    onClick={() => {
                      const data = JSON.stringify(event, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `event-${event.eventId}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <i className="fas fa-download me-2"></i>
                    Export Data
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={fetchEventDetails}
                    disabled={loading}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>

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
                    <strong>Created:</strong> {formatDate(event.startDate)}
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

export default AdminEventDetailsPage;