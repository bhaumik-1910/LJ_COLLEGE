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
                setUniversities(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error(error.message || 'Failed to load universities');
            }
        };

        fetchUniversities();
    }, [token]);

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({ ...prev, [name]: value }));
    // };

    const handleInputChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         // Filter out empty courses
    //         const validCourses = formData.courses.filter(course => course.trim() !== '');

    //         // Validate form
    //         if (!formData.university || !formData.name.trim() || validCourses.length === 0) {
    //             toast.error('Please fill in all required fields and add at least one course');
    //             return;
    //         }

    //         const res = await fetch(`${API_BASE}/institutions`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             body: JSON.stringify({
    //                 university: formData.university,
    //                 name: formData.name,
    //                 courses: validCourses
    //             })
    //         });

    //         const data = await res.json();
    //         console.log(data)

    //         if (!res.ok) {
    //             throw new Error(data.message || 'Failed to create institution');
    //         }

    //         toast.success('Institution created successfully');

    //         // Reset form
    //         setFormData({
    //             university: '',
    //             name: '',
    //             courses: ['']
    //         });

    //         // Navigate back to institutions list
    //         // navigate('/superadmin-dashboard/institutions');
    //     } catch (error) {
    //         toast.error(error.message || 'Failed to create institution');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const validCourses = formData.courses
                .map(c => c.trim())
                .filter(c => c !== '');

            if (!formData.university || !formData.name.trim() || validCourses.length === 0) {
                toast.error('Please fill all required fields and add at least one course');
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
            console.log(data);

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create institution');
            }

            toast.success('Institution created successfully');

            setFormData({
                university: '',
                name: '',
                courses: ['']
            });

        } catch (error) {
            toast.error(error.message || 'Failed to create institution');
        } finally {
            setLoading(false);
        }
    };


    return (
        // component="form" onSubmit={handleSubmit}
        <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
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
                        {universities.length === 0 ? 'Loading universities...' : ''}
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
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        onClick={handleSubmit}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? 'Creating...' : 'Create Institution'}
                    </Button>

                </Box>
            </Box>
        </Box>
    );
}