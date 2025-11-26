// // frontend/src/pages/SuperAdmin/University_Institute.jsx--------------------------------------------------
// // import React, { useState, useEffect, useContext } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //     Box,
// //     Button,
// //     TextField,
// //     MenuItem,
// //     Typography,
// //     CircularProgress
// // } from '@mui/material';
// // import { toast } from 'react-toastify';
// // import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// // import { AuthContext } from '../../context/AuthContext';

// // const API_BASE = import.meta.env.VITE_API_BASE;

// // export default function University_Institute() {
// //     const { token } = useContext(AuthContext);
// //     const navigate = useNavigate();

// //     const [universities, setUniversities] = useState([]);
// //     const [loading, setLoading] = useState(false);

// //     const [formData, setFormData] = useState({
// //         university: '',
// //         name: '',
// //         courses: []
// //     });

// //     // Fetch universities on component mount
// //     useEffect(() => {
// //         const fetchUniversities = async () => {
// //             try {
// //                 const response = await fetch(`${API_BASE}/universities`, {
// //                     headers: {
// //                         'Authorization': `Bearer ${token}`
// //                     }
// //                 });

// //                 if (!response.ok) {
// //                     throw new Error('Failed to fetch universities');
// //                 }

// //                 const data = await response.json();
// //                 setUniversities(data);
// //             } catch (e) {
// //                 toast.error(e.message);
// //             }
// //         };

// //         fetchUniversities();
// //     }, [token]);

// //     const handleInputChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData(prev => ({ ...prev, [name]: value }));
// //     };

// //     const handleCourseChange = (index, value) => {
// //         const newCourses = [...formData.courses];
// //         newCourses[index] = value;
// //         setFormData(prev => ({ ...prev, courses: newCourses }));
// //     };

// //     const addCourseField = () => {
// //         setFormData(prev => ({ ...prev, courses: [...prev.courses, ''] }));
// //     };

// //     const removeCourseField = (index) => {
// //         const newCourses = formData.courses.filter((_, i) => i !== index);
// //         setFormData(prev => ({ ...prev, courses: newCourses }));
// //     };

// //     const createInstitution = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);

// //         try {
// //             // Filter out empty courses
// //             const validCourses = formData.courses.filter(course => course.trim() !== '');

// //             // Validate form
// //             if (!formData.university || !formData.name.trim() || validCourses.length === 0) {
// //                 toast.error('Please fill in all required fields and add at least one course');
// //                 return;
// //             }

// //             const response = await fetch(`${API_BASE}/institutions`, {  // Added /api/ here
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                     'Authorization': `Bearer ${token}`
// //                 },
// //                 body: JSON.stringify({
// //                     name: formData.name,
// //                     university: formData.university,
// //                     courses: validCourses
// //                 })
// //             });

// //             // Check if response is JSON
// //             const contentType = response.headers.get('content-type');
// //             if (!contentType || !contentType.includes('application/json')) {
// //                 const text = await response.text();
// //                 throw new Error(`Expected JSON, got ${contentType}. Response: ${text.substring(0, 100)}...`);
// //             }

// //             const data = await response.json();

// //             if (!response.ok) {
// //                 throw new Error(data.message || 'Failed to create institution');
// //             }

// //             toast.success('Institution created successfully');

// //             // Reset form
// //             setFormData({
// //                 university: '',
// //                 name: '',
// //                 courses: []
// //             });

// //             // Navigate back to institutions list
// //             navigate('/superadmin-dashboard/institutions');
// //         } catch (error) {
// //             toast.error(error.message || 'Failed to create institution. Please check console for details.');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <Box component="form" onSubmit={createInstitution} sx={{ p: 3 }}>
// //             <Button
// //                 startIcon={<ArrowBackIcon />}
// //                 onClick={() => navigate(-1)}
// //                 sx={{ mb: 2 }}
// //             >
// //                 Back to List
// //             </Button>

// //             <Typography variant="h5" gutterBottom>
// //                 Create New Institution
// //             </Typography>

