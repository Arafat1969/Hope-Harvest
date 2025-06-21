import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
const styles = {
  pageBackground: {
    backgroundColor: "#4CAF50",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 0"
  },
  text: {
    color:  "#2E7D32"  
  },
  card: {
    backgroundColor: "#ffffff"
  },
  submitButton: {
    backgroundColor: "#81c784", 
    borderColor: "#66bb6a"
  },
  link: {
    color: "#4caf50", 
    textDecoration: "underline"
  }
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    addressStreet: '',
    addressCity: '',
    addressPostalCode: '',
    addressCountry: '',
    role: 'USER'
  });

  const [errors, setErrors] = useState({});
  const [showAddress, setShowAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
      setIsSubmitting(true);
    
    // Use auth service for registration
    authService.register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      phoneNumber: formData.phoneNumber,
      addressCity: formData.addressCity,
      addressPostalCode: formData.addressPostalCode,
      addressCountry: formData.addressCountry
    })
    .then(response => {
      console.log("Registration successful:", response);
      setRegistrationSuccess(true);
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Short delay to show success message
    })
    .catch(error => {
      console.error("Registration failed:", error.response?.data || error.message);
      setErrors({
        general: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  const toggleAddressSection = () => {
    setShowAddress(!showAddress);
  };

  return (
    <div style={styles.pageBackground}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow" style={{...styles.card, borderRadius: "1rem"}}>
              <div className="card-body">
                <h2 className="card-title text-center mb-4" style={styles.text}>Sign Up</h2>
                
                {registrationSuccess ? (
                  <div className="alert alert-success text-center">
                    Registration successful! Redirecting to login page...
                  </div>
                ) : (
                  <div>
                    {errors.general && (
                      <div className="alert alert-danger">{errors.general}</div>
                    )}
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="firstName" className="form-label" style={styles.text}>First Name *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                          />
                          {errors.firstName && (
                            <div className="invalid-feedback">{errors.firstName}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="lastName" className="form-label" style={styles.text}>Last Name *</label>
                          <input
                            type="text"
                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                          />
                          {errors.lastName && (
                            <div className="invalid-feedback">{errors.lastName}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="form-label" style={styles.text}>Email *</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                    
                    <div className="form-group mb-3">
                      <label htmlFor="password" className="form-label" style={styles.text}>Password *</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="********"
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>
                    
                    <div className="form-group mb-3">
                      <label htmlFor="confirmPassword" className="form-label" style={styles.text}>Confirm Password *</label>
                      <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="********"
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>
                    
                    <div className="form-group mb-3">
                      <label htmlFor="phoneNumber" className="form-label" style={styles.text}>Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="+8801712345678"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <button 
                        type="button" 
                        className="btn btn-link text-decoration-none p-0" 
                        onClick={toggleAddressSection}
                        style={styles.text}
                      >
                        {showAddress ? '- Hide' : '+ Add'} Address Information (Optional)
                      </button>
                      
                      {showAddress && (
                        <div className="mt-3">
                          <div className="form-group mb-3">
                            <label htmlFor="addressStreet" className="form-label" style={styles.text}>Street Address</label>
                            <input
                              type="text"
                              className="form-control"
                              id="addressStreet"
                              value={formData.addressStreet}
                              onChange={handleChange}
                              placeholder="123 Main Street"
                            />
                          </div>
                          
                          <div className="form-group mb-3">
                            <label htmlFor="addressCity" className="form-label" style={styles.text}>City</label>
                            <input
                              type="text"
                              className="form-control"
                              id="addressCity"
                              value={formData.addressCity}
                              onChange={handleChange}
                              placeholder="Dhaka"
                            />
                          </div>
                          
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group mb-3">
                                <label htmlFor="addressPostalCode" className="form-label" style={styles.text}>Postal Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="addressPostalCode"
                                  value={formData.addressPostalCode}
                                  onChange={handleChange}
                                  placeholder="1000"
                                />
                              </div>
                            </div>
                            
                            <div className="col-md-6">
                              <div className="form-group mb-3">
                                <label htmlFor="addressCountry" className="form-label" style={styles.text}>Country</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="addressCountry"
                                  value={formData.addressCountry}
                                  onChange={handleChange}
                                  placeholder="Bangladesh"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={handleSubmit}
                        style={styles.submitButton}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                      </button>
                    </div>
                    
                    <div className="text-center mt-3">
                      <p className="mb-0" style={styles.text}>
                        Already have an account?{' '}
                        <a href="/login" style={styles.link}>Log In</a>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register