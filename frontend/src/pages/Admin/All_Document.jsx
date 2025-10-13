import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, CircularProgress, Grid, TablePagination } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = "http://localhost:5000/api";
const BACKEND_BASE = "http://localhost:5000";

const toBackendUrl = (p) => {
    if (!p) return "";
    return p.startsWith("/uploads") ? `${BACKEND_BASE}${p}` : p;
};

export default function All_Document() {
    const { token } = useContext(AuthContext);
    const headers = useMemo(() => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}) }), [token]);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // Fetch documents with pagination parameters
    const fetchAllDocs = async (p, limit) => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/documents?page=${p + 1}&limit=${limit}`, { headers });
            const data = await res.json();
            if (res.ok) {
                setItems(Array.isArray(data.items) ? data.items : []);
                setTotal(data.total || 0); // Assuming your backend sends back 'total' count
            }
        } catch (_) {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    // This useEffect will run when page or rowsPerPage changes
    useEffect(() => {
        fetchAllDocs(page, rowsPerPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, token]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when rows per page changes
    };

    const getFileName = (doc) => {
        if (doc?.fileOriginalName) return doc.fileOriginalName;
        try {
            const u = doc?.fileUrl || "";
            const parts = u.split("/");
            return parts[parts.length - 1] || "Open";
        } catch {
            return "Open";
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight={700}>All Documents</Typography>
            </Box>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" py={6}><CircularProgress /></Box>
            ) : (
                <>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Enrolment No</TableCell>
                                    <TableCell>Student Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>File</TableCell>
                                    <TableCell>Images</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((d) => (
                                    <TableRow key={d._id} hover>
                                        <TableCell>{d.student?.enrolno || d.studentEnrolno}</TableCell>
                                        <TableCell>{d.student?.fullName || d.studentName}</TableCell>
                                        <TableCell>{d.type}</TableCell>
                                        <TableCell>{d.category?.name || d.categoryName}</TableCell>
                                        <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Link href={toBackendUrl(d.fileUrl)} target="_blank" rel="noopener" underline="hover">
                                                {getFileName(d)}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Grid container spacing={1}>
                                                {(d.images || []).slice(0, 4).map((img, idx) => (
                                                    <Grid item key={idx}>
                                                        <a href={toBackendUrl(img)} target="_blank" rel="noopener noreferrer">
                                                            <img
                                                                src={toBackendUrl(img)}
                                                                alt={`img-${idx}`}
                                                                style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }}
                                                            />
                                                        </a>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">No documents found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                showFirstButton
                showLastButton
            />
        </Box>
    );
}