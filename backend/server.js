import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./config/db.js";

import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors())
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
// app.get("/", (req, res) => {
//     res.send("🚀 Server is running...");
// });

app.use("/api/users", userRoutes)

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
