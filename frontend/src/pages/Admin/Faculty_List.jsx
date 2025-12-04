// import React, { useContext, useEffect, useMemo, useState } from 'react';
// import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, CircularProgress, TextField, Stack, TablePagination } from '@mui/material';
// import { AuthContext } from '../../context/AuthContext';

// const API_BASE = 'http://localhost:5000/api';
// const API_BASE = import.meta.env.VITE_API_BASE;

// export default function FacultyList() {
//     const { token } = useContext(AuthContext);
//     const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [faculties, setFaculties] = useState([]);
//     const [q, setQ] = useState('');

//     // Pagination state
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [total, setTotal] = useState(0);

//     // Derived data: filtered and paged rows
//     const filtered = useMemo(() => {
//         const term = q.trim().toLowerCase();
//         if (!term) return faculties;
//         return faculties.filter((f) =>
//             [f.name, f.email, f.university].some((v) => String(v || '').toLowerCase().includes(term))
//         );
//     }, [q, faculties]);

//     const pagedRows = useMemo(() => {
//         const start = page * rowsPerPage;
//         return filtered.slice(start, start + rowsPerPage);
//     }, [filtered, page, rowsPerPage]);

//     // Reset page when search or rowsPerPage changes
//     useEffect(() => {
//         setPage(0);
//     }, [q, rowsPerPage]);

//     const handleChangePage = (_evt, newPage) => setPage(newPage);
//     const handleChangeRowsPerPage = (evt) => {
//         setRowsPerPage(parseInt(evt.target.value, 10));
//         setPage(0);
//     };

//     useEffect(() => {
//         const fetchFaculties = async () => {
//             if (!token) { setLoading(false); return }
//             setLoading(true);
//             setError('');
//             try {
//                 // Fetch all faculties from the backend
//                 const res = await fetch(`${API_BASE}/faculty`, { headers: { ...authHeader } });
//                 const contentType = res.headers.get('content-type') || '';
//                 const text = await res.text();
//                 if (!contentType.includes('application/json')) {
//                     throw new Error(`Unexpected response (status ${res.status})`);
//                 }
//                 const data = text ? JSON.parse(text) : [];
//                 if (!res.ok) throw new Error(data?.message || 'Failed to load faculties');

//                 // Assuming the backend returns all faculties, set the total count
//                 const fetchedFaculties = Array.isArray(data) ? data : [];
//                 setFaculties(fetchedFaculties);
//                 setTotal(fetchedFaculties.length);

//             } catch (e) {
//                 setError(e.message || 'Failed to load faculties');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchFaculties();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [token, authHeader]);

//     return (
//         <Box sx={{ p: 3 }}>
//             <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={2} mb={2}>
//                 <Typography variant="h5" fontWeight={700}>Faculty List</Typography>
//                 <TextField value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, or university" size="small" sx={{ maxWidth: 360 }} />
//             </Stack>

//             {loading ? (
//                 <Box sx={{ py: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <CircularProgress />
//                 </Box>
//             ) : error ? (
//                 <Box sx={{ p: 2, color: 'error.main' }}>{error}</Box>
//             ) : (
//                 <TableContainer component={Box}>
//                     <Table size="small">
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>Avatar</TableCell>
//                                 <TableCell>Name</TableCell>
//                                 <TableCell>Email</TableCell>
//                                 <TableCell>University</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {pagedRows.map((f) => (
//                                 <TableRow key={f._id} hover>
//                                     <TableCell>
//                                         <Avatar src={f.avatarUrl || undefined}>{String(f.name || 'F').charAt(0).toUpperCase()}</Avatar>
//                                     </TableCell>
//                                     <TableCell>{f.name || '-'}</TableCell>
//                                     <TableCell>{f.email || '-'}</TableCell>
//                                     <TableCell>{f.university || '-'}</TableCell>
//                                 </TableRow>
//                             ))}
//                             {!filtered.length && (
//                                 <TableRow>
//                                     <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
//                                         No faculties found
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             )}

//             {/* Pagination Controls */}
//             <TablePagination
//                 component="div"
//                 count={filtered.length} // Count is based on filtered rows
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

