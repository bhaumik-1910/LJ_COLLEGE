import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000/api";

export default function Add_document() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

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
        <Box component="form" onSubmit={onSubmit} sx={{ p: 3, maxWidth: 720, mx: "auto" }}>
            <Typography variant="h5" fontWeight={700} mb={2}>Add Document</Typography>
            <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                    <TextField select label="Student Enrolment No" name="enrolno" value={form.enrolno} onChange={handleChange} fullWidth variant="standard">
                        {students.map((s) => (
                            <MenuItem key={s._id} value={s.enrolno}>{s.enrolno}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField select label="Student Name" name="fullName" value={form.fullName} onChange={(e) => {
                        const value = e.target.value;
                        const match = students.find((s) => s.fullName === value);
                        setForm((prev) => ({ ...prev, fullName: value, enrolno: match ? match.enrolno : prev.enrolno }));
                    }} fullWidth variant="standard">
                        {students.map((s) => (
                            <MenuItem key={s._id} value={s.fullName}>{s.fullName}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Type" name="type" value={form.type} onChange={handleChange} fullWidth variant="standard" placeholder="e.g., Assignment, Report" />
                </Grid>
                <Grid item xs={12}>
                    <TextField select label="Category (existing)" name="categoryId" value={form.categoryId} onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value, categoryName: "" }))} fullWidth variant="standard">
                        <MenuItem value="">None</MenuItem>
                        {categories.map((c) => (
                            <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Or New Category" name="categoryName" value={form.categoryName} onChange={(e) => setForm((p) => ({ ...p, categoryName: e.target.value, categoryId: "" }))} fullWidth variant="standard" />
                </Grid>
                <Grid item xs={12}>
                    <TextField type="date" label="Date" name="date" value={form.date} onChange={handleChange} fullWidth variant="standard" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" component="label">
                        Upload Document (pdf/doc/ppt/xls)
                        <input type="file" hidden accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" onChange={handleFile} />
                    </Button>
                    <Typography variant="body2" sx={{ ml: 2, display: "inline-block" }}>{form.file ? form.file.name : "No file selected"}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" component="label">
                        Upload Images (max 4)
                        <input type="file" hidden multiple accept="image/png,image/jpeg,image/webp" onChange={handleImages} />
                    </Button>
                    <Typography variant="body2" sx={{ ml: 2, display: "inline-block" }}>{form.images.length > 0 ? `${form.images.length} selected` : "None"}</Typography>
                </Grid>
            </Grid>

            <Box mt={3} display="flex" gap={2}>
                <Button type="submit" variant="contained" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>Cancel</Button>
            </Box>
        </Box>
    );
}
