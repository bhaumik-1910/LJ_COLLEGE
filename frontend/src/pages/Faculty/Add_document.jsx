import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, MenuItem, Paper, TextField, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// *** Image import - Make sure this path is correct ***
import studentImage from './../../assets/images/student-add.png';

// const API_BASE = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_BASE;

export default function Add_document() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const theme = useTheme();

    // const [students, setStudents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Add these state variables at the top of your component
    const [universities, setUniversities] = useState([]);
    const [institutes, setInstitutes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState("");
    const [selectedInstitute, setSelectedInstitute] = useState("");

    const [form, setForm] = useState({
        university: "",
        universityName: "",
        institute: "",
        course: "",
        // enrolno: "",
        // fullName: "",
        type: "",
        categoryId: "",
        categoryName: "",
        subCategory: "",
        // date: "",
        date: new Date().toISOString().split("T")[0],
        file: null,
        images: [], // up to 4
    });

    // const selectedStudent = useMemo(() => students.find((s) => s.enrolno === form.enrolno) || null, [students, form.enrolno]);

    const handleChange = (e) => {
        // const { name, value } = e.target;
        // setForm((prev) => ({ ...prev, [name]: value }));

        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            setForm((prev) => ({ ...prev, file }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFile = (e) => {
        // const file = e.target.files?.[0] || null;
        // setForm((prev) => ({ ...prev, file }));
        const file = e.target.files?.[0];
        if (file) {
            setForm(prev => ({ ...prev, file }));
        }
        e.target.value = '';
    };

    const handleImages = (e) => {
        // const files = Array.from(e.target.files || []).slice(0, 4);
        // setForm((prev) => ({ ...prev, images: files }));
        const files = e.target.files ? Array.from(e.target.files).slice(0, 4) : [];
        setForm(prev => ({
            ...prev,
            images: [...prev.images, ...files].slice(0, 4) // Ensure max 4 images
        }));
        e.target.value = '';
    };

    // Keep fullName in sync when enrolno selected
    // useEffect(() => {
    //     if (selectedStudent) {
    //         setForm((prev) => ({ ...prev, fullName: selectedStudent.fullName }));
    //     } else {
    //         setForm((prev) => ({ ...prev, fullName: "" }));
    //     }
    // }, [selectedStudent]);

    // const fetchStudents = async () => {
    //     try {
    //         const res = await fetch(`${API_BASE}/faculty/students`, {
    //             headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    //         });
    //         const data = await res.json();
    //         if (res.ok) setStudents(Array.isArray(data) ? data : []);
    //         else toast.error(data.message || "Failed to fetch students");
    //     } catch (e) {
    //         toast.error("Failed to fetch students");
    //     }
    // };


    const validate = () => {
        if (!form.universityName) return toast.error("Select University");
        if (!form.institute) return toast.error("Select Institute ");
        if (!form.course) return toast.error("Select Course");
        if (!form.type.trim()) return toast.error("Type is required");
        if (!form.date) return toast.error("Date is required");
        if (!form.file) return toast.error("Upload a document file");
        if (!form.categoryId && !form.categoryName.trim()) return toast.error("Select or enter category");
        // File type check
        const allowed = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];
        if (form.file && !allowed.includes(form.file.type)) return toast.error("Unsupported file type");
        if (form.images.length > 4) return toast.error("Maximum 4 images");
        return null;
    };

    // Add these fetch functions
    const fetchUniversities = async () => {
        try {
            const res = await fetch(`${API_BASE}/universities`, {
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            });
            const data = await res.json();
            if (res.ok) setUniversities(Array.isArray(data) ? data : []);
            else toast.error(data.message || "Failed to fetch universities");
        } catch (e) {
            toast.error("Failed to fetch universities");
        }
    };

    //Fetch To the institutions
    const fetchInstitutes = async (universityName) => {
        if (!universityName) {
            setInstitutes([]);
            return;
        }

        try {
            const url = `${API_BASE}/institutions/university/${encodeURIComponent(universityName)}`;

            const res = await fetch(url, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'application/json'
                },
            });

            // First check if response is JSON
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                throw new Error('Server returned non-JSON response');
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || `HTTP error! status: ${res.status}`);
            }

            // Handle the response format
            const institutesData = data.data || [];

            setInstitutes(institutesData);
            setForm(prev => ({
                ...prev,
                institute: "",
                course: ""
            }));

        } catch (error) {
            toast.error(`Error fetching institutes: ${error.message}`);
            setInstitutes([]);
        }
    };


    // Fetch courses when institute is selected
    const fetchCourses = async (instituteId) => {
        if (!instituteId) {
            setCourses([]);
            return;
        }

        try {
            const url = `${API_BASE}/institutions/${instituteId}/courses`;

            const res = await fetch(url, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    'Content-Type': 'application/json'
                },
            });

            // First check if response is JSON
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await res.text();
                throw new Error('Server returned non-JSON response');
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || `HTTP error! status: ${res.status}`);
            }

            // Handle the response format
            const coursesData = Array.isArray(data) ? data : (data.data || []);

            setCourses(coursesData);

        } catch (error) {
            toast.error(`Error fetching courses: ${error.message}`);
            setCourses([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE}/categories`, {
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            });
            const data = await res.json();
            if (res.ok) setCategories(Array.isArray(data) ? data : []);
            else toast.error(data.message || "Failed to fetch categories");
        } catch (e) {
            toast.error("Failed to fetch categories");
        }
    };
    // const fetchCategories = async () => {
    //     try {
    //         const res = await fetch(`${API_BASE}/documents/categories`, {
    //             headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    //         });

    //         const data = await res.json();

    //         if (res.ok) setCategories(Array.isArray(data) ? data : []);
    //         else toast.error(data.message || "Failed to fetch categories");
    //     } catch (e) {
    //         toast.error("Failed to fetch categories");
    //     }
    // };


    useEffect(() => {
        // fetchStudents();
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchUniversities();
    }, []);

    useEffect(() => {
        if (selectedUniversity) {
            fetchInstitutes(selectedUniversity);
        }
    }, [selectedUniversity]);


    useEffect(() => {
        if (form.institute) {
            fetchCourses(form.institute);
        } else {
            setCourses([]);
        }
    }, [form.institute]);


    const onSubmit = async (e) => {
        // e.preventDefault();
        // const err = validate();
        // if (err) return;

        // setLoading(true);
        // try {
        //     const fd = new FormData();
        //     // fd.append("enrolno", form.enrolno);
        //     fd.append("type", form.type);
        //     fd.append("date", form.date);
        //     if (form.categoryId) fd.append("categoryId", form.categoryId);
        //     if (form.categoryName.trim()) fd.append("categoryName", form.categoryName.trim());
        //     if (form.file) fd.append("file", form.file);
        //     for (const img of form.images) fd.append("images", img);

        //     const res = await fetch(`${API_BASE}/documents`, {
        //         method: "POST",
        //         headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        //         body: fd,
        //     });
        //     const data = await res.json().catch(() => ({}));
        //     if (!res.ok) throw new Error(data.message || "Upload failed");
        //     toast.success("Document uploaded successfully");
        //     setForm({ universityName: "", institute: "", course: "", type: "", categoryId: "", categoryName: "", date: "", file: null, images: [] });
        // } catch (error) {
        //     toast.error(error.message || "Something went wrong");
        // } finally {
        //     setLoading(false);
        // }

        e.preventDefault();
        const err = validate();
        if (err) return;

        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('university', form.university);
            fd.append('universityName', form.universityName);
            fd.append('institute', form.institute);
            fd.append('course', form.course);
            fd.append("type", form.type);
            fd.append("subCategory", form.subCategory.trim());
            fd.append("date", form.date);

            if (form.categoryId) fd.append("categoryId", form.categoryId);
            if (form.categoryName.trim()) fd.append("categoryName", form.categoryName.trim());

            if (form.file) fd.append("file", form.file);
            for (const img of form.images) fd.append("images", img);

            const res = await fetch(`${API_BASE}/documents`, {
                method: "POST",
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: fd,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.message || "Upload failed");

            toast.success("Document uploaded successfully");

            setForm({ university: '', universityName: "", institute: "", course: "", type: "", categoryId: "", categoryName: "", subCategory: "", date: "", file: null, images: [] });
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box component="form" onSubmit={onSubmit} sx={{ p: 3, maxWidth: 1100, mx: "auto" }}>
            <Paper elevation={4} sx={{ borderRadius: 2, p: { xs: 2, md: 6 }, bgcolor: '#fff' }}>
                <Grid
                    container
                    spacing={3}
                    alignItems="stretch"
                    sx={{
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >

                    {/* Left side — Form */}
                    <Grid item xs={12} md={6}>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                            mb={{ xs: 3, md: 2 }}
                            color="primary.main"
                            display="flex"
                            alignItems="center"
                            gap={2}
                        >
                            Add Document
                            <DescriptionIcon fontSize="large" />
                        </Typography>

                        {/* Form Fields */}
                        <Grid container spacing={2} direction="column">
                            {/* University Dropdown */}
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Select University"
                                    name="university"
                                    size="small"
                                    value={form.university}
                                    onChange={(e) => {
                                        const selectedUniversity = universities.find(u => u._id === e.target.value);
                                        if (selectedUniversity) {
                                            setSelectedUniversity(selectedUniversity.name);
                                            setForm(prev => ({
                                                ...prev,
                                                university: selectedUniversity._id,
                                                universityName: selectedUniversity.name,
                                                institute: "",
                                                course: ""
                                            }));
                                            fetchInstitutes(selectedUniversity.name);
                                        }
                                    }}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Select University</em>
                                    </MenuItem>
                                    {universities.map((univ) => (
                                        <MenuItem key={univ._id} value={univ._id}>
                                            {univ.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Institute Dropdown */}
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Select Institute"
                                    name="institute"
                                    size="small"
                                    value={form.institute}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setForm(prev => ({
                                            ...prev,
                                            institute: selectedId,
                                            course: ""
                                        }));
                                        fetchCourses(selectedId);
                                    }}
                                    // onChange={(e) => {
                                    //     const selectedId = e.target.value;
                                    //     const inst = institutes.find(i => i._id === selectedId);

                                    //     setForm(prev => ({
                                    //         ...prev,
                                    //         institute: selectedId,
                                    //         instituteName: inst?.name || "",
                                    //         course: ""
                                    //     }));

                                    //     fetchCourses(selectedId);
                                    // }}

                                    disabled={!form.university}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Select Institute</em>
                                    </MenuItem>
                                    {institutes.map((inst) => (
                                        <MenuItem key={inst._id} value={inst._id}>
                                            {inst.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Course Dropdown */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Select Course"
                                    name="course"
                                    size="small"
                                    value={form.course}
                                    onChange={(e) => {
                                        setForm(prev => ({
                                            ...prev,
                                            course: e.target.value
                                        }));
                                    }}
                                    disabled={!form.institute}
                                    required
                                >
                                    <MenuItem value="">
                                        <em>Select Course</em>
                                    </MenuItem>
                                    {courses.map((course, index) => (
                                        <MenuItem key={index} value={course}>
                                            {course}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Type */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Type*"
                                    name="type"
                                    value={form.type}
                                    size="small"
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="e.g., Assignment, Report"
                                />
                            </Grid>

                            {/* Category */}
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Category (existing)*"
                                    name="categoryId"
                                    size="small"
                                    value={form.categoryId}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            categoryId: e.target.value,
                                            categoryName: "",
                                        }))
                                    }
                                    fullWidth
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {categories.map((c) => (
                                        <MenuItem key={c._id} value={c._id}>
                                            {c.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            {/* <TextField
                                select
                                label="Category (existing)*"
                                name="categoryId"
                                size="small"
                                value={form.categoryId}
                                onChange={(e) => {
                                    const selectedId = e.target.value;

                                    const selectedCategory = categories.find(
                                        (c) => c._id.toString() === selectedId
                                    );

                                    setForm((p) => ({
                                        ...p,
                                        categoryId: selectedId,
                                        categoryName: selectedCategory?.name || "",
                                        newCategoryName: "",     //IMPORTANT: NEW CATEGORY CLEAR
                                    }));
                                }}
                                fullWidth
                            >
                                <MenuItem value="">None</MenuItem>
                                {categories.map((c) => (
                                    <MenuItem key={c._id} value={c._id.toString()}>
                                        {c.name}
                                    </MenuItem>
                                ))}
                            </TextField> */}

                            {/* New Category */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Or New Category"
                                    name="categoryName"
                                    size="small"
                                    value={form.categoryName}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            categoryName: e.target.value,
                                            categoryId: "",
                                        }))
                                    }
                                    fullWidth
                                />
                            </Grid>

                            {/* Sub Category */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Sub Category (Optional)"
                                    name="subCategory"
                                    size="small"
                                    value={form.subCategory}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            subCategory: e.target.value, //OPTIONAL
                                        }))
                                    }
                                    fullWidth
                                    placeholder="e.g., Unit-1, Practical, Mid Term"
                                />
                            </Grid>

                            {/* Date */}
                            {/* <Grid item xs={12}>
                                <TextField
                                    type="date"
                                    label="Date"
                                    name="date"
                                    value={form.date}
                                    size="small"
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid> */}
                            <Grid item xs={12}>
                                <TextField
                                    type="date"
                                    label="Date"
                                    name="date"
                                    value={form.date}
                                    size="small"
                                    fullWidth
                                    disabled    // USER CHANGE NA KARI SAKE
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>


                            {/* Document */}
                            <Grid item xs={12}>
                                <Button variant="outlined" component="label">
                                    Upload Document (pdf/doc/ppt/xls)
                                    <input
                                        type="file"
                                        hidden
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                                        onChange={handleFile}
                                    />
                                </Button>
                                <Typography variant="body2" sx={{ ml: 2, display: "inline-block" }}>
                                    {form.file ? form.file.name : "No file selected"}
                                </Typography>
                            </Grid>

                            {/* Images */}
                            <Grid item xs={12}>
                                <Button variant="outlined" component="label">
                                    Upload Images (max 4)
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImages}
                                    />
                                </Button>
                                <Typography variant="body2" sx={{ ml: 2, display: "inline-block" }}>
                                    {form.images.length > 0
                                        ? `${form.images.length} selected`
                                        : "None"}
                                </Typography>
                            </Grid>

                            {/* Buttons */}
                            <Box mt={3} display="flex" gap={2}>
                                <Button type="submit" variant="contained" disabled={loading} startIcon={<SaveIcon />}>
                                    {loading ? "Saving..." : "Upload Document"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    // color="secondary"
                                    onClick={() => navigate(-1)}
                                    startIcon={<CancelIcon />}>
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Right side — Image */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: theme.palette.primary.light + "10",
                            borderRadius: 2,
                            p: 3,
                        }}
                    >
                        <Box sx={{ width: "100%", maxWidth: 400 }}>
                            <img
                                src={studentImage}
                                alt="Student Form Illustration"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    display: "block",
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
