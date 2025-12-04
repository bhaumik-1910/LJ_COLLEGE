// import React, { useEffect, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Typography, Box, Grid, Paper } from "@mui/material";
// import { AuthContext } from "../../context/AuthContext";

// // Import icons
// import PersonIcon from '@mui/icons-material/Person';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
// import SchoolIcon from '@mui/icons-material/School';
// import DescriptionIcon from '@mui/icons-material/Description';

// import { Doughnut, Line } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);


// // const API_BASE = "http://localhost:5000/api";
// const API_BASE = import.meta.env.VITE_API_BASE;

// export default function SuperAdminDashboard() {
//     const navigate = useNavigate();
//     const { token } = useContext(AuthContext);

//     // const [uniForm, setUniForm] = useState({ name: "", email: "", otp: "" });
//     // const [otpSent, setOtpSent] = useState(false);
//     // const [verified, setVerified] = useState(false);

//     const [universities, setUniversities] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [institutionCount, setInstitutionCount] = useState(0);

//     const [docCount, setDocCount] = useState(0);
//     const [monthly, setMonthly] = useState({
//         year: new Date().getFullYear(),
//         months: Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }))
//     });

//     const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

//     useEffect(() => {
//         const role = localStorage.getItem("role");
//         if (role !== "superadmin") {
//             navigate("/login");
//         }
//     }, [navigate]);

//     const fetchUniversities = async () => {
//         try {
//             const res = await fetch(`${API_BASE}/universities`);
//             const data = await res.json();
//             if (res.ok) setUniversities(Array.isArray(data) ? data : []);
//         } catch { }
//     };

//     const fetchUsers = async () => {
//         try {
//             const res = await fetch(`${API_BASE}/superadmin/users`, { headers: { ...authHeader } });
//             const data = await res.json();
//             if (res.ok) setUsers(Array.isArray(data) ? data : []);
//         } catch { }
//     };

//     const fetchDocCount = async () => {
//         try {
//             const res = await fetch(`${API_BASE}/superadmin/documents/count`, { headers: { ...authHeader } });
//             const data = await res.json();
//             if (res.ok) setDocCount(Number(data.count || 0));
//         } catch { }
//     };

//     const fetchMonthly = async () => {
//         try {
//             const res = await fetch(`${API_BASE}/superadmin/documents/stats/monthly`, { headers: { ...authHeader } });
//             const data = await res.json();
//             if (res.ok && data?.months) setMonthly({ year: data.year, months: data.months });
//         } catch { }
//     };

//     const fetchInstitutionCount = async () => {
//         try {
//             const res = await fetch(`${API_BASE}/institutions/count`, { headers: { ...authHeader } });
//             const data = await res.json();
//             if (res.ok && data.success) { setInstitutionCount(data.count); }
//         } catch (error) {
//             console.error('Error fetching institution count:', error);
//         }
//     };

//     useEffect(() => {
//         fetchUniversities();
//         fetchUsers();
//         fetchDocCount();
//         fetchMonthly();
//         fetchInstitutionCount();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);


//     // Derived totals
//     const totalUsers = users.length;
//     const totalSuperAdmins = users.filter((u) => String(u.role).toLowerCase() === "superadmin").length;
//     const totalAdmins = users.filter((u) => String(u.role).toLowerCase() === "admin").length;
//     const totalFaculty = users.filter((u) => String(u.role).toLowerCase() === "faculty").length;
//     const totalUniversities = universities.length;
//     const totalOtherUsers = totalUsers - (totalAdmins + totalFaculty);
//     const totalInstitutions = institutionCount;

//     // Data for the charts
//     const usersChartData = {
//         labels: ["Super Admins", "Admins", "Faculty", "Other Users"],
//         datasets: [{
//             data: [totalSuperAdmins, totalAdmins, totalFaculty, totalOtherUsers],
//             backgroundColor: [
//                 "rgba(255, 99, 132, 0.6)",
//                 "rgba(54, 162, 235, 0.6)",
//                 "rgba(255, 206, 86, 0.6)",
//                 "rgba(126, 108, 64, 0.6)",
//             ],
//             borderColor: [
//                 "rgba(255, 99, 132, 1)",
//                 "rgba(54, 162, 235, 1)",
//                 "rgba(255, 206, 86, 1)",
//                 "rgba(126, 108, 64, 1)",
//             ],
//             borderWidth: 1,
//         }],
//     };

//     // In a real-world scenario, you might want to show more data for universities, but here we'll just show the total
//     const universityChartData = {
//         labels: ["Universities", "Institutions"],
//         datasets: [{
//             data: [totalUniversities, totalInstitutions],
//             backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
//             borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
//             borderWidth: 1,
//         }],
//     };

//     // Chart options to make them look better and display text inside the center
//     const chartOptions = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             tooltip: {
//                 callbacks: {
//                     label: (context) => {
//                         const label = context.label || '';
//                         const value = context.parsed;
//                         return `${label}: ${value}`;
//                     },
//                 },
//             },
//         },
//     };

