import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box, Typography, Grid, Stack, Avatar, TextField, Button, Divider, Input, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


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
        // setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/faculty/me`, { headers: { ...authHeader } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load profile");
            setMe(data || null);
        } catch (e) {
            toast.error(e.message);
        }
    };

    useEffect(() => {
        if (token) fetchMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(() => {
        if (me) setForm({
            name: me.name || "",
            email: me.email || "",
            role: me.role || "",
            university: me.university || "",
            avatarUrl: me.avatarUrl || "",
        });
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
            window.dispatchEvent(new CustomEvent('profile:updated', { detail: { avatarUrl: form.avatarUrl || '' } }));
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

    // if (loading) {
    //     return (
    //         <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
    //             <CircularProgress />
    //         </Box>
    //     );
    // }

    return (
        <Box sx={{ p: 3 }}>

            <Typography
                variant="h5"
                fontWeight={700}
                color="primary.main"
                mb={2}
                display="flex"
                alignItems="center"
                gap={1}
            >
                Faculty Profile
                <AccountCircleIcon fontSize="large" />
            </Typography>

            <Grid sx={{ p: 3 }}>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>

                    <Avatar src={form.avatarUrl || undefined} sx={{ width: 96, height: 96 }}>
                        {form.name?.charAt(0)?.toUpperCase() || 'F'}
                    </Avatar>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                        {/* <TextField
                            label="Avatar URL"
                            value={form.avatarUrl}
                            // variant="standard"
                            onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
                            size="small"
                            sx={{ minWidth: 260 }}
                            disabled={!editing}
                        /> */}
                        {/* <Input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} /> */}
                        <div className="d-flex align-items-center">
                            <label htmlFor="avatar-upload" className="btn btn-outline-primary">Upload</label>
                            <input
                                ref={fileInputRef}
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                            />
                        </div>
                        {/* <Button variant="outlined" onClick={onPickFile}>Upload</Button> */}
                        {!editing ? (
                            <Button variant="contained" onClick={() => setEditing(true)}>Edit</Button>
                        ) : (
                            <Stack direction="row" spacing={1}>
                                <Button variant="outlined" onClick={() => { setEditing(false); setForm({ name: me?.name || '', email: me?.email || '', role: me?.role || '', university: me?.university || '', avatarUrl: me?.avatarUrl || '' }); }}>Cancel</Button>
                                <Button variant="contained" onClick={handleSave}>Save</Button>
                            </Stack>
                        )}
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack
                    spacing={2}
                    sx={{
                        width: {
                            xs: '100%',
                            sm: '90%',
                            md: 670,
                            lg: 670
                        },
                    }}
                >
                    <TextField
                        label="Name"
                        size="small"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        disabled={!editing}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        size="small"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        disabled={!editing}
                        fullWidth
                    />
                    <TextField
                        label="Role"
                        size="small"
                        value={form.role}
                        onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                        disabled
                        fullWidth
                    />
                    <TextField
                        label="University"
                        size="small"
                        value={form.university}
                        onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
                        disabled={!editing}
                        fullWidth
                    />
                </Stack>

            </Grid>
        </Box>
    );
}
