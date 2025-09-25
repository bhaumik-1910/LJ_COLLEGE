import React, { useState } from "react";
import {
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
    MenuItem,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink } from 'react-router-dom'

const ILLUSTRATION =
    "https://cdni.iconscout.com/illustration/premium/thumb/online-education-3428959-2902701.png";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        designation: "",
        role: "",
        university: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("Register Form Data:", form);
        // Add API call here
    };

    return (
        <Grid
            container
            sx={{
                minHeight: "100vh",
                bgcolor: "#f5f9ff",
            }}
        >
            {/* Left side image */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 4,
                }}
            >
                <Box
                    component="img"
                    src={ILLUSTRATION}
                    alt="Education Illustration"
                    sx={{ width: "100%" }}
                />
            </Grid>

            {/* Right side register box */}
            <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 5,
                        borderRadius: 3,
                        width: "100%",
                        maxWidth: 450,
                        textAlign: "center",
                    }}
                >
                    {/* Logo */}
                    <Box
                        component="img"
                        src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                        alt="University Logo"
                        sx={{ width: 70, mb: 2 }}
                    />

                    {/* University Name */}
                    <Typography variant="h6" fontWeight="bold">
                        UNIVERSITY NAME
                    </Typography>
                    <Typography variant="body2" color="primary" mb={3}>
                        REGISTER ACCOUNT
                    </Typography>

                    {/* Full Name */}
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        variant="standard"
                        margin="normal"
                    />

                    {/* Email */}
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        variant="standard"
                        margin="normal"
                    />

                    {/* Password */}
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        variant="standard"
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Confirm Password */}
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={handleChange}
                        variant="standard"
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Designation */}
                    <TextField
                        fullWidth
                        label="Designation"
                        name="designation"
                        value={form.designation}
                        onChange={handleChange}
                        variant="standard"
                        margin="normal"
                    />

                    {/* Role Dropdown */}
                    <TextField
                        select
                        fullWidth
                        label="Role"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        variant="standard"
                        margin="normal"
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="faculty">Faculty</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                    </TextField>

                    {/* University Name */}
                    <TextField
                        fullWidth
                        label="University Name"
                        name="university"
                        value={form.university}
                        onChange={handleChange}
                        variant="standard"
                        margin="normal"
                    />

                    {/* Register button */}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            mt: 3,
                            py: 1.2,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Register
                    </Button>
                    <Typography sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Button component={RouterLink} to="/login">Log in</Button>
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
