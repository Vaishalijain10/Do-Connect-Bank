// backend/controllers/userController.js
import bcrypt from "bcrypt";
import users from "../models/userModel.js";
import jwt from "jsonwebtoken";
import sendOtpEmail from "../services/registerEmailService.js";
import sendPasswordEmail from "../services/ForgotPasswordService.js";
import {
  generateOTP,
  generateUniqueAccountNumber,
  GenerateNewPassword,
} from "../services/helperFuntions.js";
import { upload } from "../library/Multer.js";

// Request OTP Controller
export async function requestOtp(req, res) {
  const { email, phoneNumber } = req.body;
  console.log(`backend : user Controller : request-Otp`);
  try {
    const otp = generateOTP();
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    const already = await users.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    });

    if (already) {
      console.log("THIS EMAIL OR CONTACT ALREADY PRESENT");
      return res.send({
        status: false,
        message: "Email or Phone Number already registered",
      });
    }
    console.log("New user");
    const newUser = await users({
      email: email,
      phoneNumber: phoneNumber,
      tempOtp: otp,
      otpExpiration,
    });

    console.log("process");
    await newUser.save();

    await sendOtpEmail(email, otp);
    res.send({ status: true, message: "OTP sent to email." });
  } catch (error) {
    console.log("Error in requestOtp:", error);
    res.send({ status: false, message: "OTP request failed." });
  }
}

// Verify OTP Controller
export async function verifyOtp(req, res) {
  console.log(`backend : user Controller : verify-Otp`);
  const { email, otp } = req.body;
  console.log(req.body);
  try {
    const user = await users.findOne({ email: email, tempOtp: otp });
    console.log(`backend : user Controller : verify-Otp : user : ${user}`);
    if (!user || user.otpExpiration < Date.now()) {
      return res.send({ status: false, message: "Invalid or expired OTP." });
    }

    await users.updateOne({ email }, { otp: null, otpExpiration: null });
    res.send({ status: true, message: "OTP verified successfully." });
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    res.send({ status: false, message: "OTP verification failed." });
  }
}

// registerController -> First name, last name, Phone number, email, state, city, pinCode, Address, Password, Account number, DigitalPin, balance, Profile photo
// Register Controller
export async function registerController(req, res) {
  console.log("Received registration request");

  // Manually invoke multer's file upload handler
  const multerUpload = upload.single("profilePhoto");
  multerUpload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err.message);
      return res.send({ status: false, message: err.message });
    }

    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      state,
      city,
      pinCode,
      address,
      password,
      digitalPin,
    } = req.body;

    try {
      console.log("Checking if user already exists...");
      const existingUser = await users.findOne({ email });

      if (existingUser) {
        console.log("User already exists.");
        return res.send({ status: false, message: "User already exists." });
      }

      console.log("Hashing password and digital pin...");
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedDigitalPin = await bcrypt.hash(digitalPin, 10);

      console.log("Generating account number...");
      const accountNumber = await generateUniqueAccountNumber();

      console.log("Creating new user...");
      const newUser = new users({
        firstName,
        lastName,
        email,
        phoneNumber,
        state,
        city,
        pinCode,
        address,
        password: hashedPassword,
        digitalPin: hashedDigitalPin,
        accountNumber,
        balance: 0, // Initial balance
        profilePhoto: req.file ? req.file.filename : null, // Save photo path if uploaded
      });

      await newUser.save();
      console.log("User registered successfully.");
      res.send({ status: true, message: "User registered successfully." });
    } catch (error) {
      console.error("Error during registration:", error);
      res.send({ status: false, message: "Error during registration." });
    }
  });
}

// login controller -> accountNumber, phoneNumber or email, password
export async function loginController(req, res) {
  console.log(`userController : login`);
  const { email, password } = req.body;

  try {
    // Find the user by account number, phone number, or email
    const user = await users.findOne({
      email,
    });

    if (!user) {
      return res.send({
        status: false,
        message: "User not found. Please register first.",
      });
    }

    // Compare entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.send({ status: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload can include user details
      process.env.JWT_SECRET, // Use the secret from your .env file
      { expiresIn: "1h" }
    );

    res.send({ status: true, userData: user, token: token });
  } catch (error) {
    console.log(`userController : login controller : error : ${error}`);
    res.send({ status: false, message: "Something went wrong during login." });
  }
}

// get Current User Details @ redux
export async function getCurrentUserDetails(req, res) {
  console.log(`userController : getCurrentUserDetails`);

  try {
    const user = await users.findOne({ _id: req.params.userId });
    if (user) {
      return res.send({ status: true, data: user });
    }
  } catch (error) {
    console.log(
      `userController : get Current User Details controller : error : ${error}`
    );
    res.send({
      status: false,
      message: "Something went wrong while fetching details.",
    });
  }
}

// Endpoint to verify the digital pin
export async function verifyDigitalPin(req, res) {
  console.log("verifyDigitalPin called");
  const { userId, pin } = req.body;

  try {
    // Find the user by ID
    const user = await users.findById(userId);
    if (!user) {
      return res.send({ status: false, message: "User not found" });
    }

    // Compare the entered pin with the stored hashed digitalPin
    const isMatch = await bcrypt.compare(pin, user.digitalPin);
    if (isMatch) {
      return res.send({ status: true, message: "PIN matched successfully!" });
    } else {
      return res.send({ status: false, message: "Incorrect pin" });
    }
  } catch (error) {
    console.log("Error verifying digital pin:", error);
    return res.send({ status: false, message: "Server Error" });
  }
}