//     const monthlyChartData = {
//         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//         datasets: [{
//             label: `Documents in ${monthly.year}`,
//             data: monthly.months.map(m => m.count),
//             borderColor: "rgba(54, 162, 235, 1)",
//             backgroundColor: "rgba(54, 162, 235, 0.2)",
//             tension: 0.25,
//             fill: true,
//         }]
//     };

//     const lineOptions = {
//         responsive: true,
//         plugins: { legend: { position: 'top' } },
//         scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
//     };

//     // Common styles for the cards
//     // const cardStyles = {
//     //     p: 3,
//     //     color: 'white',
//     //     borderRadius: '12px',
//     //     height: '100%',
//     //     display: 'flex',
//     //     flexDirection: 'column',
//     //     justifyContent: 'center',
//     //     alignItems: 'center',
//     //     textAlign: 'center',
//     // };
//     const cardStyles = {
//         p: 3,
//         color: "white",
//         borderRadius: "12px",
//         height: "200px",
//         width: '250px',
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         textAlign: "center",
//         gap: 1,
//         boxShadow: 3,
//         "& svg": { fontSize: "3rem" }
//     };


//     return (
//         <Box sx={{ p: 4 }}>
//             <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: "#2b4ddb" }}>
//                 Super Dashboard
//             </Typography>

//             {/* ROW 1 : 4 CARDS */}
//             <Grid container spacing={6} justifyContent="center">
//                 {[
//                     { label: "Total Super Admins", value: totalSuperAdmins, icon: <AdminPanelSettingsIcon />, color: "#4e73df" },
//                     { label: "Total Admins", value: totalAdmins, icon: <AdminPanelSettingsIcon />, color: "#4e73df" },
//                     { label: "Total Faculty", value: totalFaculty, icon: <PeopleAltIcon />, color: "#1cc88a" },
//                     { label: "Total Users", value: totalUsers, icon: <PersonIcon />, color: "#f6c23e" }
//                 ].map((card, i) => (
//                     <Grid key={i} item xs={12} sm={6} md={3}>
//                         <Paper sx={{ ...cardStyles, bgcolor: card.color }}>
//                             {card.icon}
//                             <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>{card.label}</Typography>
//                             <Typography variant="h5" fontWeight={700}>{card.value}</Typography>
//                         </Paper>
//                     </Grid>
//                 ))}
//             </Grid>

//             {/* ROW 2 : CENTERED 3 CARDS */}
//             <Grid container spacing={6} justifyContent="center" sx={{ mt: 4 }}>
//                 {[
//                     { label: "Total Universities", value: totalUniversities, icon: <SchoolIcon />, color: "#e74a3b" },
//                     { label: "Total Institutions", value: totalInstitutions, icon: <SchoolIcon />, color: "#52211d" },
//                     { label: "Total Documents", value: docCount, icon: <DescriptionIcon />, color: "#36b9cc" }
//                 ].map((card, i) => (
//                     <Grid key={i} item xs={12} sm={6} md={4}>
//                         <Paper sx={{ ...cardStyles, bgcolor: card.color }}>
//                             {card.icon}
//                             <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>{card.label}</Typography>
//                             <Typography variant="h5" fontWeight={700}>{card.value}</Typography>
//                         </Paper>
//                     </Grid>
//                 ))}
//             </Grid>

//             {/* ROW 3 : TWO CENTERED DOUGHNUT CHARTS */}
//             <Grid container
//                 spacing={8}
//                 mb={3}
//                 mt={5}
//                 justifyContent="center"

//             >
//                 <Grid item xs={12} md={12} sx={{ width: '450px', height: '450px' }}>
//                     <Paper sx={{ p: 2, bgcolor: '#fff' }}>
//                         <Typography variant="h6" mb={2} textAlign="center">User Distribution by Role</Typography>
//                         <Box sx={{ width: '80%', margin: 'auto' }}>
//                             <Doughnut data={usersChartData} options={chartOptions} />
//                         </Box>
//                     </Paper>
//                 </Grid>
//                 <Grid item xs={12} md={6} sx={{ width: '450px', height: '450px' }}>
//                     <Paper sx={{ p: 2, bgcolor: '#fff' }}>
//                         <Typography variant="h6" mb={2} textAlign="center">University Count</Typography>
//                         <Box sx={{ width: '80%', margin: 'auto' }}>
//                             <Doughnut data={universityChartData} options={chartOptions} />
//                             {/* <Typography variant="h4" sx={{ textAlign: 'center', mt: 2 }}>
//                                 {totalUniversities}
//                             </Typography> */}
//                         </Box>
//                     </Paper>
//                 </Grid>
//             </Grid>

