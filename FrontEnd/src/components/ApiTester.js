import { useState } from 'react';
import { authService } from '../services/authService';
import { campaignService } from '../services/campaignService';

const ApiTester = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (serviceName, endpointName, testFunction) => {
    try {
      setLoading(true);
      const result = await testFunction();
      setResults(prev => ({
        ...prev,
        [`${serviceName}-${endpointName}`]: {
          status: 'success',
          data: result
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [`${serviceName}-${endpointName}`]: {
          status: 'error',
          error: error.message || 'Connection failed'
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setResults({});
    
    // Test User Service endpoints
    await testEndpoint('user', 'health', async () => {
      // Simple test - try to hit login endpoint with invalid data to check if service is up
      try {
        await authService.login({ email: 'test@test.com', password: 'invalid' });
      } catch (error) {
        if (error.response?.status === 401) {
          return 'Service is running (401 as expected)';
        }
        throw error;
      }
    });

    // Test Donation Service endpoints  
    await testEndpoint('donation', 'campaigns', async () => {
      return await campaignService.getAllCampaigns();
    });

    await testEndpoint('donation', 'categories', async () => {
      return await campaignService.getCampaignCategories();
    });

    // Test basic connectivity to event service
    await testEndpoint('event', 'health', async () => {
      // Just test if we can reach the service
      const response = await fetch('http://localhost:8090/api/v1/events/test');
      if (response.status === 404) {
        return 'Service is running (404 expected for non-existent endpoint)';
      }
      return await response.text();
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'error': return 'text-danger';
      default: return 'text-muted';
    }
  };

  return (
    <div className="container py-5">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <i className="fas fa-flask me-2"></i>
            API Connection Tester
          </h3>
        </div>
        <div className="card-body">
          <p className="text-muted mb-4">
            This tool tests the connection between your React frontend and Spring Boot backend services.
          </p>
          
          <button 
            className="btn btn-primary mb-4" 
            onClick={runAllTests}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Testing...
              </>
            ) : (
              <>
                <i className="fas fa-play me-2"></i>
                Run All Tests
              </>
            )}
          </button>

          <div className="row">
            <div className="col-md-4">
              <h5 className="text-primary">User Service (Port 8085)</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Health Check
                  <span className={`badge ${getStatusColor(results['user-health']?.status)}`}>
                    {results['user-health']?.status || 'Not tested'}
                  </span>
                </li>
              </ul>
              {results['user-health']?.error && (
                <div className="alert alert-danger mt-2">
                  <small>{results['user-health'].error}</small>
                </div>
              )}
            </div>

            <div className="col-md-4">
              <h5 className="text-success">Donation Service (Port 8080)</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Campaigns
                  <span className={`badge ${getStatusColor(results['donation-campaigns']?.status)}`}>
                    {results['donation-campaigns']?.status || 'Not tested'}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Categories
                  <span className={`badge ${getStatusColor(results['donation-categories']?.status)}`}>
                    {results['donation-categories']?.status || 'Not tested'}
                  </span>
                </li>
              </ul>
              {results['donation-campaigns']?.error && (
                <div className="alert alert-danger mt-2">
                  <small>{results['donation-campaigns'].error}</small>
                </div>
              )}
            </div>

            <div className="col-md-4">
              <h5 className="text-warning">Event Service (Port 8090)</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Health Check
                  <span className={`badge ${getStatusColor(results['event-health']?.status)}`}>
                    {results['event-health']?.status || 'Not tested'}
                  </span>
                </li>
              </ul>
              {results['event-health']?.error && (
                <div className="alert alert-danger mt-2">
                  <small>{results['event-health'].error}</small>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h6>Instructions:</h6>
            <ol>
              <li>Make sure all three Spring Boot services are running</li>
              <li>Click "Run All Tests" to check connectivity</li>
              <li>Green badges indicate successful connections</li>
              <li>Red badges indicate connection issues</li>
            </ol>
          </div>

          <div className="mt-3">
            <h6>Expected Ports:</h6>
            <ul>
              <li><code>User Service:</code> http://localhost:8085</li>
              <li><code>Donation Service:</code> http://localhost:8080</li>
              <li><code>Event Service:</code> http://localhost:8090</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
