import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  // List,
  // ListItemText,
  // IconButton,
  Stack,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
import studentImage from "../../assets/images/student-add.png";
import CancelIcon from "@mui/icons-material/Cancel";


const API_BASE = "http://localhost:5000/api";
// const API_BASE = import.meta.env.VITE_API_BASE;

export default function U_Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    name: "",
    // courses: [],
  });
  // const [newCourse, setNewCourse] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "superadmin") navigate("/login");
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

  // const handleAddCourse = () => {
  //   if (newCourse.trim() === "") return;
  //   setForm((prevForm) => ({
  //     ...prevForm,
  //     courses: [...prevForm.courses, newCourse.trim()],
  //   }));
  //   setNewCourse("");
  // };

  // const handleRemoveCourse = (index) => {
  //   setForm((prevForm) => ({
  //     ...prevForm,
  //     courses: prevForm.courses.filter((_, i) => i !== index),
  //   }));
  // };

  const createUniversity = async () => {
    if (!verified) return toast.error("Verify email via OTP first");
    if (!form.name) return toast.error("Enter university name");
    // if (form.courses.length === 0)
    //   return toast.error("Add at least one course");

    try {
      const res = await fetch(`${API_BASE}/universities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          // courses: form.courses,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create university");
      toast.success("University created");
      setForm({ email: "", otp: "", name: "" });//, courses: []
      setOtpSent(false);
      setVerified(false);
      await loadUniversities();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        // minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: "#f7fbfc",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          p: { xs: 3, md: 5 },
          width: "100%",
          maxWidth: 990,
          background: "#fff",
        }}
      >
        <Grid container spacing={4}>
          {/* Left form ONLY (full width) */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 6, mt: 2 }}>
              <Typography
                variant="h5"
                sx={{ color: "#3b6ef6", fontWeight: 700, mr: 1 }}
              >
                University Registration (Super Admin)
              </Typography>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  bgcolor: "#e8f0ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AddIcon sx={{ color: "#3b6ef6", fontSize: 20 }} />
              </Box>
            </Box>

            <Stack spacing={2}>
              <TextField
                fullWidth
                label="University Email*"
                variant="outlined"
                value={form.email}
                size="small"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" onClick={sendOtp}>
                  Send OTP
                </Button>

                {otpSent && (
                  <>
                    <TextField
                      label="Enter OTP"
                      variant="outlined"
                      size="small"
                      value={form.otp}
                      onChange={(e) =>
                        setForm({ ...form, otp: e.target.value })
                      }
                    />

                    <Button variant="contained" onClick={verifyOtp}>
                      Verify
                    </Button>
                  </>
                )}
              </Box>

              <Divider />

              <TextField
                fullWidth
                label="University Name*"
                variant="outlined"
                value={form.name}
                size="small"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              {/* 
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  label="Add Course"
                  variant="outlined"
                  value={newCourse}
                  size="small"
                  onChange={(e) => setNewCourse(e.target.value)}
                />
                <IconButton color="primary" onClick={handleAddCourse}>
                  <AddIcon />
                </IconButton>
              </Box> */}

              {/* {form.courses.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Courses:
                  </Typography>

                  <List dense>
                    {form.courses.map((course, index) => (
                      <Paper
                        key={index}
                        sx={{
                          mb: 1,
                          p: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <ListItemText primary={course} />
                        <IconButton
                          onClick={() => handleRemoveCourse(index)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Paper>
                    ))}
                  </List>
                </Box>
              )} */}

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="contained" onClick={createUniversity} startIcon={<AddIcon />}>
                  Create University
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => {
                    setForm({
                      email: "",
                      otp: "",
                      name: "",
                      // courses: [],
                    });
                    setOtpSent(false);
                    setVerified(false);
                  }}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
              </Box>
            </Stack>
          </Grid>

          {/* Right Image Section */}
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={studentImage} // Place image in public folder
              alt="Working Girl"
              style={{
                maxHeight: "400px",
                width: "auto",
                borderRadius: "10px",
                objectFit: "contain",
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
