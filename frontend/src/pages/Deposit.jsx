import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deposit_BALANCE } from "../redux/slices/userSlice";
import { depositMoney } from "../api/AccountFunction";
export default function Deposit() {
  // Local state for deposit amount and feedback messages
  const [depositAmount, setDepositAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for buttons

  // Access user data and dispatch function from Redux
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle deposit submission
  const handleDeposit = async (event) => {
    event.preventDefault();

    // Validate the deposit amount
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.info("Please enter a valid deposit amount.");
      setMessage("Please enter a valid deposit amount.");
      return;
    }
    setLoading(true); // Enable loading state
    try {
      // Call the deposit API
      const response = await depositMoney(user.userData._id, amount);

      // Handle the API response based on status
      if (response.status) {
        setDepositAmount(""); // Reset deposit amount input field
        dispatch(
          deposit_BALANCE({ New_amount: user.userData.balance + amount })
        );
        toast.success(`Successfully deposited ₹${amount.toFixed(2)}!`);
        setMessage(`Successfully deposited ₹${amount.toFixed(2)}!`);
        navigate("/");
      }
    } catch (error) {
      // Handle errors from the API call
      toast.error("Something went wrong!");
      console.log(error);
    } finally {
      setLoading(false); // Disable loading state
    }
  };

  return (
    <div className="h-[79.91vh] flex items-center justify-center bg-gray-100 overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Page Header */}
        <h1 className="bg-navy text-white w-full p-2 mb-2 uppercase text-center text-sm sm:text-base md:text-lg lg:text-xl">
          Deposit Funds
        </h1>

        <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4 text-center">
          Add money to your account quickly and securely!
        </h2>

        {/* Deposit Form */}
        <form onSubmit={handleDeposit} className="space-y-4">
          <label className="block text-lg font-medium text-gray-700">
            Enter Deposit Amount
          </label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-center text-xl"
            placeholder="₹0.00"
            min="0"
            step="0.01"
          />

          {/* Display feedback message */}
          {message && (
            <div className="text-center text-green-600 text-sm mt-2">
              {message}
            </div>
          )}

          {/* Deposit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-navy"
            } text-white w-full p-2 rounded text-lg sm:text-base`}
          >
            {loading ? "Processing..." : "Deposit"}
          </button>
        </form>

        {/* Link to return to previous page */}
        <div className="text-center mt-4 space-y-2">
          <Link to="/" className="text-sm text-navy-blue hover:underline block">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
