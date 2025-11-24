// // frontend/src/pages/SuperAdmin/University_Institute.jsx
// import React, { useState, useEffect, useContext } from 'react';
// import {
//     Box,
//     Button,
//     TextField,
//     MenuItem,
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
//     DialogActions,
//     Snackbar,
//     Alert
// } from '@mui/material';
// import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
// import { AuthContext } from '../../context/AuthContext';
// import axios from 'axios';

// const API_BASE = import.meta.env.VITE_API_BASE;

// export default function University_Institute() {
//     const { token } = useContext(AuthContext);
//     const [universities, setUniversities] = useState([]);
//     const [institutions, setInstitutions] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [openDialog, setOpenDialog] = useState(false);
//     const [editingId, setEditingId] = useState(null);
//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//     // Form state
//     const [formData, setFormData] = useState({
//         university: '',
//         institutionName: '',
//         courses: ['']
//     });

//     // Fetch universities
//     const fetchUniversities = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`${API_BASE}/universities`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setUniversities(response.data);
//         } catch (error) {
//             showSnackbar('Error fetching universities', 'error');
//         }
//     };

//     // Fetch institutions with university details
//     const fetchInstitutions = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(`${API_BASE}/institutions`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setInstitutions(response.data);
//         } catch (error) {
//             showSnackbar('Error fetching institutions', 'error');
//         } finally {
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         fetchUniversities();
//         fetchInstitutions();
//     }, []);

//     const showSnackbar = (message, severity = 'success') => {
//         setSnackbar({ open: true, message, severity });
//     };

