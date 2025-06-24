import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/about';
import AdminDashboard from './components/AdminDashboard';
import ApiTester from './components/ApiTester';
import ApplyFundsLayout from './components/applyfundcontent';
import CampaignRequest from './components/CampaignRequest';
import CampaignsList from './components/CampaignsList';
import DonationForm from './components/DonationForm';
import DonationTrackingPage from './components/DonationTrackingPage';
import Gallery from './components/gallerycomponent';
import HomePage from './components/HomePage';
import Login from './components/login';
import Navbar from './components/navbar';
import PaymentInfoPage from './components/PaymentInfoPage';
import PaymentOTPPage from './components/PaymentOTPPage';
import PaymentPage from './components/PaymentPage';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import ProjectContent from './components/projectContent';
import Register from './components/register';
import UserDashboard from './components/UserDashboard';
import UserProfile from './components/UserProfile';
import VolunteerActivityLayout from './components/volunteeractivity';
import Footer from './components/Footer';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      
      // Get basic user info from localStorage
      const userData = {
        firstName: localStorage.getItem('firstName') || 'User',
        lastName: localStorage.getItem('lastName') || '',
        email: localStorage.getItem('email') || '',
        phoneNumber: localStorage.getItem('phoneNumber') || '',
        city: localStorage.getItem('city') || '',
        postalCode: localStorage.getItem('postalCode') || '',
        country: localStorage.getItem('country') || '',
        role: localStorage.getItem('role') || 'USER'
      };
      
      setUser(userData);
    }
  }, []);

  // Handle login success
  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      city: userData.addressCity,
      postalCode: userData.addressPostalCode,
      country: userData.addressCountry,
      role: userData.role || 'USER'
    });
  };

  // Handle logout
  const handleLogout = () => {
    // Clear authentication state
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear all authentication-related data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userData');
    
    console.log('🚪 User logged out, localStorage cleared');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><HomePage /></>} />
        <Route path="/about" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><Sidebar /></>} />
        <Route path="/projects" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><ProjectContent /></>} />
        <Route path="/campaigns" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><CampaignsList /></>} />
        <Route path="/donate" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><DonationForm /></>} />
        <Route path="/payment" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><PaymentPage /></>} />
        <Route path="/payment-info" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><PaymentInfoPage /></>} />
        <Route path="/payment-otp" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><PaymentOTPPage /></>} />
        <Route path="/payment-success" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><PaymentSuccessPage /></>} />
        <Route path="/track-donation" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><DonationTrackingPage /></>} />
        <Route path="/volunteer-activity" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><VolunteerActivityLayout /></>} />
        <Route path="/apply-for-funds" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><ApplyFundsLayout /></>} />
        <Route path="/request-campaign" element={
          !isAuthenticated ? 
            <Navigate to="/login" replace /> : 
            <>
              <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
              <CampaignRequest />
            </>
        } />
        <Route path="/gallery" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><Gallery /></>} />
        <Route path="/test-api" element={<><Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} /><ApiTester /></>} />
        <Route path="/login" element={
          isAuthenticated ? 
            (user?.role === 'ADMIN' ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/dashboard" replace />) : 
            <Login onLoginSuccess={handleLoginSuccess} />
        } />
        <Route path="/register" element={
          isAuthenticated ? 
            (user?.role === 'ADMIN' ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/dashboard" replace />) : 
            <Register />
        } />
        <Route path="/dashboard" element={
          !isAuthenticated ? 
            <Navigate to="/login" replace /> : 
            user?.role === 'ADMIN' ? 
            <Navigate to="/admin-dashboard" replace /> :
            <>
              <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
              <UserDashboard />
            </>
        } />
        <Route path="/admin-dashboard" element={
          !isAuthenticated ? 
            <Navigate to="/login" replace /> : 
            user?.role !== 'ADMIN' ? 
            <Navigate to="/dashboard" replace /> :
            <>
              <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
              <AdminDashboard />
            </>
        } />
        <Route path="/profile" element={
          !isAuthenticated ? 
            <Navigate to="/login" replace /> : 
            <>
              <Navbar isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />
              <UserProfile user={user} />
            </>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;