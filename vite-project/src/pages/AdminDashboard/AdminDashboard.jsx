import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";

export default function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/"); // redirect if not admin
        }
    }, [navigate]);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={2}>Admin Dashboard</Typography>
            <Typography>Welcome, Admin! You can manage users, courses, and more.</Typography>
        </Box>
    );
}
