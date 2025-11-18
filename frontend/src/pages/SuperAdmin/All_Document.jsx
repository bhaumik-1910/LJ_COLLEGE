// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, CircularProgress, Grid, TablePagination } from "@mui/material";
// import { AuthContext } from "../../context/AuthContext";

// const API_BASE = "http://localhost:5000/api";
// const BACKEND_BASE = "http://localhost:5000";

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
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  CircularProgress,
  Grid,
  TablePagination,
  Paper,
  Stack,
  Avatar,
  Chip,
  Tooltip,
} from "@mui/material";
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
      const res = await fetch(`${API_BASE}/superadmin/documents?page=${p + 1}&limit=${limit}`, { headers });
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
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, bgcolor: '#fff' }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            All Documents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Showing {items.length} items
          </Typography>
        </Stack>

        {/* Loading */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={6}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Enrolment No</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Type</TableCell>
                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Category</TableCell>
                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Date</TableCell>
                    <TableCell>File</TableCell>
                    <TableCell sx={{ width: 160 }}>Images</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        No documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((d) => (
                      <TableRow key={d._id} hover>
                        <TableCell sx={{ minWidth: 120 }}>
                          {d.student?.enrolno || d.studentEnrolno || "-"}
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: "primary.light",
                                color: "primary.contrastText",
                                fontSize: 14,
                              }}
                            >
                              {((d.student?.fullName || d.studentName || "U")
                                .split(" ")
                                .map((p) => p[0] || "")
                                .slice(0, 2)
                                .join("") || "U"
                              ).toUpperCase()}
                            </Avatar>

                            <Box>
                              <Typography sx={{ fontWeight: 600 }}>
                                {d.student?.fullName || d.studentName || "-"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "inline", sm: "none" } }}>
                                {d.student?.enrolno || d.studentEnrolno || ""}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{d.type || "-"}</TableCell>

                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                          {d.category?.name || d.categoryName || "-"}
                        </TableCell>

                        <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                          {d.date ? new Date(d.date).toLocaleDateString() : "-"}
                        </TableCell>

                        <TableCell>
                          <Link href={toBackendUrl(d.fileUrl)} target="_blank" rel="noopener" underline="hover">
                            {getFileName(d)}
                          </Link>
                        </TableCell>

                        {/* Images column — DESIGN UPDATED: max 4 images in one line */}
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              flexWrap: "nowrap",
                              overflow: "hidden",
                            }}
                          >
                            {(d.images || []).slice(0, 4).map((img, idx) => (
                              <Tooltip key={idx} title="Open image" arrow>
                                <Link
                                  href={toBackendUrl(img)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{ display: "inline-block" }}
                                >
                                  <Box
                                    component="img"
                                    src={toBackendUrl(img)}
                                    alt={`img-${idx}`}
                                    sx={{
                                      width: 52,
                                      height: 52,
                                      objectFit: "cover",
                                      borderRadius: 1,
                                      border: "1px solid #e6e6e6",
                                      display: "block",
                                    }}
                                  />
                                </Link>
                              </Tooltip>
                            ))}

                            {/* If more than 4 images, show +N badge (purely visual, no behavior change) */}
                            {(d.images || []).length > 4 && (
                              <Box
                                sx={{
                                  minWidth: 52,
                                  height: 52,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 1,
                                  border: "1px dashed #e6e6e6",
                                  bgcolor: "#fafafa",
                                  ml: 0.5,
                                }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  +{(d.images || []).length - 4}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        {/* End images column */}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Pagination */}
        <Box mt={2} display="flex" justifyContent="flex-end" alignItems="center">
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
      </Paper>
    </Box>
  );
}
