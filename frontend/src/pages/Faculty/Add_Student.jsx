import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api";

export default function Add_Student() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [form, setForm] = useState({
        enrolno: "",
        fullName: "",
        email: "",
        password: "",
        course: "",
        contact: "",
        gender: "",
        address: "",
        university: ""
    });
    const [loading, setLoading] = useState(false);
    const [universities, setUniversities] = useState([]);
    const [fetchingUnis, setFetchingUnis] = useState(true);
    // 1. Add a new state for courses
    const [courses, setCourses] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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

    // 2. Fetch universities on initial load
    useEffect(() => {
        fetchUniversities();
    }, []);

    // 3. Add a new useEffect to fetch courses when the selected university changes
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
            const res = await fetch(`${API_BASE}/faculty/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(form),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Failed to add student");
            toast.success("Student added successfully");
            setForm({
                enrolno: "",
                fullName: "",
                email: "",
                password: "",
                course: "",
                contact: "",
                gender: "",
                address: "",
                university: ""
            });
            // navigate("/faculty-dashboard/student-list");
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={onSubmit} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={700} mb={2}>Add Student</Typography>
            <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                    <TextField label="Enrollment No" name="enrolno" value={form.enrolno} onChange={handleChange} fullWidth variant="standard" />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} fullWidth variant="standard" />
                </Grid>
                <Grid item xs={12}>
                    <TextField type="email" label="Email" name="email" value={form.email} onChange={handleChange} fullWidth variant="standard" />
                </Grid>
                <Grid item xs={12}>
                    <TextField type="password" label="Password" name="password" value={form.password} onChange={handleChange} fullWidth variant="standard" />
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Contact" name="contact" value={form.contact} onChange={handleChange} fullWidth inputProps={{ maxLength: 10 }} variant="standard" />
                </Grid>
                <Grid item xs={12}>
                    <TextField select label="Gender" name="gender" value={form.gender} onChange={handleChange} fullWidth variant="standard">
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField select label={fetchingUnis ? "Loading Universities..." : "University"} name="university" value={form.university} onChange={handleChange} fullWidth variant="standard" disabled={fetchingUnis || universities.length === 0}>
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
                        variant="standard"
                        disabled={!form.university || courses.length === 0}
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
                    <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth multiline minRows={3} variant="standard" />
                </Grid>
            </Grid>

            <Box mt={3} display="flex" gap={2}>
                <Button type="submit" variant="contained" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            </Box>
        </Box>
    );
}