import React, { useContext, useEffect, useState } from "react";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

export default function Student_List() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5" fontWeight={700}>Students</Typography>
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
                                    <TableCell>Course</TableCell>
                                    <TableCell>Contact</TableCell>
                                    <TableCell>Gender</TableCell>
                                    <TableCell>Address</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((r) => (
                                    <TableRow key={r._id || r.enrolno} hover>
                                        <TableCell>{r.enrolno}</TableCell>
                                        <TableCell>{r.fullName}</TableCell>
                                        <TableCell>{r.email}</TableCell>
                                        <TableCell>{r.course}</TableCell>
                                        <TableCell>{r.contact}</TableCell>
                                        <TableCell>{r.gender}</TableCell>
                                        <TableCell>{r.address}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            )}
        </Box>
    );
}
