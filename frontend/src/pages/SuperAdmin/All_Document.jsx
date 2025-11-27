// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, CircularProgress, Grid, TablePagination } from "@mui/material";
// import { AuthContext } from "../../context/AuthContext";

// const API_BASE = "http://localhost:5000/api";
// const API_BASE = import.meta.env.VITE_API_BASE;
// const BACKEND_BASE = "http://localhost:5000";
// const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE;

// const toBackendUrl = (p) => {
//     if (!p) return "";
//     return p.startsWith("/uploads") ? `${BACKEND_BASE}${p}` : p;
// };

// export default function All_Document() {
//     const { token } = useContext(AuthContext);
//     const headers = useMemo(() => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}) }), [token]);

//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // Pagination state
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [total, setTotal] = useState(0);

//     // Fetch documents with pagination parameters
//     const fetchAllDocs = async (p, limit) => {
//         if (!token) return;
//         setLoading(true);
//         try {
//             const res = await fetch(`${API_BASE}/superadmin/documents?page=${p + 1}&limit=${limit}`, { headers });
//             const data = await res.json();
//             if (res.ok) {
//                 setItems(Array.isArray(data.items) ? data.items : []);
//                 setTotal(data.total || 0); // Assuming your backend sends back 'total' count
//             }
//         } catch (_) {
//             // ignore
//         } finally {
//             setLoading(false);
//         }
//     };

//     // This useEffect will run when page or rowsPerPage changes
//     useEffect(() => {
//         fetchAllDocs(page, rowsPerPage);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [page, rowsPerPage, token]);

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0); // Reset to the first page when rows per page changes
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

//     return (
//         <Box sx={{ p: 3 }}>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//                 <Typography variant="h5" fontWeight={700}>All Documents</Typography>
//             </Box>

//             {loading ? (
//                 <Box display="flex" justifyContent="center" alignItems="center" py={6}><CircularProgress /></Box>
//             ) : (
//                 <>
//                     <TableContainer>
//                         <Table size="small">
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>Enrolment No</TableCell>
//                                     <TableCell>Student Name</TableCell>
//                                     <TableCell>Type</TableCell>
//                                     <TableCell>Category</TableCell>
//                                     <TableCell>Date</TableCell>
//                                     <TableCell>File</TableCell>
//                                     <TableCell>Images</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {items.map((d) => (
//                                     <TableRow key={d._id} hover>
//                                         <TableCell>{d.student?.enrolno || d.studentEnrolno}</TableCell>
//                                         <TableCell>{d.student?.fullName || d.studentName}</TableCell>
//                                         <TableCell>{d.type}</TableCell>
//                                         <TableCell>{d.category?.name || d.categoryName}</TableCell>
//                                         <TableCell>{new Date(d.date).toLocaleDateString()}</TableCell>
//                                         <TableCell>
//                                             <Link href={toBackendUrl(d.fileUrl)} target="_blank" rel="noopener" underline="hover">
//                                                 {getFileName(d)}
//                                             </Link>
//                                         </TableCell>
//                                         <TableCell>
//                                             <Grid container spacing={1}>
//                                                 {(d.images || []).slice(0, 4).map((img, idx) => (
//                                                     <Grid item key={idx}>
//                                                         <a href={toBackendUrl(img)} target="_blank" rel="noopener noreferrer">
//                                                             <img
//                                                                 src={toBackendUrl(img)}
//                                                                 alt={`img-${idx}`}
//                                                                 style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }}
//                                                             />
//                                                         </a>
//                                                     </Grid>
//                                                 ))}
//                                             </Grid>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                                 {items.length === 0 && (
//                                     <TableRow>
//                                         <TableCell colSpan={7} align="center">No documents found</TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 </>
//             )}

//             <TablePagination
//                 component="div"
//                 count={total}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={rowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//                 showFirstButton
//                 showLastButton
//             />
//         </Box>
//     );
// }

//-----------------------------------------------------------------------------------
// import React, { useContext, useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Link,
//   CircularProgress,
//   Grid,
//   TablePagination,
//   Paper,
//   Stack,
//   Avatar,
//   Chip,
//   Tooltip,
// } from "@mui/material";
// import { AuthContext } from "../../context/AuthContext";

// const API_BASE = "http://localhost:5000/api";
// const API_BASE = import.meta.env.VITE_API_BASE;
// const BACKEND_BASE = "http://localhost:5000";
// const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE;

