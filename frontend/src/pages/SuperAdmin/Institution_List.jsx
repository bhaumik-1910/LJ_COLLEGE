// // frontend/src/pages/SuperAdmin/Institution_List.jsx
// import { useState, useEffect, useContext } from 'react';
// import {
//     Box,
//     Button,
//     Typography,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     CircularProgress,
//     IconButton,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogContentText,
//     DialogActions,
//     TextField,
//     MenuItem
// } from '@mui/material';
// import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import { toast } from 'react-toastify';
// import CancelIcon from "@mui/icons-material/Cancel";
// import SaveIcon from "@mui/icons-material/Save";

// const API_BASE = import.meta.env.VITE_API_BASE;

// export default function InstitutionList() {
//     const { token } = useContext(AuthContext);
//     const [institutions, setInstitutions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [institutionToDelete, setInstitutionToDelete] = useState(null);
//     const [isDeleting, setIsDeleting] = useState(false);

//     const [editDialogOpen, setEditDialogOpen] = useState(false);
//     const [institutionToEdit, setInstitutionToEdit] = useState(null);
//     const [isSaving, setIsSaving] = useState(false);
//     const [universities, setUniversities] = useState([]);

//     const navigate = useNavigate();

//     // Form state
//     const [formData, setFormData] = useState({
//         name: '',
//         university: '',
//         courses: ['']
//     });

//     // Fetch institutions 
//     const fetchInstitutions = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`${API_BASE}/institutions`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const result = await response.json();

//             if (result.success && Array.isArray(result.data)) {
//                 setInstitutions(result.data);
//             } else {
//                 setInstitutions(result);
//             }
//         } catch (error) {
//             toast.error(error.message || 'Failed to load institutions');
//         } finally {
//             setLoading(false);
//         }
//     };

//     //Fetch University For Edit
//     const fetchUniversities = async () => {
//         try {
//             const response = await fetch(`${API_BASE}/universities`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch universities');
//             }

//             const data = await response.json();
//             setUniversities(Array.isArray(data) ? data : []);
//         } catch (error) {
//             toast.error(error.message || 'Failed to load universities');
//         }
//     };

//     // Call both functions in useEffect
//     useEffect(() => {
//         fetchInstitutions();
//         fetchUniversities();
//     }, []);

//     // Open delete confirmation dialog
//     const handleDeleteClick = (institution) => {
//         setInstitutionToDelete(institution);
//         setDeleteDialogOpen(true);
//     };

//     // Close delete confirmation dialog
//     const handleCloseDeleteDialog = () => {
//         setDeleteDialogOpen(false);
//         setInstitutionToDelete(null);
//     };

//     // Delete institution
//     const handleDelete = async () => {
//         if (!institutionToDelete) return;

//         setIsDeleting(true);
//         try {
//             const res = await fetch(`${API_BASE}/institutions/${institutionToDelete._id}`, {
//                 method: "DELETE",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             if (!res.ok) {
//                 const errorData = await res.json().catch(() => ({}));
//                 throw new Error(errorData.message || "Failed to delete institution");
//             }

//             toast.success("Institution deleted successfully");
//             fetchInstitutions();
//         } catch (error) {
//             console.error("Delete error:", error);
//             toast.error(error.message || "Failed to delete institution");
//         } finally {
//             setIsDeleting(false);
//             handleCloseDeleteDialog();
//         }
//     };

//     // const getUniversityName = (univId) => {
//     //     const univ = universities.find(u => u._id === univId);
//     //     return univ ? univ.name : 'N/A';
//     // };

//     // Edit institution functions
//     const handleEditClick = (institution) => {
//         setInstitutionToEdit(institution);
//         setFormData({
//             name: institution.name || '',
//             university: institution.university?._id || institution.university || '',
//             courses: institution.courses?.length > 0 ? [...institution.courses] : ['']
//         });
//         setEditDialogOpen(true);
//     };

