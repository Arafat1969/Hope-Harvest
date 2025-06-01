import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    color: "#2E7D32"
  },
  card: {
    backgroundColor: "#ffffff"
  },
  submitButton: {
    backgroundColor: "#81c784", 
    borderColor: "#66bb6a",
    transition: "background-color 0.3s, border-color 0.3s"
  },
  submitButtonHover: {
    backgroundColor: "#4CAF50",
    borderColor: "#2E7D32",
    transition: "background-color 0.3s, border-color 0.3s"
  },
  link: {
    color: "#4caf50", 
    textDecoration: "underline"
  }
};

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  
  // State for form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State for form validation errors
  const [errors, setErrors] = useState({});
  
  // State for button hover
  const [isHovered, setIsHovered] = useState(false);
  
  // State for login status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Clear error when user types
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Make login API call
      const response = await axios.post('http://localhost:8090/api/v1/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      console.log("Login successful:", response.data);
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
      localStorage.setItem('firstName', response.data.data.firstName);
      localStorage.setItem('lastName', response.data.data.lastName || '');
      localStorage.setItem('email', response.data.data.email || '');
      localStorage.setItem('phoneNumber', response.data.data.phoneNumber || '');
      
      localStorage.setItem('city', response.data.data.addressCity || '');
      localStorage.setItem('postalCode', response.data.data.addressPostalCode || '');
      localStorage.setItem('country', response.data.data.addressCountry || '');
      
      
      // Clear form and errors
      setFormData({ email: '', password: '' });
      setErrors({});
      
      // Set login success
      setLoginSuccess(true);
      
      // Extract user data for the parent component
      const userData = {
        firstName: response.data.data.firstName,
      };
      
      // Notify parent component of successful login after a short delay
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(userData);
        }
        navigate('/'); // Redirect to home page
      }, 1500); // Short delay to show success message
      
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        setErrors({ 
          general: 'Invalid email or password. Please try again.' 
        });
      } else if (error.response?.status >= 500) {
        setErrors({ 
          general: 'Server error. Please try again later.' 
        });
      } else {
        setErrors({ 
          general: 'Login failed. Please check your credentials.' 
        });
      }
      
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card shadow" style={{...styles.card, borderRadius: "1rem", maxWidth: "360px", margin: "0 auto"}}>
              <div className="card-body">
                <h2 className="card-title text-center mb-4" style={styles.text}>Login</h2>
                
                {loginSuccess ? (
                  <div className="alert alert-success text-center">
                    Login successful! Redirecting to home page...
                  </div>
                ) : (
                  <div>
                    {/* General Error Message */}
                    {errors.general && (
                      <div className="alert alert-danger">{errors.general}</div>
                    )}
                  
                    {/* Email/Username */}
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="form-label" style={styles.text}>Email</label>
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
                    
                    {/* Password */}
                    <div className="form-group mb-3">
                      <label htmlFor="password" className="form-label" style={styles.text}>Password</label>
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
                    
                    {/* Submit Button */}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={handleSubmit}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={isHovered ? styles.submitButtonHover : styles.submitButton}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                      </button>
                    </div>
                    
                    {/* Register Link */}
                    <div className="text-center mt-3">
                      <p className="mb-0" style={styles.text}>
                        Don't have an account?{' '}
                        <a href="/register" style={styles.link}>Sign Up</a>
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
  );
};

export default Login;