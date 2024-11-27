import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { baseUrl } from "../api/URL";
import { RiseLoader } from "react-spinners";
import defaultImage from "../images/Logo2.jpeg";

export default function ViewUserDetails() {
  // Access user data from Redux
  const user = useSelector((state) => state.user);
  console.log("View user details", user);
  // view-user-details
  const [loading, setLoading] = useState(true);

  const isLocalHost = window.location.hostname === "localhost";
  const imgLink = isLocalHost
    ? `${baseUrl}/${user?.userData?.profilePhoto}`
    : defaultImage;

  useEffect(() => {
    if (user?.userData) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    // Display a spinner while user data is being loaded
    return (
      <div className="h-[79.91vh] flex items-center justify-center bg-gray-100">
        <RiseLoader color="#001f3f" />
      </div>
    );
  }

  return (
    <div className="h-[79.91vh] flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <h1 className="bg-navy text-white w-full p-2 mb-2 uppercase text-center">
          User Details
        </h1>

        {/* Profile Photo */}
        <div className="flex justify-center mt-6">
          <img
            src={imgLink}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
        </div>

        {/* User Information */}
        <div className="space-y-4 cursor-not-allowed">
          <div className="flex justify-start">
            <span className="font-bold text-gray-700">Account Number:</span>
            <span className="ml-2">{user?.userData?.accountNumber}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-bold text-gray-700">First Name:</span>
            <span className="ml-2">{user?.userData?.firstName}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-bold text-gray-700">Last Name:</span>
            <span className="ml-2">{user?.userData?.lastName}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-bold text-gray-700">Email:</span>
            <span className="ml-2">{user?.userData?.email}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-bold text-gray-700">Phone Number:</span>
            <span className="ml-2">{user?.userData?.phoneNumber}</span>
          </div>
          <div className="flex justify-start">
            <span className="font-bold text-gray-700">Address:</span>
            <span className="ml-2">
              {user?.userData?.address}, {user?.userData?.city},{" "}
              {user?.userData?.state} - {user?.userData?.pinCode}
            </span>
          </div>

          <div className="text-center mt-4 space-y-2">
            <p className="text-sm">
              Edit User Details?{" "}
              <Link
                to="/editUserDetails"
                className="text-navy-blue hover:underline"
              >
                Edit Details
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