//     const handleCloseSnackbar = () => {
//         setSnackbar(prev => ({ ...prev, open: false }));
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleCourseChange = (index, value) => {
//         const newCourses = [...formData.courses];
//         newCourses[index] = value;
//         setFormData(prev => ({
//             ...prev,
//             courses: newCourses
//         }));
//     };

//     const addCourseField = () => {
//         setFormData(prev => ({
//             ...prev,
//             courses: [...prev.courses, '']
//         }));
//     };

//     const removeCourseField = (index) => {
//         const newCourses = formData.courses.filter((_, i) => i !== index);
//         setFormData(prev => ({
//             ...prev,
//             courses: newCourses
//         }));
//     };

//     // Update the handleSubmit function
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const url = editingId
//                 ? `${API_BASE}/institutions/${editingId}`
//                 : `${API_BASE}/institutions`;

//             const method = editingId ? 'put' : 'post';

//             await axios[method](
//                 url,
//                 {
//                     name: formData.institutionName,
//                     university: formData.university,
//                     courses: formData.courses.filter(course => course.trim() !== '')
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             setOpenDialog(false);
//             fetchInstitutions();
//             resetForm();
//             showSnackbar(`Institution ${editingId ? 'updated' : 'created'} successfully`);
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || 'An error occurred';
//             showSnackbar(errorMessage, 'error');
//         }
//     };

//     const handleEdit = (institution) => {
//         setFormData({
//             university: institution.university._id || institution.university,
//             institutionName: institution.name,
//             courses: institution.courses.length > 0 ? [...institution.courses, ''] : ['']
//         });
//         setEditingId(institution._id);
//         setOpenDialog(true);
//     };

//     const handleDelete = async (id) => {
//         if (window.confirm('Are you sure you want to delete this institution?')) {
//             try {
//                 await axios.delete(`${API_BASE}/institutions/${id}`, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//                 fetchInstitutions();
//                 showSnackbar('Institution deleted successfully');
//             } catch (error) {
//                 showSnackbar('Error deleting institution', 'error');
//             }
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             university: '',
//             institutionName: '',
//             courses: ['']
//         });
//         setEditingId(null);
//     };

//     return (
//         <Box sx={{ p: 3 }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
//                 <Typography variant="h5">Institution Management</Typography>
//                 <Button
//                     variant="contained"
//                     startIcon={<AddIcon />}
//                     onClick={() => {
//                         resetForm();
//                         setOpenDialog(true);
//                     }}
//                 >
//                     Add Institution
//                 </Button>
//             </Box>

//             <Paper sx={{ p: 3, mb: 3 }}>
//                 <TableContainer>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>University</TableCell>
//                                 <TableCell>Institution Name</TableCell>
//                                 <TableCell>Courses</TableCell>
//                                 <TableCell align="right">Actions</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {loading && institutions.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={4} align="center">
//                                         <CircularProgress />
//                                     </TableCell>
//                                 </TableRow>
//                             ) : institutions.length > 0 ? (
//                                 institutions.map((institution) => (
//                                     <TableRow key={institution._id}>
//                                         <TableCell>
//                                             {institution.university?.name || 'N/A'}
//                                         </TableCell>
//                                         <TableCell>{institution.name}</TableCell>
//                                         <TableCell>
//                                             {institution.courses?.length > 0 ? (
//                                                 <Box component="ul" sx={{ pl: 2, my: 0 }}>
//                                                     {institution.courses.map((course, index) => (
//                                                         <li key={index}>{course}</li>
//                                                     ))}
//                                                 </Box>
//                                             ) : 'No courses'}
//                                         </TableCell>
//                                         <TableCell align="right">
//                                             <IconButton
//                                                 onClick={() => handleEdit(institution)}
//                                                 color="primary"
//                                                 size="small"
//                                             >
//                                                 <EditIcon />
//                                             </IconButton>
//                                             <IconButton
//                                                 onClick={() => handleDelete(institution._id)}
//                                                 color="error"
//                                                 size="small"
//                                             >
//                                                 <DeleteIcon />
//                                             </IconButton>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan={4} align="center">
//                                         No institutions found. Click "Add Institution" to create one.
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             </Paper>

//             <Dialog
//                 open={openDialog}
//                 onClose={() => {
//                     setOpenDialog(false);
//                     resetForm();
//                 }}
//                 maxWidth="sm"
//                 fullWidth
//             >
//                 <DialogTitle>
//                     {editingId ? 'Edit Institution' : 'Add New Institution'}
//                 </DialogTitle>
//                 <form onSubmit={handleSubmit}>
//                     <DialogContent>
//                         <TextField
//                             select
//                             fullWidth
//                             margin="normal"
//                             label="Select University"
//                             name="university"
//                             value={formData.university}
//                             onChange={handleInputChange}
//                             required
//                             disabled={loading}
//                         >
//                             {universities.map((university) => (
//                                 <MenuItem key={university._id} value={university._id}>
//                                     {university.name}
//                                 </MenuItem>
//                             ))}
//                         </TextField>

//                         <TextField
//                             fullWidth
//                             margin="normal"
//                             label="Institution Name"
//                             name="institutionName"
//                             value={formData.institutionName}
//                             onChange={handleInputChange}
//                             required
//                             disabled={loading}
//                         />

//                         <Box sx={{ mt: 3, mb: 2 }}>
//                             <Typography variant="subtitle2" gutterBottom>
//                                 Courses
//                             </Typography>
//                             {formData.courses.map((course, index) => (
//                                 <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
//                                     <TextField
//                                         fullWidth
//                                         value={course}
//                                         onChange={(e) => handleCourseChange(index, e.target.value)}
//                                         placeholder={`Course ${index + 1}`}
//                                         disabled={loading}
//                                     />
//                                     <Button
//                                         variant="outlined"
//                                         color="error"
//                                         onClick={() => removeCourseField(index)}
//                                         disabled={formData.courses.length <= 1 || loading}
//                                         size="small"
//                                     >
//                                         Remove
//                                     </Button>
//                                 </Box>
//                             ))}
//                             <Button
//                                 variant="outlined"
//                                 startIcon={<AddIcon />}
//                                 onClick={addCourseField}
//                                 disabled={loading}
//                                 sx={{ mt: 1 }}
//                             >
//                                 Add Course
//                             </Button>
//                         </Box>
//                     </DialogContent>
//                     <DialogActions sx={{ p: 2 }}>
//                         <Button
//                             onClick={() => {
//                                 setOpenDialog(false);
//                                 resetForm();
//                             }}
//                             disabled={loading}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             disabled={loading}
//                         >
//                             {loading ? (
//                                 <>
//                                     <CircularProgress size={24} sx={{ mr: 1 }} />
//                                     {editingId ? 'Updating...' : 'Creating...'}
//                                 </>
//                             ) : (
//                                 editingId ? 'Update' : 'Create'
//                             )}
//                         </Button>
//                     </DialogActions>
//                 </form>
//             </Dialog>

//             <Snackbar
//                 open={snackbar.open}
//                 autoHideDuration={6000}
//                 onClose={handleCloseSnackbar}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//             >
//                 <Alert
//                     onClose={handleCloseSnackbar}
//                     severity={snackbar.severity}
//                     sx={{ width: '100%' }}
//                 >
//                     {snackbar.message}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// }

// frontend/src/pages/SuperAdmin/University_Institute.jsx--------------------------------------------------
// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     Box,
//     Button,
//     TextField,
//     MenuItem,
//     Typography,
//     CircularProgress
// } from '@mui/material';
// import { toast } from 'react-toastify';
// import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// import { AuthContext } from '../../context/AuthContext';

// const API_BASE = import.meta.env.VITE_API_BASE;

// export default function University_Institute() {
//     const { token } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const [universities, setUniversities] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const [formData, setFormData] = useState({
//         university: '',
//         name: '',
//         courses: []
//     });

//     // Fetch universities on component mount
//     useEffect(() => {
//         const fetchUniversities = async () => {
//             try {
//                 const response = await fetch(`${API_BASE}/universities`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to fetch universities');
//                 }

//                 const data = await response.json();
//                 setUniversities(data);
//             } catch (e) {
//                 toast.error(e.message);
//             }
//         };

//         fetchUniversities();
//     }, [token]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
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
//         setFormData(prev => ({ ...prev, courses: newCourses }));
//     };

//     const createInstitution = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             // Filter out empty courses
//             const validCourses = formData.courses.filter(course => course.trim() !== '');

//             // Validate form
//             if (!formData.university || !formData.name.trim() || validCourses.length === 0) {
//                 toast.error('Please fill in all required fields and add at least one course');
//                 return;
//             }

//             const response = await fetch(`${API_BASE}/institutions`, {  // Added /api/ here
//                 method: 'POST',
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

//             // Check if response is JSON
//             const contentType = response.headers.get('content-type');
//             if (!contentType || !contentType.includes('application/json')) {
//                 const text = await response.text();
//                 throw new Error(`Expected JSON, got ${contentType}. Response: ${text.substring(0, 100)}...`);
//             }

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to create institution');
//             }

//             toast.success('Institution created successfully');

//             // Reset form
//             setFormData({
//                 university: '',
//                 name: '',
//                 courses: []
//             });

//             // Navigate back to institutions list
//             navigate('/superadmin-dashboard/institutions');
//         } catch (error) {
//             toast.error(error.message || 'Failed to create institution. Please check console for details.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box component="form" onSubmit={createInstitution} sx={{ p: 3 }}>
//             <Button
//                 startIcon={<ArrowBackIcon />}
//                 onClick={() => navigate(-1)}
//                 sx={{ mb: 2 }}
//             >
//                 Back to List
//             </Button>

//             <Typography variant="h5" gutterBottom>
//                 Create New Institution
//             </Typography>

//             <TextField
//                 select
//                 fullWidth
//                 margin="normal"
//                 label="Select University"
//                 name="university"
//                 value={formData.university}
//                 onChange={handleInputChange}
//                 required
//                 disabled={loading || universities.length === 0}
//             >
//                 {universities.length === 0 ? (
//                     <MenuItem disabled>Loading universities...</MenuItem>
//                 ) : (
//                     universities.map((univ) => (
//                         <MenuItem key={univ._id} value={univ._id}>
//                             {univ.name}
//                         </MenuItem>
//                     ))
//                 )}
//             </TextField>

//             <TextField
//                 fullWidth
//                 margin="normal"
//                 label="Institution Name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 required
//                 disabled={loading}
//             />

//             <Box sx={{ mt: 3, mb: 2 }}>
//                 <Typography variant="subtitle2" gutterBottom>
//                     Courses
//                 </Typography>
//                 {formData.courses.map((course, index) => (
//                     <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
//                         <TextField
//                             fullWidth
//                             value={course}
//                             onChange={(e) => handleCourseChange(index, e.target.value)}
//                             placeholder={`Course ${index + 1}`}
//                             disabled={loading}
//                         />
//                         <Button
//                             type="button"
//                             variant="outlined"
//                             color="error"
//                             onClick={() => removeCourseField(index)}
//                             disabled={formData.courses.length <= 1 || loading}
//                             size="small"
//                         >
//                             Remove
//                         </Button>
//                     </Box>
//                 ))}
//                 <Button
//                     type="button"
//                     variant="outlined"
//                     onClick={addCourseField}
//                     disabled={loading}
//                     sx={{ mt: 1 }}
//                 >
//                     Add Course
//                 </Button>
//             </Box>

//             <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
//                 <Button
//                     type="button"
//                     variant="outlined"
//                     onClick={() => navigate('/superadmin-dashboard/institutions')}
//                     disabled={loading}
//                 >
//                     Cancel
//                 </Button>
//                 <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     disabled={loading}
//                 >
//                     {loading ? <CircularProgress size={24} /> : 'Create Institution'}
//                 </Button>
//             </Box>
//         </Box>
//     );
// }

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import { ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE;

export default function University_Institute() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        university: '',
        name: '',
        courses: ['']
    });

    // Fetch universities on component mount
    useEffect(() => {
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
                setUniversities(data);
            } catch (error) {
                toast.error(error.message || 'Failed to load universities');
            }
        };

        fetchUniversities();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCourseChange = (index, value) => {
        const newCourses = [...formData.courses];
        newCourses[index] = value;
        setFormData(prev => ({ ...prev, courses: newCourses }));
    };

    const addCourseField = () => {
        setFormData(prev => ({
            ...prev,
            courses: [...prev.courses, '']
        }));
    };

    const removeCourseField = (index) => {
        const newCourses = formData.courses.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, courses: newCourses }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filter out empty courses
            const validCourses = formData.courses.filter(course => course.trim() !== '');

            // Validate form
            if (!formData.university || !formData.name.trim() || validCourses.length === 0) {
                toast.error('Please fill in all required fields and add at least one course');
                return;
            }

            const res = await fetch(`${API_BASE}/institutions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    university: formData.university,
                    name: formData.name,
                    courses: validCourses
                })
            });

            const data = await res.json();
            console.log(data)

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create institution');
            }

            toast.success('Institution created successfully');

            // Reset form
            setFormData({
                university: '',
                name: '',
                courses: ['']
            });

            // Navigate back to institutions list
            // navigate('/superadmin-dashboard/institutions');
        } catch (error) {
            toast.error(error.message || 'Failed to create institution');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
                disabled={loading}
            >
                Back to List
            </Button>

            <Typography variant="h4" component="h1" gutterBottom>
                Create New Institution
            </Typography>

            <Box sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                <TextField
                    select
                    fullWidth
                    margin="normal"
                    label="University"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    required
                    disabled={loading || universities.length === 0}
                >
                    <MenuItem value="" disabled>
                        {universities.length === 0 ? 'Loading universities...' : 'Select a university'}
                    </MenuItem>
                    {universities.map((univ) => (
                        <MenuItem key={univ._id} value={univ._id}>
                            {univ.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    margin="normal"
                    label="Institution Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                />

                <Box sx={{ mt: 3, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        Courses
                    </Typography>
                    {formData.courses.map((course, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                value={course}
                                onChange={(e) => handleCourseChange(index, e.target.value)}
                                placeholder={`Course ${index + 1}`}
                                disabled={loading}
                            />
                            {formData.courses.length > 1 && (
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => removeCourseField(index)}
                                    disabled={loading}
                                    sx={{ minWidth: '40px' }}
                                >
                                    <DeleteIcon />
                                </Button>
                            )}
                        </Box>
                    ))}
                    <Button
                        type="button"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={addCourseField}
                        disabled={loading}
                        sx={{ mt: 1 }}
                    >
                        Add Course
                    </Button>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        type="button"
                        variant="outlined"
                        // onClick={() => navigate('/superadmin-dashboard/institutions')}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? 'Creating...' : 'Create Institution'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}