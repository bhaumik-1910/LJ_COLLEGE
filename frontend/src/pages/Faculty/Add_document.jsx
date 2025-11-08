import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, MenuItem, Paper, TextField, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

// *** Image import - Make sure this path is correct ***
import studentImage from './../../assets/images/student-add.png';

const API_BASE = "http://localhost:5000/api";

export default function Add_document() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const theme = useTheme();

    const [students, setStudents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        enrolno: "",
        fullName: "",
        type: "",
        categoryId: "",
        categoryName: "",
        date: "",
        file: null,
        images: [], // up to 4
    });

    const selectedStudent = useMemo(() => students.find((s) => s.enrolno === form.enrolno) || null, [students, form.enrolno]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFile = (e) => {
        const file = e.target.files?.[0] || null;
        setForm((prev) => ({ ...prev, file }));
    };

    const handleImages = (e) => {
        const files = Array.from(e.target.files || []).slice(0, 4);
        setForm((prev) => ({ ...prev, images: files }));
    };

    // Keep fullName in sync when enrolno selected
    useEffect(() => {
        if (selectedStudent) {
            setForm((prev) => ({ ...prev, fullName: selectedStudent.fullName }));
        } else {
            setForm((prev) => ({ ...prev, fullName: "" }));
        }
    }, [selectedStudent]);

    const fetchStudents = async () => {
        try {
            const res = await fetch(`${API_BASE}/faculty/students`, {
                headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            });
            const data = await res.json();
            if (res.ok) setStudents(Array.isArray(data) ? data : []);
            else toast.error(data.message || "Failed to fetch students");
        } catch (e) {
            toast.error("Failed to fetch students");
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

    useEffect(() => {
        fetchStudents();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const validate = () => {
        if (!form.enrolno) return toast.error("Select student enrolment no");
        if (!form.fullName) return toast.error("Student name required");
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

    const onSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return;

        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("enrolno", form.enrolno);
            fd.append("type", form.type);
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
            setForm({ enrolno: "", fullName: "", type: "", categoryId: "", categoryName: "", date: "", file: null, images: [] });
            // navigate("/faculty-dashboard/document-list");
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        // <Box component="form" onSubmit={onSubmit} sx={{ p: 3, maxWidth: 720, mx: "auto" }}>
        //     <Paper elevation={4} sx={{ p: 5, borderRadius: 2 }}>

        //         <Typography variant="h5" fontWeight={700} mb={2}>Add Document</Typography>

        //         <Grid container spacing={2} direction="column">
        //             <Grid item xs={12}>
        //                 <TextField select label="Student Enrolment No" name="enrolno" value={form.enrolno} onChange={handleChange} fullWidth size="small">
        //                     {students.map((s) => (
        //                         <MenuItem key={s._id} value={s.enrolno}>{s.enrolno}</MenuItem>
        //                     ))}
        //                 </TextField>
        //             </Grid>

        //             <Grid item xs={12}>
        //                 <TextField select label="Student Name" name="fullName" size="small" value={form.fullName} onChange={(e) => {
        //                     const value = e.target.value;
        //                     const match = students.find((s) => s.fullName === value);
        //                     setForm((prev) => ({ ...prev, fullName: value, enrolno: match ? match.enrolno : prev.enrolno }));
        //                 }} fullWidth>
        //                     {students.map((s) => (
        //                         <MenuItem key={s._id} value={s.fullName}>{s.fullName}</MenuItem>
        //                     ))}
        //                 </TextField>
        //             </Grid>

        //             <Grid item xs={12}>
        //                 <TextField label="Type" name="type" value={form.type} size="small" onChange={handleChange} fullWidth placeholder="e.g., Assignment, Report" />
        //             </Grid>
        //             <Grid item xs={12}>
        //                 <TextField select label="Category (existing)" name="categoryId" size="small" value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value, categoryName: "" }))} fullWidth>
        //                     <MenuItem value="">None</MenuItem>
        //                     {categories.map((c) => (
        //                         <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
        //                     ))}
        //                 </TextField>
        //             </Grid>

        //             <Grid item xs={12}>
        //                 <TextField label="Or New Category" name="categoryName" size="small" value={form.categoryName} onChange={(e) => setForm((p) => ({ ...p, categoryName: e.target.value, categoryId: "" }))} fullWidth />
        //             </Grid>

        //             <Grid item xs={12}>
        //                 <TextField type="date" label="Date" name="date" value={form.date} size="small" onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        //             </Grid>

        //             <Grid item xs={12}>
        //                 <Button variant="outlined" component="label">
        //                     Upload Document (pdf/doc/ppt/xls)
        //                     <input type="file" hidden accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" onChange={handleFile} />
        //                 </Button>
        //                 <Typography variant="body2" sx={{ ml: 2, display: "inline-block" }}>{form.file ? form.file.name : "No file selected"}</Typography>
        //             </Grid>

        //             <Grid item xs={12}>
        //                 <Button variant="outlined" component="label">
        //                     Upload Images (max 4)
        //                     <input type="file" hidden multiple accept="image/png,image/jpeg,image/webp" onChange={handleImages} />
        //                 </Button>
        //                 <Typography variant="body2" sx={{ ml: 2, display: "inline-block" }}>{form.images.length > 0 ? `${form.images.length} selected` : "None"}</Typography>
        //             </Grid>

        //         </Grid>

        //         <Box mt={3} display="flex" gap={2}>
        //             <Button type="submit" variant="contained" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        //             <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        //         </Box>

        //         {/* 2. Image Section (Right) - md={6} */}
        //         <Grid item xs={12} md={6} sx={{
        //             display: { xs: 'none', md: 'flex' },
        //             justifyContent: 'center',
        //             alignItems: 'center',
        //             backgroundColor: theme.palette.primary.light + '10',
        //             borderTopRightRadius: 8,
        //             borderBottomRightRadius: 8,
        //         }}>
        //             <Box sx={{
        //                 width: '100%',
        //                 maxWidth: 400,
        //                 p: 3,
        //             }}>
        //                 <img
        //                     src={studentImage}
        //                     alt="Student Form Illustration"
        //                     style={{
        //                         width: '100%',
        //                         height: 'auto',
        //                         display: 'block'
        //                     }}
        //                 />
        //             </Box>
        //         </Grid>

        //     </Paper >
        // </Box>
        <Box component="form" onSubmit={onSubmit} sx={{ p: 3, maxWidth: 990, mx: "auto" }}>
            <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <Grid
                    container
                    spacing={3}
                    alignItems="stretch"
                    sx={{
                        flexDirection: { xs: "column", md: "row" }, // column on mobile, row on desktop
                    }}
                >

                    {/* Left side — Form */}
                    <Grid item xs={12} md={6}>

                        <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
                            Add Document
                        </Typography>

                        {/* Form Fields */}
                        <Grid container spacing={2} direction="column">
                            {/* All your form fields stay here */}
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Student Enrolment No"
                                    name="enrolno"
                                    value={form.enrolno}
                                    onChange={handleChange}
                                    fullWidth
                                    size="small"
                                >
                                    {students.map((s) => (
                                        <MenuItem key={s._id} value={s.enrolno}>
                                            {s.enrolno}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Student Name"
                                    name="fullName"
                                    size="small"
                                    value={form.fullName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const match = students.find((s) => s.fullName === value);
                                        setForm((prev) => ({
                                            ...prev,
                                            fullName: value,
                                            enrolno: match ? match.enrolno : prev.enrolno,
                                        }));
                                    }}
                                    fullWidth
                                >
                                    {students.map((s) => (
                                        <MenuItem key={s._id} value={s.fullName}>
                                            {s.fullName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="Type"
                                    name="type"
                                    value={form.type}
                                    size="small"
                                    onChange={handleChange}
                                    fullWidth
                                    placeholder="e.g., Assignment, Report"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    select
                                    label="Category (existing)"
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

                            <Grid item xs={12}>
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
                            </Grid>

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
                                <Button type="submit" variant="contained" disabled={loading}>
                                    {loading ? "Saving..." : "Save"}
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
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
