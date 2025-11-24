// frontend/src/pages/SuperAdmin/Institution_List.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    IconButton
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function InstitutionList() {
    const { token } = useContext(AuthContext);
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch institutions + universities
    const fetchInstitutions = async () => {
        try {
            setLoading(true);

            const instReq = fetch(`${API_BASE}/institutions`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const [instRes] = await Promise.all([instReq]);

            if (!instRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const institutionsData = await instRes.json();

            setInstitutions(institutionsData);
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, []);

    // Delete institution
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this institution?")) return;

        try {
            const res = await fetch(`${API_BASE}/institutions/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                throw new Error("Delete failed");
            }

            toast.success("Institution deleted successfully");
            fetchInstitutions();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const getUniversityName = (univId) => {
        const univ = universities.find(u => u._id === univId);
        return univ ? univ.name : 'N/A';
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                <Typography variant="h5">Institution Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/superadmin-dashboard/institution')}
                >
                    Add Institution
                </Button>
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>University</TableCell>
                                <TableCell>Institution Name</TableCell>
                                <TableCell>Courses</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : institutions.length > 0 ? (
                                institutions.map((institution) => (
                                    <TableRow key={institution._id}>
                                        <TableCell>{institution.name}</TableCell>
                                        <TableCell>{institution.name}</TableCell>
                                        <TableCell>
                                            {institution.courses?.length > 0 ? (
                                                <Box component="ul" sx={{ pl: 2, my: 0 }}>
                                                    {institution.courses.map((course, index) => (
                                                        <li key={index}>{course}</li>
                                                    ))}
                                                </Box>
                                            ) : 'No courses'}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => navigate(`/superadmin-dashboard/institution/edit/${institution._id}`)}
                                                color="primary"
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>

                                            <IconButton
                                                onClick={() => handleDelete(institution._id)}
                                                color="error"
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No institutions found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
