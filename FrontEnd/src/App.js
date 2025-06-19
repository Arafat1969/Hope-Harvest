import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './signup/navbar';
import Sidebar from './signup/about';
import ProjectContent from './signup/projectContent';
import VolunteerActivityLayout from './signup/volunteeractivity';
import ApplyFundsLayout from './signup/applyfundcontent';
import Gallery from './signup/gallerycomponent';
import Register from './signup/register';
import Login from './signup/login';
import UserProfile from './signup/UserProfile';
import DonationForm from "./DonationPayment/DonationForm"; // Import the DonationForm component
import DonationSummary from "./DonationPayment/DonationSummary"; // Import the DonationSummary component
import PaymentVerification from "./DonationPayment/PaymentVerification"; // Import the PaymentVerification component
import MobileBanking from "./DonationPayment/MobileBanking"; // Import the MobileBanking component
import BankTransfer from "./DonationPayment/BankTransfer"; // Import the BankTransfer component

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
        country: localStorage.getItem('country') || ''
      };
      
      setUser(userData);
    }
  }, []);

  // Handle login success
  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setUser({
      firstName: userData.firstName,
      lastName: userData.lastName || '',
      email: userData.email || '',
      phoneNumber: userData.phoneNumber || '',
      address: userData.address || {
        street: '',
        city: '',
        postalCode: '',
        country: ''
      }
    });
    
    // Store user data for persistence
    
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar isAuthenticated={isAuthenticated} user={user} />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar isAuthenticated={isAuthenticated} user={user} />
              <Sidebar />
            </>
          }
        />
        <Route
          path="/projects"
          element={
            <>
              <Navbar isAuthenticated={isAuthenticated} user={user} />
              <ProjectContent />
            </>
          }
        />
        <Route
          path="/volunteer-activity"
          element={
            <>
              <Navbar isAuthenticated={isAuthenticated} user={user} />
              <VolunteerActivityLayout />
            </>
          }
        />
        <Route
          path="/apply-for-funds"
          element={
            <>
              <Navbar isAuthenticated={isAuthenticated} user={user} />
              <ApplyFundsLayout />
            </>
          }
        />
        <Route
          path="/gallery"
          element={
            <>
              <Navbar isAuthenticated={isAuthenticated} user={user} />
              <Gallery />
            </>
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/profile"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar isAuthenticated={isAuthenticated} user={user} />
                <UserProfile user={user} />
              </>
            )
          }
        />
        <Route
          path="/donate"
          element={<DonationForm />}
        />
        <Route
          path="/payment-gateway/mobile-banking"
          element={
            <MobileBanking />
          }
        />
        <Route
          path="/payment-gateway/bank-transfer"
          element={
            <BankTransfer />
          }
        />
        <Route
          path="/donation-summary"
          element={<DonationSummary />}
        />
        <Route
          path="/verify-payment"
          element={<PaymentVerification />}
        />

        {/* Add a catch-all redirect to home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;