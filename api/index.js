import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"; //use extension of file while import is not aplicable for libary import
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();

const Connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected with MONGODB");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MONGODB is disconnected!!");
});

// NO need to check for connected with mongodb already checking for isconnected in Connect function if not connect disconnected will check that
// mongoose.connection.on("connected", () => {
//   console.log("MONGODB is connected!!");
// });

// middleware
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/users", usersRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  res.status(errorStatus).json({
    success: false,
    status: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  Connect();
  console.log("Server is listining!");
});
