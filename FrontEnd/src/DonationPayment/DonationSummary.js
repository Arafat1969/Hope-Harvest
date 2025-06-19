import React, { useState } from "react";
import axios from "axios";

const DonationSummary = () => {
  const [trackingKey, setTrackingKey] = useState("");
  const [donationSummary, setDonationSummary] = useState(null);
  const [error, setError] = useState(null);

  const fetchDonation = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/donations/anonymous/${trackingKey}` // Adjust API URL
      );
      setDonationSummary(response.data.data);
      setError(null);
    } catch (err) {
      setError("Donation not found");
      setDonationSummary(null);
    }
  };

  return (
    <div>
      <h2>Check Donation Status</h2>
      {error && <div className="error">{error}</div>}
      {donationSummary && (
        <div className="summary">
          <h3>Donation Summary</h3>
          <p>Amount: {donationSummary.amount}</p>
          <p>Status: {donationSummary.status}</p>
        </div>
      )}
      <input
        type="text"
        placeholder="Enter Tracking Key"
        value={trackingKey}
        onChange={(e) => setTrackingKey(e.target.value)}
        required
      />
      <button onClick={fetchDonation}>Fetch Donation</button>
    </div>
  );
};

export default DonationSummary;
