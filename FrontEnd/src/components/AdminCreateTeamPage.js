import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { volunteerService } from '../services/volunteerService';
import { authService } from '../services/authService';

const AdminCreateTeamPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get pre-selected event from navigation state
  const preSelectedEvent = location.state || {};

  // Form state - using volunteerId for backend
  const [formData, setFormData] = useState({
    eventId: preSelectedEvent.selectedEventId || '', // Pre-select event if passed
    name: '',
    description: '',
    leaderId: '', // This will be volunteerId
    memberList: [] // This will be array of volunteerIds
  });

  // Data lists
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [users, setUsers] = useState([]); // Store user details
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [volunteersLoading, setVolunteersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchInitialData();
    
    // If event is pre-selected, generate a default team name
    if (preSelectedEvent.selectedEventId && preSelectedEvent.selectedEventTitle) {
      setFormData(prev => ({
        ...prev,
        eventId: preSelectedEvent.selectedEventId.toString(),
        name: `${preSelectedEvent.selectedEventTitle} Team`,
        description: `Team formed for ${preSelectedEvent.selectedEventTitle} event in ${preSelectedEvent.selectedEventLocation || 'the designated location'}.`
      }));
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      setEventsLoading(true);
      setVolunteersLoading(true);

      // Fetch events first
      const eventsResponse = await eventService.getAllEventsAdmin();
      const eventsData = eventsResponse?.data || eventsResponse || [];
      setEvents(eventsData);
      setEventsLoading(false);

      // Fetch volunteers
      const volunteersResponse = await volunteerService.getAllVolunteersAdmin();
      const volunteersData = volunteersResponse?.data || volunteersResponse || [];

      // Fetch user details for each volunteer
      const userPromises = volunteersData.map(volunteer => 
        authService.getUserById(volunteer.externalUserId)
      );

      const userResponses = await Promise.allSettled(userPromises);
      const usersData = [];

      userResponses.forEach((response, index) => {
        if (response.status === 'fulfilled') {
          const userData = response.value?.data || response.value;
          usersData.push({
            ...userData,
            volunteerId: volunteersData[index].volunteerId,
            volunteer: volunteersData[index]
          });
        }
      });

      setUsers(usersData);
      setVolunteers(volunteersData);
      setVolunteersLoading(false);

    } catch (error) {
      console.error('Error fetching initial data:', error);
      setError('Failed to load required data. Please refresh the page.');
      setEventsLoading(false);
      setVolunteersLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLeaderChange = (e) => {
    const leaderId = e.target.value; // This is volunteerId
    setFormData(prev => ({
      ...prev,
      leaderId: leaderId,
      // Remove leader from member list if they were selected as a member
      memberList: prev.memberList.filter(memberId => memberId !== leaderId)
    }));
  };

  const handleMemberToggle = (volunteerId) => {
    setFormData(prev => {
      const isAlreadyMember = prev.memberList.includes(volunteerId);
      const isLeader = prev.leaderId === volunteerId;

      // Don't allow leader to be added as member
      if (isLeader) {
        return prev;
      }

      return {
        ...prev,
        memberList: isAlreadyMember
          ? prev.memberList.filter(id => id !== volunteerId)
          : [...prev.memberList, volunteerId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.eventId) {
      setError('Please select an event.');
      return;
    }
    if (!formData.name.trim()) {
      setError('Please provide a team name.');
      return;
    }
    if (!formData.leaderId) {
      setError('Please select a team leader.');
      return;
    }
    if (formData.memberList.length === 0) {
      setError('Please select at least one team member.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare team data - all IDs are volunteerIds
      const teamData = {
        eventId: parseInt(formData.eventId),
        name: formData.name.trim(),
        description: formData.description.trim(),
        leaderId: formData.leaderId, // volunteerId
        memberList: formData.memberList // array of volunteerIds
      };

      console.log('Submitting team data:', teamData);

      // Submit team formation request
      const response = await eventService.formTeamForEvent(formData.eventId, teamData);
      
      console.log('Team creation response:', response);
      
      setSuccess(true);
      
      // Redirect after short delay
      setTimeout(() => {
        if (preSelectedEvent.selectedEventId) {
          navigate(`/admin/events/${preSelectedEvent.selectedEventId}`);
        } else {
          navigate('/admin/events');
        }
      }, 2000);

    } catch (error) {
      console.error('Error creating team:', error);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to create team. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get user full name by volunteerId
  const getUserFullNameByVolunteerId = (volunteerId) => {
    const user = users.find(u => u.volunteerId === volunteerId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  };

  // Helper function to get user email by volunteerId
  const getUserEmailByVolunteerId = (volunteerId) => {
    const user = users.find(u => u.volunteerId === volunteerId);
    return user ? user.email : 'Unknown Email';
  };

  const getEventTitle = (eventId) => {
    const event = events.find(e => e.eventId === parseInt(eventId));
    return event ? event.title : 'Unknown Event';
  };

  const getAvailableVolunteers = () => {
    return volunteers.filter(volunteer => volunteer.volunteerId !== formData.leaderId);
  };

  if (eventsLoading || volunteersLoading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="text-muted">Loading Form Data...</h4>
              <p className="text-muted">Please wait while we fetch events and volunteers</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-success text-center">
              <i className="fas fa-check-circle fa-3x mb-3 text-success"></i>
              <h2>Team Created Successfully!</h2>
              <p className="lead">The team "{formData.name}" has been formed for the selected event.</p>
              <p className="text-muted">
                {preSelectedEvent.selectedEventId 
                  ? 'Redirecting to event details...' 
                  : 'Redirecting to events page...'
                }
              </p>
            </div>
          </div>
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
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px'
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
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
                      <i className="fas fa-users"></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-1">Create Event Team</h1>
                      <p className="mb-0 opacity-90">
                        {preSelectedEvent.selectedEventTitle 
                          ? `Form a team for: ${preSelectedEvent.selectedEventTitle}`
                          : 'Form a team for event execution'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    {preSelectedEvent.selectedEventId && (
                      <button 
                        className="btn btn-outline-light"
                        onClick={() => navigate(`/admin/events/${preSelectedEvent.selectedEventId}`)}
                      >
                        <i className="fas fa-arrow-left me-2"></i>
                        Back to Event
                      </button>
                    )}
                    <button 
                      className="btn btn-light"
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

        {/* Pre-selected Event Alert */}
        {preSelectedEvent.selectedEventId && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-info alert-dismissible fade show">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Event Pre-selected:</strong> You are creating a team for 
                <strong> {preSelectedEvent.selectedEventTitle}</strong> 
                {preSelectedEvent.selectedEventLocation && (
                  <span> in {preSelectedEvent.selectedEventLocation}</span>
                )}
                {preSelectedEvent.selectedEventDate && (
                  <span> scheduled for {new Date(preSelectedEvent.selectedEventDate).toLocaleDateString()}</span>
                )}.
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, eventId: '', name: '', description: '' }));
                  }}
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
          <div className="col-lg-8">
            {/* Team Formation Form */}
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-info-circle me-2 text-primary"></i>
                    Basic Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label htmlFor="eventId" className="form-label fw-bold">Select Event *</label>
                      <select 
                        id="eventId"
                        name="eventId"
                        className={`form-select ${preSelectedEvent.selectedEventId ? 'bg-light' : ''}`}
                        value={formData.eventId}
                        onChange={handleInputChange}
                        required
                        disabled={!!preSelectedEvent.selectedEventId} // Disable if pre-selected
                      >
                        <option value="">Choose an event...</option>
                        {events.map(event => (
                          <option key={event.eventId} value={event.eventId}>
                            {event.title} - {event.locationCity} ({event.status})
                          </option>
                        ))}
                      </select>
                      <div className="form-text">
                        {preSelectedEvent.selectedEventId 
                          ? 'Event pre-selected from event details page'
                          : 'Select the event for which you want to form a team'
                        }
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label fw-bold">Team Name *</label>
                      <input 
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter team name"
                        required
                        maxLength={100}
                      />
                      <div className="form-text">
                        {preSelectedEvent.selectedEventTitle 
                          ? 'Default name generated based on selected event'
                          : 'Provide a descriptive name for the team'
                        }
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="leaderId" className="form-label fw-bold">Team Leader *</label>
                      <select 
                        id="leaderId"
                        name="leaderId"
                        className="form-select"
                        value={formData.leaderId}
                        onChange={handleLeaderChange}
                        required
                      >
                        <option value="">Select team leader...</option>
                        {volunteers.map(volunteer => (
                          <option key={volunteer.volunteerId} value={volunteer.volunteerId}>
                            {getUserFullNameByVolunteerId(volunteer.volunteerId)}
                          </option>
                        ))}
                      </select>
                      <div className="form-text">
                        Choose an experienced volunteer as the team leader
                      </div>
                    </div>

                    <div className="col-md-12 mb-3">
                      <label htmlFor="description" className="form-label fw-bold">Team Description</label>
                      <textarea 
                        id="description"
                        name="description"
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the team's purpose and responsibilities..."
                        maxLength={500}
                      />
                      <div className="form-text">
                        {preSelectedEvent.selectedEventTitle 
                          ? 'Default description generated based on selected event'
                          : 'Optional: Provide details about the team\'s role and objectives'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members Selection */}
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-user-friends me-2 text-success"></i>
                    Select Team Members ({formData.memberList.length} selected)
                  </h5>
                </div>
                <div className="card-body">
                  {getAvailableVolunteers().length > 0 ? (
                    <div className="row">
                      {getAvailableVolunteers().map(volunteer => (
                        <div key={volunteer.volunteerId} className="col-md-6 mb-3">
                          <div 
                            className={`card h-100 ${formData.memberList.includes(volunteer.volunteerId) ? 'border-success bg-light' : 'border-secondary'}`}
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <div className="flex-grow-1">
                                  <h6 className="card-title mb-1">
                                    {getUserFullNameByVolunteerId(volunteer.volunteerId)}
                                    {formData.memberList.includes(volunteer.volunteerId) && (
                                      <i className="fas fa-check-circle text-success ms-2"></i>
                                    )}
                                  </h6>
                                  <p className="card-text small text-muted mb-2">
                                    <strong>Email:</strong> {getUserEmailByVolunteerId(volunteer.volunteerId)}
                                  </p>
                                  <p className="card-text small text-muted mb-0">
                                    <strong>Volunteer ID:</strong> {volunteer.volunteerId}
                                  </p>
                                </div>
                                <div className="form-check">
                                  <input 
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`member-${volunteer.volunteerId}`}
                                    checked={formData.memberList.includes(volunteer.volunteerId)}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleMemberToggle(volunteer.volunteerId);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted">
                      <i className="fas fa-users-slash fa-2x mb-3"></i>
                      <p>No volunteers available for selection.</p>
                      {formData.leaderId && (
                        <small>
                          Note: {getUserFullNameByVolunteerId(formData.leaderId)} is selected as leader and cannot be a team member.
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="card-body text-center">
                  <button 
                    type="submit"
                    className="btn btn-success btn-lg px-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Creating Team...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-users me-2"></i>
                        Create Team
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Pre-selected Event Info */}
            {preSelectedEvent.selectedEventId && (
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                  <h5 className="mb-0 text-success">
                    <i className="fas fa-calendar-check me-2"></i>
                    Selected Event
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Event Title</label>
                    <p className="mb-0 fw-bold text-success">{preSelectedEvent.selectedEventTitle}</p>
                  </div>
                  
                  {preSelectedEvent.selectedEventLocation && (
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">Location</label>
                      <p className="mb-0">{preSelectedEvent.selectedEventLocation}</p>
                    </div>
                  )}

                  {preSelectedEvent.selectedEventDate && (
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">Event Date</label>
                      <p className="mb-0">{new Date(preSelectedEvent.selectedEventDate).toLocaleDateString()}</p>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-top">
                    <button 
                      type="button"
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => navigate(`/admin/events/${preSelectedEvent.selectedEventId}`)}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Event Details
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Team Summary */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-warning">
                  <i className="fas fa-clipboard-list me-2"></i>
                  Team Summary
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Selected Event</label>
                  <p className="mb-0">
                    {formData.eventId ? getEventTitle(formData.eventId) : 'No event selected'}
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Team Name</label>
                  <p className="mb-0">
                    {formData.name || 'No name provided'}
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Team Leader</label>
                  <p className="mb-0">
                    {formData.leaderId ? (
                      <span className="badge bg-primary">
                        {getUserFullNameByVolunteerId(formData.leaderId)}
                      </span>
                    ) : (
                      'No leader selected'
                    )}
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Team Members ({formData.memberList.length})</label>
                  {formData.memberList.length > 0 ? (
                    <div className="d-flex flex-wrap gap-1">
                      {formData.memberList.map(volunteerId => (
                        <span key={volunteerId} className="badge bg-success">
                          {getUserFullNameByVolunteerId(volunteerId)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mb-0 text-muted">No members selected</p>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">Total Team Size</label>
                  <p className="mb-0 fs-5 fw-bold text-primary">
                    {(formData.leaderId ? 1 : 0) + formData.memberList.length} volunteers
                  </p>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Guidelines
                </h5>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mb-0">
                  {preSelectedEvent.selectedEventId && (
                    <li className="mb-2">
                      <i className="fas fa-check text-success me-2"></i>
                      <small>Event has been pre-selected for you</small>
                    </li>
                  )}
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    <small>Choose an experienced volunteer as leader</small>
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    <small>Select at least one team member</small>
                  </li>
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    <small>The leader cannot be a team member</small>
                  </li>
                  <li className="mb-0">
                    <i className="fas fa-check text-success me-2"></i>
                    <small>Provide a clear team description</small>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateTeamPage;