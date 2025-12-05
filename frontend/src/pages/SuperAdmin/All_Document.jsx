
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Link,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TablePagination,
  Paper,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

// const API_BASE = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_BASE;
// const BACKEND_BASE = "http://localhost:5000";
const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE;

const toBackendUrl = (p) => {
  if (!p) return "";
  return p.startsWith("/uploads") ? `${BACKEND_BASE}${p}` : p;
};

export default function All_Document() {
  const { token } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);  // Auto extracted
  const [selectedCat, setSelectedCat] = useState("");

  const [allDocTypes, setAllDocTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState("");

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const headers = useMemo(
    () => ({ ...(token ? { Authorization: `Bearer ${token}` } : {}) }),
    [token]
  );

  // Fetch documents and auto extract categories
  // const fetchDocs = async (p = 0, limit = 10) => {
  //   if (!token) return;
  //   setLoading(true);

  //   try {
  //     const res = await fetch(
  //       `${API_BASE}/superadmin/documents?page=${p + 1}&limit=${limit}`,
  //       { headers }
  //     );
  //     const data = await res.json();

  //     if (res.ok) {
  //       const items = Array.isArray(data.items) ? data.items : [];
  //       setDocs(items);
  //       setTotal(data.total || items.length);

  //       // Extract unique category names automatically
  //       const uniqueCategories = [...new Set(
  //         items.map(d => d.category?.name || d.categoryName).filter(Boolean)
  //       )];
  //       setCategories(uniqueCategories);


  //       const uniqueType = [...new Set(
  //         items.map(d => d.type?.name || d.type).filter(Boolean)
  //       )];
  //       setAllDocTypes(uniqueType);
  //       // setAllDocTypes(Array.isArray(typeData.items) ? typeData.items : []);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchDocs = async (p = 0, limit = 10, category = "", type = "") => {
    if (!token) return;
    setLoading(true);

    try {
      let qs = `?page=${p + 1}&limit=${limit}`;

      if (category) qs += `&category=${encodeURIComponent(category)}`;
      if (type) qs += `&type=${encodeURIComponent(type)}`;

      const res = await fetch(`${API_BASE}/superadmin/documents${qs}`, { headers });
      const data = await res.json();

      if (res.ok) {
        setDocs(data.items || []);
        setTotal(data.total || 0);

        // extract categories again only when NOT filtering
        if (!category) {
          const uniqueCategories = [...new Set(
            (data.items || []).map(d => d.category?.name || d.categoryName).filter(Boolean)
          )];
          setCategories(uniqueCategories);
        }

        // extract types only when NOT filtering
        if (!type) {
          const uniqueTypes = [...new Set(
            (data.items || []).map(d => d.type).filter(Boolean)
          )];
          setAllDocTypes(uniqueTypes);
        }
      }

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDocs(0, rowsPerPage);
    // eslint-disable-next-line
  }, [token]);

  // Handle category filter
  // const handleCategoryChange = (e) => {
  //   const value = e.target.value;
  //   setSelectedCat(value);

  //   if (!value) {
  //     fetchDocs(page, rowsPerPage);  // Show all
  //   } else {
  //     const filteredDocs = docs.filter(
  //       (d) => (d.category?.name || d.categoryName) === value
  //     );
  //     setDocs(filteredDocs);
  //   }
  // };
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCat(value);
    setLoading(true);
    fetchDocs(0, rowsPerPage, value, selectedTypes);
  };


  // Handle Type filter
  // const handleTypeChange = (e) => {
  //   const value = e.target.value;
  //   setSelectedTypes(value);

  //   if (!value) {
  //     fetchDocs(page, rowsPerPage);  // Show all
  //   } else {
  //     const filteredDocs = docs.filter(
  //       (d) => (d.type?.name || d.type) === value
  //     );
  //     setDocs(filteredDocs);
  //   }
  // };
  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedTypes(value);
    setLoading(true);
    fetchDocs(0, rowsPerPage, selectedCat, value);
  };


  const getFileName = (doc) => {
    if (doc?.fileOriginalName) return doc.fileOriginalName;
    try {
      const parts = doc.fileUrl.split("/");
      return parts.at(-1) || "Open";
    } catch {
      return "Open";
    }
  };

  const handleChangePage = (_evt, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (evt) => {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
    fetchDocs(0, parseInt(evt.target.value, 10));
  };

  // Search filter
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return docs;
    return docs.filter((f) =>
      [f.student?.fullName, f.student?.enrolno]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [q, docs]);

  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  //Download 
  const downloadFile = async (url, filename = "download") => {
    try {
      const res = await fetch(toBackendUrl(url));
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Download failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={4}
        sx={{
          p: 2,
          borderRadius: 3,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexWrap="wrap"
          gap={2}
        >

          {/* Left Side Title */}
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: "#2B6EF6" }}
          >
            All Documents
          </Typography>

          {/* Right Side Filters */}
          <Box display="flex" gap={2}>

            {/* Category Filter */}
            <TextField
              select
              // label="Filter by Category"
              label={loading ? "Loading categories..." : "Filter by Category"}
              size="small"
              value={selectedCat}
              onChange={handleCategoryChange}
              disabled={loading}
              sx={{
                minWidth: 240,
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>

            {/* Type Filter */}
            <TextField
              select
              size="small"
              label={loading ? "Loading Type..." : "Filter by Type"}
              value={selectedTypes}
              onChange={handleTypeChange}
              sx={{
                minWidth: 180,
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
              }}
            >
              <MenuItem value="">All</MenuItem>
              {allDocTypes.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

          </Box>
        </Box>


        {/* Table */}
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : docs.length === 0 ? (
            <Typography align="center">No Documents Found</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Univesity Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Institute Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Sub Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">File</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="center">Images</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {pagedRows.map((d) => (
                    <TableRow key={d._id} hover>
                      <TableCell>{d.universityName}</TableCell>
                      <TableCell>{d.instituteName}</TableCell>
                      <TableCell>{d.course}</TableCell>
                      <TableCell>{d.type}</TableCell>
                      <TableCell>{d.category?.name || d.categoryName}</TableCell>
                      <TableCell>{d.subCategory || "-"}</TableCell>
                      <TableCell>{d.date ? new Date(d.date).toLocaleDateString() : "-"}</TableCell>

                      <TableCell>
                        {/* <Link href={toBackendUrl(d.fileUrl)} target="_blank" underline="hover">
                          {getFileName(d)}
                        </Link> */}
                        <Link
                          component="button"
                          underline="hover"
                          onClick={() => downloadFile(d.fileUrl, getFileName(d))}
                        >
                          {getFileName(d)}
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Box
                          // display="flex"
                          gap={0.5}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)", 
                            gap: "6px",
                            width: 80,
                          }}
                        >
                          {(d.images || []).slice(0, 4).map((img, idx) => (
                            // <img
                            //   key={idx}
                            //   src={toBackendUrl(img)}
                            //   alt="img"
                            //   style={{
                            //     width: 36,
                            //     height: 36,
                            //     borderRadius: 4,
                            //     objectFit: "cover",
                            //     border: "1px solid #eee",
                            //   }}
                            // />
                            <img
                              key={idx}
                              src={toBackendUrl(img)}
                              alt={`img-${idx}`}
                              onClick={() => downloadFile(img, `image-${idx + 1}.jpg`)}
                              style={{
                                width: 36,
                                height: 36,
                                objectFit: "cover",
                                borderRadius: 4,
                                border: "1px solid #ddd",
                                cursor: "pointer"
                              }}
                            />
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
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
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
