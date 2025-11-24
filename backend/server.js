import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import connectDB from "./config/db.js";

import userRoutes from "./routes/user.js";
import universityRoutes from "./routes/university.js";
import superadminRoutes from "./routes/superadmin.js";
import studentRoutes from "./routes/students.js";
import categoriesRoutes from "./routes/categories.js";
import documentsRoutes from "./routes/documents.js";

import institutionRoutes from "./routes/institution.js";

dotenv.config();

const app = express();

//Super Admin profile image upload limit
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Middleware
app.use(cors())
app.use(express.json());
// Static serving for uploaded files
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB();

// Routes
// app.get("/", (req, res) => {
//     res.send(" Server is running...");
// });

app.use("/api/users", userRoutes)
app.use("/api/universities", universityRoutes)
app.use("/api/superadmin", superadminRoutes)
app.use('/api/faculty', studentRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/documents', documentsRoutes);

// After initializing express app and before starting the server
app.use('/api/institutions', institutionRoutes);

// Start Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
