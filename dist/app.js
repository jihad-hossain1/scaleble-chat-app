"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const message_route_1 = __importDefault(require("./route/message.route"));
// Load environment variables from .env file
dotenv_1.default.config();
// Initialize the Express application
const app = (0, express_1.default)();
// Enable CORS with default settings (allow all origins)
app.use((0, cors_1.default)());
// Define your routes here
app.use("/api/v1", message_route_1.default);
// Export the app for use in other files
exports.default = app;
