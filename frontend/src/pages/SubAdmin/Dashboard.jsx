import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DescriptionIcon from '@mui/icons-material/Description';

// Import Chart components and dependencies
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE = 'http://localhost:5000/api';

export default function SubAdminDashboard() {
    const { token } = useContext(AuthContext);
    const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

    const [loading, setLoading] = useState(true);
    const [facultyCount, setFacultyCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);
    const [documentCount, setDocumentCount] = useState(0);

    const fetchCounts = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Fetch all 
            // const facRes = await fetch(`${API_BASE}/admin/users`, { headers: { ...authHeader } });
            // const facJson = await facRes.json();
            // if (facRes.ok && typeof facJson?.count === 'number') {
            //     setFacultyCount(facJson.count);
            // }

            // Fetch faculty count (subadmin scope)
            const facRes = await fetch(`${API_BASE}/faculty/count`, { headers: { ...authHeader } });
            const facJson = await facRes.json();
            if (facRes.ok && typeof facJson?.count === 'number') {
                setFacultyCount(facJson.count);
            }

            // Fetch student count
            const stuRes = await fetch(`${API_BASE}/faculty/students/count`, { headers: { ...authHeader } });
            const stuJson = await stuRes.json();
            if (stuRes.ok && typeof stuJson?.count === 'number') {
                setStudentCount(stuJson.count);
            }

            // Fetch document count
            const docRes = await fetch(`${API_BASE}/documents/count`, { headers: { ...authHeader } });
            const docJson = await docRes.json();
            if (docRes.ok && typeof docJson?.count === 'number') {
                setDocumentCount(docJson.count);
            }
        } catch (error) {
            console.error("Failed to fetch counts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCounts();
    }, [token, authHeader]);

    // Common styles for the cards
    const cardStyles = {
        p: 3,
        color: 'white',
        borderRadius: '12px',
        height: '150px',
        width: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    };

    // Data for the new Doughnut chart
    const countsChartData = {
        labels: ["Faculties", "Students", "Documents"],
        datasets: [{
            data: [facultyCount, studentCount, documentCount],
            backgroundColor: [
                '#1cc88a', // Green for Faculties
                '#f6c23e', // Yellow for Students
                '#36b9cc', // Blue/Cyan for Documents
            ],
            hoverBackgroundColor: [
                '#17a673',
                '#d89d14',
                '#2c9faf',
            ],
            borderColor: '#fff',
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (

        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>Admin Dashboard</Typography>

            {loading ? (
                <Box sx={{ py: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ ...cardStyles, bgcolor: '#1cc88a' }}>
                            <PeopleAltIcon sx={{ fontSize: '3rem', mb: 1 }} />
                            <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Faculties</Typography>
                            <Typography variant="h6" fontWeight={700}>{facultyCount}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ ...cardStyles, bgcolor: '#f6c23e' }}>
                            <PersonIcon sx={{ fontSize: '3rem', mb: 1 }} />
                            <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Students</Typography>
                            <Typography variant="h6" fontWeight={700}>{studentCount}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ ...cardStyles, bgcolor: '#36b9cc' }}>
                            <DescriptionIcon sx={{ fontSize: '3rem', mb: 1 }} />
                            <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Documents</Typography>
                            <Typography variant="h6" fontWeight={700}>{documentCount}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Doughnut Chart on the right */}
            <Grid item xs={12} md={6} sx={{ mt: 5 }}>
                {!loading && (facultyCount + studentCount + documentCount > 0) && (
                    <Box sx={{ maxWidth: '400px', width: '100%', height: 400 }}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" fontWeight={700} mb={2}>Overall Distribution</Typography>
                            <Box sx={{ flexGrow: 1, width: '100%' }}>
                                <Doughnut data={countsChartData} options={chartOptions} />
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Grid>

            {/* Display message if no data */}
            {!loading && (facultyCount + studentCount + documentCount === 0) && (
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Typography textAlign="center" mt={4} color="text.secondary">
                        No data available for the chart.
                    </Typography>
                </Grid>
            )}

        </Box>
    );
}