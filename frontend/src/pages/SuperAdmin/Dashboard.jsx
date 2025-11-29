import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Grid, Paper } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

// Import icons
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';

import { Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);


// const API_BASE = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_BASE;

export default function SuperAdminDashboard() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    // const [uniForm, setUniForm] = useState({ name: "", email: "", otp: "" });
    // const [otpSent, setOtpSent] = useState(false);
    // const [verified, setVerified] = useState(false);

    const [universities, setUniversities] = useState([]);
    const [users, setUsers] = useState([]);
    const [institutionCount, setInstitutionCount] = useState(0);

    const [docCount, setDocCount] = useState(0);
    const [monthly, setMonthly] = useState({
        year: new Date().getFullYear(),
        months: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }))
    });

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "superadmin") {
            navigate("/login");
        }
    }, [navigate]);

    const fetchUniversities = async () => {
        try {
            const res = await fetch(`${API_BASE}/universities`);
            const data = await res.json();
            if (res.ok) setUniversities(Array.isArray(data) ? data : []);
        } catch { }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_BASE}/superadmin/users`, { headers: { ...authHeader } });
            const data = await res.json();
            if (res.ok) setUsers(Array.isArray(data) ? data : []);
        } catch { }
    };

    const fetchDocCount = async () => {
        try {
            const res = await fetch(`${API_BASE}/superadmin/documents/count`, { headers: { ...authHeader } });
            const data = await res.json();
            if (res.ok) setDocCount(Number(data.count || 0));
        } catch { }
    };

    const fetchMonthly = async () => {
        try {
            const res = await fetch(`${API_BASE}/superadmin/documents/stats/monthly`, { headers: { ...authHeader } });
            const data = await res.json();
            if (res.ok && data?.months) setMonthly({ year: data.year, months: data.months });
        } catch { }
    };

    const fetchInstitutionCount = async () => {
        try {
            const res = await fetch(`${API_BASE}/institutions/count`, { headers: { ...authHeader } });
            const data = await res.json();
            if (res.ok && data.success) { setInstitutionCount(data.count); }
        } catch (error) {
            console.error('Error fetching institution count:', error);
        }
    };

    useEffect(() => {
        fetchUniversities();
        fetchUsers();
        fetchDocCount();
        fetchMonthly();
        fetchInstitutionCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // Derived totals
    const totalUsers = users.length;
    const totalAdmins = users.filter((u) => String(u.role).toLowerCase() === "superadmin").length;
    const totalFaculty = users.filter((u) => String(u.role).toLowerCase() === "faculty").length;
    const totalUniversities = universities.length;
    const totalOtherUsers = totalUsers - (totalAdmins + totalFaculty);
    const totalInstitutions = institutionCount;

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

    const monthlyChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
            label: `Documents in ${monthly.year}`,
            data: monthly.months.map(m => m.count),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            tension: 0.25,
            fill: true,
        }]
    };

    const lineOptions = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
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
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: "#2b4ddb" }}>Super Dashboard</Typography>
            {/* Top summary boxes */}
            <Grid container spacing={4} mb={4}>
                {/* Total Admins Card */}
                <Grid item xs={12} sm={6} md={3} sx={{ width: '200px' }}>
                    <Paper sx={{ ...cardStyles, bgcolor: '#4e73df' }}>
                        <AdminPanelSettingsIcon sx={{ fontSize: '3rem', mb: 1 }} />
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Super Admins</Typography>
                        <Typography variant="h5" fontWeight={700}>{totalAdmins}</Typography>
                    </Paper>
                </Grid>

                {/* Total Admin Card */}
                <Grid item xs={12} sm={6} md={3} sx={{ width: '200px' }}>
                    <Paper sx={{ ...cardStyles, bgcolor: '#f6c23e' }}>
                        <PersonIcon sx={{ fontSize: '3rem', mb: 1 }} />
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Admins</Typography>
                        <Typography variant="h5" fontWeight={700}>{totalUsers}</Typography>
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


                {/* Total Universities Card */}
                <Grid item xs={12} sm={6} md={3} sx={{ width: '200px' }}>
                    <Paper sx={{ ...cardStyles, bgcolor: '#e74a3b' }}>
                        <SchoolIcon sx={{ fontSize: '3rem', mb: 1 }} />
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Universities</Typography>
                        <Typography variant="h5" fontWeight={700}>{totalUniversities}</Typography>
                    </Paper>
                </Grid>

                {/* Total Institutions Card */}
                <Grid item xs={12} sm={6} md={3} sx={{ width: '200px' }}>
                    <Paper sx={{ ...cardStyles, bgcolor: '#52211dff' }}>
                        <SchoolIcon sx={{ fontSize: '3rem', mb: 1 }} />
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Institutions</Typography>
                        <Typography variant="h5" fontWeight={700}>{totalInstitutions}</Typography>
                    </Paper>
                </Grid>

                {/* Total Documents Card */}
                <Grid item xs={12} sm={6} md={3} sx={{ width: '200px' }}>
                    <Paper sx={{ ...cardStyles, bgcolor: '#36b9cc' }}>
                        <DescriptionIcon sx={{ fontSize: '3rem', mb: 1 }} />
                        <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Documents</Typography>
                        <Typography variant="h5" fontWeight={700}>{docCount}</Typography>
                    </Paper>
                </Grid>

            </Grid>

            {/* Monthly Documents */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6} sx={{ width: '300px', height: '200px' }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2} textAlign="center">Monthly Documents</Typography>
                        <Box sx={{ width: '100%', margin: 'auto' }}>
                            <Line data={monthlyChartData} options={lineOptions} />
                        </Box>
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
        </Box>
    );
}
