// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { Box, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination, TextField, } from "@mui/material";
// import { AuthContext } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const API_BASE = "http://localhost:5000/api";

// export default function Student_List() {
//     const { token } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");


//     // Search and pagination state
//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     // Derived data: filtered and paged rows
//     const filteredRows = useMemo(() => {
//         const q = search.trim().toLowerCase();
//         if (!q) return rows;
//         return rows.filter((r) => {
//             const fields = [r.name, r.email, r.role];
//             return fields.some((v) => String(v || "").toLowerCase().includes(q));
//         });
//     }, [rows, search]);

//     const pagedRows = useMemo(() => {
//         const start = page * rowsPerPage;
//         return filteredRows.slice(start, start + rowsPerPage);
//     }, [filteredRows, page, rowsPerPage]);

//     // Reset page when search or rowsPerPage changes
//     useEffect(() => {
//         setPage(0);
//     }, [search, rowsPerPage]);

//     const handleChangePage = (_evt, newPage) => setPage(newPage);
//     const handleChangeRowsPerPage = (evt) => {
//         setRowsPerPage(parseInt(evt.target.value, 10));
//         setPage(0);
//     };

//     const fetchStudents = async () => {
//         setLoading(true);
//         setError("");
//         try {
//             const res = await fetch(`${API_BASE}/faculty/students`, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//                 },
//             });
//             const data = await res.json().catch(() => ([]));
//             if (!res.ok) throw new Error(data.message || "Failed to fetch students");
//             const list = Array.isArray(data) ? data : (Array.isArray(data.items) ? data.items : []);
//             setRows(list);
//         } catch (e) {
//             setError(e.message || "Something went wrong");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchStudents();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     return (
//         <Box sx={{ p: 3 }}>
//             <Box mb={2}>
//                 <Typography variant="h5" fontWeight={700}>Students</Typography>
//             </Box>

//             <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
//                 <TextField
//                     size="small"
//                     placeholder="Search student..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     sx={{ maxWidth: 360 }}
//                 />
//                 <Button variant="contained" onClick={() => navigate("/faculty-dashboard/add-student")}>Add Student</Button>
//             </Box>

//             {
//                 loading && (
//                     <Box display="flex" alignItems="center" justifyContent="center" py={6}>
//                         <CircularProgress />
//                     </Box>
//                 )
//             }

//             {
//                 !loading && error && (
//                     <Typography color="error" mb={2}>{error}</Typography>
//                 )
//             }

//             {
//                 !loading && !error && (
//                     rows.length === 0 ? (
//                         <Typography color="text.secondary">No students found.</Typography>
//                     ) : (
//                         <TableContainer component={Box}>
//                             <Table size="small">
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell>Enrollment No</TableCell>
//                                         <TableCell>Full Name</TableCell>
//                                         <TableCell>Email</TableCell>
//                                         <TableCell>Password</TableCell>
//                                         <TableCell>Course</TableCell>
//                                         <TableCell>Contact</TableCell>
//                                         <TableCell>Gender</TableCell>
//                                         <TableCell>Address</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {pagedRows.map((r) => (
//                                         <TableRow key={r._id || r.enrolno} hover>
//                                             <TableCell>{r.enrolno}</TableCell>
//                                             <TableCell>{r.fullName}</TableCell>
//                                             <TableCell>{r.email}</TableCell>
//                                             <TableCell>{r.password}</TableCell>
//                                             <TableCell>{r.course}</TableCell>
//                                             <TableCell>{r.contact}</TableCell>
//                                             <TableCell>{r.gender}</TableCell>
//                                             <TableCell>{r.address}</TableCell>
//                                         </TableRow>
//                                     ))}
//                                     {filteredRows.length === 0 && !loading && (
//                                         <TableRow>
//                                             <TableCell colSpan={6} align="center">No users</TableCell>
//                                         </TableRow>
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     )
//                 )
//             }
//             {/* Pagination */}
//             <TablePagination
//                 component="div"
//                 count={filteredRows.length}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={rowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//                 showFirstButton
//                 showLastButton
//             />
//         </Box >
//     );
// }
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TablePagination,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api";

