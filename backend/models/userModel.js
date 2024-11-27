import mongoose from "mongoose";

// fields - FirstName, LastName, Email, PhoneNumber, state,city , pincode , Address, Password, AccoundNumber, DigitalPin, Balance, Profile
const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    pinCode: {
      type: String,
    },
    address: {
      type: String,
    },
    password: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    digitalPin: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
    },
    profilePhoto: {
      type: String,
    },
    tempOtp: {
      type: String,
    },
  },
  { timestamps: true }
);

const users = mongoose.model("users", UserSchema);

export default users;
