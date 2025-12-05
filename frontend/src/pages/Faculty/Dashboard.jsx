// import React, { useEffect, useContext, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Typography, Box, Grid, Paper, CircularProgress } from "@mui/material";
// import { AuthContext } from "../../context/AuthContext";
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import DescriptionIcon from '@mui/icons-material/Description';
// import DashboardIcon from '@mui/icons-material/Dashboard';

// // const API_BASE = "http://localhost:5000/api";
// const API_BASE = import.meta.env.VITE_API_BASE;

// export default function FacultyDashboard() {
//     const navigate = useNavigate();
//     const { token } = useContext(AuthContext);

//     const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     // const [studentCount, setStudentCount] = useState(0);
//     const [documentCount, setDocumentCount] = useState(0);
//     const [monthly, setMonthly] = useState([]); // [{ month: 1..12, count }]

//     useEffect(() => {
//         const role = localStorage.getItem("role");
//         if (role !== "faculty") {
//             navigate("/login");
//             return;
//         }

//         const fetchAll = async () => {
//             setLoading(true);
//             setError("");
//             try {
//                 const [sRes, dRes, mRes] = await Promise.all([
//                     // fetch(`${API_BASE}/faculty/students/count`, { headers: { ...authHeader } }),
//                     fetch(`${API_BASE}/documents/count`, { headers: { ...authHeader } }),
//                     fetch(`${API_BASE}/documents/stats/monthly`, { headers: { ...authHeader } }),
//                 ]);

//                 // const sData = await sRes.json();
//                 const dData = await dRes.json();
//                 const mData = await mRes.json();

//                 // if (!sRes.ok) throw new Error(sData.message || "Failed to fetch students count");
//                 if (!dRes.ok) throw new Error(dData.message || "Failed to fetch documents count");
//                 if (!mRes.ok) throw new Error(mData.message || "Failed to fetch monthly stats");

//                 // setStudentCount(Number(sData.count || 0));
//                 setDocumentCount(Number(dData.count || 0));
//                 setMonthly(Array.isArray(mData.months) ? mData.months : []);
//             } catch (e) {
//                 setError(e.message || "Failed to load dashboard");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAll();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const currentYear = new Date().getFullYear();

//     const cardStyles = {
//         p: 3,
//         color: 'white',
//         borderRadius: '12px',
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         textAlign: 'center',
//     };

//     const chart = useMemo(() => {
//         const months = Array.from({ length: 12 }, (_, i) => i + 1);
//         const map = new Map(monthly.map(m => [m.month, m.count]));
//         const values = months.map(m => map.get(m) || 0);
//         const maxVal = Math.max(1, ...values);
//         return { months, values, maxVal };
//     }, [monthly]);

//     const Chart = () => {
//         const width = 600;
//         const height = 260;
//         const padding = { left: 30, right: 10, top: 10, bottom: 30 };
//         const innerW = width - padding.left - padding.right;
//         const innerH = height - padding.top - padding.bottom;
//         const barGap = 8;
//         const barW = Math.max(8, Math.floor((innerW - barGap * 11) / 12));

//         return (
//             <svg width={width} height={height} role="img" aria-label="Monthly documents">
//                 <g transform={`translate(${padding.left},${padding.top})`}>
//                     {chart.values.map((v, i) => {
//                         const h = Math.round((v / chart.maxVal) * innerH);
//                         const x = i * (barW + barGap);
//                         const y = innerH - h;
//                         return (
//                             <g key={i}>
//                                 <rect x={x} y={y} width={barW} height={h} fill="#4e73df" rx="4" />
//                                 <text x={x + barW / 2} y={innerH + 16} textAnchor="middle" fontSize="10" fill="#666">
//                                     {i + 1}
//                                 </text>
//                                 {v > 0 && (
//                                     <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="10" fill="#333">
//                                         {v}
//                                     </text>
//                                 )}
//                             </g>
//                         );
//                     })}
//                     <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#ddd" />
//                 </g>
//             </svg>
//         );
//     };

//     return (
//         <Box sx={{ p: 4 }}>
//             <Typography
//                 variant="h5"
//                 fontWeight={700}
//                 color="primary.main"
//                 sx={{ mb: 2 }}
//                 display="flex"
//                 alignItems="center"
//                 gap={1}
//             >
//                 Faculty Dashboard
//                 <DashboardIcon fontSize="large" />
//             </Typography>

//             {loading ? (
//                 <Box display="flex" alignItems="center" gap={2}><CircularProgress size={20} /> Loading...</Box>
//             ) : error ? (
//                 <Typography color="error">{error}</Typography>
//             ) : (
//                 <>
//                     <Grid container spacing={4} mb={4}>
//                         {/* <Grid item xs={12} sm={6} md={3} sx={{ minWidth: '220px' }}>
//                             <Paper sx={{ ...cardStyles, bgcolor: '#1cc88a' }}>
//                                 <PeopleAltIcon sx={{ fontSize: '3rem', mb: 1 }} />
//                                 <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Students</Typography>
//                                 <Typography variant="h5" fontWeight={700}>{studentCount}</Typography>
//                             </Paper>
//                         </Grid> */}
//                         <Grid item xs={12} sm={6} md={3} sx={{ minWidth: '220px' }}>
//                             <Paper sx={{ ...cardStyles, bgcolor: '#4e73df' }}>
//                                 <DescriptionIcon sx={{ fontSize: '3rem', mb: 1 }} />
//                                 <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Documents</Typography>
//                                 <Typography variant="h5" fontWeight={700}>{documentCount}</Typography>
//                             </Paper>
//                         </Grid>
//                     </Grid>

