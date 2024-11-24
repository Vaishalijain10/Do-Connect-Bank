import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaWallet,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaHistory,
  FaRegCreditCard,
  FaKey,
  FaLock,
} from "react-icons/fa";
// import { FaLock } from "react-icons/fa";
import HeroCover from "../images/bg3.jpeg";
import security1 from "../images/security1.png";
import security2 from "../images/security2.png";
import { useSelector } from "react-redux";
import EnterDigitalPin from "../components/EnterDigitalPin";
import { toast } from "react-toastify";
import axios from "axios";
import { userUrl } from "../api/URL";

export default function Home() {
  const navigate = useNavigate();
  const { userData, loggedIn } = useSelector((state) => state.user);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [nextPath, setNextPath] = useState("");

  // Function to handle service click
  const handleServiceClick = (path) => {
    if (loggedIn) {
      setNextPath(path);
      setShowPinPrompt(true);
    } else {
      toast.error("Log in to access our services!");
      return navigate("/login"); // navigation not working
    }
  };

  // Function to handle pin submission
  const handlePinSubmit = async (enteredPin) => {
    try {
      // Make an API call to verify the pin
      const response = await axios.post(`${userUrl}/verifyDigitalPin`, {
        userId: userData._id,
        pin: enteredPin,
      });

      if (response.data.status) {
        navigate(nextPath);
      } else {
        toast.error("Incorrect digital pin");
      }
    } catch (error) {
      console.log("Error verifying digital pin:", error);
      toast.error("An error occurred while verifying the digital pin");
    }

    setShowPinPrompt(false);
  };

  return (
    <div className="bg-white flex flex-col items-center">
      {/* Hero Section */}
      <div
        className="w-[98%] h-[60vh] opacity-96 bg-cover mt-4 ml-4 mr-4 bg-center flex flex-col  text-white"
        style={{ backgroundImage: `url(${HeroCover})` }}
      >
        <div className="h-full w-full bg-[#165ba078] justify-center items-center text-center pt-[140px]">
          <h1 className="text-md sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold mb-4 py-1 px-2 text-yellow-50 mx-4">
            Grow Your Wealth, Secure Your Health with DoCo Bank!
          </h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium py-1 px-2 mx-4">
            Your trusted partner in financial growth & security.
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div className="w-[90%] mt-12 px-6 py-6 bg-gray-100 rounded-lg shadow-md border border-2px">
        <h2 className="text-3xl font-bold text-navy mb-8 text-center">
          Our Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service: View Balance */}
          <div
            onClick={() => handleServiceClick("/balance")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 text-center group cursor-pointer"
          >
            <FaWallet className="text-4xl text-navy mb-4 group-hover:text-teal-500 transition" />
            <h3 className="text-xl font-semibold text-navy">View Balance</h3>
            <p className="text-gray-600 mt-2">
              Check your current balance in seconds!
            </p>
          </div>
          {/* Service: Deposit */}
          <Link
            onClick={() => handleServiceClick("/deposit")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 text-center group"
          >
            <FaRegCreditCard className="text-4xl text-navy mb-4 group-hover:text-teal-500 transition" />
            <h3 className="text-xl font-semibold text-navy">Deposit Money</h3>
            <p className="text-gray-600 mt-2">
              Deposit funds easily and instantly.
            </p>
          </Link>

          {/* Service: Withdraw Money */}
          <Link
            onClick={() => handleServiceClick("/withdraw")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 text-center group"
          >
            <FaMoneyBillWave className="text-4xl text-navy mb-4 group-hover:text-teal-500 transition" />
            <h3 className="text-xl font-semibold text-navy">Withdraw Money</h3>
            <p className="text-gray-600 mt-2">
              Access your funds anytime, anywhere.
            </p>
          </Link>

          {/* Service: Transfer Funds */}
          <Link
            onClick={() => handleServiceClick("/transfer")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 text-center group"
          >
            <FaExchangeAlt className="text-4xl text-navy mb-4 group-hover:text-teal-500 transition" />
            <h3 className="text-xl font-semibold text-navy">Transfer Funds</h3>
            <p className="text-gray-600 mt-2">Send money securely with ease.</p>
          </Link>

          {/* Service: Transaction History */}
          <Link
            onClick={() => handleServiceClick("/transactionHistory")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 text-center group"
          >
            <FaHistory className="text-4xl text-navy mb-4 group-hover:text-teal-500 transition" />
            <h3 className="text-xl font-semibold text-navy">
              Transaction History
            </h3>
            <p className="text-gray-600 mt-2">
              Review all your past transactions.
            </p>
          </Link>
        </div>
      </div>

      {/*  User credentials Section */}
      <div className="w-[90%] mt-12 px-6 py-6 bg-gray-100 rounded-lg shadow-md border border-2px">
        <h2 className="text-3xl font-bold text-navy mb-8 text-center">
          User Credentials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {/* Reset Digital Pin */}
          <div
            onClick={() => navigate("/digitalPin")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 text-center group cursor-pointer"
          >
            <FaKey className="text-4xl text-navy mb-4 group-hover:text-teal-500 transition" />
            <h3 className="text-xl font-semibold text-navy">
              Reset Digital Pin
            </h3>
            <p className="text-gray-600 mt-2">
              Securely reset your digital pin for enhanced security.
            </p>
          </div>
          {/* Reset Password */}
          <div
            onClick={() => navigate("/passwordReset")}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 text-center group cursor-pointer"
          >
            <FaLock className="text-4xl text-navy mb-4 group-hover:text-teal-500 transition" />
            <h3 className="text-xl font-semibold text-navy">Reset Password</h3>
            <p className="text-gray-600 mt-2">
              Securely reset your password for enhanced security.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials & Security Section */}
      <div className="w-[90%] mt-12 mb-12 px-6 py-12 bg-gray-100 rounded-lg shadow-md border border-2px ">
        <h2 className="text-3xl font-bold text-center text-navy mb-8">
          Why Choose DoCo Bank?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Testimonials */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold text-navy mb-4">Our Vision</h3>
            <p className="italic text-gray-700 mb-4">
              “DoCo Bank will change the financial game; <br />
              reliable service & security are our name!”
            </p>
            <h3 className="font-semibold text-navy">- VJ!</h3>
          </div>

          {/* Security Badges */}
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-semibold text-navy mb-4">
              Your security is our top aim
            </h3>
            <p className="text-gray-600 mb-4">
              We use cutting-edge encryption to guard your info tight, <br />
              Protecting your finances day and night!
            </p>
            <div className="flex justify-center space-x-4">
              <img
                src={security1}
                alt="Security Badge 1"
                className="w-16 h-16"
              />
              <img
                src={security2}
                alt="Security Badge 2"
                className="w-16 h-16"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pop-Up Component */}
      {showPinPrompt && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 z-50">
          <EnterDigitalPin
            onSubmit={handlePinSubmit}
            onClose={() => setShowPinPrompt(false)}
          />
        </div>
      )}
    </div>
  );
}
