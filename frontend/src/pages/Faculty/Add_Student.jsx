import React, { useContext, useState } from "react";
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
        course: "",
        contact: "",
        gender: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        if (!form.enrolno.trim()) return "Enrollment number is required";
        if (!form.fullName.trim()) return "Full name is required";
        if (!form.email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Enter a valid email";
        if (!form.course.trim()) return "Course is required";
        if (!form.contact.trim()) return "Contact is required";
        if (!/^\d{10}$/.test(form.contact)) return "Contact must be 10 digits";
        if (!form.gender) return "Gender is required";
        if (!form.address.trim()) return "Address is required";
        return null;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return toast.error(err);

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
            // navigate("/faculty-dashboard/student-list");
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={onSubmit} sx={{ p: 3, maxWidth: 900 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>Add Student</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField label="Enrollment No" name="enrolno" value={form.enrolno} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField type="email" label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Course" name="course" value={form.course} onChange={handleChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Contact" name="contact" value={form.contact} onChange={handleChange} fullWidth required inputProps={{ maxLength: 10 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField select label="Gender" name="gender" value={form.gender} onChange={handleChange} fullWidth required>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth required multiline minRows={3} />
                </Grid>
            </Grid>

            <Box mt={3} display="flex" gap={2}>
                <Button type="submit" variant="contained" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            </Box>
        </Box>
    );
}