//                     {/* <Grid container spacing={3}>
//                         <Grid item xs={12} md={8} lg={7}>
//                             <Paper sx={{ p: 2 }}>
//                                 <Typography variant="h6" mb={2}>Monthly Documents (Year {new Date().getFullYear()})</Typography>
//                                 <Chart />
//                             </Paper>
//                         </Grid>
//                     </Grid> */}

//                     <Grid container spacing={3}>
//                         {/* Chart 1 */}
//                         <Grid item xs={12} md={6}>
//                             <Paper sx={{ p: 2 }}>
//                                 <Typography
//                                     variant="h6"
//                                     mb={2}
//                                     sx={{ textAlign: { xs: "center", md: "left" } }}
//                                 >
//                                     Monthly Documents (Year {currentYear})
//                                 </Typography>
//                                 <Chart />
//                             </Paper>
//                         </Grid>

//                         {/* Chart 2 */}
//                         {/* <Grid item xs={12} md={6}>
//                             <Paper sx={{ p: 2 }}>
//                                 <Typography
//                                     variant="h6"
//                                     mb={2}
//                                     sx={{ textAlign: { xs: "center", md: "left" } }}
//                                 >
//                                     Documents by Department (Year {currentYear})
//                                 </Typography>
//                                 <Chart />
//                             </Paper>
//                         </Grid> */}
//                     </Grid>
//                 </>
//             )}
//         </Box>
//     );
// }

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

// const API_BASE = 'http://localhost:5000/api';
const API_BASE = import.meta.env.VITE_API_BASE;

export default function FacultyDashboard() {
    const { token } = useContext(AuthContext);
    const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

    const [loading, setLoading] = useState(true);
    const [facultyCount, setFacultyCount] = useState(0);
    // const [studentCount, setStudentCount] = useState(0);
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

            // Fetch faculty count (admin scope)
            // const facRes = await fetch(`${API_BASE}/faculty/count`, { headers: { ...authHeader } });
            // const facJson = await facRes.json();
            // if (facRes.ok && typeof facJson?.count === 'number') {
            //     setFacultyCount(facJson.count);
            // }

            // Fetch student count
            // const stuRes = await fetch(`${API_BASE}/faculty/students/count`, { headers: { ...authHeader } });
            // const stuJson = await stuRes.json();
            // if (stuRes.ok && typeof stuJson?.count === 'number') {
            //     setStudentCount(stuJson.count);
            // }

            // Fetch document count
            const docRes = await fetch(`${API_BASE}/documents/count`, { headers: { ...authHeader } });
            const docJson = await docRes.json();
            if (docRes.ok && typeof docJson?.count === 'number') {
                setDocumentCount(docJson.count);
            }
        } catch (error) {
            toast.error("Failed to fetch counts");
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
        labels: ["Documents"],
        datasets: [{
            data: [facultyCount, documentCount],
            backgroundColor: [
                '#1cc88a', // Green for Faculties
                // '#f6c23e', // Yellow for Students
                // '#36b9cc', // Blue/Cyan for Documents
            ],
            hoverBackgroundColor: [
                '#17a673',
                // '#d89d14',
                // '#2c9faf',
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

        <Box sx={{ p: 5 }}>
            <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: "#2b4ddb" }}>Faculty Dashboard</Typography>

            {loading ? (
                <Box sx={{ py: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {/* <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ ...cardStyles, bgcolor: '#1cc88a' }}>
                            <PeopleAltIcon sx={{ fontSize: '3rem', mb: 1 }} />
                            <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Faculties</Typography>
                            <Typography variant="h6" fontWeight={700}>{/Typography>
                        </Paper>
                    </Grid> */}

                    {/* <Grid item xs={12} sm={6} md={4}>
                        <Paper sx={{ ...cardStyles, bgcolor: '#f6c23e' }}>
                            <PersonIcon sx={{ fontSize: '3rem', mb: 1 }} />
                            <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Students</Typography>
                            <Typography variant="h6" fontWeight={700}>{studentCount}</Typography>
                        </Paper>
                    </Grid> */}

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
                {!loading && (documentCount > 0) && (
                    <Box sx={{ maxWidth: '400px', width: '100%', height: 400 }}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" fontWeight={700} mb={2} align='center'>Overall Distribution</Typography>
                            <Box sx={{ flexGrow: 1, width: '100%' }}>
                                <Doughnut data={countsChartData} options={chartOptions} />
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Grid>

            {/* Display message if no data */}
            {!loading && (documentCount === 0) && (
                <Grid item xs={12} md={6}>
                    <Typography mt={4} color="text.secondary" align='center'>
                        No data available for the chart.
                    </Typography>
                </Grid>
            )}

        </Box>
    );
}