//             {/* ROW 4 : MONTHLY LINE CHART CENTERED */}
//             <Grid container
//                 // spacing={3}
//                 // mb={4}
//                 justifyContent="center"
//             >
//                 <Grid item xs={12} md={6} sx={{ width: '600px', height: '900px' }}>
//                     {/* <Paper sx={{ p: 2 }}> */}
//                     <Typography variant="h6" mb={2} textAlign="center">Monthly Documents</Typography>
//                     {/* <Box sx={{ width: '100%', margin: 'auto' }}> */}
//                     <Line data={monthlyChartData} options={lineOptions} />
//                     {/* </Box>  */}
//                     {/* </Paper> */}
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// }


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
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

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
    const totalSuperAdmins = users.filter((u) => String(u.role).toLowerCase() === "superadmin").length;
    const totalAdmins = users.filter((u) => String(u.role).toLowerCase() === "admin").length;
    const totalFaculty = users.filter((u) => String(u.role).toLowerCase() === "faculty").length;
    const totalUniversities = universities.length;
    const totalOtherUsers = totalUsers - (totalAdmins + totalFaculty);
    const totalInstitutions = institutionCount;

    // Data for the charts
    const usersChartData = {
        labels: ["Super Admins", "Admins", "Faculty", "Other Users"],
        datasets: [{
            data: [totalSuperAdmins, totalAdmins, totalFaculty, totalOtherUsers],
            backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(126, 108, 64, 0.6)",
            ],
            borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(126, 108, 64, 1)",
            ],
            borderWidth: 1,
        }],
    };

    // In a real-world scenario, you might want to show more data for universities, but here we'll just show the total
    const universityChartData = {
        labels: ["Universities", "Institutions"],
        datasets: [{
            data: [totalUniversities, totalInstitutions],
            backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
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
    // const cardStyles = {
    //     p: 3,
    //     color: 'white',
    //     borderRadius: '12px',
    //     height: '100%',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     textAlign: 'center',
    // };
    const cardStyles = {
        p: 3,
        color: "white",
        borderRadius: "12px",
        height: "150px",
        width: '200px',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 1,
        boxShadow: 3,
        "& svg": { fontSize: "3rem" }
    };


    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: "#2b4ddb" }}>
                Super Dashboard
            </Typography>

            {/* ROW 1 : 4 CARDS */}
            <Grid container spacing={5} justifyContent="center">
                {[
                    { label: "Total Super Admins", value: totalSuperAdmins, icon: <AdminPanelSettingsIcon />, color: "#4e73df" },
                    { label: "Total Admins", value: totalAdmins, icon: <SupervisorAccountIcon />, color: "#4e73df" },
                    { label: "Total Faculty", value: totalFaculty, icon: <PeopleAltIcon />, color: "#1cc88a" },
                    { label: "Total Users", value: totalUsers, icon: <PersonIcon />, color: "#f6c23e" }
                ].map((card, i) => (
                    <Grid key={i} item xs={12} sm={6} md={3}>
                        <Paper sx={{ ...cardStyles, bgcolor: card.color }}>
                            {card.icon}
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>{card.label}</Typography>
                            <Typography variant="h5" fontWeight={700}>{card.value}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* ROW 2 : CENTERED 3 CARDS */}
            <Grid container spacing={5} justifyContent="center" sx={{ mt: 4 }}>
                {[
                    { label: "Total Universities", value: totalUniversities, icon: <SchoolIcon />, color: "#e74a3b" },
                    { label: "Total Institutions", value: totalInstitutions, icon: <SchoolIcon />, color: "#52211d" },
                    { label: "Total Documents", value: docCount, icon: <DescriptionIcon />, color: "#36b9cc" }
                ].map((card, i) => (
                    <Grid key={i} item xs={12} sm={6} md={4}>
                        <Paper sx={{ ...cardStyles, bgcolor: card.color }}>
                            {card.icon}
                            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>{card.label}</Typography>
                            <Typography variant="h5" fontWeight={700}>{card.value}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* ROW 3 : TWO CENTERED DOUGHNUT CHARTS */}
            <Grid
                container
                spacing={4}
                // mb={3}
                mt={3}
                justifyContent="center"
            >
                {/* PIE CHART 1 */}
                <Grid item xs={12} md={6} sx={{ width: '450px', height: '450px' }}>
                    <Paper sx={{ p: 2, bgcolor: '#fff' }}>
                        <Typography variant="h6" mb={2} textAlign="center">
                            User Distribution by Role
                        </Typography>
                        <Box sx={{ width: "80%", mx: "auto" }}>
                            <Doughnut data={usersChartData} options={chartOptions} />
                        </Box>
                    </Paper>
                </Grid>

                {/* PIE CHART 2 */}
                <Grid item xs={12} md={6} sx={{ width: '450px', height: '450px' }}>
                    <Paper sx={{ p: 2, bgcolor: '#fff' }}>
                        <Typography variant="h6" mb={2} textAlign="center">
                            University Count
                        </Typography>
                        <Box sx={{ width: "80%", mx: "auto" }}>
                            <Doughnut data={universityChartData} options={chartOptions} />
                        </Box>
                    </Paper>
                </Grid>

                {/* MONTHLY LINE CHART */}
                {/* <Grid item xs={12} md={8} >
                    <Paper sx={{ p: 2, bgcolor: '#fff' }}>
                        <Typography variant="h6" mb={2} textAlign="center">
                            Monthly Documents
                        </Typography>
                        <Line data={monthlyChartData} options={lineOptions} />
                    </Paper>
                </Grid> */}
            </Grid>
        </Box>
    );
}
