import Navbar from "../signup/navbar";
import React, { useState } from "react";
import "./MobileBanking.css";
import { useNavigate } from "react-router-dom";

export default function BkashPayment() {
    const [accountNumber, setAccountNumber] = useState("");
    const [agreed, setAgreed] = useState(false);

    // Get donation amount from URL query parameter
    const searchParams = new URLSearchParams(window.location.search);
    const donationAmount = searchParams.get("amount") || "0";

    const handleProceed = () => {
        if (accountNumber && agreed) {
            alert("Proceeding with payment...");
        } else {
            alert("Please enter account number and agree to terms.");
        }
    };

    return (
        <div className="bkash-container">
            <div className="bkash-header">
                <img
                    src="https://seeklogo.com/images/B/bkash-logo-3958D05E7C-seeklogo.com.png"
                    alt="bKash Logo"
                    className="bkash-logo"
                />
                <span className="bkash-title">Payment</span>
            </div>

            <div className="bkash-box">
                <p>
                    <strong>Merchant</strong>: Anjuman Mufidul Islam
                </p>
                <p>
                    <strong>Invoice no</strong>: 1559040913
                </p>
                <p>
                    <strong>Amount</strong>: BDT {donationAmount}
                </p>
            </div>

            <div className="bkash-input-area">
                <label>Your bKash account number</label>
                <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="01700000001"
                />
                <div className="terms">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={() => setAgreed(!agreed)}
                    />
                    <span>
                        I agree to the <a href="#">terms and conditions</a>
                    </span>
                </div>
            </div>

            <div className="bkash-buttons">
                <button onClick={handleProceed}>PROCEED</button>
                <button className="close">CLOSE</button>
            </div>

            <div className="footer-code">© 16247</div>
        </div>
    );
}