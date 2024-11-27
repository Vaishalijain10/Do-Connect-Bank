import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetDigitalPin } from "../api/UserFunction";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";

export default function DigitalPin() {
  // Access user data from Redux
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [resetMethod, setResetMethod] = useState("pin");
  const [currentCredential, setCurrentCredential] = useState("");
  const [newPin, setNewPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false); // Loading state for button
  const [message, setMessage] = useState(""); // Message for success/error feedback
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // Function to handle form submission
  const handleResetPin = async (e) => {
    e.preventDefault();

    if (!currentCredential || !newPin || !confirmPin) {
      const error = "All fields are required.";
      toast.info(error);
      setMessage(error);
      return;
    }

    // Basic validation
    if (newPin.join("") !== confirmPin.join("")) {
      const error = "New Pin and Confirm Pin do not match.";
      toast.error(error);
      setMessage(error);
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      console.log("handleResetPin: Sending request to reset digital pin...");

      // Call the helper function
      const response = await resetDigitalPin(
        user.userData?._id,
        resetMethod,
        currentCredential,
        newPin.join("")
      );

      if (response.status) {
        toast.success(response.message || "Digital Pin reset successfully!");
        setMessage(response.message || "Digital Pin reset successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const errorMessage = response.message || "Failed to reset digital pin.";
        toast.error(errorMessage);
        setMessage(errorMessage);
      }
    } catch (error) {
      console.error("handleResetPin: Unexpected error:", error);
      const errorMessage = "An error occurred. Please try again.";
      toast.error(errorMessage);
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle new pin input change
  const handleNewInputChange = (value, index) => {
    if (value.length > 1) return; // Prevent entering more than one digit
    const updatedPin = [...newPin];
    updatedPin[index] = value;
    setNewPin(updatedPin);

    // Automatically focus the next input
    if (value !== "" && index < 3) {
      const nextInput = document.getElementById(`newPin-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle confirm pin input change
  const handleConfirmInputChange = (value, index) => {
    if (value.length > 1) return; // Prevent entering more than one digit
    const updatedPin = [...confirmPin];
    updatedPin[index] = value;
    setConfirmPin(updatedPin);

    // Automatically focus the next input
    if (value !== "" && index < 3) {
      const nextInput = document.getElementById(`confirmPin-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="h-[79.91vh] flex items-center justify-center bg-gray-100 overflow-y-auto">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        {/* Header */}
        <h1 className="bg-navy text-white w-full p-2 mb-2 uppercase text-center text-sm sm:text-base md:text-lg lg:text-xl">
          Digital Pin
        </h1>

        {/* Digital Pin Display */}
        <div className="mb-2">
          <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-center">
            Your Current Digital Pin
          </h2>
          <div className="text-base sm:text-lg md:text-xl font-bold mb-2 text-center">
            ****
          </div>
        </div>

        {/* Reset Digital Pin Section */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-center">
            Reset Your Digital Pin
          </h2>

          {/* Radio Buttons for Selection */}
          <div className="flex justify-center space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="resetMethod"
                value="pin"
                checked={resetMethod === "pin"}
                onChange={(e) => setResetMethod(e.target.value)}
                className="form-radio"
              />
              <span className="text-sm sm:text-base">Use Current Pin</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="resetMethod"
                value="password"
                checked={resetMethod === "password"}
                onChange={(e) => setResetMethod(e.target.value)}
                className="form-radio"
              />
              <span className="text-sm sm:text-base">Use Password</span>
            </label>
          </div>

          {/* Conditional Inputs Based on Selected Method */}
          <form onSubmit={handleResetPin} className="space-y-2">
            {/* current pin */}
            {resetMethod === "pin" && (
              <div className="mb-4 flex gap-4">
                <label className="block text-sm sm:text-base mb-2 mt-2 text-gray-700">
                  Enter Current Pin
                </label>
                <div className="flex justify-center gap-2">
                  {Array(4)
                    .fill("")
                    .map((_, index) => (
                      <div key={index} className="relative">
                        <input
                          type={showCurrentPin ? "text" : "password"}
                          value={currentCredential[index] || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCurrentCredential((prev) => {
                              const newCredential = [...prev];
                              newCredential[index] = value;
                              return newCredential.join("");
                            });

                            // Move to the next input box automatically
                            if (value && index < 3) {
                              const nextInput = document.getElementById(
                                `pin-input-${index + 1}`
                              );
                              nextInput?.focus();
                            }
                          }}
                          id={`pin-input-${index}`}
                          className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {index === 3 && (
                          <span
                            className="absolute ml-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                            onClick={() => setShowCurrentPin((prev) => !prev)}
                          >
                            {showCurrentPin ? (
                              <AiTwotoneEyeInvisible size={20} />
                            ) : (
                              <AiTwotoneEye size={20} />
                            )}
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* current password */}
            {resetMethod === "password" && (
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Current Password"
                    value={currentCredential}
                    onChange={(e) => setCurrentCredential(e.target.value)}
                    className="w-full p-2 border rounded text-sm sm:text-base"
                    required
                  />
                  <span
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <AiTwotoneEyeInvisible size={20} />
                    ) : (
                      <AiTwotoneEye size={20} />
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* New Pin Input */}
            <div className="mb-4 flex gap-4">
              <label className="block text-sm sm:text-base mb-2 mt-2 text-gray-700">
                Enter New Pin
              </label>
              <div className="flex justify-center gap-2 ml-5">
                {newPin.map((digit, index) => (
                  <div key={index} className="relative">
                    <input
                      id={`newPin-${index}`}
                      type={showNewPin ? "text" : "password"}
                      value={digit}
                      maxLength={1}
                      onChange={(e) =>
                        handleNewInputChange(e.target.value, index)
                      }
                      className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index === 3 && (
                      <span
                        className="absolute ml-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowNewPin((prev) => !prev)}
                      >
                        {showNewPin ? (
                          <AiTwotoneEyeInvisible size={20} />
                        ) : (
                          <AiTwotoneEye size={20} />
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm New Pin Input */}
            <div className="mb-4 flex gap-4">
              <label className="block text-sm sm:text-base mb-2 mt-2 text-gray-700">
                Confirm New Pin
              </label>
              <div className="flex justify-center gap-2 ">
                {confirmPin.map((digit, index) => (
                  <div key={index} className="relative">
                    <input
                      id={`confirmPin-${index}`}
                      type={showConfirmPin ? "text" : "password"}
                      value={digit}
                      maxLength={1}
                      onChange={(e) =>
                        handleConfirmInputChange(e.target.value, index)
                      }
                      className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {index === 3 && (
                      <span
                        className="absolute ml-5 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowConfirmPin((prev) => !prev)}
                      >
                        {showConfirmPin ? (
                          <AiTwotoneEyeInvisible size={20} />
                        ) : (
                          <AiTwotoneEye size={20} />
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-navy"
              } text-white w-full p-2 rounded text-sm sm:text-base`}
            >
              {loading ? "Resetting..." : "Reset Digital Pin"}
            </button>
          </form>

          {/* Feedback Message */}
          {message && (
            <div
              className={`text-center mt-4 ${
                message.includes("successfully")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}

          {/* Back Link */}
          <div className="text-center mt-4 space-y-4">
            <Link
              to="/"
              className="text-sm text-navy-blue hover:underline block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
