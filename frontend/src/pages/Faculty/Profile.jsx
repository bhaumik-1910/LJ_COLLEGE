// import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import { Box, Typography, Grid, Stack, Avatar, TextField, Button, Divider, Input, CircularProgress } from "@mui/material";
// import { toast } from "react-toastify";
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';


// const API_BASE = "http://localhost:5000/api";

// export default function FacultyProfile() {
//     const { token } = useContext(AuthContext);
//     const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

//     const [me, setMe] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [editing, setEditing] = useState(false);
//     const [form, setForm] = useState({ name: "", email: "", role: "", university: "", avatarUrl: "" });
//     const fileInputRef = useRef(null);

//     const fetchMe = async () => {
//         // setLoading(true);
//         try {
//             const res = await fetch(`${API_BASE}/faculty/me`, { headers: { ...authHeader } });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || "Failed to load profile");
//             setMe(data || null);
//         } catch (e) {
//             toast.error(e.message);
//         }
//     };

//     useEffect(() => {
//         if (token) fetchMe();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [token]);

//     useEffect(() => {
//         if (me) setForm({
//             name: me.name || "",
//             email: me.email || "",
//             role: me.role || "",
//             university: me.university || "",
//             avatarUrl: me.avatarUrl || "",
//         });
//     }, [me]);

//     const handleSave = async () => {
//         try {
//             const res = await fetch(`${API_BASE}/faculty/me`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json", ...authHeader },
//                 body: JSON.stringify(form),
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || "Update failed");
//             toast.success("Profile updated");
//             setEditing(false);
//             window.dispatchEvent(new CustomEvent('profile:updated', { detail: { avatarUrl: form.avatarUrl || '' } }));
//             await fetchMe();
//         } catch (e) {
//             toast.error(e.message);
//         }
//     };

//     const onPickFile = () => fileInputRef.current?.click();
//     const handleFileChange = (e) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//         const maxSizeMB = 2;
//         if (file.size > maxSizeMB * 1024 * 1024) {
//             toast.error(`Image too large. Max ${maxSizeMB}MB`);
//             return;
//         }
//         const reader = new FileReader();
//         reader.onload = () => {
//             const dataUrl = reader.result;
//             setForm((f) => ({ ...f, avatarUrl: String(dataUrl) }));
//             if (!editing) setEditing(true);
//         };
//         reader.readAsDataURL(file);
//     };

//     // if (loading) {
//     //     return (
//     //         <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
//     //             <CircularProgress />
//     //         </Box>
//     //     );
//     // }

//     return (
//         <Box sx={{ p: 3 }}>

//             <Typography
//                 variant="h5"
//                 fontWeight={700}
//                 color="primary.main"
//                 mb={2}
//                 display="flex"
//                 alignItems="center"
//                 gap={1}
//             >
//                 Faculty Profile
//                 <AccountCircleIcon fontSize="large" />
//             </Typography>

//             <Grid sx={{ p: 3 }}>

//                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>

//                     <Avatar src={form.avatarUrl || undefined} sx={{ width: 96, height: 96 }}>
//                         {form.name?.charAt(0)?.toUpperCase() || 'F'}
//                     </Avatar>

//                     <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
//                         {/* <TextField
//                             label="Avatar URL"
//                             value={form.avatarUrl}
//                             // variant="standard"
//                             onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
//                             size="small"
//                             sx={{ minWidth: 260 }}
//                             disabled={!editing}
//                         /> */}
//                         {/* <Input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} /> */}
//                         <div className="d-flex align-items-center">
//                             <label htmlFor="avatar-upload" className="btn btn-outline-primary">Upload</label>
//                             <input
//                                 ref={fileInputRef}
//                                 id="avatar-upload"
//                                 type="file"
//                                 accept="image/*"
//                                 hidden
//                                 onChange={handleFileChange}
//                             />
//                         </div>
//                         {/* <Button variant="outlined" onClick={onPickFile}>Upload</Button> */}
//                         {!editing ? (
//                             <Button variant="contained" onClick={() => setEditing(true)}>Edit</Button>
//                         ) : (
//                             <Stack direction="row" spacing={1}>
//                                 <Button variant="outlined" onClick={() => { setEditing(false); setForm({ name: me?.name || '', email: me?.email || '', role: me?.role || '', university: me?.university || '', avatarUrl: me?.avatarUrl || '' }); }}>Cancel</Button>
//                                 <Button variant="contained" onClick={handleSave}>Save</Button>
//                             </Stack>
//                         )}
//                     </Stack>
//                 </Stack>

//                 <Divider sx={{ my: 2 }} />

//                 <Stack
//                     spacing={2}
//                     sx={{
//                         width: {
//                             xs: '100%',
//                             sm: '90%',
//                             md: 670,
//                             lg: 670
//                         },
//                     }}
//                 >
//                     <TextField
//                         label="Name"
//                         size="small"
//                         value={form.name}
//                         onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//                         disabled={!editing}
//                         fullWidth
//                     />
//                     <TextField
//                         label="Email"
//                         size="small"
//                         value={form.email}
//                         onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
//                         disabled={!editing}
//                         fullWidth
//                     />
//                     <TextField
//                         label="Role"
//                         size="small"
//                         value={form.role}
//                         onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
//                         disabled
//                         fullWidth
//                     />
//                     <TextField
//                         label="University"
//                         size="small"
//                         value={form.university}
//                         onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
//                         disabled={!editing}
//                         fullWidth
//                     />
//                 </Stack>