import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    CircularProgress,
    TextField,
    Stack,
    TablePagination,
    Button,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

// const API_BASE = 'http://localhost:5000/api';
const API_BASE = import.meta.env.VITE_API_BASE;

export default function FacultyList() {
    const { token } = useContext(AuthContext);
    const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [faculties, setFaculties] = useState([]);
    const [q, setQ] = useState('');

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // FILTER
    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return faculties;
        return faculties.filter((f) =>
            [f.name, f.email, f.university].some((v) => String(v || '').toLowerCase().includes(s))
        );
    }, [q, faculties]);

    const pagedRows = useMemo(() => {
        const start = page * rowsPerPage;
        return filtered.slice(start, start + rowsPerPage);
    }, [filtered, page, rowsPerPage]);

    useEffect(() => {
        setPage(0);
    }, [q, rowsPerPage]);

    const handleChangePage = (_evt, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (evt) => {
        setRowsPerPage(parseInt(evt.target.value, 10));
        setPage(0);
    };

    // useEffect(() => {
    //     const fetchFaculties = async () => {
    //         if (!token) return;
    //         setLoading(true);
    //         setError('');

    //         try {
    //             const res = await fetch(`${API_BASE}/faculty`, {
    //                 headers: authHeader
    //             });

    //             const text = await res.text();
    //             const data = text ? JSON.parse(text) : [];

    //             if (!res.ok) throw new Error(data?.message || "Failed to load faculties");

    //             setFaculties(Array.isArray(data) ? data : []);

    //         } catch (e) {
    //             setError(e.message || "Failed to load faculties");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchFaculties();
    // }, [token, authHeader]);

    const fetchFaculties = async () => {
        if (!token) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/faculty`, {
                headers: authHeader
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : [];

            if (!res.ok) throw new Error(data?.message || "Failed to load faculties");

            setFaculties(Array.isArray(data) ? data : []);

        } catch (e) {
            setError(e.message || "Failed to load faculties");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, [token, authHeader]);

    return (
        <Box sx={{ p: 3 }}>
            <Paper
                elevation={2} sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, bgcolor: '#fff' }}
            >

                {/* Header Section */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                >
                    <Typography variant="h5" fontWeight={700} sx={{ color: "#2b4ddb" }}>
                        Faculty List
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        <TextField
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search by name, email, or university"
                            size="small"
                            sx={{
                                maxWidth: 360,
                                bgcolor: "#fff",
                                borderRadius: 2,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            }}
                        />
                        {/* <Button
                            // size="small"
                            variant="outlined"
                            onClick={() => fetchFaculties()}
                        >
                            Refresh
                        </Button> */}
                        <IconButton onClick={() => fetchFaculties()}>
                            <RefreshIcon />
                        </IconButton>
                    </Stack>
                </Stack>

                {/* MAIN CARD WITH SHADOW */}
                <Box sx={{ p: 2 }}>

                    {/* Loading */}
                    {loading ? (
                        <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" sx={{ p: 2 }}>
                            {error}
                        </Typography>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#f5f7ff" }}>
                                        <TableCell sx={{ fontWeight: 700 }}>Avatar</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>University</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {pagedRows.map((f) => (
                                        <TableRow key={f._id} hover>
                                            <TableCell>
                                                <Avatar
                                                    src={f.avatarUrl || undefined}
                                                    sx={{ bgcolor: "#e8f0ff", color: "#2B6EF6" }}
                                                >
                                                    {String(f.name || "F").charAt(0).toUpperCase()}
                                                </Avatar>
                                            </TableCell>

                                            <TableCell>{f.name || "-"}</TableCell>
                                            <TableCell>{f.email || "-"}</TableCell>
                                            <TableCell>{f.university || "-"}</TableCell>
                                        </TableRow>
                                    ))}

                                    {!filtered.length && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                                No faculties found
                                            </TableCell>
                                        </TableRow>
                                    )}
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
                            showFirstButton
                            showLastButton
                        />
                    </Box>

                </Box>
            </Paper>
        </Box >
    );
}
