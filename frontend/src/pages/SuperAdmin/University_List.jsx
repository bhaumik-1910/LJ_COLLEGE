import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    IconButton,
    Paper,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    TablePagination,
    InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// const API_BASE = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_BASE;

export default function UniversityList() {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [targetUni, setTargetUni] = useState(null);
    const { token } = useContext(AuthContext);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // FETCH UNIVERSITIES (fetch instead of axios)
    const fetchUniversities = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/universities`);
            const data = await res.json();
            if (res.ok) setUniversities(Array.isArray(data) ? data : []);
            else toast.error("Failed to fetch universities");
        } catch (err) {
            toast.error("Failed to fetch universities");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUniversities();
    }, []);

    // DELETE
    const confirmDelete = async () => {
        if (!targetUni) return;

        try {
            const res = await fetch(
                `${API_BASE}/universities/${targetUni._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,   //  VERY IMPORTANT
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Delete failed");
            }

            toast.success("University deleted successfully");
            setConfirmOpen(false);
            setTargetUni(null);
            fetchUniversities();

        } catch (err) {
            toast.error(err.message || "Failed to delete university");
        }
    };

    const filteredUniversities = useMemo(() => {
        return universities.filter(
            (u) =>
                u.name.toLowerCase().includes(searchText.toLowerCase()) ||
                u.email.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [universities, searchText]);

    const paginated = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredUniversities.slice(start, start + rowsPerPage);
    }, [filteredUniversities, page, rowsPerPage]);

    return (
        <Box sx={{ p: 3 }}>
            <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, bgcolor: '#fff' }}>

                {/* HEADER */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    mb={2}
                    gap={2}
                >
                    <Typography variant="h5" fontWeight={700} color="primary.main">
                        Registered Universities
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() =>
                            (window.location.href = "/superadmin-dashboard/university-register")
                        }
                        startIcon={<AddIcon />}
                    >
                        Add New University
                    </Button>
                </Box>

                {/* SEARCH */}
                <Box mb={2}>
                    <TextField
                        placeholder="Search universities..."
                        size="small"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300 }}
                    />
                </Box>

                {/* TABLE */}
                {loading ? (
                    <Box display="flex" justifyContent="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : filteredUniversities.length === 0 ? (
                    <Typography textAlign="center" py={4}>
                        No universities found
                    </Typography>
                ) : (
                    <>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>University Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Created At</TableCell>
                                        <TableCell align="right">Action</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginated.map((u) => (
                                        <TableRow key={u._id} hover>
                                            <TableCell>{u.name}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell>
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell align="right">
                                                {/* <Tooltip title="Edit">
                                                    <IconButton color="primary">
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip> */}

                                                <Tooltip title="Delete">
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => {
                                                            setTargetUni(u);
                                                            setConfirmOpen(true);
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* PAGINATION */}
                        <TablePagination
                            component="div"
                            count={filteredUniversities.length}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25]}
                        />
                    </>
                )}
            </Paper>

            {/* DELETE CONFIRM DIALOG */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        Are you sure you want to delete{" "}
                        <b>{targetUni?.name}</b>?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setConfirmOpen(false)}
                        variant="outlined"
                        startIcon={<CancelIcon />}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={confirmDelete}
                        startIcon={<DeleteIcon />}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
