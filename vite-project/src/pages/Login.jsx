import React, { useState } from "react";
import { Box, Grid, Paper, TextField, Button, Typography, FormControlLabel, Checkbox, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (res.ok) {
                toast.success("Login successful!");
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);

                switch (data.role) {
                    case "admin": navigate("/admin-dashboard"); break;
                    case "faculty": navigate("/faculty-dashboard"); break;
                    case "student": navigate("/student-dashboard"); break;
                    default: navigate("/"); break;
                }
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (err) {
            toast.error("Server error");
        }
    };

    return (
        <Grid container sx={{ minHeight: "100vh", bgcolor: "#f5f9ff" }}>
            <Grid item xs={12} md={6}>
                <Box component="img" src="https://cdni.iconscout.com/illustration/premium/thumb/online-education-3428959-2902701.png" sx={{ width: "100%" }} />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Paper sx={{ p: 5, borderRadius: 3, width: "100%", maxWidth: 400 }}>
                    <Typography variant="h6" fontWeight="bold" textAlign="center">UNIVERSITY NAME</Typography>
                    <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} variant="standard" sx={{ mt: 2 }} />
                    <TextField
                        fullWidth label="Password" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} variant="standard" sx={{ mt: 2 }}
                        InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
                    />
                    <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" sx={{ mt: 1 }} />
                    <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleLogin}>Sign in</Button>
                    <Typography sx={{ mt: 2 }}>Don't have an account? <Button component={RouterLink} to="/register">Register</Button></Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
