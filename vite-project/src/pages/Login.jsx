import React, { useState } from "react";
import {
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
    InputAdornment,
    IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink } from 'react-router-dom'

// Left-side illustration
const ILLUSTRATION = "https://cdni.iconscout.com/illustration/premium/thumb/online-education-3428959-2902701.png";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

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

            {/* Right side login box */}
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
                        maxWidth: 400,
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
                        LOGIN ACCOUNT
                    </Typography>

                    {/* Enrollment number */}
                    <TextField
                        fullWidth
                        label="Email"
                        variant="standard"
                        margin="normal"
                    />

                    {/* Password */}
                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
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

                    {/* Remember me + Forgot password */}
                    <Box
                        sx={{
                            mt: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />
                        <Typography
                            variant="body2"
                            sx={{ cursor: "pointer", color: "primary.main" }}
                        >
                            Forgot Password?
                        </Typography>
                    </Box>

                    {/* Sign in button */}
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            py: 1.2,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Sign in
                    </Button>

                    <Typography sx={{ mt: 2 }}>
                        Already have an account?{' '}
                        <Button component={RouterLink} to="/register" >Register</Button>
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}
