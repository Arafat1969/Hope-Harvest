import React, { useState } from "react";
import axios from "axios";

const PaymentVerification = () => {
  const [paymentId, setPaymentId] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const verifyPayment = async () => {
    const payload = { paymentId, otp };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/payment/verify", // Adjust API URL
        payload
      );
      setStatus(response.data.message);
      setError(null);
    } catch (err) {
      setError("Verification failed");
      setStatus(null);
    }
  };

  return (
    <div>
      <h2>Verify Payment</h2>
      {error && <div className="error">{error}</div>}
      {status && <div className="status">{status}</div>}
      <input
        type="text"
        placeholder="Payment ID"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button onClick={verifyPayment}>Verify Payment</button>
    </div>
  );
};

export default PaymentVerification;