// const toBackendUrl = (p) => {
//   if (!p) return "";
//   return p.startsWith("/uploads") ? `${BACKEND_BASE}${p}` : p;
// };

// export default function All_Document() {
//   const { token } = useContext(AuthContext);
//   const headers = useMemo(() => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}) }), [token]);

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Pagination state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [total, setTotal] = useState(0);

//   // Fetch documents with pagination parameters
//   const fetchAllDocs = async (p, limit) => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/superadmin/documents?page=${p + 1}&limit=${limit}`, { headers });
//       const data = await res.json();
//       if (res.ok) {
//         setItems(Array.isArray(data.items) ? data.items : []);
//         setTotal(data.total || 0); // Assuming your backend sends back 'total' count
//       }
//     } catch (_) {
//       // ignore
//     } finally {
//       setLoading(false);
//     }
//   };

//   // This useEffect will run when page or rowsPerPage changes
//   useEffect(() => {
//     fetchAllDocs(page, rowsPerPage);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, rowsPerPage, token]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0); // Reset to the first page when rows per page changes
//   };

//   const getFileName = (doc) => {
//     if (doc?.fileOriginalName) return doc.fileOriginalName;
//     try {
//       const u = doc?.fileUrl || "";
//       const parts = u.split("/");
//       return parts[parts.length - 1] || "Open";
//     } catch {
//       return "Open";
//     }
//   };

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 } }}>
//       <Paper elevation={3} sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, bgcolor: '#fff' }}>
//         {/* Header */}
//         <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
//           <Typography variant="h5" fontWeight={700}>
//             All Documents
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Showing {items.length} items
//           </Typography>
//         </Stack>

//         {/* Loading */}
//         {loading ? (
//           <Box display="flex" justifyContent="center" alignItems="center" py={6}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <>
//             <TableContainer>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Enrolment No</TableCell>
//                     <TableCell>Student Name</TableCell>
//                     <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Type</TableCell>
//                     <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Category</TableCell>
//                     <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Date</TableCell>
//                     <TableCell>File</TableCell>
//                     <TableCell sx={{ width: 160 }}>Images</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {items.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                         No documents found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     items.map((d) => (
//                       <TableRow key={d._id} hover>
//                         <TableCell sx={{ minWidth: 120 }}>
//                           {d.student?.enrolno || d.studentEnrolno || "-"}
//                         </TableCell>

//                         <TableCell>
//                           <Stack direction="row" spacing={1} alignItems="center">
//                             <Avatar
//                               sx={{
//                                 width: 36,
//                                 height: 36,
//                                 bgcolor: "primary.light",
//                                 color: "primary.contrastText",
//                                 fontSize: 14,
//                               }}
//                             >
//                               {((d.student?.fullName || d.studentName || "U")
//                                 .split(" ")
//                                 .map((p) => p[0] || "")
//                                 .slice(0, 2)
//                                 .join("") || "U"
//                               ).toUpperCase()}
//                             </Avatar>

//                             <Box>
//                               <Typography sx={{ fontWeight: 600 }}>
//                                 {d.student?.fullName || d.studentName || "-"}
//                               </Typography>
//                               <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "inline", sm: "none" } }}>
//                                 {d.student?.enrolno || d.studentEnrolno || ""}
//                               </Typography>
//                             </Box>
//                           </Stack>
//                         </TableCell>

//                         <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{d.type || "-"}</TableCell>

//                         <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
//                           {d.category?.name || d.categoryName || "-"}
//                         </TableCell>

//                         <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
//                           {d.date ? new Date(d.date).toLocaleDateString() : "-"}
//                         </TableCell>

//                         <TableCell>
//                           <Link href={toBackendUrl(d.fileUrl)} target="_blank" rel="noopener" underline="hover">
//                             {getFileName(d)}
//                           </Link>
//                         </TableCell>

