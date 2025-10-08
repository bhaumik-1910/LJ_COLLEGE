import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination, TextField, } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

export default function Student_List() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // Search and pagination state
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Derived data: filtered and paged rows
    const filteredRows = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((r) => {
            const fields = [r.name, r.email, r.role];
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
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Box mb={2}>
                <Typography variant="h5" fontWeight={700}>Students</Typography>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <TextField
                    size="small"
                    placeholder="Search student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ maxWidth: 360 }}
                />
                <Button variant="contained" onClick={() => navigate("/faculty-dashboard/add-student")}>Add Student</Button>
            </Box>

            {
                loading && (
                    <Box display="flex" alignItems="center" justifyContent="center" py={6}>
                        <CircularProgress />
                    </Box>
                )
            }

            {
                !loading && error && (
                    <Typography color="error" mb={2}>{error}</Typography>
                )
            }

            {
                !loading && !error && (
                    rows.length === 0 ? (
                        <Typography color="text.secondary">No students found.</Typography>
                    ) : (
                        <TableContainer component={Box}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Enrollment No</TableCell>
                                        <TableCell>Full Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Password</TableCell>
                                        <TableCell>Course</TableCell>
                                        <TableCell>Contact</TableCell>
                                        <TableCell>Gender</TableCell>
                                        <TableCell>Address</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pagedRows.map((r) => (
                                        <TableRow key={r._id || r.enrolno} hover>
                                            <TableCell>{r.enrolno}</TableCell>
                                            <TableCell>{r.fullName}</TableCell>
                                            <TableCell>{r.email}</TableCell>
                                            <TableCell>{r.password}</TableCell>
                                            <TableCell>{r.course}</TableCell>
                                            <TableCell>{r.contact}</TableCell>
                                            <TableCell>{r.gender}</TableCell>
                                            <TableCell>{r.address}</TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredRows.length === 0 && !loading && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">No users</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )
                )
            }
            {/* Pagination */}
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
        </Box >
    );
}
