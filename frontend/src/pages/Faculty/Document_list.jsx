import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Grid, IconButton, Link, MenuItem, Paper, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, TablePagination } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';

// const API_BASE = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_BASE;
// const BACKEND_BASE = "http://localhost:5000";
const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE;

const toBackendUrl = (p) => {
    if (!p) return "";
    // make absolute if backend served path
    return p.startsWith("/uploads") ? `${BACKEND_BASE}${p}` : p;
};

export default function Document_list() {
    const { token } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState("");

    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const [loadingCats, setLoadingCats] = useState(false);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [targetId, setTargetId] = useState("");

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    // const fetchDocs = async (categoryIdOrName = "") => {
    //     setLoading(true);
    //     try {
    //         const qs = categoryIdOrName
    //             ? categoryIdOrName.startsWith("id:")
    //                 ? `?categoryId=${encodeURIComponent(categoryIdOrName.slice(3))}`
    //                 : `?categoryName=${encodeURIComponent(categoryIdOrName)}`
    //             : "";

    //         const res = await fetch(`${API_BASE}/documents${qs}`, { headers });
    //         const data = await res.json();

    //         if (!res.ok) {
    //             toast.error(data.message || "Failed to fetch documents");
    //             setDocs([]);
    //             return;
    //         }

    //         // correct data extraction
    //         if (data.success && Array.isArray(data.data)) {
    //             setDocs(data.data);
    //         } else {
    //             setDocs([]);
    //         }

    //     } catch (e) {
    //         toast.error("Failed to fetch documents");
    //         setDocs([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // const fetchCategories = async () => {
    //     setLoadingCats(true);
    //     try {
    //         const res = await fetch(`${API_BASE}/categories`, { headers });
    //         const data = await res.json();
    //         if (res.ok) setCategories(Array.isArray(data) ? data : []);
    //         else toast.error(data.message || "Failed to fetch categories");
    //     } catch (e) {
    //         toast.error("Failed to fetch categories");
    //     } finally {
    //         setLoadingCats(false);
    //     }
    // };
    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE}/documents/categories`, {
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            });

            const data = await res.json();

            if (res.ok) setCategories(Array.isArray(data) ? data : []);
            else toast.error(data.message || "Failed to fetch categories");
        } catch (e) {
            toast.error("Failed to fetch categories");
        }
    };

    const fetchTypes = async () => {
        try {
            const res = await fetch(`${API_BASE}/documents/types`, {
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            });
            const data = await res.json();
            if (res.ok) setTypes(Array.isArray(data) ? data : []);
            else toast.error(data.message || "Failed to fetch types");
        } catch (e) {
            toast.error("Failed to fetch types");
        }
    };

    const fetchSubCategories = async () => {
        try {
            const res = await fetch(`${API_BASE}/documents/subcategories`, {
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            });

            const data = await res.json();

            if (res.ok) setSubCategories(Array.isArray(data) ? data : []);
            else toast.error(data.message || "Failed to fetch sub categories");

        } catch (e) {
            toast.error("Failed to fetch sub categories");
        }
    };

    const fetchDocs = async (query = "") => {
        setLoading(true);
        try {
            const res = await fetch(
                `${API_BASE}/documents${query ? `?${query}` : ""}`,
                { headers }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to fetch documents");
                setDocs([]);
                return;
            }

            setDocs(data.data || []);
        } catch (e) {
            toast.error("Failed to fetch documents");
            setDocs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchCategories();
        fetchTypes();
        fetchSubCategories();
        fetchDocs("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        setSelectedCat(val);

        setSelectedType("");
        setSelectedSubCategory("");

        if (!val) fetchDocs("");
        // else fetchDocs(`id:${val}`);
        else fetchDocs(`categoryId=${val}`);
    };

    const handleTypeChange = (e) => {
        const val = e.target.value;

        setSelectedType(val);
        setSelectedCat("");
        setSelectedSubCategory("");

        if (!val) {
            fetchDocs("");    // ALL DATA
        } else {
            fetchDocs(`type=${val}`);   // ONLY TYPE FILTER
        }
    };


    const handleSubCategoryChange = (e) => {
        const val = e.target.value;
        setSelectedSubCategory(val);

        let query = "";

        if (selectedCat) query += `categoryId=${selectedCat}`;
        if (val) query += `${query ? "&" : ""}subCategory=${encodeURIComponent(val)}`;

        fetchDocs(query);
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
            toast.success('Deleted Document');
            if (!selectedCat) fetchDocs(""); else fetchDocs(`id:${selectedCat}`);
            closeDeleteDialog();
        } catch (e) { toast.error(e.message || 'Delete failed'); }
        finally { setDeletingId(""); }
    };

    //Download 
    const downloadFile = async (url, filename = "download") => {
        try {
            const res = await fetch(toBackendUrl(url));
            const blob = await res.blob();
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            toast.error("Download failed");
        }
    };


    return (
        <Box sx={{ p: 3 }}>

            <Paper sx={{ p: 3 }}>

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

                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <TextField
                                select
                                fullWidth
                                label={loadingCats ? "Loading Type..." : "Filter by Type"}
                                size="small"
                                value={selectedType}
                                onChange={handleTypeChange}
                                sx={{ minWidth: 200 }}
                            >
                                <MenuItem value="">All</MenuItem>
                                {types.map((t, i) => (
                                    <MenuItem key={i} value={t}>
                                        {t}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                select
                                fullWidth
                                label={loadingCats ? "Loading Categories..." : "Filter by Category"}
                                value={selectedCat}
                                onChange={handleCategoryChange}
                                sx={{ minWidth: 200 }}
                                size="small"
                                disabled={loadingCats}
                            >
                                <MenuItem value="">All</MenuItem>
                                {categories.map((c) => (
                                    <MenuItem key={c._id} value={c._id}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                select
                                fullWidth
                                label={loadingCats ? "Loading Sub Categories..." : "Filter by Sub Category"}
                                size="small"
                                value={selectedSubCategory}
                                onChange={handleSubCategoryChange}
                                sx={{ minWidth: 200 }}
                            >
                                <MenuItem value="">All</MenuItem>
                                {subCategories.map((sc, i) => (
                                    <MenuItem key={i} value={sc}>
                                        {sc}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                </Box>

                {loading ? (
                    // Display loading indicator
                    <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                        <CircularProgress />
                    </Box>
                ) : docs.length === 0 ? (
                    // Display "No documents found" message
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="200px"
                    >
                        <Typography sx={{ p: 2 }}>
                            No documents found
                        </Typography>
                    </Box>

                ) : (
                    <>
                        {/* Display the table with documents */}
                        <TableContainer component={Box} >
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Univesity Name</TableCell>
                                        <TableCell>Institute Name</TableCell>
                                        <TableCell>Course</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Sub Category</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>File</TableCell>
                                        <TableCell>Images</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedDocs.map((d) => (
                                        <TableRow key={d._id} hover>
                                            <TableCell>{d.universityName}</TableCell>
                                            <TableCell>{d.instituteName}</TableCell>
                                            <TableCell>{d.course}</TableCell>
                                            <TableCell>{d.type}</TableCell>
                                            <TableCell>{d.category?.name || d.categoryName}</TableCell>
                                            <TableCell>{d.subCategory || "-"}</TableCell>
                                            <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                {/* <Link href={toBackendUrl(d.fileUrl)} target="_blank" rel="noopener" underline="hover">
                                                    {getFileName(d)}
                                                </Link> */}
                                                <Link
                                                    component="button"
                                                    underline="hover"
                                                    onClick={() => downloadFile(d.fileUrl, getFileName(d))}
                                                >
                                                    {getFileName(d)}
                                                </Link>

                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" gap={0.5} flexWrap="wrap">
                                                    {(d.images || []).slice(0, 4).map((img, idx) => (
                                                        // <img key={idx} src={toBackendUrl(img)} alt={`img-${idx}`} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }} />
                                                        <img
                                                            key={idx}
                                                            src={toBackendUrl(img)}
                                                            alt={`img-${idx}`}
                                                            onClick={() => downloadFile(img, `image-${idx + 1}.jpg`)}
                                                            style={{
                                                                width: 36,
                                                                height: 36,
                                                                objectFit: "cover",
                                                                borderRadius: 4,
                                                                border: "1px solid #ddd",
                                                                cursor: "pointer"
                                                            }}
                                                        />

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
            </Paper>

            {/* Delete confirm dialog */}
            <Dialog open={confirmOpen} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
                <DialogTitle>Delete Document</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        Are you sure you want to delete this document? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={closeDeleteDialog}
                        disabled={!!deletingId}
                        variant="outlined"
                        startIcon={<CancelIcon />}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={confirmDelete}
                        disabled={!!deletingId}
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}