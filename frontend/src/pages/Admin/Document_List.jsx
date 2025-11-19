// import React, { useContext, useEffect, useMemo, useState } from "react";
// import {
//     Box,
//     Link,
//     MenuItem,
//     TextField,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     CircularProgress,
//     TablePagination,
// } from "@mui/material";
// import { AuthContext } from "../../context/AuthContext";

// const API_BASE = "http://localhost:5000/api";
// const API_BASE = import.meta.env.VITE_API_BASE;
// const BACKEND_BASE = "http://localhost:5000";
// const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE;

// const toBackendUrl = (p) => {
//     if (!p) return "";
//     return p.startsWith("/uploads") ? `${BACKEND_BASE}${p}` : p;
// };

// export default function AdminDocumentList() {
//     const { token } = useContext(AuthContext);

//     const [categories, setCategories] = useState([]);
//     const [selectedCat, setSelectedCat] = useState("");
//     const [docs, setDocs] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [loadingCats, setLoadingCats] = useState(false);
//     const [q, setQ] = useState(''); //Pagination
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     const headers = useMemo(() => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}) }), [token]);

//     const fetchCategories = async () => {
//         setLoadingCats(true);
//         try {
//             const res = await fetch(`${API_BASE}/categories`, { headers });
//             const data = await res.json();
//             if (res.ok) setCategories(Array.isArray(data) ? data : []);
//         } finally {
//             setLoadingCats(false);
//         }
//     };

//     const fetchDocs = async (categoryIdOrName = "") => {
//         setLoading(true);
//         try {
//             const qs = categoryIdOrName
//                 ? categoryIdOrName.startsWith("id:")
//                     ? `?categoryId=${encodeURIComponent(categoryIdOrName.slice(3))}`
//                     : `?categoryName=${encodeURIComponent(categoryIdOrName)}`
//                 : "";
//             const res = await fetch(`${API_BASE}/documents${qs}`, { headers });
//             const data = await res.json();
//             setDocs(res.ok ? (Array.isArray(data) ? data : []) : []);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!token) return;
//         fetchCategories();
//         fetchDocs("");
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [token]);

//     const handleCategoryChange = (e) => {
//         const val = e.target.value;
//         setSelectedCat(val);
//         if (!token) return;
//         if (!val) fetchDocs("");
//         else fetchDocs(`id:${val}`);
//     };

//     const getFileName = (doc) => {
//         if (doc?.fileOriginalName) return doc.fileOriginalName;
//         try {
//             const u = doc?.fileUrl || "";
//             const parts = u.split("/");
//             return parts[parts.length - 1] || "Open";
//         } catch {
//             return "Open";
//         }
//     };

//     const handleChangePage = (_evt, newPage) => setPage(newPage);
//     const handleChangeRowsPerPage = (evt) => {
//         setRowsPerPage(parseInt(evt.target.value, 10));
//         setPage(0);
//     };

//     // Derived data: filtered and paged rows
//     const filtered = useMemo(() => {
//         const term = q.trim().toLowerCase();
//         if (!term) return docs;
//         return docs.filter((f) =>
//             [f.student?.fullName || f.studentName, f.student?.enrolno || f.studentEnrolno].some((v) => String(v || '').toLowerCase().includes(term))
//         );
//     }, [q, docs]);

//     const pagedRows = useMemo(() => {
//         const start = page * rowsPerPage;
//         return filtered.slice(start, start + rowsPerPage);
//     }, [filtered, page, rowsPerPage]);

//     // Reset page when search or rowsPerPage changes
//     useEffect(() => {
//         setPage(0);
//     }, [q, rowsPerPage]);

//     return (
//         <Box sx={{ p: 3 }}>
//             <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
//                 <Typography variant="h5" fontWeight={700}>Documents</Typography>
//                 <Box display="flex" alignItems="center" gap={2}>
//                     <TextField
//                         select
//                         label={loadingCats ? "Loading categories..." : "Filter by Category"}
//                         value={selectedCat}
//                         onChange={handleCategoryChange}
//                         sx={{ minWidth: 240 }}
//                         disabled={loadingCats}
//                     >
//                         <MenuItem value="">All</MenuItem>
//                         {categories.map((c) => (
//                             <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
//                         ))}
//                     </TextField>
//                 </Box>
//             </Box>

