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
    Grid,
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
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [subCategories, setSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    const [loadingCats, setLoadingCats] = useState(false);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState(''); // (kept for existing logic)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const headers = useMemo(() => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}) }), [token]);

    // const fetchCategories = async () => {
    //     setLoadingCats(true);
    //     try {
    //         const res = await fetch(`${API_BASE}/categories`, { headers });
    //         const data = await res.json();
    //         if (res.ok) setCategories(Array.isArray(data) ? data : []);
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

    // Proper Document Data So 
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
    }, [token]);

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        setSelectedCat(val);

        setSelectedType("");
        setSelectedSubCategory("");

        if (!token) return;
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


    //Dowlond
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
            <Paper
                elevation={2} sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, bgcolor: '#fff' }}
            >

                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: "#2B6EF6" }}>
                        Documents List
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

                {/* Card wrapper with shadow & rounded */}

                <Box sx={{ p: 2 }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                            <CircularProgress />
                        </Box>
                    ) : docs.length === 0 ? (
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
                        <TableContainer component={Box}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Univesity Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Institute Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Sub Category</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="center">File</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="center">Images</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pagedRows.map((d) => (
                                        <TableRow key={d._id} hover>
                                            <TableCell>{d.universityName}</TableCell>
                                            <TableCell>{d.instituteName}</TableCell>
                                            <TableCell>{d.course}</TableCell>
                                            <TableCell>{d.type}</TableCell>
                                            <TableCell>{d.category?.name || d.categoryName}</TableCell>
                                            <TableCell>{d.subCategory || "-"}</TableCell>
                                            <TableCell>{d.date ? new Date(d.date).toLocaleDateString() : "-"}</TableCell>
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
                                                        // <img
                                                        //     key={idx}
                                                        //     src={toBackendUrl(img)}
                                                        //     alt={`img-${idx}`}
                                                        //     style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "1px solid #eee" }}
                                                        // />
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
