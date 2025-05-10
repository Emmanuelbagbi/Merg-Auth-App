// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import cookieParser from "cookie-parser";
// import mongodb from "./config/mongodb.js";
// import authRouter from "./routes/authRoutes.js";
// import userRouter from "./routes/userRouter.js";

// const app = express();
// const port = 4000;
// const allowedOrigins = [process.env.BACKEND_URL];

// mongodb();
// app.use(express.json());
// app.use(cors({ credentials: true, origin: allowedOrigins }));
// app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("welcome");
// });

// app.use("/auth", authRouter);
// app.use("/user", userRouter);

// app.listen(port, () =>
//   console.log(`server started on http://localhost:${port}`)
// );




import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js"; // passport config
import mongodb from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouter.js";

const app = express();
const port = process.env.PORT || 4000;

// Ensure your frontend URL is correct
const allowedOrigin = process.env.FRONTEND_URL || "https://merg-auth-app.vercel.app";

// Connect to MongoDB
mongodb();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Use true if using HTTPS and proxy
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => res.send("Welcome to the backend!"));
app.use("/auth", authRouter);
app.use("/user", userRouter);

// Start the server on 0.0.0.0 for Render compatibility
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
