import React, { useState } from "react";
import "./BankTransfer.css";

export default function BankTransfer() {
  const banks = [
    "BRAC Bank",
    "Dutch-Bangla Bank",
    "Islami Bank",
    "Standard Chartered",
    "City Bank",
  ];

  // Get amount from URL query string
  const searchParams = new URLSearchParams(window.location.search);
  const amount = searchParams.get("amount") || "";

  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedBank) {
      alert("Please choose your bank.");
      return;
    }
    if (!accountNumber.trim()) {
      alert("Please enter an account number.");
      return;
    }

    // TODO: replace with actual API call
    console.log("Bank:", selectedBank);
    console.log("Account number:", accountNumber);
    console.log("Amount:", amount);
    alert("Transfer request submitted!");
  };

  return (
    <div className="bank-transfer-container">
      <h2 className="page-title">Bank Transfer</h2>

      {/* Amount box */}
      <div className="amount-box">
        <p>
          <strong>Amount:</strong> BDT {amount}
        </p>
      </div>

      <form className="transfer-form" onSubmit={handleSubmit}>
        <label htmlFor="bankSelect">Select Bank</label>
        <select
          id="bankSelect"
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          required
        >
          <option value="" disabled>
            -- Choose a bank --
          </option>
          {banks.map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>

        <label htmlFor="accountNumber">Account Number</label>
        <input
          id="accountNumber"
          type="text"
          placeholder="Enter account number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">
          SUBMIT
        </button>
      </form>
    </div>
  );
}
