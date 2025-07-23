import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';
import { volunteerService } from '../services/volunteerService';
import { eventService } from '../services/eventService';
import { fundApplicationService } from '../services/fundApplicationService';

// Reusable Metric Card for the top section.
const MetricCard = ({ title, value, icon, onClick }) => (
  <div className="metric-card" onClick={onClick}>
    <div className="metric-icon">{icon}</div>
    <div className="metric-info">
      <span className="metric-title">{title}</span>
      <span className="metric-value">{value}</span>
    </div>
  </div>
);

// Compact Stat for secondary metrics.
const ActivityStat = ({ title, value, onClick }) => (
    <div className="activity-stat" onClick={onClick}>
        <span>{title}</span>
        <span className="activity-value">{value}</span>
    </div>
);


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminStats, setAdminStats] = useState({
    totalCampaigns: 0,
    totalDonations: 0,
    totalUsers: 0,
    pendingCampaigns: 0,
    totalFundsRaised: 0,
    successfulDonations: 0,
    failedDonations: 0,
    pendingDonations: 0,
    totalVolunteers: 0,
    totalEvents: 0,
    totalFundApplications: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  // --- LOGIC UNCHANGED: Your original data fetching logic is preserved ---
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        campaignsRes, 
        donationStatsRes, 
        userRes, 
        campaignRequestsRes, 
        donationsRes,
        volunteersRes,
        eventsRes,
        fundApplicationsRes
      ] = await Promise.allSettled([
        campaignService.getAllCampaignsAdmin(),
        donationService.getDonationStatistics(),
        authService.getAllUsers(),
        campaignService.getAllCampaignRequests(),
        donationService.getAllDonations(),
        volunteerService.getAllVolunteersAdmin(),
        eventService.getAllEventsAdmin(),
        fundApplicationService.getAllFundApplicationsAdmin()
      ]);

      let stats = {
        totalCampaigns: 0,
        totalDonations: 0,
        totalUsers: 0,
        pendingCampaigns: 0,
        totalFundsRaised: 0,
        successfulDonations: 0,
        failedDonations: 0,
        pendingDonations: 0,
        totalVolunteers: 0,
        totalEvents: 0,
        totalFundApplications: 0
      };

      if (campaignsRes.status === 'fulfilled' && campaignsRes.value) {
        const campaigns = campaignsRes.value.data || campaignsRes.value || [];
        stats.totalCampaigns = campaigns.length;
        stats.totalFundsRaised = campaigns.reduce((sum, campaign) => sum + (parseFloat(campaign.collectedAmount) || 0), 0);
      }

      if (donationStatsRes.status === 'fulfilled' && donationStatsRes.value) {
        const donationStats = donationStatsRes.value.data || donationStatsRes.value || {};
        stats.totalDonations = donationStats.totalDonations || 0;
        stats.successfulDonations = donationStats.successfulDonations || 0;
        stats.failedDonations = donationStats.failedDonations || 0;
        stats.pendingDonations = donationStats.pendingDonations || 0;
        if (donationStats.totalAmount) {
          stats.totalFundsRaised = parseFloat(donationStats.totalAmount);
        }
      }

      if (userRes.status === 'fulfilled' && userRes.value) {
        const users = userRes.value.data || userRes.value || [];
        stats.totalUsers = users.length;
      }

      if (campaignRequestsRes.status === 'fulfilled' && campaignRequestsRes.value) {
        const requests = campaignRequestsRes.value.data || campaignRequestsRes.value || [];
        stats.pendingCampaigns = requests.filter(r => r.status?.toLowerCase() === 'pending').length;
      }

      if (volunteersRes.status === 'fulfilled' && volunteersRes.value) {
        const volunteers = volunteersRes.value.data || volunteersRes.value || [];
        stats.totalVolunteers = volunteers.length;
      }

      if (eventsRes.status === 'fulfilled' && eventsRes.value) {
        const events = eventsRes.value.data || eventsRes.value || [];
        stats.totalEvents = events.length;
      }

      if (fundApplicationsRes.status === 'fulfilled' && fundApplicationsRes.value) {
        const fundApplications = fundApplicationsRes.value.data || fundApplicationsRes.value || [];
        stats.totalFundApplications = fundApplications.length;
      }

      setAdminStats(stats);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };
  
  if (loading) {
    return <div className="page-container state-container"><div className="loading-spinner"></div></div>;
  }

  if (error) {
    return (
      <div className="page-container state-container">
        <div className="alert alert-danger">
            {error}
            <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchAdminData}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-container">
        {/* The new "live" background container */}
        <div className="background-animation">
            <div className="orb orb1"></div>
            <div className="orb orb2"></div>
            <div className="orb orb3"></div>
        </div>

        {/* Header */}
        <header className="dashboard-header">
            <div>
                <h1 className="header-title">Dashboard</h1>
                <p className="header-subtitle">Platform Overview</p>
            </div>
            <div className="header-actions">
                <button className="btn btn-primary" onClick={() => navigate('/admin/create/campaigns')}>
                   🚀 New Campaign
                </button>
                 <button className="btn btn-secondary" onClick={() => navigate('/admin/create/events')}>
                   🎉 New Event
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/admin/create/category')}>
                  🏷️ New Category
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/admin/create/team')}>
                  👥 New Team
                </button>
            </div>
        </header>

        {/* Main Content */}
        <main>
            {/* Section 1: Key Metrics */}
            <section className="dashboard-section">
                <div className="section-grid">
                    <MetricCard title="Total Funds Raised" value={formatCurrency(adminStats.totalFundsRaised)} icon={<i className="fas fa-dollar-sign"></i>} />
                    <MetricCard title="Total Campaigns" value={adminStats.totalCampaigns} icon={<i className="fas fa-bullhorn"></i>} onClick={() => navigate('/admin/campaigns')} />
                    <MetricCard title="Total Donations" value={adminStats.totalDonations} icon={<i className="fas fa-hand-holding-heart"></i>} onClick={() => navigate('/admin/donations')} />
                    <MetricCard title="Platform Users" value={adminStats.totalUsers} icon={<i className="fas fa-users"></i>} onClick={() => navigate('/admin/users')} />
                </div>
            </section>

            {/* Section 2: Financials & Activity */}
            <div className="content-grid">
                {/* Financial Overview Card */}
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Financial Overview</h5>
                    </div>
                    <div className="card-body">
                         <div className="financial-stats">
                            <div className="financial-stat success">
                                <span>Successful Donations</span>
                                <strong>{adminStats.successfulDonations}</strong>
                            </div>
                             <div className="financial-stat warning">
                                <span>Pending Donations</span>
                                <strong>{adminStats.pendingDonations}</strong>
                            </div>
                             <div className="financial-stat danger">
                                <span>Failed Donations</span>
                                <strong>{adminStats.failedDonations}</strong>
                            </div>
                         </div>
                    </div>
                </div>

                {/* Platform Activity Card */}
                 <div className="card">
                    <div className="card-header">
                        <h5 className="card-title">Platform Activity</h5>
                    </div>
                    <div className="card-body">
                        <div className="activity-grid">
                            <ActivityStat title="Pending Requests" value={adminStats.pendingCampaigns} onClick={() => navigate('/admin/campaign-requests')} />
                            <ActivityStat title="Fund Applications" value={adminStats.totalFundApplications} onClick={() => navigate('/admin/fund-applications')} />
                            <ActivityStat title="Total Volunteers" value={adminStats.totalVolunteers} onClick={() => navigate('/admin/volunteers')} />
                            <ActivityStat title="Total Events" value={adminStats.totalEvents} onClick={() => navigate('/admin/events')} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
      </div>
      
      <style jsx global>{`
        :root {
          --primary-color: #00A3FF; 
          --secondary-color: rgba(255, 255, 255, 0.1);
          --success-color: #28a745;
          --danger-color: #dc3545;
          --warning-color: #ffc107;
          --text-color: #F5F7FA;
          --text-muted: #99AAB5;
          --border-color: rgba(255, 255, 255, 0.2);
          --border-radius: 8px;
        }

        /* --- Base & Page Layout --- */
        .page-container { 
            background-color: #121417;
            min-height: 100vh; 
            padding: 2rem 2.5rem; 
            color: var(--text-color);
            position: relative;
            overflow: hidden; /* Important to contain the orbs */
        }
        .state-container { display: flex; align-items: center; justify-content: center; position: relative; z-index: 10; }
        .loading-spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.2); border-top-color: var(--primary-color); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* --- Live Background --- */
        .background-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }
        .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.6;
        }
        .orb1 {
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, #0077B6, transparent 60%);
            animation: moveOrb1 25s infinite alternate;
        }
        .orb2 {
            width: 350px;
            height: 350px;
            background: radial-gradient(circle, #480CA8, transparent 60%);
            animation: moveOrb2 30s infinite alternate;
        }
        .orb3 {
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, #F72585, transparent 60%);
            animation: moveOrb3 20s infinite alternate;
        }

        @keyframes moveOrb1 {
            from { transform: translate(10vw, 20vh) scale(1); }
            to { transform: translate(60vw, 70vh) scale(1.2); }
        }
        @keyframes moveOrb2 {
            from { transform: translate(80vw, 10vh) scale(1.1); }
            to { transform: translate(20vw, 80vh) scale(0.9); }
        }
        @keyframes moveOrb3 {
            from { transform: translate(50vw, 0vh) scale(0.8); }
            to { transform: translate(30vw, 50vh) scale(1.1); }
        }

        /* --- Header --- */
        .dashboard-header, main {
            position: relative;
            z-index: 1; /* Ensure content is above the background */
        }
        .dashboard-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 2.5rem; 
            padding-bottom: 1.5rem; 
            border-bottom: 1px solid var(--border-color); 
        }
        .header-title { font-size: 2.25rem; font-weight: 600; margin: 0; }
        .header-subtitle { font-size: 1rem; color: var(--text-muted); margin: 0; }
        .header-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .btn { font-weight: 500; }
        .btn-primary { background-color: var(--primary-color); border: 1px solid var(--primary-color); color: #fff; }
        .btn-primary:hover { opacity: 0.9; }
        .btn-secondary { background-color: var(--secondary-color); border: 1px solid var(--border-color); color: var(--text-color); }
        .btn-secondary:hover { background-color: rgba(255, 255, 255, 0.15); }

        /* --- Grid & Sections --- */
        .dashboard-section { margin-bottom: 2rem; }
        .section-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .content-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem; }

        /* --- Card Styling (Glassmorphism) --- */
        .card { 
            background: rgba(30, 33, 36, 0.5); /* Semi-transparent background */
            backdrop-filter: blur(15px); /* The frosted glass effect */
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid var(--border-color); 
            border-radius: var(--border-radius); 
        }
        .card-header { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border-color); }
        .card-header .card-title { font-size: 1.1rem; font-weight: 500; margin: 0; }
        .card-body { padding: 1.25rem; }

        /* --- Metric Card --- */
        .metric-card {
            background: rgba(30, 33, 36, 0.5);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 1.25rem;
            display: flex;
            align-items: center;
            gap: 1.25rem;
            transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .metric-card:hover { 
            transform: translateY(-3px);
            border-color: var(--primary-color); 
            box-shadow: 0 0 25px rgba(0, 163, 255, 0.2);
            cursor: pointer; 
        }
        .metric-icon { font-size: 1.75rem; color: var(--text-muted); }
        .metric-info { display: flex; flex-direction: column; }
        .metric-title { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.25rem; }
        .metric-value { font-size: 2rem; font-weight: 600; line-height: 1.2; color: var(--text-color); }
        
        /* --- Financial Overview --- */
        .financial-stats { display: flex; flex-direction: column; gap: 1rem; }
        .financial-stat { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-radius: var(--border-radius); background-color: rgba(255, 255, 255, 0.05); }
        .financial-stat span { color: var(--text-muted); font-size: 0.9rem; }
        .financial-stat strong { font-size: 1.2rem; font-weight: 600; }
        .financial-stat.success strong { color: var(--success-color); }
        .financial-stat.warning strong { color: var(--warning-color); }
        .financial-stat.danger strong { color: var(--danger-color); }

        /* --- Platform Activity --- */
        .activity-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .activity-stat {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.05);
            padding: 0.75rem 1rem;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .activity-stat:hover { background-color: rgba(255, 255, 255, 0.1); }
        .activity-stat span { color: var(--text-muted); font-size: 0.9rem; }
        .activity-stat .activity-value { font-weight: 600; font-size: 1.1rem; color: var(--text-color); }

        /* --- Responsive Design --- */
        @media (max-width: 1200px) {
          .section-grid { grid-template-columns: repeat(2, 1fr); }
          .content-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
            .dashboard-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
            .section-grid, .activity-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;
