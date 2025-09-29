import React, { useState, useContext } from "react";
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
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import left_image from "../assets/Register-image1.jpg";
import logo from "../assets/Register-logo.jpg";
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { register, loading } = useContext(AuthContext);

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

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const res = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      designation: form.designation,
      role: form.role,
      university: form.university,
    });

    if (res.success) {
      toast.success("User registered successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        designation: "",
        role: "",
        university: "",
      });
      setTimeout(() => navigate("/login"), 500);
    } else {
      toast.error(res.message || "Error registering user");
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        // bgcolor: "#479f6aff",
        display: "flex",
        justifyContent: "center"
      }}
    >
      {/* Left side image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          //   display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, md: 4 },

        }}
      >
        <Box
          component="img"
          src={left_image}
          alt="Education Illustration"
          sx={{
            width: { xs: "100%", sm: "80%", md: "578px" },
            height: { xs: "auto", md: "90%" },
            borderRadius: "20px",

          }}
        />
      </Grid>

      {/* Right side register box */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          //   display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, md: 4 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            width: "100%",
            maxWidth: 450,
            textAlign: "center",
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="University Logo"
            sx={{ 
              width: 90, 
              mb: 2,
              borderRadius: "50%",
             }}
          />

          <Typography
            variant="body2"
            mb={3}
            sx={{
              fontWeight: "600",
              color: "black",
              fontSize: { xs: "16px", md: "20px" },
            }}
          >
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
            sx={{ marginTop: "8px" }}
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            variant="standard"
            sx={{ marginTop: "8px" }}
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
            sx={{ marginTop: "8px" }}
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
            sx={{ marginTop: "8px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
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
            sx={{ marginTop: "8px" }}
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
            sx={{ marginTop: "8px" }}
            SelectProps={{
              sx: {
                textAlign: "left",
                "& .MuiSelect-select": {
                  textAlign: "left",
                },
              },
            }}
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
            sx={{ marginTop: "8px" }}
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
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <Typography sx={{ mt: 2, fontSize: { xs: "14px", md: "16px" } }}>
            Already have an account?{" "}
            <Button
              component={RouterLink}
              to="/login"
              sx={{ textTransform: "none", p: 0 }}
            >
              Log in
            </Button>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
