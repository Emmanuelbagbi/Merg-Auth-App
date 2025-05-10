import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import TwitterStrategy from "passport-twitter";
import userModel from "../models/userModels.js";

// Session setup remains the same
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Enhanced Google Strategy with better image handling
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ['profile', 'email']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      // Update existing user's avatar if missing or from Google
      if (!existingUser.avatar || existingUser.provider === 'google') {
        existingUser.avatar = profile.photos?.[0]?.value?.replace(/=s96-c$/, '=s400-c');
        await existingUser.save();
      }
      return done(null, existingUser);
    }

    const newUser = await userModel.create({
      name: profile.displayName,
      email,
      password: "",
      provider: 'google',
      userVerified: true,
      avatar: profile.photos?.[0]?.value?.replace(/=s96-c$/, '=s400-c') || null
    });
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

// Enhanced Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields: ["id", "displayName", "emails", "picture.type(large)"],
  enableProof: true
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error("Email not found"), null);

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      if (!existingUser.avatar || existingUser.provider === 'facebook') {
        existingUser.avatar = profile.photos?.[0]?.value;
        await existingUser.save();
      }
      return done(null, existingUser);
    }

    const newUser = await userModel.create({
      name: profile.displayName,
      email,
      password: "",
      provider: 'facebook',
      userVerified: true,
      avatar: profile.photos?.[0]?.value || null
    });
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

// Enhanced Twitter Strategy
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "/auth/twitter/callback",
  includeEmail: true,
  userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
},
async (token, tokenSecret, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error("Email not available"), null);

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      if (!existingUser.avatar || existingUser.provider === 'twitter') {
        existingUser.avatar = profile.photos?.[0]?.value;
        await existingUser.save();
      }
      return done(null, existingUser);
    }

    const newUser = await userModel.create({
      name: profile.displayName,
      email,
      password: "",
      provider: 'twitter',
      userVerified: true,
      avatar: profile.photos?.[0]?.value?.replace('_normal', '_400x400') || null
    });
    return done(null, newUser);
  } catch (err) {
    return done(err);
  }
}));

export default passport;
