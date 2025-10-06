import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Button, Grid, Paper, TextField, Divider, List, ListItem, ListItemText } from "@mui/material";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

// Import icons
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE = "http://localhost:5000/api";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    // const [uniForm, setUniForm] = useState({ name: "", email: "", otp: "" });
    // const [otpSent, setOtpSent] = useState(false);
    // const [verified, setVerified] = useState(false);

    const [universities, setUniversities] = useState([]);
    const [users, setUsers] = useState([]);

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/login");
        }
    }, [navigate]);

    // const handleLogout = () => {
    //     logout();
    //     navigate("/login");
    // };

    // const sendOtp = async () => {
    //     if (!uniForm.email) return toast.error("Enter university email");
    //     try {
    //         const res = await fetch(`${API_BASE}/universities/send-otp`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ email: uniForm.email }),
    //         });
    //         const data = await res.json();
    //         if (!res.ok) throw new Error(data.message || "Failed to send OTP");
    //         setOtpSent(true);
    //         toast.success("OTP sent");
    //     } catch (e) {
    //         toast.error(e.message);
    //     }
    // };

    // const verifyOtp = async () => {
    //     if (!uniForm.email || !uniForm.otp) return toast.error("Enter email and OTP");
    //     try {
    //         const res = await fetch(`${API_BASE}/universities/verify-otp`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ email: uniForm.email, otp: uniForm.otp }),
    //         });
    //         const data = await res.json();
    //         if (!res.ok) throw new Error(data.message || "OTP verification failed");
    //         setVerified(true);
    //         toast.success("Email verified");
    //     } catch (e) {
    //         toast.error(e.message);
    //     }
    // };

    // const createUniversity = async () => {
    //     if (!verified) return toast.error("Verify email via OTP first");
    //     if (!uniForm.name) return toast.error("Enter university name");
    //     try {
    //         const res = await fetch(`${API_BASE}/universities`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ name: uniForm.name, email: uniForm.email }),
    //         });
    //         const data = await res.json();
    //         if (!res.ok) throw new Error(data.message || "Failed to create university");
    //         toast.success("University created");
    //         setUniForm({ name: "", email: "", otp: "" });
    //         setOtpSent(false);
    //         setVerified(false);
    //         await fetchUniversities();
    //     } catch (e) {
    //         toast.error(e.message);
    //     }
    // };

    const fetchUniversities = async () => {
        try {
            const res = await fetch(`${API_BASE}/universities`);
            const data = await res.json();
            if (res.ok) setUniversities(Array.isArray(data) ? data : []);
        } catch { }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/users`, { headers: { ...authHeader } });
            const data = await res.json();
            if (res.ok) setUsers(Array.isArray(data) ? data : []);
        } catch { }
    };

    useEffect(() => {
        fetchUniversities();
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Derived totals
    const totalUsers = users.length;
    const totalAdmins = users.filter((u) => String(u.role).toLowerCase() === "admin").length;
    const totalFaculty = users.filter((u) => String(u.role).toLowerCase() === "faculty").length;
    const totalUniversities = universities.length;
    const totalOtherUsers = totalUsers - (totalAdmins + totalFaculty);

    // Data for the charts
    const usersChartData = {
        labels: ["Admins", "Faculty", "Other Users"],
        datasets: [{
            data: [totalAdmins, totalFaculty, totalOtherUsers],
            backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
        }],
    };

    // In a real-world scenario, you might want to show more data for universities, but here we'll just show the total
    const universityChartData = {
        labels: ["Universities"],
        datasets: [{
            data: [totalUniversities],
            backgroundColor: ["rgba(75, 192, 192, 0.6)"],
            borderColor: ["rgba(75, 192, 192, 1)"],
            borderWidth: 1,
        }],
    };

    // Chart options to make them look better and display text inside the center
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed;
                        return `${label}: ${value}`;
                    },
                },
            },
        },
    };

    // Common styles for the cards
    const cardStyles = {
        p: 3,
        color: 'white',
        borderRadius: '12px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>Dashboard</Typography>
            {/* Top summary boxes */}
            <Grid container spacing={4} mb={4}>
                {/* Total Admins Card */}
                <Grid item xs={12} sm={6} md={3} sx={{ width: '200px' }}>
                    <Paper sx={{ ...cardStyles, bgcolor: '#4e73df' }}>
                        <AdminPanelSettingsIcon sx={{ fontSize: '3rem', mb: 1 }} />
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Admins</Typography>
                        <Typography variant="h5" fontWeight={700}>{totalAdmins}</Typography>
                    </Paper>
                </Grid>

                {/* Total Faculty Card */}
                <Grid item xs={12} sm={6} md={3} sx={{ width: '200px' }}>
                    <Paper sx={{ ...cardStyles, bgcolor: '#1cc88a' }}>
                        <PeopleAltIcon sx={{ fontSize: '3rem', mb: 1 }} />
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Faculty</Typography>
                        <Typography variant="h5" fontWeight={700}>{totalFaculty}</Typography>
                    </Paper>
                </Grid>

                {/* Total Users Card */}
                <Grid item xs={12} sm={6} md={3} sx={{ width: '200px' }}>
                    <Paper sx={{ ...cardStyles, bgcolor: '#f6c23e' }}>
                        <PersonIcon sx={{ fontSize: '3rem', mb: 1 }} />
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Users</Typography>
                        <Typography variant="h5" fontWeight={700}>{totalUsers}</Typography>
                    </Paper>
                </Grid>

                {/* Total Universities Card */}
                <Grid item xs={12} sm={6} md={3} sx={{ width: '200px' }}>
                    <Paper sx={{ ...cardStyles, bgcolor: '#e74a3b' }}>
                        <SchoolIcon sx={{ fontSize: '3rem', mb: 1 }} />
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Universities</Typography>
                        <Typography variant="h5" fontWeight={700}>{totalUniversities}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6} sx={{ width: '450px', height: '450px' }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2} textAlign="center">User Distribution by Role</Typography>
                        <Box sx={{ width: '80%', margin: 'auto' }}>
                            <Doughnut data={usersChartData} options={chartOptions} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} sx={{ width: '450px', height: '450px' }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2} textAlign="center">University Count</Typography>
                        <Box sx={{ width: '80%', margin: 'auto' }}>
                            <Doughnut data={universityChartData} options={chartOptions} />
                            {/* <Typography variant="h4" sx={{ textAlign: 'center', mt: 2 }}>
                                {totalUniversities}
                            </Typography> */}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* <Grid container spacing={3}>
                <Grid item  xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2}>Register University (SMTP OTP)</Typography>
                        <TextField
                            fullWidth
                            label="University Email"
                            value={uniForm.email}
                            onChange={(e) => setUniForm({ ...uniForm, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <Button variant="outlined" onClick={sendOtp}>Send OTP</Button>
                        {otpSent && (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Enter OTP"
                                    value={uniForm.otp}
                                    onChange={(e) => setUniForm({ ...uniForm, otp: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <Button variant="contained" onClick={verifyOtp}>Verify</Button>
                            </Box>
                        )}
                        <Divider sx={{ my: 2 }} />
                        <TextField
                            fullWidth
                            label="University Name"
                            value={uniForm.name}
                            onChange={(e) => setUniForm({ ...uniForm, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <Button variant="contained" color="primary" onClick={createUniversity}>
                            Create University
                        </Button>
                    </Paper>
                </Grid>

                <Grid item  xs={12} md={6}>
                    <Paper sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" mb={2}>Universities</Typography>
                        <List dense>
                            {universities.map((u) => (
                                <ListItem key={u._id} divider>
                                    <ListItemText primary={u.name} secondary={u.email} />
                                </ListItem>
                            ))}
                            {universities.length === 0 && (
                                <Typography variant="body2">No universities yet.</Typography>
                            )}
                        </List>
                        <Button onClick={fetchUniversities}>Refresh</Button>
                    </Paper>

                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2}>Users</Typography>
                        <List dense>
                            {users.map((u) => (
                                <ListItem key={u._id} divider>
                                    <ListItemText primary={`${u.name} (${u.role})`} secondary={`${u.email}${u.university ? ` · ${u.university}` : ''}`} />
                                </ListItem>
                            ))}
                            {users.length === 0 && (
                                <Typography variant="body2">No users found.</Typography>
                            )}
                        </List>
                        <Button onClick={fetchUsers}>Refresh</Button>
                    </Paper>
                </Grid>
            </Grid>

            <Box mt={3}>
                <Button variant="contained" color="error" onClick={handleLogout}>
                    Logout
                </Button>
            </Box> */}
        </Box>
    );
}
