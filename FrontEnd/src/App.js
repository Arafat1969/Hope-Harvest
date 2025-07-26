import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import Sidebar from "./components/AboutPage";
import AdminDashboard from "./components/AdminDashboard";
import ApiTester from "./components/ApiTester";
import ApplyFundsLayout from "./components/applyfundcontent";
import CampaignRequest from "./components/CampaignRequest";
import CampaignsList from "./components/CampaignsList";
import DonationForm from "./components/DonationForm";
import DonationTrackingPage from "./components/DonationTrackingPage";
import Gallery from "./components/gallerycomponent";
import HomePage from "./components/HomePage";
import Login from "./components/login";
import Navbar from "./components/navbar";
import PaymentInfoPage from "./components/PaymentInfoPage";
import PaymentOTPPage from "./components/PaymentOTPPage";
import PaymentPage from "./components/PaymentPage";
import PaymentSuccessPage from "./components/PaymentSuccessPage";
import ProjectContent from "./components/projectContent";
import Register from "./components/register";
import UserDashboard from "./components/UserDashboard";
import UserProfile from "./components/UserProfile";
import VolunteerActivityLayout from "./components/VolunteerActivityLayout";
import Footer from "./components/Footer";
import AdminDonationsPage from "./components/AdminDonationsPage";
import AdminCampaignsPage from "./components/AdminCampaignsPage";
import AdminVolunteersPage from "./components/AdminVolunteersPage";
import AdminEventsPage from "./components/AdminEventsPage";
import AdminUsersPage from "./components/AdminUsersPage";
import AdminFundApplicationsPage from "./components/AdminFundApplicationsPage";
import AdminCampaignRequestsPage from "./components/AdminCampaignRequestsPage";
import AdminCreateCampaignPage from "./components/AdminCreateCampaignPage";
import AdminCreateCampaignSuccessPage from "./components/AdminCreateCampaignSuccessPage";
import AdminCreateEventPage from "./components/AdminCreateEventPage";
import AdminCreateEventSuccessPage from "./components/AdminCreateEventSuccessPage";
import VolunteerRegistrationPage from "./components/VolunteerRegistrationPage";
import VolunteerRegistrationSuccessPage from "./components/VolunteerRegistrationSuccessPage";
import CreateCategory from "./components/CreateCategory";
import CreateCategorySuccess from "./components/CreateCategorySuccess";
import AdminDetailedCampaign from "./components/AdminDetailedCampaign";
import UserDonationDetails from "./components/UserDonationDetails";
import UserCampaignRequestDetails from "./components/UserCampaignRequestDetails";
import FundApplicationForm from "./components/FundApplicationForm";
import UserFundApplicationDetails from "./components/UserFundApplicationDetails";
import UserCampaignRequestsList from "./components/UserCampaignRequestsList";
import UserDonationsList from "./components/UserDonationsList";
import UserFundApplicationsList from "./components/UserFundApplicationsList";
import AdminVolunteerDetails from "./components/AdminVolunteerDetails";
import VolunteerDashboard from "./components/VolunteerDashboard";
import AdminFundApplicationDetails from "./components/AdminFundApplicationDetails";
import VolunteerVerificationDetails from "./components/VolunteerVerificationDetails";
import AdminEventDetailsPage from "./components/AdminEventDetailsPage";
import AdminCreateTeamPage from "./components/AdminCreateTeamPage";
import VolunteerEventDetailsPage from "./components/VolunteerEventDetailsPage";
import VolunteerRatingFormPage from "./components/VolunteerRatingFormPage";
import VolunteerRatingDetails from "./components/VolunteerRatingDetails";

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);

      // Get basic user info from localStorage
      const userData = {
        firstName: localStorage.getItem("firstName") || "User",
        lastName: localStorage.getItem("lastName") || "",
        email: localStorage.getItem("email") || "",
        phoneNumber: localStorage.getItem("phoneNumber") || "",
        city: localStorage.getItem("city") || "",
        postalCode: localStorage.getItem("postalCode") || "",
        country: localStorage.getItem("country") || "",
        role: localStorage.getItem("role") || "USER",
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
      role: userData.role || "USER",
    });
  };

  // Handle logout
  const handleLogout = () => {
    // Clear authentication state
    setIsAuthenticated(false);
    setUser(null);

    // Clear all authentication-related data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("userData");

    console.log("🚪 User logged out, localStorage cleared");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <HomePage />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <Sidebar />
            </>
          }
        />
        <Route
          path="/projects"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <ProjectContent />
            </>
          }
        />
        <Route
          path="/campaigns"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <CampaignsList />
            </>
          }
        />
        <Route
          path="/donate"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <DonationForm />
            </>
          }
        />
        <Route
          path="/payment"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <PaymentPage />
            </>
          }
        />
        <Route
          path="/payment-info"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <PaymentInfoPage />
            </>
          }
        />
        <Route
          path="/payment-otp"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <PaymentOTPPage />
            </>
          }
        />

        <Route
          path="/my-donations"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <UserDonationsList />
              </>
            )
          }
        />

        <Route
          path="/my-campaign-requests"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <UserCampaignRequestsList />
              </>
            )
          }
        />

        <Route
          path="/my-fund-applications"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <UserFundApplicationsList />
              </>
            )
          }
        />

        <Route
          path="/volunteer-dashboard"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <VolunteerDashboard />
              </>
            )
          }
        />

        <Route
          path="/volunteer/verifications/:verificationId"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <VolunteerVerificationDetails />
              </>
            )
          }
        />

        <Route
          path="/volunteer/events/:eventId"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <VolunteerEventDetailsPage />
              </>
            )
          }
        />

        <Route
          path="/volunteers/rate"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <VolunteerRatingFormPage />
              </>
            )
          }
        />

        <Route
          path="/volunteer/ratings/:ratingId"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <VolunteerRatingDetails />
              </>
            )
          }
        />

        <Route
          path="/admin/events/:eventId"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminEventDetailsPage />
              </>
            )
          }
        />
        <Route
          path="/payment-success"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <PaymentSuccessPage />
            </>
          }
        />
        <Route
          path="/track-donation"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <DonationTrackingPage />
            </>
          }
        />

        <Route
          path="/fund-application-form"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <FundApplicationForm />
              </>
            )
          }
        />
        <Route
          path="/volunteer-activity"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <VolunteerActivityLayout />
            </>
          }
        />
        <Route
          path="/apply-for-funds"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <ApplyFundsLayout />
            </>
          }
        />
        <Route
          path="/request-campaign"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <CampaignRequest />
              </>
            )
          }
        />
        <Route
          path="/my-donations/:donationId"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <UserDonationDetails />
              </>
            )
          }
        />
        <Route
          path="/gallery"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <Gallery />
            </>
          }
        />
        <Route
          path="/test-api"
          element={
            <>
              <Navbar
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
              />
              <ApiTester />
            </>
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              user?.role === "ADMIN" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              user?.role === "ADMIN" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role === "ADMIN" ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <UserDashboard />
              </>
            )
          }
        />

        <Route
          path="/my-fund-applications/:applicationId"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <UserFundApplicationDetails />
              </>
            )
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminDashboard />
              </>
            )
          }
        />

        <Route
          path="/admin/donations"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminDonationsPage />
              </>
            )
          }
        />

        <Route
          path="/admin/campaigns"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminCampaignsPage />
              </>
            )
          }
        />

        <Route
          path="/admin/volunteers"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminVolunteersPage />
              </>
            )
          }
        />

        <Route
          path="/admin/events"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminEventsPage />
              </>
            )
          }
        />

        <Route
          path="/admin/volunteers/:volunteerId"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminVolunteerDetails />
              </>
            )
          }
        />

        <Route
          path="/admin/fund-applications/:applicationId"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminFundApplicationDetails />
              </>
            )
          }
        />

        <Route
          path="/admin/create/team"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminCreateTeamPage />
              </>
            )
          }
        />

        <Route
          path="/admin/users"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminUsersPage />
              </>
            )
          }
        />

        <Route
          path="/admin/fund-applications"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminFundApplicationsPage />
              </>
            )
          }
        />

        <Route
          path="/admin/campaign-requests"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminCampaignRequestsPage />
              </>
            )
          }
        />

        <Route
          path="/admin/create/campaigns"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminCreateCampaignPage />
              </>
            )
          }
        />

        <Route
          path="/admin/create/campaigns/success"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminCreateCampaignSuccessPage />
              </>
            )
          }
        />

        <Route
          path="/admin/create/events"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminCreateEventPage />
              </>
            )
          }
        />

        <Route
          path="/my-campaign-requests/:requestId"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <UserCampaignRequestDetails />
              </>
            )
          }
        />

        <Route
          path="/admin/create/events/success"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminCreateEventSuccessPage />
              </>
            )
          }
        />

        <Route
          path="/admin/create/category"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <CreateCategory />
              </>
            )
          }
        />

        <Route
          path="/admin/create/category/success"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <CreateCategorySuccess />
              </>
            )
          }
        />

        <Route
          path="/admin/campaigns/:campaignId"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : user?.role !== "ADMIN" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <AdminDetailedCampaign />
              </>
            )
          }
        />

        <Route
          path="/volunteer-registration"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <VolunteerRegistrationPage />
              </>
            )
          }
        />

        <Route
          path="/volunteer-registration/success"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <VolunteerRegistrationSuccessPage />
              </>
            )
          }
        />

        <Route
          path="/profile"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar
                  isAuthenticated={isAuthenticated}
                  user={user}
                  onLogout={handleLogout}
                />
                <UserProfile user={user} />
              </>
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
