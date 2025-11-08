import React, { useEffect, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Grid, Paper, CircularProgress } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DescriptionIcon from '@mui/icons-material/Description';

const API_BASE = "http://localhost:5000/api";

export default function FacultyDashboard() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [studentCount, setStudentCount] = useState(0);
    const [documentCount, setDocumentCount] = useState(0);
    const [monthly, setMonthly] = useState([]); // [{ month: 1..12, count }]

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "faculty") {
            navigate("/login");
            return;
        }

        const fetchAll = async () => {
            setLoading(true);
            setError("");
            try {
                const [sRes, dRes, mRes] = await Promise.all([
                    fetch(`${API_BASE}/faculty/students/count`, { headers: { ...authHeader } }),
                    fetch(`${API_BASE}/documents/count`, { headers: { ...authHeader } }),
                    fetch(`${API_BASE}/documents/stats/monthly`, { headers: { ...authHeader } }),
                ]);

                const sData = await sRes.json();
                const dData = await dRes.json();
                const mData = await mRes.json();

                if (!sRes.ok) throw new Error(sData.message || "Failed to fetch students count");
                if (!dRes.ok) throw new Error(dData.message || "Failed to fetch documents count");
                if (!mRes.ok) throw new Error(mData.message || "Failed to fetch monthly stats");

                setStudentCount(Number(sData.count || 0));
                setDocumentCount(Number(dData.count || 0));
                setMonthly(Array.isArray(mData.months) ? mData.months : []);
            } catch (e) {
                setError(e.message || "Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currentYear = new Date().getFullYear();

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

    const chart = useMemo(() => {
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const map = new Map(monthly.map(m => [m.month, m.count]));
        const values = months.map(m => map.get(m) || 0);
        const maxVal = Math.max(1, ...values);
        return { months, values, maxVal };
    }, [monthly]);

    const Chart = () => {
        const width = 600;
        const height = 260;
        const padding = { left: 30, right: 10, top: 10, bottom: 30 };
        const innerW = width - padding.left - padding.right;
        const innerH = height - padding.top - padding.bottom;
        const barGap = 8;
        const barW = Math.max(8, Math.floor((innerW - barGap * 11) / 12));

        return (
            <svg width={width} height={height} role="img" aria-label="Monthly documents">
                <g transform={`translate(${padding.left},${padding.top})`}>
                    {chart.values.map((v, i) => {
                        const h = Math.round((v / chart.maxVal) * innerH);
                        const x = i * (barW + barGap);
                        const y = innerH - h;
                        return (
                            <g key={i}>
                                <rect x={x} y={y} width={barW} height={h} fill="#4e73df" rx="4" />
                                <text x={x + barW / 2} y={innerH + 16} textAnchor="middle" fontSize="10" fill="#666">
                                    {i + 1}
                                </text>
                                {v > 0 && (
                                    <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize="10" fill="#333">
                                        {v}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                    <line x1={0} y1={innerH} x2={innerW} y2={innerH} stroke="#ddd" />
                </g>
            </svg>
        );
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>Faculty Dashboard</Typography>

            {loading ? (
                <Box display="flex" alignItems="center" gap={2}><CircularProgress size={20} /> Loading...</Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : (
                <>
                    <Grid container spacing={4} mb={4}>
                        <Grid item xs={12} sm={6} md={3} sx={{ minWidth: '220px' }}>
                            <Paper sx={{ ...cardStyles, bgcolor: '#1cc88a' }}>
                                <PeopleAltIcon sx={{ fontSize: '3rem', mb: 1 }} />
                                <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Students</Typography>
                                <Typography variant="h5" fontWeight={700}>{studentCount}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} sx={{ minWidth: '220px' }}>
                            <Paper sx={{ ...cardStyles, bgcolor: '#4e73df' }}>
                                <DescriptionIcon sx={{ fontSize: '3rem', mb: 1 }} />
                                <Typography variant="subtitle2" color="white" sx={{ opacity: 0.8 }}>Total Documents</Typography>
                                <Typography variant="h5" fontWeight={700}>{documentCount}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={7}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" mb={2}>Monthly Documents (Year {new Date().getFullYear()})</Typography>
                                <Chart />
                            </Paper>
                        </Grid>
                    </Grid> */}

                    <Grid container spacing={3}>
                        {/* Chart 1 */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography
                                    variant="h6"
                                    mb={2}
                                    sx={{ textAlign: { xs: "center", md: "left" } }}
                                >
                                    Monthly Documents (Year {currentYear})
                                </Typography>
                                <Chart />
                            </Paper>
                        </Grid>

                        {/* Chart 2 */}
                        {/* <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography
                                    variant="h6"
                                    mb={2}
                                    sx={{ textAlign: { xs: "center", md: "left" } }}
                                >
                                    Documents by Department (Year {currentYear})
                                </Typography>
                                <Chart />
                            </Paper>
                        </Grid> */}
                    </Grid>
                </>
            )}
        </Box>
    );
}