import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    MenuItem,
    TextField,
    Typography,
    useTheme,
    useMediaQuery,
    Paper,
    IconButton,
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

// *** Image import - Make sure this path is correct ***
import studentImage from './../../assets/images/student-add.png';

const API_BASE = "http://localhost:5000/api";

export default function Add_Student() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [form, setForm] = useState({
        enrolno: "",
        fullName: "",
        email: "",
        course: "",
        contact: "",
        gender: "",
        address: "",
        university: ""
    });
    const [loading, setLoading] = useState(false);
    const [universities, setUniversities] = useState([]);
    const [fetchingUnis, setFetchingUnis] = useState(true);
    const [courses, setCourses] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Reset course when university changes
        if (name === "university") {
            setForm(prev => ({ ...prev, course: "", [name]: value }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validate = () => {
        if (!form.enrolno.trim()) return toast.error("Enrollment number is required");
        if (!form.fullName.trim()) return toast.error("Full name is required");
        if (!form.email.trim()) return toast.error("Email is required");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error("Enter a valid email");
        if (!form.contact.trim()) return toast.error("Contact is required");
        if (!/^\d{10}$/.test(form.contact)) return toast.error("Contact must be 10 digits");
        if (!form.gender) return toast.error("Gender is required");
        if (!form.university) return toast.error("University is required");
        if (!form.course) return toast.error("Course is required");
        if (!form.address.trim()) return toast.error("Address is required");
        return null;
    };

    const fetchUniversities = async () => {
        setFetchingUnis(true);
        try {
            const res = await fetch(`${API_BASE}/universities`);
            const data = await res.json();
            if (res.ok) {
                setUniversities(Array.isArray(data) ? data : []);
            }
        } catch (e) {
            toast.error("Failed to fetch universities.");
        } finally {
            setFetchingUnis(false);
        }
    };

    useEffect(() => {
        fetchUniversities();
    }, []);

    useEffect(() => {
        const selectedUniversity = universities.find(u => u.name === form.university);

        if (selectedUniversity) {
            if (selectedUniversity.courses && selectedUniversity.courses.length > 0) {
                setCourses(selectedUniversity.courses);
            } else {
                setCourses([]);
            }
        } else {
            setCourses([]);
        }
    }, [form.university, universities]);

    const onSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return;

        setLoading(true);
        try {
            const payload = {
                enrolno: String(form.enrolno || "").trim(),
                fullName: String(form.fullName || "").trim(),
                email: String(form.email || "").trim(),
                course: String(form.course || "").trim(),
                contact: String(form.contact || "").trim(),
                gender: String(form.gender || "").toLowerCase(),
                address: String(form.address || "").trim(),
            };

            const res = await fetch(`${API_BASE}/faculty/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Failed to add student");

            toast.success("Student added successfully");
            setForm({
                enrolno: "",
                fullName: "",
                email: "",
                course: "",
                contact: "",
                gender: "",
                address: "",
                university: ""
            });
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                p: isMobile ? 2 : 4,
                flexGrow: 1,
            }}
        >
            <Box sx={{
                maxWidth: 850,
                margin: '0 auto',
                py: isMobile ? 3 : 5,
            }}>
                <Paper elevation={4} sx={{ p: 0, borderRadius: 2 }}>
                    <Grid
                        container
                        spacing={0}
                        justifyContent="center"
                        alignItems="stretch"
                    >

                        {/* 1. Form Section (Left) */}
                        <Grid item xs={12} md={6}>

                            <Box component="form" onSubmit={onSubmit} sx={{
                                p: isMobile ? 3 : 5,
                                height: '100%',
                                position: 'relative'
                            }}>


                                <IconButton
                                    aria-label="add student icon"
                                    color="primary"
                                    size="large"
                                    sx={{
                                        position: 'absolute',
                                        top: isMobile ? 16 : 24,
                                        right: isMobile ? 16 : 24,
                                    }}
                                >
                                    <PersonAddIcon fontSize="large" />
                                </IconButton>

                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    mb={isMobile ? 3 : 4}
                                    color="primary.main"
                                >
                                    Add New Student
                                </Typography>

                                <Grid container spacing={isMobile ? 2 : 3} direction="column">
                                    <Grid item xs={12}>
                                        <TextField label="Enrollment No" name="enrolno" value={form.enrolno} onChange={handleChange} fullWidth size="small" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} fullWidth size="small" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField type="email" label="Email" name="email" value={form.email} onChange={handleChange} fullWidth size="small" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField label="Contact" name="contact" value={form.contact} onChange={handleChange} fullWidth inputProps={{ maxLength: 10 }} size="small" />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField select label="Gender" name="gender" value={form.gender} onChange={handleChange} fullWidth size="small">
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField select label={fetchingUnis ? "Loading Universities..." : "University"} name="university" value={form.university} onChange={handleChange} fullWidth disabled={fetchingUnis || universities.length === 0} size="small">
                                            {universities.map((u) => (
                                                <MenuItem key={u._id} value={u.name}>
                                                    {u.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            select
                                            label="Course"
                                            name="course"
                                            value={form.course}
                                            onChange={handleChange}
                                            fullWidth

                                            disabled={!form.university || courses.length === 0}
                                            size="small"
                                        >
                                            {courses.length > 0 ? (
                                                courses.map((c) => (
                                                    <MenuItem key={c} value={c}>
                                                        {c}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem disabled>Select a University first</MenuItem>
                                            )}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth multiline minRows={3} />
                                    </Grid>

                                </Grid>

                                {/* Action Buttons */}
                                <Box mt={isMobile ? 3 : 4} display="flex" gap={2} justifyContent="flex-start">
                                    <Button type="submit" variant="contained" size="large" disabled={loading}>{loading ? "Saving..." : "Save Student"}</Button>
                                    <Button variant="outlined" color="secondary" size="large" onClick={() => navigate(-1)}>Cancel</Button>
                                </Box>
                            </Box>
                        </Grid>

                        {/* 2. Image Section (Right) - md={6} */}
                        <Grid item xs={12} md={6} sx={{
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: theme.palette.primary.light + '10',
                            borderTopRightRadius: 8,
                            borderBottomRightRadius: 8,
                        }}>
                            <Box sx={{
                                width: '100%',
                                maxWidth: 400,
                                p: 3,
                            }}>
                                <img
                                    src={studentImage}
                                    alt="Student Form Illustration"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                />
                            </Box>
                        </Grid>

                    </Grid>
                </Paper>
            </Box>
        </Box>
    );
}
