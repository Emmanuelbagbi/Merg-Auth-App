import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true }, // sparse to allow null for some OAuth
  password: { type: String }, // optional for social accounts
  provider: { type: String, default: "local" }, // 'local', 'google', 'facebook', 'twitter'
  providerId: { type: String }, // ID from OAuth provider
  avatar: { type: String }, // optional profile image

  // Verification and reset fields
  verifiedOTP: { type: String, default: "" },
  verifiedOTPExpiresAt: { type: Number, default: 0 },
  userVerified: { type: Boolean, default: false },
  resetOTP: { type: String, default: "" },
  resetOTPExpiresAt: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

