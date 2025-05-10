import express from "express";
import passport from "passport";
import {
  isVerified,
  login,
  logout,
  register,
  resetPassword,
  sendOtp,
  sendResetOTP,
  verifyEmail,
} from "../controller/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

// ===== Local Auth =====
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-otp", userAuth, sendOtp);
authRouter.post("/verify-email", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isVerified);
authRouter.post("/reset-password-otp", sendResetOTP);
authRouter.post("/reset-password", resetPassword);

// ===== OAuth: Google =====
// Google
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "http://localhost:5176",
}));

// Facebook
authRouter.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
authRouter.get("/facebook/callback", passport.authenticate("facebook", {
  failureRedirect: "/login",
  successRedirect: "http://localhost:5176",
}));

// Twitter
authRouter.get("/twitter", passport.authenticate("twitter"));
authRouter.get("/twitter/callback", passport.authenticate("twitter", {
  failureRedirect: "/login",
  successRedirect: "http://localhost:5176",
}));

export default authRouter;
