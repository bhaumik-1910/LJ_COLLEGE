import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";

export default function FacultyDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "faculty") {
            navigate("/"); // redirect if not faculty
        }
    }, [navigate]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={2}>Faculty Dashboard</Typography>
            <Typography>Welcome, Faculty! You can manage your courses and students.</Typography>
        </Box>
    );
}
