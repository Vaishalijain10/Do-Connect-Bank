import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { FaHome, FaUserAlt } from "react-icons/fa";
import Logo from "../images/Logo.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { deleteAuth } from "../redux/slices/userSlice";
import EnterDigitalPin from "../components/EnterDigitalPin"; // Import the pin component
import { toast } from "react-toastify";
import axios from "axios";
import { userUrl } from "../api/URL";

export default function NavBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [active, setActive] = useState("/");
  const [showPinPrompt, setShowPinPrompt] = useState(false); // Pin prompt state
  const [nextPath, setNextPath] = useState(""); // Path after pin verification
  const user = useSelector((state) => state.user);

  const handleNavigate = (path) => {
    setActive(path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch(deleteAuth());
    handleNavigate("/login");
  };

  const handleProfileClick = () => {
    if (user.loggedIn) {
      setNextPath("/ViewUserDetails"); // Path for the profile page
      setShowPinPrompt(true); // Show the pin prompt
    } else {
      toast.error("Log in to access your profile!");
      navigate("/login");
    }
  };

  const handlePinSubmit = async (enteredPin) => {
    try {
      // Verify the digital pin
      const response = await axios.post(`${userUrl}/verifyDigitalPin`, {
        userId: user.userData._id,
        pin: enteredPin,
      });

      if (response.data.status) {
        toast.success("Access granted!");
        navigate(nextPath); // Navigate to the profile page
      } else {
        toast.error("Incorrect digital pin!");
      }
    } catch (error) {
      console.error("Error verifying digital pin:", error);
      toast.error("An error occurred while verifying the pin.");
    }

    setShowPinPrompt(false); // Hide the pin prompt
  };

  return (
    <nav className="bg-navy text-white shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <img
              src={Logo}
              alt="logo"
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
            />
            <Link
              to="/"
              className="text-lg sm:text-xl lg:text-2xl ml-2 font-bold"
            >
              DoCo Bank!
            </Link>
          </div>

          <div className="flex text-end items-center gap-4 sm:gap-6">
            {/* Home Icon */}
            <Link
              to="/"
              className={`text-2xl sm:text-3xl lg:text-4xl transition ease-in-out duration-500 ${
                active === "/" ? "text-teal-200" : "hover:text-teal-200"
              }`}
              onClick={() => handleNavigate("/")}
            >
              <FaHome />
            </Link>

            {user.loggedIn ? (
              <>
                {/* Profile Icon */}
                <button
                  className={`text-xl sm:text-2xl lg:text-3xl transition ease-in-out duration-500 ${
                    active === "/ViewUserDetails"
                      ? "text-teal-200"
                      : "hover:text-teal-200"
                  }`}
                  onClick={handleProfileClick} // Show pin prompt on click
                >
                  <FaUserAlt />
                </button>

                {/* Logout Icon */}
                <button
                  className={`text-2xl sm:text-3xl lg:text-4xl transition ease-in-out duration-500 ${
                    active === "/login"
                      ? "text-teal-200"
                      : "hover:text-teal-200"
                  }`}
                  onClick={handleLogout}
                >
                  <IoMdLogOut />
                </button>
              </>
            ) : (
              // Login Icon
              <Link
                to="/login"
                className={`text-2xl sm:text-3xl lg:text-4xl transition ease-in-out duration-500 ${
                  active === "/login" ? "text-teal-200" : "hover:text-teal-200"
                }`}
                onClick={() => handleNavigate("/login")}
              >
                <IoMdLogIn />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Pin Prompt Modal */}
      {showPinPrompt && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-60 z-50">
          <EnterDigitalPin
            onSubmit={handlePinSubmit} // Handle pin submission
            onClose={() => setShowPinPrompt(false)} // Close the pin prompt
          />
        </div>
      )}
    </nav>
  );
}