//             </Grid>
//         </Box>
//     );
// }


// FacultyProfile.jsx — design-only update to match AdminProfile style (centered card, gradient header,
// left avatar card with upload button, right rounded form card). No functional changes.
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Avatar,
  TextField,
  Button,
  Divider,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api";

export default function FacultyProfile() {
  const { token } = useContext(AuthContext);
  const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", university: "", avatarUrl: "" });
  const fileInputRef = useRef(null);

  const fetchMe = async () => {
    try {
      const res = await fetch(`${API_BASE}/faculty/me`, { headers: { ...authHeader } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load profile");
      setMe(data || null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (me) {
      setForm({
        name: me.name || "",
        email: me.email || "",
        role: me.role || "",
        university: me.university || "",
        avatarUrl: me.avatarUrl || "",
      });
    }
  }, [me]);

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE}/faculty/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      toast.success("Profile updated");
      setEditing(false);
      window.dispatchEvent(new CustomEvent("profile:updated", { detail: { avatarUrl: form.avatarUrl || "" } }));
      await fetchMe();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onPickFile = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSizeMB = 2;
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Image too large. Max ${maxSizeMB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setForm((f) => ({ ...f, avatarUrl: String(dataUrl) }));
      if (!editing) setEditing(true);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* centered outer card */}
      <Paper
        elevation={6}
        sx={{
          maxWidth: 980,
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "#fafbfd",
        }}
      >
        {/* gradient header */}
        <Box
          sx={{
            px: { xs: 3, md: 4 },
            py: 3.5,
            background: "linear-gradient(90deg, #4f73ff 0%, #7fb1ff 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Faculty Profile
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.95 }}>
              Manage your account details
            </Typography>
          </Box>

          <Box>
            {!editing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setEditing(true)}
                sx={{
                  textTransform: "none",
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  borderRadius: 3,
                  px: 2.2,
                }}
              >
                Edit
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      name: me?.name || "",
                      email: me?.email || "",
                      role: me?.role || "",
                      university: me?.university || "",
                      avatarUrl: me?.avatarUrl || "",
                    });
                  }}
                  sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.2)", textTransform: "none", borderRadius: 3 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{ textTransform: "none", bgcolor: "rgba(255,255,255,0.18)", color: "#fff", borderRadius: 3 }}
                >
                  Save
                </Button>
              </Stack>
            )}
          </Box>
        </Box>

        {/* body */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
            {/* left avatar card */}
            <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  p: 3,
                  bgcolor: "#fff",
                  width: "100%",
                  maxWidth: 320,
                  boxShadow: "0 6px 18px rgba(11,20,60,0.04)",
                }}
              >
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={form.avatarUrl || undefined}
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: "#e6e9ef",
                        fontSize: 36,
                        boxShadow: "0 8px 20px rgba(11,20,60,0.06)",
                      }}
                    >
                      {form.name?.charAt(0)?.toUpperCase() || "F"}
                    </Avatar>

                    <IconButton
                      onClick={onPickFile}
                      sx={{
                        position: "absolute",
                        right: -6,
                        bottom: -6,
                        bgcolor: "#fff",
                        border: "2px solid #fff",
                        boxShadow: "0 6px 12px rgba(11,20,60,0.08)",
                        width: 40,
                        height: 40,
                      }}
                      size="small"
                    >
                      <CameraAltIcon sx={{ color: "#6b7cff" }} />
                    </IconButton>
                  </Box>

                  <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />

                  <Box textAlign="center">
                    <Typography variant="h6" fontWeight={700}>
                      {me?.name || "-"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {me?.email || "-"}
                    </Typography>
                  </Box>

                  <Box width="100%" mt={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        if (me?.email) {
                          navigator.clipboard?.writeText(me.email);
                          toast.success("Email copied");
                        }
                      }}
                      sx={{
                        textTransform: "none",
                        borderRadius: 3,
                        background: "linear-gradient(90deg,#4f73ff,#7fb1ff)",
                        boxShadow: "0 8px 20px rgba(79,115,255,0.12)",
                        color: "#fff",
                        mb: 1,
                      }}
                    >
                      Copy Email
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setForm((f) => ({ ...f, avatarUrl: "" }))}
                      sx={{
                        textTransform: "none",
                        borderRadius: 3,
                        borderColor: "#e6e9ef",
                        color: "#4f73ff",
                      }}
                    >
                      Remove Avatar
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* right form card */}
            <Grid item xs={12} md={7} sx={{ display: "flex", justifyContent: "center" }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  p: 3,
                  bgcolor: "#fff",
                  width: "100%",
                  maxWidth: 600,
                  boxShadow: "0 6px 18px rgba(11,20,60,0.04)",
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={!editing}
                    fullWidth
                    size="small"
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 3, bgcolor: "#fbfcff" } }}
                  />
                  <TextField
                    label="Email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={!editing}
                    fullWidth
                    size="small"
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 3, bgcolor: "#fbfcff" } }}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Role"
                      value={form.role}
                      disabled
                      fullWidth
                      size="small"
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 3, bgcolor: "#fbfcff" } }}
                    />
                    <TextField
                      label="University"
                      value={form.university}
                      onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
                      disabled={!editing}
                      fullWidth
                      size="small"
                      variant="outlined"
                      InputProps={{ sx: { borderRadius: 3, bgcolor: "#fbfcff" } }}
                    />
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

