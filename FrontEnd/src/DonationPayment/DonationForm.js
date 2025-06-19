import Navbar from "../signup/navbar";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DonationForm = ({ user }) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Mobile Banking");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      setError("Please enter a valid donation amount.");
      return;
    }
    setError("");

    // Redirect to payment gateway based on method
    if (paymentMethod === "Mobile Banking") {
      window.location.href = `/payment-gateway/mobile-banking?amount=${donationAmount}`;
    } else if (paymentMethod === "Bank Transfer") {
      window.location.href = `/payment-gateway/bank-transfer?amount=${donationAmount}`;
    }
  };

  return (
    <div className="donation-form-container">
      <Navbar user={user} />
      <h2>Make a Donation</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="donationAmount">Donation Amount :</label>
          <input
            type="number"
            id="donationAmount"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Mobile Banking">Mobile Banking</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <button type="submit" className="donate-button">Donate</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default DonationForm;
