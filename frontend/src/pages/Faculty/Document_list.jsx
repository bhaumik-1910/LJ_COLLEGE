import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Grid, IconButton, Link, MenuItem, Paper, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, TablePagination } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from '@mui/icons-material/Description';

const API_BASE = "http://localhost:5000/api";
const BACKEND_BASE = "http://localhost:5000";

const toBackendUrl = (p) => {
    if (!p) return "";
    // make absolute if backend served path
    return p.startsWith("/uploads") ? `${BACKEND_BASE}${p}` : p;
};

export default function Document_list() {
    const { token } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState("");
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCats, setLoadingCats] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [targetId, setTargetId] = useState("");

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const fetchCategories = async () => {
        setLoadingCats(true);
        try {
            const res = await fetch(`${API_BASE}/categories`, { headers });
            const data = await res.json();
            if (res.ok) setCategories(Array.isArray(data) ? data : []);
            else toast.error(data.message || "Failed to fetch categories");
        } catch (e) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoadingCats(false);
        }
    };

    const headers = useMemo(() => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}) }), [token]);

    const paginatedDocs = useMemo(() => {
        const start = page * rowsPerPage;
        return docs.slice(start, start + rowsPerPage);
    }, [docs, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchDocs = async (categoryIdOrName = "") => {
        setLoading(true);
        try {
            const qs = categoryIdOrName
                ? categoryIdOrName.startsWith("id:")
                    ? `?categoryId=${encodeURIComponent(categoryIdOrName.slice(3))}`
                    : `?categoryName=${encodeURIComponent(categoryIdOrName)}`
                : "";
            const res = await fetch(`${API_BASE}/documents${qs}`, { headers });
            const data = await res.json();
            if (res.ok) setDocs(Array.isArray(data) ? data : []);
            else toast.error(data.message || "Failed to fetch documents");
        } catch (e) {
            toast.error("Failed to fetch documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchCategories();
        fetchDocs("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        setSelectedCat(val);
        if (!token) return;
        if (!val) fetchDocs("");
        else fetchDocs(`id:${val}`);
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

    const openDeleteDialog = (id) => { setTargetId(id); setConfirmOpen(true); };
    const closeDeleteDialog = () => { setConfirmOpen(false); setTargetId(""); };
    const confirmDelete = async () => {
        if (!token || !targetId) return; setDeletingId(targetId);
        try {
            const res = await fetch(`${API_BASE}/documents/${targetId}`, { method: 'DELETE', headers });
            if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.message || 'Failed to delete'); }
            toast.success('Deleted');
            if (!selectedCat) fetchDocs(""); else fetchDocs(`id:${selectedCat}`);
            closeDeleteDialog();
        } catch (e) { toast.error(e.message || 'Delete failed'); }
        finally { setDeletingId(""); }
    };

    return (
        <Box sx={{ p: 3 }}>

            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>

                <Typography
                    variant="h5"
                    fontWeight={700}
                    color="primary.main"
                    display="flex"
                    alignItems="center"
                    gap={1}
                >
                    Documents List
                    <DescriptionIcon fontSize="large" />
                </Typography>

                <Box display="flex" alignItems="center" gap={2}>
                    <TextField
                        select
                        label={loadingCats ? "Loading categories..." : "Filter by Category"}
                        value={selectedCat}
                        onChange={handleCategoryChange}
                        sx={{ minWidth: 240 }}
                        size="small"
                        disabled={loadingCats}
                    >
                        <MenuItem value="">All</MenuItem>
                        {categories.map((c) => (
                            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>

            <Box sx={{ p: 2 }}>
                {loading ? (
                    // Display loading indicator
                    <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                        <CircularProgress />
                    </Box>
                ) : docs.length === 0 ? (
                    // Display "No documents found" message
                    <Typography>No documents found</Typography>
                ) : (
                    <>
                        {/* Display the table with documents */}
                        <TableContainer component={Box} >
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Student Name</TableCell>
                                        <TableCell>Enrolment No</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>File</TableCell>
                                        <TableCell>Images</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedDocs.map((d) => (
                                        <TableRow key={d._id} hover>
                                            <TableCell>{d.student?.fullName || d.studentName}</TableCell>
                                            <TableCell>{d.student?.enrolno || d.studentEnrolno}</TableCell>
                                            <TableCell>{d.type}</TableCell>
                                            <TableCell>{d.category?.name || d.categoryName}</TableCell>
                                            <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Link href={toBackendUrl(d.fileUrl)} target="_blank" rel="noopener" underline="hover">
                                                    {getFileName(d)}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" gap={0.5} flexWrap="wrap">
                                                    {(d.images || []).slice(0, 4).map((img, idx) => (
                                                        <img key={idx} src={toBackendUrl(img)} alt={`img-${idx}`} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }} />
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Delete">
                                                    <span>
                                                        <IconButton color="error" size="small" onClick={() => openDeleteDialog(d._id)} disabled={deletingId === d._id}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* 📄 Pagination */}
                        <TablePagination
                            component="div"
                            count={docs.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            showFirstButton
                            showLastButton
                        />
                    </>
                )}
            </Box>

            {/* Delete confirm dialog */}
            <Dialog open={confirmOpen} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Delete Document</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this document? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} disabled={!!deletingId}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={confirmDelete} disabled={!!deletingId}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}