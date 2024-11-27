import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { editUserDetails } from "../api/UserFunction";
import { fetchUserDetails } from "../redux/slices/userSlice";

export default function EditUserDetails() {
  // Access the user data from the Redux store
  const user = useSelector((state) => state.user.userData);
  const Navigate = useNavigate();
  // Initialize state for form fields using user's current details
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    pinCode: user.pinCode || "",
    accountNumber: user.accountNumber || "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Updated User Details:", formData);

    if (!user || !user._id) {
      toast.error("User ID is missing. Please try again.");
      return;
    }
    setLoading(true); // Enable loading state
    try {
      console.log("handleSubmit: Sending update request to helper function...");

      // Call the helper function to update user details
      const response = await editUserDetails(user._id, formData);

      if (response.status) {
        console.log("handleSubmit: User details updated successfully.");
        toast.success(response.message || "User details updated successfully!");
        dispatch(fetchUserDetails());
        Navigate("/ViewUserDetails");
      } else {
        console.error("handleSubmit: Update failed:", response.message);
        toast.error(response.message || "Failed to update user details.");
      }
    } catch (error) {
      console.error("handleSubmit: Unexpected error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Disable loading state
    }
  };

  return (
    <div className="h-[79.91vh] flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-[80vh] max-h-[70vh] overflow-y-auto">
        {/* Header */}
        <h1 className="bg-navy text-white w-full p-2 mb-4 uppercase text-center">
          Edit User Details
        </h1>

        {/* Edit Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="flex flex-col">
            <label htmlFor="firstName" className="font-bold text-gray-800">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="p-2 border rounded font-semibold text-gray-700"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label htmlFor="lastName" className="font-bold text-gray-800">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="p-2 border rounded font-semibold text-gray-700"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label htmlFor="phoneNumber" className="font-bold text-gray-800">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="p-2 border rounded font-semibold text-gray-700"
              required
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label htmlFor="address" className="font-bold text-gray-800">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="p-2 border rounded font-semibold text-gray-700"
              required
            />
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label htmlFor="city" className="font-bold text-gray-800">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="p-2 border rounded font-semibold text-gray-700"
              required
            />
          </div>

          {/* State */}
          <div className="flex flex-col">
            <label htmlFor="state" className="font-bold text-gray-800">
              State
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="p-2 border rounded font-semibold text-gray-700"
              required
            />
          </div>

          {/* Pin Code */}
          <div className="flex flex-col">
            <label htmlFor="pinCode" className="font-bold text-gray-800">
              Pin Code
            </label>
            <input
              type="text"
              id="pinCode"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              className="p-2 border rounded font-semibold text-gray-700"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading} // Disable button when loading
            className={`${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-navy"
            } text-white w-full p-2 rounded mt-4`}
          >
            {loading ? "Updating..." : "Update Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
