
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  TextField,
  Button,
  Divider,
  Grid,
  CircularProgress,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";

// const API_BASE = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_BASE;

export default function SuperAdminProfile() {
  const { token } = useContext(AuthContext);
  const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

  const [me, setMe] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  const fetchMe = async () => {
    // setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/superadmin/users`, { headers: { ...authHeader } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load users");
      const email = (typeof window !== "undefined" ? localStorage.getItem("email") : "") || "";
      const self = (Array.isArray(data) ? data : []).find(
        (u) => String(u.email).toLowerCase() === String(email).toLowerCase()
      );
      setMe(self || null);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const [form, setForm] = useState({ name: "", email: "", role: "", university: "", avatarUrl: "" });

  useEffect(() => {
    if (me)
      setForm({
        name: me.name || "",
        email: me.email || "",
        role: me.role || "",
        university: me.university || "",
        avatarUrl: me.avatarUrl || "",
      });
  }, [me]);

  const handleSave = async () => {
    if (!me?._id) return;
    try {
      const res = await fetch(`${API_BASE}/superadmin/users/${me._id}`, {
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
    const maxSizeMB = 2; // 2 mb upload limit
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

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",   // ⬅ centers horizontally
        alignItems: "center",
      }}>
      <Paper
        elevation={6}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "#fafbfd",
          maxWidth: 900,
        }}
      >
        {/* Top gradient header */}
        <Box
          sx={{
            px: { xs: 3, md: 4 },
            py: 3.5,
            background: "linear-gradient(90deg, #4f73ff 0%, #7fb1ff 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          {/* <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="space-between" spacing={2}> */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Super Admin Profile
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
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
                Edit Profile
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
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
                  sx={{
                    textTransform: "none",
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.18)",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{ textTransform: "none", ml: 1 }}
                >
                  Save
                </Button>
              </Stack>
            )}
          </Box>
          {/* </Stack> */}
        </Box>

        {/* Body */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
            {/* Left: avatar + quick actions */}
            <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "center" }}>
              {/* <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  textAlign: "center",
                  bgcolor: "background.paper",
                  boxShadow: (theme) => `0 8px 24px ${theme.palette.mode === "light" ? "rgba(20,40,80,0.04)" : "rgba(0,0,0,0.4)"}`,
                }}
              > */}
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={form.avatarUrl || undefined}
                    sx={{
                      width: 120,
                      height: 120,
                      boxShadow: 6,
                      border: "4px solid rgba(255,255,255,0.6)",
                    }}
                  >
                    {form.name?.charAt(0)?.toUpperCase() || "A"}
                  </Avatar>

                  {/* camera overlay */}
                  <IconButton
                    onClick={onPickFile}
                    size="small"
                    sx={{
                      position: "absolute",
                      right: -6,
                      bottom: -6,
                      bgcolor: "background.paper",
                      border: "2px solid",
                      borderColor: "divider",
                      boxShadow: 3,
                      "&:hover": { transform: "scale(1.06)" },
                    }}
                    aria-label="upload"
                  >
                    <CameraAltIcon fontSize="small" sx={{ color: "#6b7cff" }} />
                  </IconButton>
                </Box>

                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />

                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {form.name || "—"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {form.role || "—"}
                </Typography>

                {/* <Divider sx={{ my: 2 }} /> */}

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigator.clipboard?.writeText(form.email || "")}
                  sx={{
                    textTransform: "none",
                    // mb: 1,
                    background: "linear-gradient(90deg,#6bb8ff,#4d73ff)",
                    boxShadow: "0 6px 18px rgba(77,115,255,0.18)",
                  }}
                >
                  Copy Email
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setForm((f) => ({ ...f, avatarUrl: "" }));
                    setEditing(true);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Remove Avatar
                </Button>
              </Box>
              {/* </Paper> */}
            </Grid>

            {/* Right: form fields */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  border: (theme) => `1px solid ${theme.palette.mode === "light" ? "#f0f3ff" : "#23304a"}`,
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    variant="outlined"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    disabled={!editing}
                    fullWidth
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />

                  <TextField
                    label="Email"
                    variant="outlined"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    disabled={!editing}
                    fullWidth
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Role"
                      variant="outlined"
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                      disabled={!editing}
                      fullWidth
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                    <TextField
                      label="University"
                      variant="outlined"
                      value={form.university}
                      onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
                      disabled={!editing}
                      fullWidth
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Stack>

                  <TextField
                    label="Avatar URL"
                    variant="outlined"
                    value={form.avatarUrl}
                    onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
                    disabled={!editing}
                    fullWidth
                    helperText="Paste a public image URL or upload using camera icon"
                  />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}