// edit user details
export async function editUserDetails(req, res) {
  console.log(`userController : editUserDetails called`);
  const {
    userId,
    firstName,
    lastName,
    phoneNumber,
    state,
    city,
    pinCode,
    address,
  } = req.body;

  try {
    // Validate inputs (optional but recommended)
    if (
      !userId ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !state ||
      !city ||
      !pinCode ||
      !address
    ) {
      return res.send({ status: true, message: "All fields are required" });
    }

    // Find the user and update details
    const user = await users.findById(userId);
    if (!user) {
      return res.send({ status: false, message: "User not found" });
    }

    // Update the user's details
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.state = state;
    user.city = city;
    user.pinCode = pinCode;
    user.address = address;

    await user.save();

    console.log(`User details updated successfully for userId: ${userId}`);

    res.send({ status: true, message: "User details updated successfully" });
  } catch (error) {
    console.log(`userController : editUserDetails : error : ${error}`);
    res.send({
      status: false,
      message: "Something went wrong while updating details",
    });
  }
}

// reset Password
export async function resetPassword(req, res) {
  console.log(`userController : reset Password called`);
  const { userId, currentPassword, newPassword, confirmPassword } = req.body;
  try {
    // current password + bcrypt.hash
    // new password + bcrypt.hash
    // confirm password + bcrypt.hash
    // Validate input fields
    if (!userId || !currentPassword || !newPassword || !confirmPassword) {
      return res.send({ status: true, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.send({
        status: false,
        message: "New password and confirm password do not match",
      });
    }

    // Find the user by userId
    const user = await users.findById(userId);
    if (!user) {
      return res.send({
        status: false,
        message: "User not found",
      });
    }

    // Validate the current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.send({
        status: false,
        message: "Current password is incorrect",
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedNewPassword;
    await user.save();

    console.log(`Password updated successfully for userId: ${userId}`);
    res.send({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(`userController : reset Password : error : ${error}`);

    res.send({
      status: false,
      message: "Something went wrong while reseting Password",
    });
  }
}

// reset Digital Pin
export async function resetDigitalPin(req, res) {
  // currentPin bcrypt.hash or currentPassword + bcrypt.hash,
  // userId
  // method: resetMethod,
  // credential: currentCredential + bcrypt.hash,
  // newPin + bcrypt.hash,
  const { userId, method, credential, newPin } = req.body;

  // Check if all required fields are provided
  if (!userId || !method || !credential || !newPin) {
    return res.send({ status: false, message: "All fields are required." });
  }

  try {
    // Find user by ID
    const user = await users.findById(userId);
    if (!user) {
      return res.send({ status: false, message: "User not found." });
    }

    let isCredentialValid = false;

    // Check the method (pin or password)
    if (method === "pin") {
      // Validate the current pin
      isCredentialValid = await bcrypt.compare(credential, user.digitalPin);
    } else if (method === "password") {
      // Validate the current password
      isCredentialValid = await bcrypt.compare(credential, user.password);
    } else {
      return res.send({ status: false, message: "Invalid reset method." });
    }

    // If the current credential is invalid
    if (!isCredentialValid) {
      return res.send({
        status: false,
        message: "Current credential is incorrect.",
      });
    }

    // Validate the new pin
    if (newPin.length < 4) {
      return res.send({ status: false, message: "New Pin must be 4 digits." });
    }

    // Hash the new pin
    const hashedNewPin = await bcrypt.hash(newPin, 10);

    // Update the user's digital pin in the database
    if (method === "pin") {
      user.digitalPin = hashedNewPin;
    } else if (method === "password") {
      user.digitalPin = hashedNewPin;
    }

    // Save the user with the updated pin
    await user.save();

    // Send success response
    return res.send({
      status: true,
      message: "Digital Pin reset successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: false,
      message: "An error occurred while resetting the pin. Please try again.",
    });
  }
}

// request forgot password otp
export async function requestForgotPasswordOtp(req, res) {
  const { email } = req.body;
  console.log(`backend : user Controller : request-Otp`);
  try {
    const otp = GenerateNewPassword();
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    await users.updateOne(
      { email: email },
      { tempOtp: otp, otpExpiration },
      { upsert: true }
    );

    await sendPasswordEmail(email, otp);
    res.send({ status: true, message: "OTP sent to email." });
  } catch (error) {
    console.log("Error in requestOtp:", error);
    res.send({ status: false, message: "OTP request failed." });
  }
}

// verify forgot password otp
export async function verifyForgotPasswordOtp(req, res) {
  console.log(`backend : user Controller : verify-Otp`);
  const { email, otp } = req.body;
  console.log(req.body);
  try {
    const user = await users.findOne({ email: email, tempOtp: otp });
    console.log(`backend : user Controller : verify-Otp : user : ${user}`);
    if (!user || user.otpExpiration < Date.now()) {
      return res.send({ status: false, message: "Invalid or expired OTP." });
    }

    await users.updateOne(
      { email },
      { otp: null, otpExpiration: null } // Clear OTP after verification
    );
    res.send({ status: true, message: "OTP verified successfully." });
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    res.send({ status: false, message: "OTP verification failed." });
  }
}

// forgot password
export async function forgotPasswordController(req, res) {
  console.log(`userController : forgot password`);
  const { email, password } = req.body;

  try {
    const user = await users.findOne({ email });

    if (!user) {
      return res.send({
        status: false,
        message: "User not found. Please check your details.",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    console.log("Password reset successful");
    res.send({
      status: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(
      `userController : forgot password controller : error : ${error}`
    );
    res.send({
      status: false,
      message: "Something went wrong while resetting the password.",
    });
  }
}
