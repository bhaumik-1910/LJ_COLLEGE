import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api";

export default function UniversityUsers() {
    const { token } = useContext(AuthContext);
    const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

    const [allUsers, setAllUsers] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [selectedUni, setSelectedUni] = useState("");
    const [loading, setLoading] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);

    const [delOpen, setDelOpen] = useState(false);
    const [delRow, setDelRow] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/users`, { headers: { ...authHeader } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load users");
            setAllUsers(Array.isArray(data) ? data : []);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUniversities = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/universities`, { headers: { ...authHeader } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load universities");
            setUniversities(Array.isArray(data) ? data : []);
            if (Array.isArray(data) && data.length && !selectedUni) setSelectedUni(data[0].name);
        } catch (e) {
            toast.error(e.message);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchUniversities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const rows = useMemo(() => {
        if (!selectedUni) return allUsers;
        return allUsers.filter((u) => (u.university || "").toLowerCase() === selectedUni.toLowerCase());
    }, [allUsers, selectedUni]);

    const onEdit = (row) => {
        setEditRow({ ...row });
        setEditOpen(true);
    };

    const onEditChange = (key, val) => setEditRow((r) => ({ ...r, [key]: val }));

    const saveEdit = async () => {
        if (!editRow?._id) return;
        try {
            const res = await fetch(`${API_BASE}/admin/users/${editRow._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify({
                    name: editRow.name,
                    email: editRow.email,
                    role: editRow.role,
                    university: editRow.university,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed");
            toast.success("User updated");
            setEditOpen(false);
            setEditRow(null);
            await fetchUsers();
        } catch (e) {
            toast.error(e.message);
        }
    };

    const onDelete = (row) => {
        setDelRow(row);
        setDelOpen(true);
    };

    const confirmDelete = async () => {
        if (!delRow?._id) return;
        try {
            const res = await fetch(`${API_BASE}/admin/users/${delRow._id}`, {
                method: "DELETE",
                headers: { ...authHeader },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            toast.success("User deleted");
            setDelOpen(false);
            setDelRow(null);
            await fetchUsers();
        } catch (e) {
            toast.error(e.message);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} mb={2}>
                <Typography variant="h5" fontWeight={700}>University Users</Typography>
                <TextField select size="small" label="University" value={selectedUni} onChange={(e) => setSelectedUni(e.target.value)} sx={{ minWidth: 220 }}>
                    {universities.map((u) => (
                        <MenuItem key={u._id || u.name} value={u.name}>{u.name}</MenuItem>
                    ))}
                </TextField>
            </Stack>

            <TableContainer component={Box}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>University</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((r) => (
                            <TableRow key={r._id} hover>
                                <TableCell>{r.name}</TableCell>
                                <TableCell>{r.email}</TableCell>
                                <TableCell sx={{ textTransform: "capitalize" }}>{r.role}</TableCell>
                                <TableCell>{r.university || "-"}</TableCell>
                                <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => onEdit(r)}><EditIcon /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => onDelete(r)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {rows.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No users</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent dividers>
                    <TextField margin="dense" label="Name" variant="standard" fullWidth value={editRow?.name || ""} onChange={(e) => onEditChange("name", e.target.value)} />
                    <TextField margin="dense" label="Email" variant="standard" fullWidth value={editRow?.email || ""} onChange={(e) => onEditChange("email", e.target.value)} />
                    <TextField select margin="dense" label="Role" variant="standard" fullWidth value={editRow?.role || "user"} onChange={(e) => onEditChange("role", e.target.value)}>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="faculty">Faculty</MenuItem>
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                    </TextField>
                    <TextField margin="dense" label="University" variant="standard" fullWidth value={editRow?.university || ""} onChange={(e) => onEditChange("university", e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={saveEdit}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete confirm */}
            <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
                <DialogTitle>Delete user?</DialogTitle>
                <DialogContent dividers>
                    <Typography>Are you sure you want to delete {delRow?.email}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDelOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