//             <Box sx={{ p: 2 }}>
//                 {loading ? (
//                     <Box display="flex" justifyContent="center" alignItems="center" py={6}>
//                         <CircularProgress />
//                     </Box>
//                 ) : docs.length === 0 ? (
//                     <Typography>No documents found</Typography>
//                 ) : (
//                     <TableContainer component={Box}>
//                         <Table size="small">
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>Student Name</TableCell>
//                                     <TableCell>Enrolment No</TableCell>
//                                     <TableCell>Type</TableCell>
//                                     <TableCell>Category</TableCell>
//                                     <TableCell>Date</TableCell>
//                                     <TableCell>File</TableCell>
//                                     <TableCell>Images</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {docs.map((d) => (
//                                     <TableRow key={d._id} hover>
//                                         <TableCell>{d.student?.fullName || d.studentName}</TableCell>
//                                         <TableCell>{d.student?.enrolno || d.studentEnrolno}</TableCell>
//                                         <TableCell>{d.type}</TableCell>
//                                         <TableCell>{d.category?.name || d.categoryName}</TableCell>
//                                         <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
//                                         <TableCell>
//                                             <Link href={toBackendUrl(d.fileUrl)} target="_blank" rel="noopener" underline="hover">
//                                                 {getFileName(d)}
//                                             </Link>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Box display="flex" gap={0.5} flexWrap="wrap">
//                                                 {(d.images || []).slice(0, 4).map((img, idx) => (
//                                                     <img
//                                                         key={idx}
//                                                         src={toBackendUrl(img)}
//                                                         alt={`img-${idx}`}
//                                                         style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }}
//                                                     />
//                                                 ))}
//                                             </Box>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 )}

//                 <TablePagination
//                     component="div"
//                     count={filtered.length} // Count is based on filtered rows
//                     page={page}
//                     onPageChange={handleChangePage}
//                     rowsPerPage={rowsPerPage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                     rowsPerPageOptions={[5, 10, 25, 50]}
//                     showFirstButton
//                     showLastButton
//                 />
//             </Box>
//         </Box>
//     );
// }

import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Box,
    Link,
    MenuItem,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    TablePagination,
    Paper,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

// const API_BASE = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_BASE;
// const BACKEND_BASE = "http://localhost:5000";
const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE;

const toBackendUrl = (p) => {
    if (!p) return "";
    return p.startsWith("/uploads") ? `${BACKEND_BASE}${p}` : p;
};

export default function AdminDocumentList() {
    const { token } = useContext(AuthContext);

    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState("");
    const [loadingCats, setLoadingCats] = useState(false);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState(''); // (kept for existing logic)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const headers = useMemo(() => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}) }), [token]);

    const fetchCategories = async () => {
        setLoadingCats(true);
        try {
            const res = await fetch(`${API_BASE}/categories`, { headers });
            const data = await res.json();
            if (res.ok) setCategories(Array.isArray(data) ? data : []);
        } finally {
            setLoadingCats(false);
        }
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
            setDocs(res.ok ? (Array.isArray(data) ? data : []) : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        fetchCategories();
        fetchDocs("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

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

    const handleChangePage = (_evt, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (evt) => {
        setRowsPerPage(parseInt(evt.target.value, 10));
        setPage(0);
    };

    // Derived data: filtered and paged rows
    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return docs;
        return docs.filter((f) =>
            [f.student?.fullName || f.studentName, f.student?.enrolno || f.studentEnrolno].some((v) => String(v || '').toLowerCase().includes(term))
        );
    }, [q, docs]);

    const pagedRows = useMemo(() => {
        const start = page * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page, rowsPerPage]);

    // Reset page when search or rowsPerPage changes
    useEffect(() => {
        setPage(0);
    }, [q, rowsPerPage]);

    return (
        <Box sx={{ p: 3 }}>
            <Paper
                elevation={4}
                sx={{
                    p: 2,
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                }}
            >

                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: "#2B6EF6" }}>
                        Documents List
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2}>
                        <TextField
                            select
                            label={loadingCats ? "Loading categories..." : "Filter by Category"}
                            size="small"
                            value={selectedCat}
                            onChange={handleCategoryChange}
                            sx={{
                                minWidth: 240,
                                background: "#fff",
                                borderRadius: 2,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                "& .MuiInputLabel-root": { color: "text.secondary" }
                            }}
                            disabled={loadingCats}
                        >
                            <MenuItem value="">All</MenuItem>
                            {categories.map((c) => (
                                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>

                {/* Card wrapper with shadow & rounded */}

                <Box sx={{ p: 2 }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                            <CircularProgress />
                        </Box>
                    ) : docs.length === 0 ? (
                        <Typography sx={{ p: 2 }}>No documents found</Typography>
                    ) : (
                        <TableContainer component={Box}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#f5f7ff" }}>
                                        <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Enrolment No</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>File</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Images</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pagedRows.map((d) => (
                                        <TableRow key={d._id} hover>
                                            <TableCell>{d.student?.fullName || d.studentName}</TableCell>
                                            <TableCell>{d.student?.enrolno || d.studentEnrolno}</TableCell>
                                            <TableCell>{d.type}</TableCell>
                                            <TableCell>{d.category?.name || d.categoryName}</TableCell>
                                            <TableCell>{d.date ? new Date(d.date).toLocaleDateString() : "-"}</TableCell>
                                            <TableCell>
                                                <Link href={toBackendUrl(d.fileUrl)} target="_blank" rel="noopener" underline="hover">
                                                    {getFileName(d)}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Box display="flex" gap={0.5} flexWrap="wrap">
                                                    {(d.images || []).slice(0, 4).map((img, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={toBackendUrl(img)}
                                                            alt={`img-${idx}`}
                                                            style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "1px solid #eee" }}
                                                        />
                                                    ))}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <Box display="flex" justifyContent="flex-end" pt={1}>
                        <TablePagination
                            component="div"
                            count={filtered.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
