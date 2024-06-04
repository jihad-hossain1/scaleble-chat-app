import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import messageRoute from "./route/message.route";
// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Enable CORS with default settings (allow all origins)
app.use(cors());

// Define your routes here
app.use("/api/v1", messageRoute);

// Export the app for use in other files
export default app;
