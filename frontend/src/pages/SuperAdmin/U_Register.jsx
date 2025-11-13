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
//                     University Registration (Super Admin)
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
  useTheme,
  ListItemText,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import studentImage from "../../assets/images/student-add.png";

const API_BASE = "http://localhost:5000/api";

export default function U_Register() {
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    name: "",
    courses: [],
  });
  const [newCourse, setNewCourse] = useState("");
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
    } catch {}
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
    if (form.courses.length === 0)
      return toast.error("Add at least one course");

    try {
      const res = await fetch(`${API_BASE}/universities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          courses: form.courses,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to create university");
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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Main rounded card container */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          p: { xs: 2, md: 4 },
          background: "#f7fbfc",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* LEFT: Form column */}
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: 600 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
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
                  label="University Email"
                  variant="outlined"
                  value={form.email}
                  size="small"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      background: "#fff",
        
                    },
                  }}
                />

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={sendOtp}
                    sx={{
                      textTransform: "none",
                      borderRadius: 20,
                      px: 3,
                      color: "#3b6ef6",
                      borderColor: "#d7e6ff",
                    }}
                  >
                    Send OTP
                  </Button>

                  {otpSent && (
                    <TextField
                      label="Enter OTP"
                      variant="outlined"
                      value={form.otp}
                      onChange={(e) => setForm({ ...form, otp: e.target.value })}
                      sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  )}

                  {otpSent && (
                    <Button
                      variant="contained"
                      onClick={verifyOtp}
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Verify
                    </Button>
                  )}
                </Box>

                <Divider sx={{ my: 0.5 }} />

                <TextField
                  fullWidth
                  label="University Name"
                  variant="outlined"
                  value={form.name}
                  size="small"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" },
                  }}
                />

                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    fullWidth
                    label="Add Course"
                    variant="outlined"
                    value={newCourse}
                    size="small"
                    onChange={(e) => setNewCourse(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCourse();
                      }
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                  <IconButton
                    color="primary"
                    onClick={handleAddCourse}
                    sx={{
                      bgcolor: "#eaf1ff",
                      "&:hover": { bgcolor: "#e0e9ff" },
                      borderRadius: 1.5,
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                {form.courses.length > 0 && (
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
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
                            borderRadius: 1.5,
                            background: "#fff",
                          }}
                        >
                          <ListItemText primary={course} />
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemoveCourse(index)}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Paper>
                      ))}
                    </List>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={createUniversity}
                    sx={{
                      textTransform: "none",
                      borderRadius: 4,
                      px: 3,
                      background: "linear-gradient(180deg,#4d73ff,#3358d8)",
                      boxShadow: "0 6px 12px rgba(77,115,255,0.18)",
                    }}
                  >
                    Create University
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => {
                      setForm({ email: "", otp: "", name: "", courses: [] });
                      setNewCourse("");
                      setOtpSent(false);
                      setVerified(false);
                    }}
                    sx={{
                      textTransform: "none",
                      borderRadius: 4,
                      px: 3,
                      borderColor: "#cfece3",
                      color: "#0b8f7a",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* RIGHT: image column - HIDDEN on small screens (xs) */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: { xs: "none", md: "flex" }, // hide on xs
              justifyContent: "center",
              alignItems: "center",
              p: 3,
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
              <img
                src={studentImage}
                alt="Student Illustration"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

