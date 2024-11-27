import React, { useState } from "react";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";
const EnterDigitalPin = ({ onSubmit, onClose }) => {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Handle pin input change
  const handleInputChange = (value, index) => {
    if (value.length > 1) return; // Prevent entering more than one digit
    const updatedPin = [...pin];
    updatedPin[index] = value;
    setPin(updatedPin);

    // Automatically focus the next input
    if (value !== "" && index < 3) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle submission
  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const finalPin = pin.join(""); // Combine pin digits into a single string
      await onSubmit(finalPin);
      setPin(["", "", "", ""]);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle return action
  const handleReturn = async () => {
    setReturnLoading(true);
    try {
      await onClose();
    } finally {
      setReturnLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center text-center justify-center bg-black bg-opacity-80">
      <div className="bg-white p-6 rounded shadow-lg w-[500px]">
        <h2 className="text-lg font-bold mb-4">Enter Digital Pin</h2>
        {/* digital pin */}
        <div className="flex justify-center gap-4 mb-4 relative">
          {pin.map((digit, index) => (
            <div key={index} className="relative">
              <input
                id={`pin-input-${index}`}
                type={showPin ? "text" : "password"} // Toggle between text and password type
                value={digit}
                maxLength={1}
                onChange={(e) => handleInputChange(e.target.value, index)}
                className="w-12 h-12 text-black text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Eye Icon for showing/hiding PIN */}
              {index === 3 && (
                <span
                  className="absolute ml-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setShowPin((prev) => !prev)}
                >
                  {showPin ? (
                    <AiTwotoneEyeInvisible size={20} />
                  ) : (
                    <AiTwotoneEye size={20} />
                  )}
                </span>
              )}
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-2">
          This PIN will be used for secure access to your account.
        </p>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitLoading || returnLoading}
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
          disabled={submitLoading || returnLoading}
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
