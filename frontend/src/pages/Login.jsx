import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../api/UserFunction";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../redux/slices/userSlice";
import { Navigate } from "react-router-dom";
import { AiTwotoneEye, AiTwotoneEyeInvisible } from "react-icons/ai";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
  // Loading state for button
  const [loading, setLoading] = useState(false);

  if (user.loggedIn) {
    return <Navigate to="/" />;
  }

  // const { email, password } = loginFormData;
  function handleLoginChange(event) {
    const { name, value } = event.target;

    setLoginFormData((prev) => {
      return {
        ...prev,
        [name]: name === "email" ? value.toLowerCase() : value,
      };
    });
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    console.log("handleLoginSubmit");
    setLoading(true); // Set loading to true when submitting
    try {
      // LoginUser -> api/UserFunction.js
      const response = await LoginUser(loginFormData);
      if (response.status) {
        console.log(response.userData._id);
        toast.success("Login Successfully!");
        dispatch(setAuth(response.userData));
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.userData._id);
        setLoading(false); // Set loading back to false after success
        return navigate("/");
      } else {
        toast.error("Something went wrong!", response.message);
        setLoading(false); // Set loading back to false after failure
      }
    } catch (error) {
      toast.error("connectivity error");
      console.log("connectivity error", error);
      setLoading(false); // Set loading back to false after error
    }
  }
  return (
    <div className="h-[79.91vh] flex items-center justify-center bg-gray-100 overflow-y-auto">
      <form className="bg-white p-4 sm:p-6 md:p-8 rounded shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl ">
        {/* Form Header */}
        <h1 className="bg-navy text-white w-full p-2 mb-2 uppercase text-center text-sm sm:text-base md:text-lg lg:text-xl">
          Login
        </h1>

        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 text-center">
          Time to Grow? Dive into DoCo!
        </h2>

        {/* Email Field */}
        <input
          type="email"
          name="email"
          value={loginFormData.email}
          onChange={handleLoginChange}
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded text-sm sm:text-base"
          required
        />

        {/* Password Field */}
        <div className="relative w-full mb-4">
          <input
            type={passwordVisible ? "text" : "password"}
            name="password"
            value={loginFormData.password}
            onChange={handleLoginChange}
            placeholder="Password"
            className="w-full p-2 border rounded text-sm sm:text-base"
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
          >
            {passwordVisible ? (
              <AiTwotoneEyeInvisible size={20} />
            ) : (
              <AiTwotoneEye size={20} />
            )}
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-navy"
          } text-white w-full p-2 rounded text-sm sm:text-base`}
          onClick={handleLoginSubmit}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Links for Forgot Password and Register */}
        <div className="text-center mt-4 space-y-2">
          <Link
            to="/forgotPassword"
            className="text-xs sm:text-sm md:text-base text-navy-blue hover:underline block"
          >
            Forgot Password?
          </Link>
          <p className="text-xs sm:text-sm md:text-base">
            New User?{" "}
            <Link to="/register" className="text-navy-blue hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