// //             <TextField
// //                 select
// //                 fullWidth
// //                 margin="normal"
// //                 label="Select University"
// //                 name="university"
// //                 value={formData.university}
// //                 onChange={handleInputChange}
// //                 required
// //                 disabled={loading || universities.length === 0}
// //             >
// //                 {universities.length === 0 ? (
// //                     <MenuItem disabled>Loading universities...</MenuItem>
// //                 ) : (
// //                     universities.map((univ) => (
// //                         <MenuItem key={univ._id} value={univ._id}>
// //                             {univ.name}
// //                         </MenuItem>
// //                     ))
// //                 )}
// //             </TextField>

// //             <TextField
// //                 fullWidth
// //                 margin="normal"
// //                 label="Institution Name"
// //                 name="name"
// //                 value={formData.name}
// //                 onChange={handleInputChange}
// //                 required
// //                 disabled={loading}
// //             />

// //             <Box sx={{ mt: 3, mb: 2 }}>
// //                 <Typography variant="subtitle2" gutterBottom>
// //                     Courses
// //                 </Typography>
// //                 {formData.courses.map((course, index) => (
// //                     <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
// //                         <TextField
// //                             fullWidth
// //                             value={course}
// //                             onChange={(e) => handleCourseChange(index, e.target.value)}
// //                             placeholder={`Course ${index + 1}`}
// //                             disabled={loading}
// //                         />
// //                         <Button
// //                             type="button"
// //                             variant="outlined"
// //                             color="error"
// //                             onClick={() => removeCourseField(index)}
// //                             disabled={formData.courses.length <= 1 || loading}
// //                             size="small"
// //                         >
// //                             Remove
// //                         </Button>
// //                     </Box>
// //                 ))}
// //                 <Button
// //                     type="button"
// //                     variant="outlined"
// //                     onClick={addCourseField}
// //                     disabled={loading}
// //                     sx={{ mt: 1 }}
// //                 >
// //                     Add Course
// //                 </Button>
// //             </Box>

// //             <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
// //                 <Button
// //                     type="button"
// //                     variant="outlined"
// //                     onClick={() => navigate('/superadmin-dashboard/institutions')}
// //                     disabled={loading}
// //                 >
// //                     Cancel
// //                 </Button>
// //                 <Button
// //                     type="submit"
// //                     variant="contained"
// //                     color="primary"
// //                     disabled={loading}
// //                 >
// //                     {loading ? <CircularProgress size={24} /> : 'Create Institution'}
// //                 </Button>
// //             </Box>
// //         </Box>
// //     );
// // }

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
// import { ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
//         courses: ['']
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
//                 setUniversities(Array.isArray(data) ? data : []);
//             } catch (error) {
//                 toast.error(error.message || 'Failed to load universities');
//             }
//         };

//         fetchUniversities();
//     }, [token]);

//     // const handleInputChange = (e) => {
//     //     const { name, value } = e.target;
//     //     setFormData(prev => ({ ...prev, [name]: value }));
//     // };

//     const handleInputChange = (e) => {
//         setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };


//     const handleCourseChange = (index, value) => {
//         const newCourses = [...formData.courses];
//         newCourses[index] = value;
//         setFormData(prev => ({ ...prev, courses: newCourses }));
//     };

//     const addCourseField = () => {
//         setFormData(prev => ({
//             ...prev,
//             courses: [...prev.courses, '']
//         }));
//     };

//     const removeCourseField = (index) => {
//         const newCourses = formData.courses.filter((_, i) => i !== index);
//         setFormData(prev => ({ ...prev, courses: newCourses }));
//     };

//     // const handleSubmit = async (e) => {
//     //     e.preventDefault();
//     //     setLoading(true);

//     //     try {
//     //         // Filter out empty courses
//     //         const validCourses = formData.courses.filter(course => course.trim() !== '');

//     //         // Validate form
//     //         if (!formData.university || !formData.name.trim() || validCourses.length === 0) {
//     //             toast.error('Please fill in all required fields and add at least one course');
//     //             return;
//     //         }