//                         {/* Images column — DESIGN UPDATED: max 4 images in one line */}
//                         <TableCell>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               gap: 1,
//                               alignItems: "center",
//                               flexWrap: "nowrap",
//                               overflow: "hidden",
//                             }}
//                           >
//                             {(d.images || []).slice(0, 4).map((img, idx) => (
//                               <Tooltip key={idx} title="Open image" arrow>
//                                 <Link
//                                   href={toBackendUrl(img)}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   sx={{ display: "inline-block" }}
//                                 >
//                                   <Box
//                                     component="img"
//                                     src={toBackendUrl(img)}
//                                     alt={`img-${idx}`}
//                                     sx={{
//                                       width: 52,
//                                       height: 52,
//                                       objectFit: "cover",
//                                       borderRadius: 1,
//                                       border: "1px solid #e6e6e6",
//                                       display: "block",
//                                     }}
//                                   />
//                                 </Link>
//                               </Tooltip>
//                             ))}

//                             {/* If more than 4 images, show +N badge (purely visual, no behavior change) */}
//                             {(d.images || []).length > 4 && (
//                               <Box
//                                 sx={{
//                                   minWidth: 52,
//                                   height: 52,
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   borderRadius: 1,
//                                   border: "1px dashed #e6e6e6",
//                                   bgcolor: "#fafafa",
//                                   ml: 0.5,
//                                 }}
//                               >
//                                 <Typography variant="caption" color="text.secondary">
//                                   +{(d.images || []).length - 4}
//                                 </Typography>
//                               </Box>
//                             )}
//                           </Box>
//                         </TableCell>
//                         {/* End images column */}
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </>
//         )}

//         {/* Pagination */}
//         <Box mt={2} display="flex" justifyContent="flex-end" alignItems="center">
//           <TablePagination
//             component="div"
//             count={total}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[5, 10, 25, 50]}
//             showFirstButton
//             showLastButton
//           />
//         </Box>
//       </Paper>
//     </Box>
//   );
// }
//-------------------------------------------------------------------
// import React, { useContext, useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Link,
//   MenuItem,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   CircularProgress,
//   TablePagination,
//   Paper,
// } from "@mui/material";
// import { AuthContext } from "../../context/AuthContext";

// const API_BASE = "http://localhost:5000/api";
// const API_BASE = import.meta.env.VITE_API_BASE;
// const BACKEND_BASE = "http://localhost:5000";
// const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE;

// const toBackendUrl = (p) => {
//   if (!p) return "";
//   return p.startsWith("/uploads") ? `${BACKEND_BASE}${p}` : p;
// };

// export default function All_Document() {
//   const { token } = useContext(AuthContext);

//   const [categories, setCategories] = useState([]);
//   const [selectedCat, setSelectedCat] = useState("");
//   const [loadingCats, setLoadingCats] = useState(false);

//   const [docs, setDocs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [q, setQ] = useState(''); // (kept for existing logic)
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   const headers = useMemo(() => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}) }), [token]);

//   const fetchCategories = async () => {
//     setLoadingCats(true);
//     try {
//       const res = await fetch(`${API_BASE}/categories`, { headers });
//       const data = await res.json();
//       if (res.ok) setCategories(Array.isArray(data) ? data : []);
//     } finally {
//       setLoadingCats(false);
//     }
//   };