//     const handleCloseEditDialog = () => {
//         setEditDialogOpen(false);
//         setInstitutionToEdit(null);
//         setFormData({ name: '', university: '', courses: [''] });
//     };

//     const handleInputChange = (e) => {
//         // const { name, value } = e.target;
//         // setFormData(prev => ({ ...prev, [name]: value }));
//         setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const handleCourseChange = (index, value) => {
//         const newCourses = [...formData.courses];
//         newCourses[index] = value;
//         setFormData(prev => ({ ...prev, courses: newCourses }));
//     };

//     const addCourseField = () => {
//         setFormData(prev => ({ ...prev, courses: [...prev.courses, ''] }));
//     };

//     const removeCourseField = (index) => {
//         const newCourses = formData.courses.filter((_, i) => i !== index);
//         setFormData(prev => ({ ...prev, courses: newCourses.length ? newCourses : [''] }));
//     };

//     const handleSubmitEdit = async (e) => {
//         e.preventDefault();
//         if (!institutionToEdit) return;

//         setIsSaving(true);
//         try {
//             const validCourses = formData.courses
//                 .map(course => course.trim())
//                 .filter(course => course !== '');

//             if (!formData.university || !formData.name.trim() || validCourses.length === 0) {
//                 toast.error('Please fill in all required fields and add at least one course');
//                 return;
//             }

//             const response = await fetch(`${API_BASE}/institutions/${institutionToEdit._id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     name: formData.name,
//                     university: formData.university,
//                     courses: validCourses
//                 })
//             });

//             if (!response.ok) {
//                 const errorData = await response.json().catch(() => ({}));
//                 throw new Error(errorData.message || 'Failed to update institution');
//             }