//     //         const res = await fetch(`${API_BASE}/institutions`, {
//     //             method: 'POST',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //                 'Authorization': `Bearer ${token}`
//     //             },
//     //             body: JSON.stringify({
//     //                 university: formData.university,
//     //                 name: formData.name,
//     //                 courses: validCourses
//     //             })
//     //         });

//     //         const data = await res.json();
//     //         console.log(data)

//     //         if (!res.ok) {
//     //             throw new Error(data.message || 'Failed to create institution');
//     //         }

//     //         toast.success('Institution created successfully');

//     //         // Reset form
//     //         setFormData({
//     //             university: '',
//     //             name: '',
//     //             courses: ['']
//     //         });

//     //         // Navigate back to institutions list
//     //         // navigate('/superadmin-dashboard/institutions');
//     //     } catch (error) {
//     //         toast.error(error.message || 'Failed to create institution');
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     const handleSubmit = async () => {
//         setLoading(true);

//         try {
//             const validCourses = formData.courses
//                 .map(c => c.trim())
//                 .filter(c => c !== '');

//             if (!formData.university || !formData.name.trim() || validCourses.length === 0) {
//                 toast.error('Please fill all required fields and add at least one course');
//                 return;
//             }

//             const res = await fetch(`${API_BASE}/institutions`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     university: formData.university,
//                     name: formData.name,
//                     courses: validCourses
//                 })
//             });

//             const data = await res.json();
//             console.log(data);

//             if (!res.ok) {
//                 throw new Error(data.message || 'Failed to create institution');
//             }

//             toast.success('Institution created successfully');

//             setFormData({
//                 university: '',
//                 name: '',
//                 courses: ['']
//             });

//         } catch (error) {
//             toast.error(error.message || 'Failed to create institution');
//         } finally {
//             setLoading(false);
//         }
//     };


//     return (
//         // component="form" onSubmit={handleSubmit}
//         <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
//             <Button
//                 startIcon={<ArrowBackIcon />}
//                 onClick={() => navigate(-1)}
//                 sx={{ mb: 3 }}
//                 disabled={loading}
//             >
//                 Back to List
//             </Button>

//             <Typography variant="h4" component="h1" gutterBottom>
//                 Create New Institution
//             </Typography>

//             <Box sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
//                 <TextField
//                     select
//                     fullWidth
//                     margin="normal"
//                     label="University"
//                     name="university"
//                     value={formData.university}
//                     onChange={handleInputChange}
//                     required
//                     disabled={loading || universities.length === 0}
//                 >
//                     <MenuItem value="" disabled>
//                         {universities.length === 0 ? 'Loading universities...' : ''}
//                     </MenuItem>
//                     {universities.map((univ) => (
//                         <MenuItem key={univ._id} value={univ.name}>
//                             {univ.name}
//                         </MenuItem>
//                     ))}
//                 </TextField>

//                 <TextField
//                     fullWidth
//                     margin="normal"
//                     label="Institution Name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     required
//                     disabled={loading}
//                 />

//                 <Box sx={{ mt: 3, mb: 2 }}>
//                     <Typography variant="subtitle1" gutterBottom>
//                         Courses
//                     </Typography>
//                     {formData.courses.map((course, index) => (
//                         <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
//                             <TextField
//                                 fullWidth
//                                 value={course}
//                                 onChange={(e) => handleCourseChange(index, e.target.value)}
//                                 placeholder={`Course ${index + 1}`}
//                                 disabled={loading}
//                             />
//                             {formData.courses.length > 1 && (
//                                 <Button
//                                     type="button"
//                                     variant="outlined"
//                                     color="error"
//                                     onClick={() => removeCourseField(index)}
//                                     disabled={loading}
//                                     sx={{ minWidth: '40px' }}
//                                 >
//                                     <DeleteIcon />
//                                 </Button>
//                             )}
//                         </Box>
//                     ))}
//                     <Button
//                         type="button"
//                         variant="outlined"
//                         startIcon={<AddIcon />}
//                         onClick={addCourseField}
//                         disabled={loading}
//                         sx={{ mt: 1 }}
//                     >
//                         Add Course
//                     </Button>
//                 </Box>

//                 <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//                     <Button
//                         type="button"
//                         variant="outlined"
//                         // onClick={() => navigate('/superadmin-dashboard/institutions')}
//                         disabled={loading}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         disabled={loading}
//                         onClick={handleSubmit}
//                         startIcon={loading ? <CircularProgress size={20} /> : null}
//                     >
//                         {loading ? 'Creating...' : 'Create Institution'}
//                     </Button>

//                 </Box>
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
// import { ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ArrowBack as ArrowBackIcon, Add as AddIcon, Delete as DeleteIcon, Cancel as CancelIcon } from '@mui/icons-material';
import studentImage from "../../assets/images/student-add.png";
import { AuthContext } from '../../context/AuthContext';
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

// import CancelIcon from "@mui/icons-material/Cancel";
// import AddIcon from "@mui/icons-material/Add";

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

    // Fetch universities
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

    const handleCancel = () => {
        setFormData({
            university: '',
            name: '',
            courses: ['']
        });
    };


    return (
        <Box
            sx={{
                p: 4,
                maxWidth: "1100px",
                mx: "auto",
                my: 4,
                bgcolor: "#fff",
                borderRadius: "24px",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                display: "flex",
                gap: 4,
                alignItems: "center",
            }}
        >

            {/* LEFT SIDE FORM */}
            <Box sx={{ flex: 1, color: "#2b4ddb" }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2 }}
                    disabled={loading}

                >
                    Back to List
                </Button>

                <Typography
                    variant="h4"
                    sx={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#2b4ddb",
                        lineHeight: 1.2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    CREATE INSTITUTION
                    <PersonAddRoundedIcon sx={{ fontSize: 32, color: "#2b4ddb" }} />
                </Typography>



                <Typography sx={{ mb: 3, color: "gray" }}>
                    Add institution details & assign courses
                </Typography>

                <TextField
                    select
                    fullWidth
                    margin="normal"
                    label="University"
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    required
                    size="small"
                    disabled={loading || universities.length === 0}
                    sx={{
                        // bgcolor: "#f9f9f9",
                        borderRadius: "10px"
                    }}
                >
                    <MenuItem value="" disabled>
                        {universities.length === 0 ? 'Loading universities...' : 'Select University'}
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
                    size="small"
                    disabled={loading}
                    sx={{ borderRadius: "10px" }}
                />

                <Typography sx={{ mt: 3, fontWeight: 600 }}>Courses</Typography>

                {formData.courses.map((course, index) => (
                    <Box
                        key={index}
                        sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center" }}
                    >
                        <TextField
                            fullWidth
                            value={course}
                            onChange={(e) => handleCourseChange(index, e.target.value)}
                            placeholder={`Course ${index + 1}`}
                            disabled={loading}
                            size="small"
                            sx={{ borderRadius: "10px" }}
                        />

                        {formData.courses.length > 1 && (
                            <Button
                                type="button"
                                variant="outlined"
                                color="error"
                                onClick={() => removeCourseField(index)}
                                disabled={loading}
                                sx={{ minWidth: "40px" }}
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
                    size="small"
                    sx={{ mt: 2 }}
                >
                    Add Course
                </Button>

                <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
                    <Button
                        variant="contained"
                        disabled={loading}
                        onClick={handleSubmit}
                        startIcon={<AddIcon />}
                    >
                        {loading ? "Creating..." : "Create Institution"}
                    </Button>

                    <Button
                        variant="outlined"
                        disabled={loading}
                        onClick={handleCancel}
                        startIcon={<CancelIcon />}
                    >
                        Cancel
                    </Button>
                </Box>

            </Box>

            {/* RIGHT SIDE ILLUSTRATION */}
            <Box sx={{ flex: 0.9, display: "flex", justifyContent: "center" }}>
                <img
                    src={studentImage}
                    alt="Illustration"
                    style={{ width: "90%", objectFit: "contain" }}
                />
            </Box>
        </Box>
    );
}
