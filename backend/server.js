import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./config/db.js";

import userRoutes from "./routes/user.js";
import universityRoutes from "./routes/university.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

//Admin profile image upload limit
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Middleware
app.use(cors())
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
// app.get("/", (req, res) => {
//     res.send(" Server is running...");
// });

app.use("/api/users", userRoutes)
app.use("/api/universities", universityRoutes)
app.use("/api/admin", adminRoutes)

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