//   // Fetch documents with pagination parameters
//   const fetchDocs = async (p, limit) => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/superadmin/documents?page=${p + 1}&limit=${limit}`, { headers });
//       const data = await res.json();
//       if (res.ok) {
//         setDocs(Array.isArray(data.items) ? data.items : []);
//         setTotal(data.total || 0); // Assuming your backend sends back 'total' count
//       }
//     } catch (_) {
//       // ignore
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const fetchDocs = async (categoryIdOrName = "") => {
//   //   setLoading(true);
//   //   try {
//   //     const qs = categoryIdOrName
//   //       ? categoryIdOrName.startsWith("id:")
//   //         ? `?categoryId=${encodeURIComponent(categoryIdOrName.slice(3))}`
//   //         : `?categoryName=${encodeURIComponent(categoryIdOrName)}`
//   //       : "";
//   //     const res = await fetch(`${API_BASE}/documents${qs}`, { headers });
//   //     const data = await res.json();
//   //     setDocs(res.ok ? (Array.isArray(data) ? data : []) : []);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   useEffect(() => {
//     if (!token) return;
//     fetchCategories();
//     fetchDocs("");
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   const handleCategoryChange = (e) => {
//     const val = e.target.value;
//     setSelectedCat(val);
//     if (!token) return;
//     if (!val) fetchDocs(0, 10);
//     else fetchDocs(`id:${val}`);
//   };

//   const getFileName = (doc) => {
//     if (doc?.fileOriginalName) return doc.fileOriginalName;
//     try {
//       const u = doc?.fileUrl || "";
//       const parts = u.split("/");
//       return parts[parts.length - 1] || "Open";
//     } catch {
//       return "Open";
//     }
//   };

//   const handleChangePage = (_evt, newPage) => setPage(newPage);

//   const handleChangeRowsPerPage = (evt) => {
//     setRowsPerPage(parseInt(evt.target.value, 10));
//     setPage(0);
//   };

//   // Derived data: filtered and paged rows
//   const filtered = useMemo(() => {
//     const term = q.trim().toLowerCase();
//     if (!term) return docs;
//     return docs.filter((f) =>
//       [f.student?.fullName || f.studentName, f.student?.enrolno || f.studentEnrolno].some((v) => String(v || '').toLowerCase().includes(term))
//     );
//   }, [q, docs]);

//   const pagedRows = useMemo(() => {
//     const start = page * rowsPerPage;
//     return filtered.slice(start, start + rowsPerPage);
//   }, [filtered, page, rowsPerPage]);

//   // Reset page when search or rowsPerPage changes
//   useEffect(() => {
//     setPage(0);
//   }, [q, rowsPerPage]);

//   return (
//     <Box sx={{ p: 3 }}>
//       <Paper
//         elevation={4}
//         sx={{
//           p: 2,
//           borderRadius: 3,
//           overflow: "hidden",
//           boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
//         }}
//       >

//         {/* Header */}
//         <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={3}>
//           <Typography variant="h5" fontWeight={700} sx={{ color: "#2B6EF6" }}>
//             All Documents
//           </Typography>

//           <Box display="flex" alignItems="center" gap={2}>
//             <TextField
//               select
//               label={loadingCats ? "Loading categories..." : "Filter by Category"}
//               size="small"
//               value={selectedCat}
//               onChange={handleCategoryChange}
//               sx={{
//                 minWidth: 240,
//                 background: "#fff",
//                 borderRadius: 2,
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//                 "& .MuiInputLabel-root": { color: "text.secondary" }
//               }}
//               disabled={loadingCats}
//             >
//               <MenuItem value="">All</MenuItem>
//               {categories.map((c) => (
//                 <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
//               ))}
//             </TextField>
//           </Box>
//         </Box>

//         {/* Card wrapper with shadow & rounded */}

//         <Box sx={{ p: 2 }}>
//           {loading ? (
//             <Box display="flex" justifyContent="center" alignItems="center" py={6}>
//               <CircularProgress />
//             </Box>
//           ) : docs.length === 0 ? (
//             <Typography sx={{ p: 2 }}>No documents found</Typography>
//           ) : (
//             <TableContainer component={Box}>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: "#f5f7ff" }}>
//                     <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
//                     <TableCell sx={{ fontWeight: 700 }}>Enrolment No</TableCell>
//                     <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
//                     <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
//                     <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
//                     <TableCell sx={{ fontWeight: 700 }}>File</TableCell>
//                     <TableCell sx={{ fontWeight: 700 }}>Images</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {pagedRows.map((d) => (
//                     <TableRow key={d._id} hover>
//                       <TableCell>{d.student?.fullName || d.studentName}</TableCell>
//                       <TableCell>{d.student?.enrolno || d.studentEnrolno}</TableCell>
//                       <TableCell>{d.type}</TableCell>
//                       <TableCell>{d.category?.name || d.categoryName}</TableCell>
//                       <TableCell>{d.date ? new Date(d.date).toLocaleDateString() : "-"}</TableCell>
//                       <TableCell>
//                         <Link href={toBackendUrl(d.fileUrl)} target="_blank" rel="noopener" underline="hover">
//                           {getFileName(d)}
//                         </Link>
//                       </TableCell>
//                       <TableCell>
//                         <Box display="flex" gap={0.5} flexWrap="wrap">
//                           {(d.images || []).slice(0, 4).map((img, idx) => (
//                             <img
//                               key={idx}
//                               src={toBackendUrl(img)}
//                               alt={`img-${idx}`}
//                               style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, border: "1px solid #eee" }}
//                             />
//                           ))}
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}

//           <Box display="flex" justifyContent="flex-end" pt={1}>
//             <TablePagination
//               component="div"
//               count={filtered.length}
//               page={page}
//               onPageChange={handleChangePage}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//               rowsPerPageOptions={[5, 10, 25, 50]}
//               showFirstButton
//               showLastButton
//             />
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// }



//---------------------------------
// import React, { useContext, useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Link,
//   CircularProgress,
//   TablePagination,
//   Paper,
//   Stack,
//   Avatar,
//   MenuItem,
//   TextField,
//   Tooltip,
// } from "@mui/material";
// import { AuthContext } from "../../context/AuthContext";

// const API_BASE = "http://localhost:5000/api";
// const API_BASE = import.meta.env.VITE_API_BASE;
// const BACKEND_BASE = "http://localhost:5000";
// const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE;

// // Convert /uploads/... → http://localhost:5000/uploads/...
// const toBackendUrl = (p) => {
//   if (!p) return "";
//   return p.startsWith("/uploads") ? `${BACKEND_BASE}${p}` : p;
// };

// export default function All_Document() {
//   const { token } = useContext(AuthContext);
//   const headers = useMemo(
//     () => (token ? { Authorization: `Bearer ${token}` } : {}),
//     [token]
//   );

//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Filters state
//   const [filterCategory, setFilterCategory] = useState("");
//   const [filterType, setFilterType] = useState("");

//   const [allCategories, setAllCategories] = useState([]);
//   const [allDocTypes, setAllDocTypes] = useState([]);

//   // Pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [total, setTotal] = useState(0);

//   // Fetch filters from DB
//   const fetchFiltersFromDB = async () => {
//     try {
//       // Categories
//       const catRes = await fetch(`${API_BASE}/categories`, {
//         headers,
//       });
//       const catData = await catRes.json();
//       setAllCategories(Array.isArray(catData.items) ? catData.items : []);

//       // Document Types
//       // const typeRes = await fetch(`${API_BASE}/superadmin/doc-types`, {
//       //   headers,
//       // });
//       // const typeData = await typeRes.json();
//       setAllDocTypes(Array.isArray(typeData.items) ? typeData.items : []);
//     } catch (err) {
//       console.log("Filter fetch error:", err);
//     }
//   };

//   // Fetch documents
//   const fetchAllDocs = async (p, limit) => {
//     if (!token) return;
//     setLoading(true);

//     try {
//       const res = await fetch(
//         `${API_BASE}/superadmin/documents?page=${p + 1}&limit=${limit}`,
//         { headers }
//       );

//       const data = await res.json();
//       if (res.ok) {
//         let docs = Array.isArray(data.items) ? data.items : [];

//         // Apply Type Filter
//         if (filterType) {
//           docs = docs.filter(
//             (d) => d.type?.toLowerCase() === filterType.toLowerCase()
//           );
//         }

//         // Apply Category Filter
//         if (filterCategory) {
//           docs = docs.filter(
//             (d) =>
//               d.category?.name?.toLowerCase() ===
//               filterCategory.toLowerCase() ||
//               d.categoryName?.toLowerCase() === filterCategory.toLowerCase()
//           );
//         }

//         setItems(docs);
//         setTotal(data.total || docs.length);
//       }
//     } catch (err) {
//       console.log("Document fetch error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch filters first time
//   useEffect(() => {
//     fetchFiltersFromDB();
//   }, [token]);

//   // Fetch docs on pagination + filters change
//   useEffect(() => {
//     fetchAllDocs(page, rowsPerPage);
//   }, [page, rowsPerPage, token, filterCategory, filterType]);

//   const handleChangePage = (_e, newPage) => setPage(newPage);

//   const handleChangeRowsPerPage = (e) => {
//     setRowsPerPage(parseInt(e.target.value, 10));
//     setPage(0);
//   };

//   const getFileName = (doc) => {
//     if (doc?.fileOriginalName) return doc.fileOriginalName;
//     try {
//       const u = doc?.fileUrl || "";
//       return u.split("/").pop() || "Open";
//     } catch {
//       return "Open";
//     }
//   };

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 } }}>
//       <Paper
//         elevation={3}
//         sx={{
//           borderRadius: 2,
//           p: { xs: 2, md: 3 },
//           bgcolor: "#fff",
//         }}
//       >
//         {/* ---------- HEADER + FILTERS ---------- */}
//         <Stack
//           direction={{ xs: "column", md: "row" }}
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", md: "center" }}
//           spacing={2}
//           mb={2}
//         >
//           <Typography variant="h5" fontWeight={700}>
//             All Documents
//           </Typography>

