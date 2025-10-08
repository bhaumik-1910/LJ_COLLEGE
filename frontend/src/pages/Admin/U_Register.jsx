// import React, { useEffect, useState } from "react";
// import { Box, Paper, Typography, TextField, Button, Divider, List, ListItem, ListItemText, Grid } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const API_BASE = "http://localhost:5000/api";

// export default function U_Register() {
//     const navigate = useNavigate();

//     const [form, setForm] = useState({ email: "", otp: "", name: "" });
//     const [otpSent, setOtpSent] = useState(false);
//     const [verified, setVerified] = useState(false);
//     const [universities, setUniversities] = useState([]);

//     useEffect(() => {
//         const role = localStorage.getItem("role");
//         if (role !== "admin") navigate("/login");
//     }, [navigate]);

//     const loadUniversities = async () => {
//         try {
//             const res = await fetch(`${API_BASE}/universities`);
//             const data = await res.json();
//             if (res.ok) setUniversities(Array.isArray(data) ? data : []);
//         } catch { }
//     };

//     useEffect(() => {
//         loadUniversities();
//     }, []);

//     const sendOtp = async () => {
//         if (!form.email) return toast.error("Enter university email");
//         try {
//             const res = await fetch(`${API_BASE}/universities/send-otp`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email: form.email }),
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || "Failed to send OTP");
//             setOtpSent(true);
//             toast.success("OTP sent");
//         } catch (e) {
//             toast.error(e.message);
//         }
//     };

//     const verifyOtp = async () => {
//         if (!form.email || !form.otp) return toast.error("Enter email and OTP");
//         try {
//             const res = await fetch(`${API_BASE}/universities/verify-otp`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email: form.email, otp: form.otp }),
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || "OTP verification failed");
//             setVerified(true);
//             toast.success("Email verified");
//         } catch (e) {
//             toast.error(e.message);
//         }
//     };

//     const createUniversity = async () => {
//         if (!verified) return toast.error("Verify email via OTP first");
//         if (!form.name) return toast.error("Enter university name");
//         try {
//             const res = await fetch(`${API_BASE}/universities`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ name: form.name, email: form.email }),
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || "Failed to create university");
//             toast.success("University created");
//             setForm({ email: "", otp: "", name: "" });
//             setOtpSent(false);
//             setVerified(false);
//             await loadUniversities();
//         } catch (e) {
//             toast.error(e.message);
//         }
//     };

//     return (
//         <Box sx={{ p: 3 }}>
//             <Grid container spacing={2} sx={{ p: 2, maxWidth: 500, mx: "auto" }}>
//                 <Typography variant="h5" fontWeight={600} mb={2}>
//                     University Registration (Admin)
//                 </Typography>

//                 <TextField
//                     fullWidth
//                     label="University Email"
//                     variant="standard"
//                     value={form.email}
//                     onChange={(e) => setForm({ ...form, email: e.target.value })}
//                     sx={{ mb: 2 }}
//                 />
//                 <Box>
//                     <Button variant="outlined" onClick={sendOtp}>Send OTP</Button>


//                     {otpSent && (
//                         <>
//                             <TextField
//                                 fullWidth
//                                 label="Enter OTP"
//                                 variant="standard"
//                                 value={form.otp}
//                                 onChange={(e) => setForm({ ...form, otp: e.target.value })}
//                                 sx={{ mb: 2 }}
//                             />
//                             <Button variant="contained" onClick={verifyOtp}>Verify</Button>
//                         </>
//                     )}
//                 </Box>

//                 <Divider sx={{ my: 2 }} />

//                 <TextField
//                     fullWidth
//                     label="University Name"
//                     variant="standard"
//                     value={form.name}
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                     sx={{ mb: 2 }}
//                 />
//                 <Button variant="contained" onClick={createUniversity}>Create University</Button>
//             </Grid>
//         </Box>
//     );
// }
import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Grid,
    IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const API_BASE = "http://localhost:5000/api";

export default function U_Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", otp: "", name: "", courses: [] });
    const [newCourse, setNewCourse] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") navigate("/login");
    }, [navigate]);

    const loadUniversities = async () => {
        try {
            const res = await fetch(`${API_BASE}/universities`);
            const data = await res.json();
            if (res.ok) setUniversities(Array.isArray(data) ? data : []);
        } catch { }
    };

    useEffect(() => {
        loadUniversities();
    }, []);

    const sendOtp = async () => {
        if (!form.email) return toast.error("Enter university email");
        try {
            const res = await fetch(`${API_BASE}/universities/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to send OTP");
            setOtpSent(true);
            toast.success("OTP sent");
        } catch (e) {
            toast.error(e.message);
        }
    };

    const verifyOtp = async () => {
        if (!form.email || !form.otp) return toast.error("Enter email and OTP");
        try {
            const res = await fetch(`${API_BASE}/universities/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: form.email, otp: form.otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "OTP verification failed");
            setVerified(true);
            toast.success("Email verified");
        } catch (e) {
            toast.error(e.message);
        }
    };

    const handleAddCourse = () => {
        if (newCourse.trim() === "") return;
        setForm((prevForm) => ({
            ...prevForm,
            courses: [...prevForm.courses, newCourse.trim()],
        }));
        setNewCourse("");
    };

    const handleRemoveCourse = (index) => {
        setForm((prevForm) => ({
            ...prevForm,
            courses: prevForm.courses.filter((_, i) => i !== index),
        }));
    };

    const createUniversity = async () => {
        if (!verified) return toast.error("Verify email via OTP first");
        if (!form.name) return toast.error("Enter university name");
        if (form.courses.length === 0) return toast.error("Add at least one course");

        try {
            const res = await fetch(`${API_BASE}/universities`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, courses: form.courses }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create university");
            toast.success("University created");
            setForm({ email: "", otp: "", name: "", courses: [] });
            setOtpSent(false);
            setVerified(false);
            await loadUniversities();
        } catch (e) {
            toast.error(e.message);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={2} sx={{ p: 2, maxWidth: 500, mx: "auto" }}>
                <Typography variant="h5" fontWeight={600} mb={2}>
                    University Registration (Admin)
                </Typography>

                <TextField
                    fullWidth
                    label="University Email"
                    variant="standard"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    sx={{ mb: 2 }}
                />
                <Box>
                    <Button variant="outlined" onClick={sendOtp}>Send OTP</Button>

                    {otpSent && (
                        <>
                            <TextField
                                fullWidth
                                label="Enter OTP"
                                variant="standard"
                                value={form.otp}
                                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <Button variant="contained" onClick={verifyOtp}>Verify</Button>
                        </>
                    )}
                </Box>

                <Divider sx={{ my: 2, width: '100%' }} />

                <TextField
                    fullWidth
                    label="University Name"
                    variant="standard"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
                    <TextField
                        fullWidth
                        label="Add Course"
                        variant="standard"
                        value={newCourse}
                        onChange={(e) => setNewCourse(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCourse();
                            }
                        }}
                    />
                    <IconButton color="primary" onClick={handleAddCourse} sx={{ ml: 1 }}>
                        <AddIcon />
                    </IconButton>
                </Box>

                {form.courses.length > 0 && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <Typography variant="subtitle1" fontWeight={500}>Courses:</Typography>
                        <List dense>
                            {form.courses.map((course, index) => (
                                <Paper key={index} sx={{ mb: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <ListItemText primary={course} />
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveCourse(index)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </Paper>
                            ))}
                        </List>
                    </Box>
                )}

                <Button variant="contained" onClick={createUniversity} sx={{ mt: 2 }}>Create University</Button>
            </Grid>
        </Box>
    );
}