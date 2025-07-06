import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { volunteerService } from '../services/volunteerService';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  formCard: {
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0'
  },
  skillTag: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.875rem',
    margin: '0.25rem',
    cursor: 'pointer'
  },
  skillInput: {
    borderRadius: '25px',
    border: '2px solid #e8f5e9',
    padding: '0.5rem 1rem'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    borderRadius: '25px',
    padding: '3rem 2rem',
    color: 'white',
    marginBottom: '2rem',
    textAlign: 'center'
  }
};

const VolunteerRegistrationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nationalId: '',
    phoneNumber: '',
    email: '',
    addressCity: '',
    addressPostalCode: '',
    addressDistrict: '',
    skills: [],
    interests: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Predefined skill and interest options
  const predefinedSkills = [
    'First Aid', 'Teaching', 'Medical Care', 'Computer Skills', 'Photography',
    'Cooking', 'Event Planning', 'Translation', 'Driving', 'Accounting',
    'Social Media', 'Graphic Design', 'Construction', 'Agriculture', 'Counseling',
    'Project Management', 'Public Speaking', 'Research', 'Administrative',
    'Fundraising', 'Marketing', 'Nursing', 'Engineering', 'Legal Advice'
  ];

  const predefinedInterests = [
    'Education', 'Healthcare', 'Disaster Relief', 'Environmental Conservation',
    'Community Development', 'Youth Programs', 'Elderly Care', 'Women Empowerment',
    'Child Welfare', 'Food Distribution', 'Clean Water Projects', 'Poverty Alleviation',
    'Digital Literacy', 'Microfinance', 'Rural Development', 'Emergency Response',
    'Mental Health', 'Skill Training', 'Cultural Preservation', 'Animal Welfare'
  ];

  useEffect(() => {
    // Auto-fill user data if available
    const userData = {
      email: localStorage.getItem('email') || '',
      phoneNumber: localStorage.getItem('phoneNumber') || '',
      addressCity: localStorage.getItem('city') || '',
      addressPostalCode: localStorage.getItem('postalCode') || ''
    };
    
    setFormData(prev => ({
      ...prev,
      ...userData
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = (interest) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
    setInterestInput('');
  };

  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  const handleInterestKeyPress = (e) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      addInterest(interestInput.trim());
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nationalId.trim()) {
      errors.nationalId = 'National ID is required';
    } else if (!/^\d{10,17}$/.test(formData.nationalId.replace(/\s/g, ''))) {
      errors.nationalId = 'Please enter a valid National ID';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^(\+88)?01[3-9]\d{8}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Please enter a valid Bangladeshi phone number';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.addressCity.trim()) {
      errors.addressCity = 'City is required';
    }

    if (!formData.addressDistrict.trim()) {
      errors.addressDistrict = 'District is required';
    }

    if (!formData.addressPostalCode.trim()) {
      errors.addressPostalCode = 'Postal code is required';
    } else if (!/^\d{4}$/.test(formData.addressPostalCode)) {
      errors.addressPostalCode = 'Postal code must be 4 digits';
    }

    if (formData.skills.length === 0) {
      errors.skills = 'Please add at least one skill';
    }

    if (formData.interests.length === 0) {
      errors.interests = 'Please add at least one area of interest';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const volunteersData = {
        externalUserId: localStorage.getItem('userId'),
        nationalId: formData.nationalId.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        addressCity: formData.addressCity.trim(),
        addressPostalCode: formData.addressPostalCode.trim(),
        addressDistrict: formData.addressDistrict.trim(),
        skills: formData.skills,
        interests: formData.interests
      };

      console.log('Registering volunteer with data:', volunteersData);
      const response = await volunteerService.registerVolunteer(volunteersData);
      console.log('Volunteer registered successfully:', response);

      setSuccess(true);
      
      // Navigate to success page after 2 seconds
      setTimeout(() => {
        navigate('/volunteer-registration/success', { 
          state: { volunteerData: response.data || response } 
        });
      }, 2000);

    } catch (error) {
      console.error('Error registering volunteer:', error);
      setError(error.response?.data?.message || 'Failed to register as volunteer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="fas fa-check-circle text-success fa-3x mb-3"></i>
          <h2 className="text-success mb-3">Registration Successful!</h2>
          <p className="text-muted">Redirecting to your volunteer profile...</p>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
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
            <i className="fas fa-heart fa-3x mb-3"></i>
            <h1 className="display-5 fw-bold mb-3">Join Our Volunteer Community</h1>
            <p className="lead mb-0">
              Make a difference in Bangladesh by volunteering with Hope Harvest
            </p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card" style={styles.formCard}>
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 text-success">
                  <i className="fas fa-user-plus me-2"></i>
                  Volunteer Registration
                </h4>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/volunteer-activity')}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back
                </button>
              </div>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="text-success mb-3">
                      <i className="fas fa-user me-2"></i>
                      Personal Information
                    </h5>
                  </div>
                </div>

                <div className="row">
                  {/* National ID */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nationalId" className="form-label">
                      National ID <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.nationalId ? 'is-invalid' : ''}`}
                      id="nationalId"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleInputChange}
                      placeholder="Enter your National ID"
                    />
                    {formErrors.nationalId && (
                      <div className="invalid-feedback">{formErrors.nationalId}</div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${formErrors.phoneNumber ? 'is-invalid' : ''}`}
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                    />
                    {formErrors.phoneNumber && (
                      <div className="invalid-feedback">{formErrors.phoneNumber}</div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="col-12 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>

                {/* Address Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="text-success mb-3">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Address Information
                    </h5>
                  </div>
                </div>

                <div className="row">
                  {/* City */}
                  <div className="col-md-4 mb-3">
                    <label htmlFor="addressCity" className="form-label">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.addressCity ? 'is-invalid' : ''}`}
                      id="addressCity"
                      name="addressCity"
                      value={formData.addressCity}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                    />
                    {formErrors.addressCity && (
                      <div className="invalid-feedback">{formErrors.addressCity}</div>
                    )}
                  </div>

                  {/* District */}
                  <div className="col-md-4 mb-3">
                    <label htmlFor="addressDistrict" className="form-label">
                      District <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.addressDistrict ? 'is-invalid' : ''}`}
                      id="addressDistrict"
                      name="addressDistrict"
                      value={formData.addressDistrict}
                      onChange={handleInputChange}
                      placeholder="Enter your district"
                    />
                    {formErrors.addressDistrict && (
                      <div className="invalid-feedback">{formErrors.addressDistrict}</div>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div className="col-md-4 mb-3">
                    <label htmlFor="addressPostalCode" className="form-label">
                      Postal Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.addressPostalCode ? 'is-invalid' : ''}`}
                      id="addressPostalCode"
                      name="addressPostalCode"
                      value={formData.addressPostalCode}
                      onChange={handleInputChange}
                      placeholder="XXXX"
                    />
                    {formErrors.addressPostalCode && (
                      <div className="invalid-feedback">{formErrors.addressPostalCode}</div>
                    )}
                  </div>
                </div>

                {/* Skills Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="text-success mb-3">
                      <i className="fas fa-tools me-2"></i>
                      Skills & Expertise <span className="text-danger">*</span>
                    </h5>
                    
                    {/* Add Skills Input */}
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        style={styles.skillInput}
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={handleSkillKeyPress}
                        placeholder="Type a skill and press Enter"
                      />
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => addSkill(skillInput.trim())}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>

                    {/* Predefined Skills */}
                    <div className="mb-3">
                      <small className="text-muted d-block mb-2">Quick add popular skills:</small>
                      <div>
                        {predefinedSkills.map(skill => (
                          <span
                            key={skill}
                            style={{
                              ...styles.skillTag,
                              opacity: formData.skills.includes(skill) ? 0.5 : 1,
                              cursor: formData.skills.includes(skill) ? 'not-allowed' : 'pointer'
                            }}
                            onClick={() => !formData.skills.includes(skill) && addSkill(skill)}
                          >
                            {skill}
                            {formData.skills.includes(skill) && ' ✓'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Selected Skills */}
                    {formData.skills.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted d-block mb-2">Your skills:</small>
                        <div>
                          {formData.skills.map(skill => (
                            <span key={skill} style={styles.skillTag}>
                              {skill}
                              <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => removeSkill(skill)}
                              ></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formErrors.skills && (
                      <div className="text-danger small">{formErrors.skills}</div>
                    )}
                  </div>
                </div>

                {/* Interests Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <h5 className="text-success mb-3">
                      <i className="fas fa-heart me-2"></i>
                      Areas of Interest <span className="text-danger">*</span>
                    </h5>
                    
                    {/* Add Interests Input */}
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        style={styles.skillInput}
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyPress={handleInterestKeyPress}
                        placeholder="Type an interest and press Enter"
                      />
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => addInterest(interestInput.trim())}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>

                    {/* Predefined Interests */}
                    <div className="mb-3">
                      <small className="text-muted d-block mb-2">Choose from common interests:</small>
                      <div>
                        {predefinedInterests.map(interest => (
                          <span
                            key={interest}
                            style={{
                              ...styles.skillTag,
                              background: formData.interests.includes(interest) ? 
                                'linear-gradient(135deg, #FF5722 0%, #D32F2F 100%)' : 
                                'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                              opacity: formData.interests.includes(interest) ? 0.5 : 1,
                              cursor: formData.interests.includes(interest) ? 'not-allowed' : 'pointer'
                            }}
                            onClick={() => !formData.interests.includes(interest) && addInterest(interest)}
                          >
                            {interest}
                            {formData.interests.includes(interest) && ' ✓'}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Selected Interests */}
                    {formData.interests.length > 0 && (
                      <div className="mb-3">
                        <small className="text-muted d-block mb-2">Your interests:</small>
                        <div>
                          {formData.interests.map(interest => (
                            <span 
                              key={interest} 
                              style={{
                                ...styles.skillTag,
                                background: 'linear-gradient(135deg, #FF5722 0%, #D32F2F 100%)'
                              }}
                            >
                              {interest}
                              <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                style={{ fontSize: '0.75rem' }}
                                onClick={() => removeInterest(interest)}
                              ></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {formErrors.interests && (
                      <div className="text-danger small">{formErrors.interests}</div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex gap-3 justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-success btn-lg"
                        disabled={loading}
                        style={{ borderRadius: '25px', padding: '0.75rem 2rem' }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Registering...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-heart me-2"></i>
                            Join as Volunteer
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-lg"
                        onClick={() => navigate('/volunteer-activity')}
                        style={{ borderRadius: '25px', padding: '0.75rem 2rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistrationPage;