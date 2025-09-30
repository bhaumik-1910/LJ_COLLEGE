import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={2}>
                Admin Dashboard
            </Typography>
            <Typography mb={3}>
                Welcome, Admin! You can manage users, courses, and more.
            </Typography>

            <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Box>
    );
}