//           {/* 🔥 Filters Row */}
//           <Stack direction="row" spacing={2} alignItems="center">
//             {/* Type Filter */}
//             <TextField
//               select
//               size="small"
//               label="Filter Type"
//               value={filterType}
//               onChange={(e) => {
//                 setFilterType(e.target.value);
//                 setPage(0);
//               }}
//               sx={{ minWidth: 140, bgcolor: "#fff" }}
//             >
//               <MenuItem value="">All</MenuItem>
//               {allDocTypes.map((t) => (
//                 <MenuItem key={t._id} value={t.name}>
//                   {t.name}
//                 </MenuItem>
//               ))}
//             </TextField>

//             {/* Category Filter */}
//             <TextField
//               select
//               size="small"
//               label="Filter Category"
//               value={filterCategory}
//               onChange={(e) => {
//                 setFilterCategory(e.target.value);
//                 setPage(0);
//               }}
//               sx={{ minWidth: 150, bgcolor: "#fff" }}
//             >
//               <MenuItem value="">All</MenuItem>
//               {allCategories.map((c) => (
//                 <MenuItem key={c._id} value={c.name}>
//                   {c.name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Stack>
//         </Stack>

//         {/* ---------- LOADING ---------- */}
//         {loading ? (
//           <Box display="flex" justifyContent="center" py={6}>
//             <CircularProgress />
//           </Box>
//         ) : (
//           <>
//             {/* ---------- TABLE ---------- */}
//             <TableContainer>
//               <Table size="small">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Enrolment No</TableCell>
//                     <TableCell>Student Name</TableCell>
//                     <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
//                       Type
//                     </TableCell>
//                     <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
//                       Category
//                     </TableCell>
//                     <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
//                       Date
//                     </TableCell>
//                     <TableCell>File</TableCell>
//                     <TableCell sx={{ width: 160 }}>Images</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {items.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                         No documents found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     items.map((d) => (
//                       <TableRow key={d._id} hover>
//                         <TableCell>{d.student?.enrolno || "-"}</TableCell>