export default function Student_List() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editOpen, setEditOpen] = useState(false);
    const [editRow, setEditRow] = useState(null);

    const [delOpen, setDelOpen] = useState(false);
    const [delRow, setDelRow] = useState(null);

    const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

    // Search and pagination state
    const [rows, setRows] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Derived data: filtered and paged rows
    const filteredRows = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) => {
            const fields = [r.enrolno, r.fullName, r.email, r.course, r.contact, r.gender, r.address, r.university];
            return fields.some((v) => String(v || "").toLowerCase().includes(q));
        });
    }, [rows, search]);

    const pagedRows = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredRows.slice(start, start + rowsPerPage);
    }, [filteredRows, page, rowsPerPage]);

    // Reset page when search or rowsPerPage changes
    useEffect(() => {
        setPage(0);
    }, [search, rowsPerPage]);

    const handleChangePage = (_evt, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (evt) => {
        setRowsPerPage(parseInt(evt.target.value, 10));
        setPage(0);
    };

    const fetchStudents = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/faculty/students`, {
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader,
                },
            });
            const data = await res.json().catch(() => ([]));
            if (!res.ok) throw new Error(data.message || "Failed to fetch students");
            const list = Array.isArray(data) ? data : (Array.isArray(data.items) ? data.items : []);
            setRows(list);
        } catch (e) {
            setError(e.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onEdit = (row) => {
        setEditRow({ ...row });
        setEditOpen(true);
    };

    const onEditChange = (key, val) => setEditRow((r) => ({ ...r, [key]: val }));

    const saveEdit = async () => {
        if (!editRow?._id) return;
        try {
            const res = await fetch(`${API_BASE}/faculty/students/${editRow._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", ...authHeader },
                body: JSON.stringify({
                    enrolno: editRow.enrolno,
                    fullName: editRow.fullName,
                    email: editRow.email,
                    course: editRow.course,
                    contact: editRow.contact,
                    gender: editRow.gender,
                    university: editRow.university,
                    address: editRow.address,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Update failed");
            toast.success("Student Updated successfully");
            setEditOpen(false);
            setEditRow(null);
            await fetchStudents(); // Re-fetch the data to show the changes
        } catch (e) {
            toast.error(e.message);
        }
    };

    // const saveEdit = async () => {
    //     if (!editRow?._id) return;
    //     try {
    //         const res = await fetch(`${API_BASE}/admin/users/${editRow._id}`, {
    //             method: "PATCH",
    //             headers: { "Content-Type": "application/json", ...authHeader },
    //             body: JSON.stringify({
    //                 name: editRow.name,
    //                 email: editRow.email,
    //                 role: editRow.role,
    //                 university: editRow.university,
    //             }),
    //         });
    //         const data = await res.json();
    //         if (!res.ok) throw new Error(data.message || "Update failed");
    //         toast.success("User updated");
    //         setEditOpen(false);
    //         setEditRow(null);
    //         await fetchUsers();
    //     } catch (e) {
    //         toast.error(e.message);
    //     }
    // };

    const onDelete = (row) => {
        setDelRow(row);
        setDelOpen(true);
    };

    const confirmDelete = async () => {
        if (!delRow?._id) return;
        try {
            const res = await fetch(`${API_BASE}/faculty/students/${delRow._id}`, {
                method: "DELETE",
                headers: { ...authHeader },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Delete failed");
            toast.success("Student deleted successfully");
            setDelOpen(false);
            setDelRow(null);
            await fetchStudents(); // Re-fetch the data to show the changes
        } catch (e) {
            toast.error(e.message);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box mb={2}>
                <Typography variant="h5" fontWeight={700}>Students</Typography>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <TextField
                    size="small"
                    placeholder="Search students..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ maxWidth: 360 }}
                />
                <Button variant="contained" onClick={() => navigate("/faculty-dashboard/add-student")}>Add Student</Button>
            </Box>

            {loading && (
                <Box display="flex" alignItems="center" justifyContent="center" py={6}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && error && (
                <Typography color="error" mb={2}>{error}</Typography>
            )}

            {!loading && !error && (
                filteredRows.length === 0 ? (
                    <Typography color="text.secondary">No students found.</Typography>
                ) : (
                    <>
                        <TableContainer component={Box}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Enrollment No</TableCell>
                                        <TableCell>Full Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Course</TableCell>
                                        <TableCell>Contact</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell>University</TableCell>
                                        <TableCell>Address</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pagedRows.map((r) => (
                                        <TableRow key={r._id} hover>
                                            <TableCell>{r.enrolno}</TableCell>
                                            <TableCell>{r.fullName}</TableCell>
                                            <TableCell>{r.email}</TableCell>
                                            <TableCell>{r.course}</TableCell>
                                            <TableCell>{r.contact}</TableCell>
                                            <TableCell>{r.gender}</TableCell>
                                            <TableCell>{r.university}</TableCell>
                                            <TableCell>{r.address}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => onEdit(r)}><EditIcon /></IconButton>
                                                <IconButton size="small" color="error" onClick={() => onDelete(r)}><DeleteIcon /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            component="div"
                            count={filteredRows.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            showFirstButton
                            showLastButton
                        />
                    </>
                )
            )}

            {/* Edit dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Student</DialogTitle>
                <DialogContent dividers>
                    <TextField margin="dense" label="Enrollment No" name="enrolno" variant="standard" fullWidth value={editRow?.enrolno || ""} onChange={(e) => onEditChange("enrolno", e.target.value)} />
                    <TextField margin="dense" label="Full Name" name="fullName" variant="standard" fullWidth value={editRow?.fullName || ""} onChange={(e) => onEditChange("fullName", e.target.value)} />
                    <TextField margin="dense" label="Email" name="email" variant="standard" fullWidth value={editRow?.email || ""} onChange={(e) => onEditChange("email", e.target.value)} />
                    <TextField margin="dense" label="Course" name="course" variant="standard" fullWidth value={editRow?.course || ""} onChange={(e) => onEditChange("course", e.target.value)} />
                    <TextField margin="dense" label="Contact" name="contact" variant="standard" fullWidth value={editRow?.contact || ""} onChange={(e) => onEditChange("contact", e.target.value)} />
                    <TextField select margin="dense" label="Gender" name="gender" variant="standard" fullWidth value={editRow?.gender || ""} onChange={(e) => onEditChange("gender", e.target.value)}>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                    </TextField>
                    <TextField margin="dense" label="Address" name="address" variant="standard" fullWidth value={editRow?.address || ""} onChange={(e) => onEditChange("address", e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={saveEdit}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete confirm */}
            <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
                <DialogTitle>Delete student?</DialogTitle>
                <DialogContent dividers>
                    <Typography>Are you sure you want to delete {delRow?.fullName} ({delRow?.enrolno})?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDelOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}