import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { WithDraw_BALANCE } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import { withdrawMoney } from "../api/AccountFunction";

export default function WithDraw() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (event) => {
    event.preventDefault();

    // Validate the withdrawal amount
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.info("Please enter a valid withdrawal amount.");
      setMessage("Please enter a valid withdrawal amount.");
      return;
    }

    // Check for sufficient balance
    if (withdrawAmount > userData.balance) {
      toast.info("Insufficient balance.");
      setMessage("Insufficient balance.");
      return;
    }
    setLoading(true); // Enable loading state
    try {
      // Call the withdraw API
      const response = await withdrawMoney(userData._id, withdrawAmount);

      // Handle the response from the API
      if (response.status) {
        // Update the Redux state with the new balance
        dispatch(
          WithDraw_BALANCE({
            WithDraw_New_amount: userData.balance - withdrawAmount,
          })
        );
        toast.success(`Successfully withdrawn.`);
        setAmount("");
        setMessage(`Successfully withdrawn ₹${withdrawAmount.toFixed(2)}.`);
        navigate("/");
      }
    } catch (error) {
      // Handle any errors during the withdrawal process
      toast.error("Something went wrong during withdrawal!");
      console.log("Withdraw Error:", error);
    } finally {
      setLoading(false); // Disable loading state
    }
  };

  return (
    <div className="h-[79.91vh] flex items-center justify-center bg-gray-100 overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ">
        {/* Page Header */}
        <h1 className="bg-navy text-white w-full p-2 mb-2 uppercase text-center text-sm sm:text-base md:text-lg lg:text-xl">
          Withdraw Funds
        </h1>

        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-center">
          Time to withdraw? It’s easy, that's for sure!
        </h2>

        {/* Withdraw Form */}
        <form onSubmit={handleWithdraw}>
          <input
            type="number"
            placeholder="Amount to Withdraw"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mb-4 border rounded text-sm sm:text-base"
            required
            min="1"
            step="0.01"
          />

          {/* Withdraw Button */}
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-navy"
            } text-white w-full p-2 rounded text-sm sm:text-base`}
          >
            {loading ? "Processing..." : "Withdraw"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className="text-center mt-4 text-sm text-red-600">{message}</div>
        )}

        {/* Link to return to previous page */}
        <div className="text-center mt-4 space-y-2">
          <Link
            to="/ "
            className="text-sm text-navy-blue hover:underline block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