//                         <TableCell>
//                           <Stack direction="row" spacing={1} alignItems="center">
//                             <Avatar
//                               sx={{
//                                 width: 36,
//                                 height: 36,
//                                 bgcolor: "primary.light",
//                                 color: "primary.contrastText",
//                                 fontSize: 14,
//                               }}
//                             >
//                               {(d.student?.fullName || "U")
//                                 .split(" ")
//                                 .map((p) => p[0])
//                                 .join("")
//                                 .toUpperCase()}
//                             </Avatar>

//                             <Box>
//                               <Typography sx={{ fontWeight: 600 }}>
//                                 {d.student?.fullName || "-"}
//                               </Typography>
//                             </Box>
//                           </Stack>
//                         </TableCell>

//                         <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
//                           {d.type || "-"}
//                         </TableCell>

//                         <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
//                           {d.category?.name || "-"}
//                         </TableCell>

//                         <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
//                           {d.date ? new Date(d.date).toLocaleDateString() : "-"}
//                         </TableCell>

//                         <TableCell>
//                           <Link href={toBackendUrl(d.fileUrl)} target="_blank" underline="hover">
//                             {getFileName(d)}
//                           </Link>
//                         </TableCell>

//                         {/* Images */}
//                         <TableCell>
//                           <Stack direction="row" spacing={1}>
//                             {(d.images || []).slice(0, 4).map((img, i) => (
//                               <Tooltip key={i} title="Open image">
//                                 <Link href={toBackendUrl(img)} target="_blank">
//                                   <img
//                                     src={toBackendUrl(img)}
//                                     alt="doc"
//                                     style={{
//                                       width: 50,
//                                       height: 50,
//                                       objectFit: "cover",
//                                       borderRadius: 6,
//                                       border: "1px solid #ccc",
//                                     }}
//                                   />
//                                 </Link>
//                               </Tooltip>
//                             ))}

//                             {d.images?.length > 4 && (
//                               <Box
//                                 sx={{
//                                   width: 50,
//                                   height: 50,
//                                   borderRadius: 2,
//                                   border: "1px dashed #bbb",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   fontSize: 12,
//                                 }}
//                               >
//                                 +{d.images.length - 4}
//                               </Box>
//                             )}
//                           </Stack>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </>
//         )}

