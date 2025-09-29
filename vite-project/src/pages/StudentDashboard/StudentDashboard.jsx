import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";

export default function StudentDashboard() {
    const navigate = useNavigate();

useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
        navigate("/"); // redirect if not student
    }
}, [navigate]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={2}>Student Dashboard</Typography>
            <Typography>Welcome, Student! You can view your courses, grades, and profile.</Typography>
        </Box>
    );
}