//             toast.success('Institution updated successfully');
//             fetchInstitutions();
//             handleCloseEditDialog();
//         } catch (error) {
//             console.error('Update error:', error);
//             toast.error(error.message || 'Failed to update institution');
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     return (
//         <Box sx={{ p: { xs: 2, md: 3 } }}>
//             <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, bgcolor: '#fff' }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
//                     {/* <Typography variant="h5">Institution Management</Typography> */}
//                     <Typography variant="h5" fontWeight={700} sx={{ color: "#2b4ddb" }}>
//                         Institution Management
//                     </Typography>
//                     <Button
//                         variant="contained"
//                         startIcon={<AddIcon />}
//                         onClick={() => navigate('/superadmin-dashboard/institution')}
//                     >
//                         Add Institution
//                     </Button>
//                 </Box>

//                 <Box >
//                     <TableContainer>
//                         <Table>
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell>University</TableCell>
//                                     <TableCell>Institution Name</TableCell>
//                                     <TableCell>Courses</TableCell>
//                                     <TableCell align="right">Actions</TableCell>
//                                 </TableRow>
//                             </TableHead>

//                             <TableBody>
//                                 {loading ? (
//                                     <TableRow>
//                                         <TableCell colSpan={4} align="center">
//                                             <CircularProgress />
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : institutions.length > 0 ? (
//                                     institutions.map((institution) => (
//                                         <TableRow key={institution._id}>
//                                             <TableCell>{institution.university}</TableCell>
//                                             <TableCell>{institution.name}</TableCell>
//                                             <TableCell>
//                                                 {institution.courses?.length > 0 ? (
//                                                     <Box component="ul" sx={{ pl: 2, my: 0 }}>
//                                                         {institution.courses.map((course, index) => (
//                                                             <li key={index}>{course}</li>
//                                                         ))}
//                                                     </Box>
//                                                 ) : 'No courses'}
//                                             </TableCell>
//                                             <TableCell align="right">
//                                                 <IconButton
//                                                     onClick={() => handleEditClick(institution)}
//                                                     color="primary"
//                                                     size="small"
//                                                     title="Edit"
//                                                 >
//                                                     <EditIcon />
//                                                 </IconButton>
//                                                 <IconButton
//                                                     onClick={() => handleDeleteClick(institution)}
//                                                     color="error"
//                                                     size="small"
//                                                     disabled={isDeleting}
//                                                     title="Delete"
//                                                 >
//                                                     <DeleteIcon />
//                                                 </IconButton>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 ) : (
//                                     <TableRow>
//                                         <TableCell colSpan={4} align="center">
//                                             No institutions found.
//                                         </TableCell>
//                                     </TableRow>
//                                 )}
//                             </TableBody>

//                         </Table>
//                     </TableContainer>
//                 </Box>

//                 {/* Delete Confirmation Dialog */}
//                 <Dialog
//                     open={deleteDialogOpen}
//                     onClose={handleCloseDeleteDialog}
//                     aria-labelledby="alert-dialog-title"
//                     aria-describedby="alert-dialog-description"
//                 >
//                     <DialogTitle id="alert-dialog-title">
//                         Confirm Deletion
//                     </DialogTitle>
//                     <DialogContent dividers>
//                         <DialogContentText id="alert-dialog-description">
//                             Are you sure you want to delete the institution <strong>"{institutionToDelete?.name}"?</strong>
//                             This action cannot be undone.
//                         </DialogContentText>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button
//                             onClick={handleCloseDeleteDialog}
//                             disabled={isDeleting}
//                             color="primary"
//                             startIcon={<CancelIcon />}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handleDelete}
//                             color="error"
//                             variant="contained"
//                             disabled={isDeleting}
//                             // startIcon={isDeleting ? <CircularProgress size={20} /> : null}
//                             startIcon={<DeleteIcon />}
//                             autoFocus
//                         >
//                             {isDeleting ? 'Deleting...' : 'Delete'}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>

//                 {/* Edit Institution Dialog */}
//                 <Dialog
//                     open={editDialogOpen}
//                     onClose={handleCloseEditDialog}
//                     maxWidth="md"
//                     fullWidth
//                 >
//                     <DialogTitle>
//                         <Box display="flex" justifyContent="space-between" alignItems="center">
//                             <span>Edit Institution</span>
//                             <IconButton
//                                 edge="end"
//                                 color="inherit"
//                                 onClick={handleCloseEditDialog}
//                                 aria-label="close"
//                                 disabled={isSaving}
//                             >
//                                 <CloseIcon />
//                             </IconButton>
//                         </Box>
//                     </DialogTitle>

//                     <DialogContent dividers>
//                         {/* <TextField
//                         select
//                         fullWidth
//                         margin="normal"
//                         label="University"
//                         name="university"
//                         value={formData.university}
//                         onChange={handleInputChange}
//                         required
//                         disabled={isSaving}
//                     >
//                         {universities.map((univ) => (
//                             <MenuItem key={univ._id} value={univ.name}>
//                                 {univ.name}
//                             </MenuItem>
//                         ))}
//                     </TextField> */}
//                         <TextField
//                             select
//                             fullWidth
//                             margin="normal"
//                             label="University"
//                             name="university"
//                             value={formData.university}
//                             onChange={handleInputChange}
//                             required
//                             disabled={loading || universities.length === 0}
//                         >
//                             <MenuItem value="" disabled>
//                                 {universities.length === 0 ? 'Loading universities...' : ''}
//                             </MenuItem>
//                             {universities.map((univ) => (
//                                 <MenuItem key={univ._id} value={univ.name}>
//                                     {univ.name}
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             label="Institution Name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             required
//                             disabled={isSaving}
//                         />

//                         <Box sx={{ mt: 3, mb: 2 }}>
//                             <Typography variant="subtitle1" gutterBottom>
//                                 Courses
//                             </Typography>

//                             {formData.courses.map((course, index) => (
//                                 <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
//                                     <TextField
//                                         fullWidth
//                                         value={course}
//                                         onChange={(e) => handleCourseChange(index, e.target.value)}
//                                         placeholder={`Course ${index + 1}`}
//                                         disabled={isSaving}
//                                     />
//                                     <IconButton
//                                         onClick={() => removeCourseField(index)}
//                                         disabled={formData.courses.length <= 1 || isSaving}
//                                         variant="outlined"
//                                         color="error"
//                                     >
//                                         <DeleteIcon />
//                                     </IconButton>
//                                 </Box>
//                             ))}

//                             <Button
//                                 onClick={addCourseField}
//                                 startIcon={<AddIcon />}
//                                 variant="outlined"
//                                 sx={{ mt: 1 }}
//                                 disabled={isSaving}
//                             >
//                                 Add Course
//                             </Button>
//                         </Box>
//                     </DialogContent>

//                     <DialogActions>
//                         <Button
//                             onClick={handleCloseEditDialog}
//                             disabled={isSaving}
//                             startIcon={<CancelIcon />}
//                         >
//                             Cancel
//                         </Button>

//                         <Button
//                             variant="contained"
//                             color="primary"
//                             disabled={isSaving}
//                             onClick={handleSubmitEdit}
//                             // startIcon={isSaving ? <CircularProgress size={20} /> : null}
//                             startIcon={<SaveIcon />}
//                         >
//                             {isSaving ? 'Saving...' : 'Save Changes'}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Paper>
//         </Box>
//     );
// }



// frontend/src/pages/SuperAdmin/Institution_List.jsx
import { useState, useEffect, useContext } from 'react';
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
    TableFooter,
    TablePagination,
    CircularProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    MenuItem
} from '@mui/material';

import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Close as CloseIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function InstitutionList() {
    const { token } = useContext(AuthContext);
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [institutionToDelete, setInstitutionToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [institutionToEdit, setInstitutionToEdit] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [universities, setUniversities] = useState([]);

    const navigate = useNavigate();

    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        university: '',
        courses: ['']
    });

    // Fetch institutions
    const fetchInstitutions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/institutions`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success && Array.isArray(result.data)) {
                setInstitutions(result.data);
            } else {
                setInstitutions(result);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to load institutions');
        } finally {
            setLoading(false);
        }
    };

    // Fetch universities
    const fetchUniversities = async () => {
        try {
            const response = await fetch(`${API_BASE}/universities`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch universities');
            }

            const data = await response.json();
            setUniversities(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error(error.message || 'Failed to load universities');
        }
    };

    useEffect(() => {
        fetchInstitutions();
        fetchUniversities();
    }, []);

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Delete dialog handlers
    const handleDeleteClick = (institution) => {
        setInstitutionToDelete(institution);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setInstitutionToDelete(null);
    };

    // Delete institution
    const handleDelete = async () => {
        if (!institutionToDelete) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`${API_BASE}/institutions/${institutionToDelete._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to delete institution");
            }

            toast.success("Institution deleted successfully");
            fetchInstitutions();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.message || "Failed to delete institution");
        } finally {
            setIsDeleting(false);
            handleCloseDeleteDialog();
        }
    };

    // Edit click
    const handleEditClick = (institution) => {
        setInstitutionToEdit(institution);
        setFormData({
            name: institution.name || '',
            university: institution.university?._id || institution.university || '',
            courses: institution.courses?.length > 0 ? [...institution.courses] : ['']
        });
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setInstitutionToEdit(null);
        setFormData({ name: '', university: '', courses: [''] });
    };

    const handleInputChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCourseChange = (index, value) => {
        const newCourses = [...formData.courses];
        newCourses[index] = value;
        setFormData(prev => ({ ...prev, courses: newCourses }));
    };

    const addCourseField = () => {
        setFormData(prev => ({ ...prev, courses: [...prev.courses, ''] }));
    };

    const removeCourseField = (index) => {
        const newCourses = formData.courses.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, courses: newCourses.length ? newCourses : [''] }));
    };

    const handleSubmitEdit = async () => {
        if (!institutionToEdit) return;

        setIsSaving(true);
        try {
            const validCourses = formData.courses
                .map(course => course.trim())
                .filter(course => course !== '');

            if (!formData.university || !formData.name.trim() || validCourses.length === 0) {
                toast.error('Please fill all required fields and add at least one course');
                return;
            }

            const response = await fetch(`${API_BASE}/institutions/${institutionToEdit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    university: formData.university,
                    courses: validCourses
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update institution');
            }

            toast.success('Institution updated successfully');
            fetchInstitutions();
            handleCloseEditDialog();
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.message || 'Failed to update institution');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: "#2b4ddb" }}>
                        Institution Management
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/superadmin-dashboard/institution')}
                    >
                        Add Institution
                    </Button>
                </Box>

                {/* TABLE */}
                <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>University</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Institution Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Courses</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
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
                                institutions
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((institution) => (
                                        <TableRow key={institution._id}>
                                            <TableCell>{institution.university}</TableCell>
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
                                            <TableCell align="center">
                                                <IconButton
                                                    onClick={() => handleEditClick(institution)}
                                                    color="primary"
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>

                                                <IconButton
                                                    onClick={() => handleDeleteClick(institution)}
                                                    color="error"
                                                    size="small"
                                                    disabled={isDeleting}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        align="center"
                                        sx={{ py: 8 }}   
                                    >
                                        No Institutions Found.
                                    </TableCell>
                                </TableRow>

                            )}
                        </TableBody>

                        {/* PAGINATION FOOTER */}
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50]}
                                    showFirstButton
                                    showLastButton
                                    count={institutions.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>

                {/* DELETE DIALOG */}
                <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText>
                            Are you sure you want to delete <strong>{institutionToDelete?.name}</strong>?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} disabled={isDeleting} startIcon={<CancelIcon />}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="contained"
                            color="error"
                            disabled={isDeleting}
                            startIcon={<DeleteIcon />}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* EDIT DIALOG */}
                <Dialog
                    open={editDialogOpen}
                    onClose={handleCloseEditDialog}
                    // maxWidth="md"
                    PaperProps={{
                        sx: { width: "750px", maxWidth: "90%" }
                    }}
                    fullWidth
                >
                    <DialogTitle>
                        <Box display="flex" justifyContent="space-between" alignItems="center" >
                            <span>Edit Institution</span>
                            <IconButton onClick={handleCloseEditDialog} disabled={isSaving}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <DialogContent dividers>
                        <TextField
                            select
                            fullWidth
                            margin="normal"
                            label="University"
                            name="university"
                            size='small'
                            value={formData.university}
                            onChange={handleInputChange}
                            required
                            disabled={loading || universities.length === 0}
                        >
                            <MenuItem value="" disabled>
                                Select University
                            </MenuItem>

                            {universities.map((univ) => (
                                <MenuItem key={univ._id} value={univ.name}>
                                    {univ.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Institution Name"
                            name="name"
                            size='small'
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            disabled={isSaving}
                        />

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1">Courses</Typography>

                            {formData.courses.map((course, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <TextField
                                        fullWidth
                                        value={course}
                                        size='small'
                                        onChange={(e) => handleCourseChange(index, e.target.value)}
                                        placeholder={`Course ${index + 1}`}
                                        disabled={isSaving}
                                    />
                                    <IconButton
                                        type='button'
                                        color="error"
                                        disabled={formData.courses.length <= 1}
                                        onClick={() => removeCourseField(index)}
                                        sx={{
                                            border: "1px solid #e53935",
                                            borderRadius: "8px",
                                            "&:hover": {
                                                backgroundColor: "rgba(229,57,53,0.1)",
                                                borderColor: "#b71c1c"
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}

                            <Button
                                onClick={addCourseField}
                                variant="outlined"
                                startIcon={<AddIcon />}
                                sx={{ mt: 2 }}
                                disabled={isSaving}
                            >
                                Add Course
                            </Button>
                        </Box>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={handleCloseEditDialog}
                            disabled={isSaving}
                            startIcon={<CancelIcon />}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            disabled={isSaving}
                            onClick={handleSubmitEdit}
                            startIcon={<SaveIcon />}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
}