//         {/* ---------- PAGINATION ---------- */}
//         <Box mt={2} display="flex" justifyContent="flex-end">
//           <TablePagination
//             component="div"
//             count={total}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[5, 10, 25, 50]}
//             showFirstButton
//             showLastButton
//           />
//         </Box>
//       </Paper>
//     </Box>
//   );
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

export default function All_Document() {
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);  // Auto extracted
  const [selectedCat, setSelectedCat] = useState("");

  const [allDocTypes, setAllDocTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState("");

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const headers = useMemo(
    () => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}) }),
    [token]
  );

  // Fetch documents and auto extract categories
  const fetchDocs = async (p = 0, limit = 10) => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/superadmin/documents?page=${p + 1}&limit=${limit}`,
        { headers }
      );
      const data = await res.json();

      if (res.ok) {
        const items = Array.isArray(data.items) ? data.items : [];
        setDocs(items);
        setTotal(data.total || items.length);

        // Extract unique category names automatically
        const uniqueCategories = [...new Set(
          items.map(d => d.category?.name || d.categoryName).filter(Boolean)
        )];
        setCategories(uniqueCategories);


        const uniqueType = [...new Set(
          items.map(d => d.type?.name || d.type).filter(Boolean)
        )];
        setAllDocTypes(uniqueType);
        // setAllDocTypes(Array.isArray(typeData.items) ? typeData.items : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs(0, rowsPerPage);
    // eslint-disable-next-line
  }, [token]);

  // Handle category filter
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCat(value);

    if (!value) {
      fetchDocs(page, rowsPerPage);  // Show all
    } else {
      const filteredDocs = docs.filter(
        (d) => (d.category?.name || d.categoryName) === value
      );
      setDocs(filteredDocs);
    }
  };

  // Handle Type filter
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedTypes(value);

    if (!value) {
      fetchDocs(page, rowsPerPage);  // Show all
    } else {
      const filteredDocs = docs.filter(
        (d) => (d.type?.name || d.type) === value
      );
      setDocs(filteredDocs);
    }
  };

  const getFileName = (doc) => {
    if (doc?.fileOriginalName) return doc.fileOriginalName;
    try {
      const parts = doc.fileUrl.split("/");
      return parts.at(-1) || "Open";
    } catch {
      return "Open";
    }
  };

  const handleChangePage = (_evt, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (evt) => {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
    fetchDocs(0, parseInt(evt.target.value, 10));
  };

  // Search filter
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return docs;
    return docs.filter((f) =>
      [f.student?.fullName, f.student?.enrolno]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [q, docs]);

  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >

          {/* Left Side Title */}
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: "#2B6EF6" }}
          >
            All Documents
          </Typography>

          {/* Right Side Filters */}
          <Box display="flex" gap={2}>

            {/* Category Filter */}
            <TextField
              select
              label="Filter by Category"
              size="small"
              value={selectedCat}
              onChange={handleCategoryChange}
              sx={{
                minWidth: 240,
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>

            {/* Type Filter */}
            <TextField
              select
              size="small"
              label="Filter by Type"
              value={selectedTypes}
              onChange={handleTypeChange}
              sx={{
                minWidth: 180,
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}
            >
              <MenuItem value="">All</MenuItem>
              {allDocTypes.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

          </Box>
        </Box>


        {/* Table */}
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : docs.length === 0 ? (
            <Typography>No documents found</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f7ff" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Univesity Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Institute Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
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
                      <TableCell>{d.universityName}</TableCell>
                      <TableCell>{d.instituteName}</TableCell>
                      <TableCell>{d.course}</TableCell>
                      <TableCell>{d.type}</TableCell>
                      <TableCell>{d.category?.name || d.categoryName}</TableCell>
                      <TableCell>{d.date ? new Date(d.date).toLocaleDateString() : "-"}</TableCell>

                      <TableCell>
                        <Link href={toBackendUrl(d.fileUrl)} target="_blank" underline="hover">
                          {getFileName(d)}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Box display="flex" gap={0.5}>
                          {(d.images || []).slice(0, 4).map((img, idx) => (
                            <img
                              key={idx}
                              src={toBackendUrl(img)}
                              alt="img"
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 4,
                                objectFit: "cover",
                                border: "1px solid #eee",
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

          {/* Pagination */}
          <Box display="flex" justifyContent="flex-end" pt={1}>
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
