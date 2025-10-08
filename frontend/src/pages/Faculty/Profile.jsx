import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box, Typography, Grid, Stack, Avatar, TextField, Button, Divider, Input } from "@mui/material";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api";

export default function FacultyProfile() {
    const { token } = useContext(AuthContext);
    const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

    const [me, setMe] = useState(null);
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

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700} mb={2}>Faculty Profile</Typography>
            <Grid sx={{ p: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Avatar src={form.avatarUrl || undefined} sx={{ width: 96, height: 96 }}>
                        {form.name?.charAt(0)?.toUpperCase() || 'F'}
                    </Avatar>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                        <TextField
                            label="Avatar URL"
                            value={form.avatarUrl}
                            variant="standard"
                            onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
                            size="small"
                            sx={{ minWidth: 260 }}
                            disabled={!editing}
                        />
                        <Input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
                        <Button variant="outlined" onClick={onPickFile}>Upload</Button>
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

                <Stack spacing={2}>
                    <TextField label="Name" variant="standard" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} disabled={!editing} />
                    <TextField label="Email" variant="standard" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} disabled={!editing} />
                    <TextField label="Role" variant="standard" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} disabled />
                    <TextField label="University" variant="standard" value={form.university} onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))} disabled={!editing} />
                </Stack>
            </Grid>
        </Box>
    );
}
