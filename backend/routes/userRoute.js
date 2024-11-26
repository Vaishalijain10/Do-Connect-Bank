// backend/routes/userRoute.js
import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  verifyOtp,
  requestOtp,
  getCurrentUserDetails,
  verifyDigitalPin,
  editUserDetails,
  resetPassword,
  resetDigitalPin,
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
} from "../controllers/userController.js";
import { upload } from "../library/Multer.js";

const router = express.Router();

console.log(`At user Route`);

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post(
  "/register",
  (req, res, next) => {
    upload.single("profilePhoto")(req, res, (err) => {
      if (err) {
        return res.status(400).send({ status: false, message: err.message });
      }
      next();
    });
  },
  registerController
);

router.post("/login", loginController);
// @ redux route
router.get("/get-current-user-details/:userId", getCurrentUserDetails);
// pin component
router.post("/verifyDigitalPin", verifyDigitalPin);

router.put("/editUserDetails", editUserDetails);

router.put("/resetPassword", resetPassword);

router.put("/resetDigitalPin", resetDigitalPin);

router.post("/request-forgot-password-otp", requestForgotPasswordOtp);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOtp);
router.put("/forgot-password", forgotPasswordController);

export default router;
