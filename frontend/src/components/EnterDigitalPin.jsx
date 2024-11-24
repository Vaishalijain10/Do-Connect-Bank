import React, { useState } from "react";

const EnterDigitalPin = ({ onSubmit, onClose }) => {
  const [pin, setPin] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false); // Submit button loading state
  const [returnLoading, setReturnLoading] = useState(false); // Return button loading state

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      await onSubmit(pin); // Ensure this is a promise for async handling
      setPin("");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReturn = async () => {
    setReturnLoading(true);
    try {
      await onClose(); // If onClose is async, handle it; otherwise, remove await
    } finally {
      setReturnLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center text-center justify-center bg-black bg-opacity-80">
      <div className="bg-white p-6 rounded shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Enter Digital Pin</h2>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter your pin"
          className="w-full p-2 border text-black border-gray-300 rounded"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitLoading || returnLoading} // Prevent interaction if any action is loading
          className={`w-full p-2 rounded ${
            submitLoading
              ? "bg-gray-400 cursor-not-allowed mt-2"
              : "bg-navy text-white mt-2"
          }`}
        >
          {submitLoading ? "Submitting..." : "Submit"}
        </button>

        {/* Return to All Services Button */}
        <button
          onClick={handleReturn}
          disabled={submitLoading || returnLoading} // Prevent interaction if any action is loading
          className={`w-full p-2 rounded ${
            returnLoading
              ? "bg-gray-400 cursor-not-allowed mt-2"
              : "bg-gray-400 text-red-700 semibold mt-2"
          }`}
        >
          {returnLoading ? "Returning..." : "Return to all services"}
        </button>
      </div>
    </div>
  );
};

export default EnterDigitalPin;
