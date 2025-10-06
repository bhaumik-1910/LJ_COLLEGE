import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function FacultyDashboard() {
    const navigate = useNavigate();

    const { logout, token } = useContext(AuthContext);

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "faculty") {
            navigate("/"); // redirect if not faculty
        }
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={2}>Faculty Dashboard</Typography>
            <Typography>Welcome, Faculty! You can manage your courses and students.</Typography>
            <button onClick={handleLogout}>logout</button>
        </Box>
    );
}
