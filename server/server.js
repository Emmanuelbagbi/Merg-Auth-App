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
const port = 4000;

// Ensure your frontend URL is correct
const allowedOrigin = process.env.BACKEND_URL || "https://merg-auth-app.vercel.app/";

// Connect to MongoDB
mongodb();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigin, 
  credentials: true // allows cookies to be sent with requests
}));

// Session configuration
app.use(session({
  secret: process.env.SECRET_KEY, // secret key to encrypt the session
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // In production, set this to true with HTTPS
}));

// Initialize Passport for user authentication
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => res.send("Welcome to the backend!"));
app.use("/auth", authRouter);
app.use("/user", userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
