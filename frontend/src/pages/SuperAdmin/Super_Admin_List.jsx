// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import {
//     Box,
//     Typography,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     IconButton,
//     Button,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     MenuItem,
//     TablePagination,
//     CircularProgress, // Added CircularProgress for a better loading indicator
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { toast } from "react-toastify";

// const API_BASE = "http://localhost:5000/api";
// const API_BASE = import.meta.env.VITE_API_BASE;

// export default function SuperAdminList() {
//     const { token } = useContext(AuthContext);
//     const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const [editOpen, setEditOpen] = useState(false);
//     const [editRow, setEditRow] = useState(null);

//     const [delOpen, setDelOpen] = useState(false);
//     const [delRow, setDelRow] = useState(null);

//     // Search and pagination state
//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);

//     // Derived data: filtered and paged rows
//     const filteredRows = useMemo(() => {
//         const q = search.trim().toLowerCase();
//         if (!q) return rows;
//         return rows.filter((r) => {
//             const fields = [r.name, r.email, r.university, r.role];
//             return fields.some((v) => String(v || "").toLowerCase().includes(q));
//         });
//     }, [rows, search]);

//     const pagedRows = useMemo(() => {
//         const start = page * rowsPerPage;
//         return filteredRows.slice(start, start + rowsPerPage);
//     }, [filteredRows, page, rowsPerPage]);

//     // Reset page when search or rowsPerPage changes
//     useEffect(() => {
//         setPage(0);
//     }, [search, rowsPerPage]);

//     const handleChangePage = (_evt, newPage) => setPage(newPage);
//     const handleChangeRowsPerPage = (evt) => {
//         setRowsPerPage(parseInt(evt.target.value, 10));
//         setPage(0);
//     };

//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(`${API_BASE}/superadmin/users`, { headers: { ...authHeader } });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || "Failed to load users");
//             const onlyAdmins = (Array.isArray(data) ? data : []).filter((u) => String(u.role).toLowerCase() === "admin");
//             setRows(onlyAdmins);
//         } catch (e) {
//             toast.error(e.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [token]);

//     const onEdit = (row) => {
//         setEditRow({ ...row });
//         setEditOpen(true);
//     };

//     const onEditChange = (key, val) => setEditRow((r) => ({ ...r, [key]: val }));

//     const saveEdit = async () => {
//         if (!editRow?._id) return;
//         try {
//             const res = await fetch(`${API_BASE}/superadmin/users/${editRow._id}`, {
//                 method: "PATCH",
//                 headers: { "Content-Type": "application/json", ...authHeader },
//                 body: JSON.stringify({
//                     name: editRow.name,
//                     email: editRow.email,
//                     role: editRow.role,
//                     university: editRow.university,
//                 }),
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || "Update failed");
//             toast.success("Admin updated");
//             setEditOpen(false);
//             setEditRow(null);
//             await fetchUsers();
//         } catch (e) {
//             toast.error(e.message);
//         }
//     };

//     const onDelete = (row) => {
//         setDelRow(row);
//         setDelOpen(true);
//     };

//     const confirmDelete = async () => {
//         if (!delRow?._id) return;
//         try {
//             const res = await fetch(`${API_BASE}/superadmin/users/${delRow._id}`, {
//                 method: "DELETE",
//                 headers: { ...authHeader },
//             });
//             const data = await res.json();
//             if (!res.ok) throw new Error(data.message || "Delete failed");
//             toast.success("Admin deleted");
//             setDelOpen(false);
//             setDelRow(null);
//             await fetchUsers();
//         } catch (e) {
//             toast.error(e.message);
//         }
//     };

//     return (
//         <Box sx={{ p: 3 }}>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//                 <Typography variant="h5" fontWeight={700}>
//                     Admins
//                 </Typography>

//                 <TextField
//                     size="small"
//                     placeholder="Search admins..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     sx={{ maxWidth: 360 }}
//                 />
//             </Box>

//             <TableContainer component={Box}>
//                 <Table size="small">
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>Name</TableCell>
//                             <TableCell>Email</TableCell>
//                             <TableCell>Role</TableCell>
//                             <TableCell>University</TableCell>
//                             <TableCell>Created</TableCell>
//                             <TableCell align="right">Actions</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {loading ? (
//                             <TableRow>
//                                 <TableCell colSpan={6} align="center">
//                                     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
//                                         <CircularProgress size={24} sx={{ mb: 1 }} />
//                                         <Typography variant="body2" color="text.secondary">Loading...</Typography>
//                                     </Box>
//                                 </TableCell>
//                             </TableRow>
//                         ) : pagedRows.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan={6} align="center">No admins found</TableCell>
//                             </TableRow>
//                         ) : (
//                             pagedRows.map((r) => (
//                                 <TableRow key={r._id} hover>
//                                     <TableCell>{r.name}</TableCell>
//                                     <TableCell>{r.email}</TableCell>
//                                     <TableCell sx={{ textTransform: "capitalize" }}>{r.role}</TableCell>
//                                     <TableCell>{r.university || "-"}</TableCell>
//                                     <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</TableCell>
//                                     <TableCell align="right">
//                                         <IconButton size="small" onClick={() => onEdit(r)}><EditIcon /></IconButton>
//                                         <IconButton size="small" color="error" onClick={() => onDelete(r)}><DeleteIcon /></IconButton>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         )}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             {/* Pagination */}
//             <TablePagination
//                 component="div"
//                 count={filteredRows.length}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 rowsPerPage={rowsPerPage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//                 rowsPerPageOptions={[5, 10, 25, 50]}
//                 showFirstButton
//                 showLastButton
//             />

//             {/* Edit dialog */}
//             <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
//                 <DialogTitle>Edit Admin</DialogTitle>
//                 <DialogContent dividers>
//                     <TextField margin="dense" label="Name" variant="standard" fullWidth value={editRow?.name || ""} onChange={(e) => onEditChange("name", e.target.value)} />
//                     <TextField margin="dense" label="Email" variant="standard" fullWidth value={editRow?.email || ""} onChange={(e) => onEditChange("email", e.target.value)} />
//                     <TextField select margin="dense" label="Role" variant="standard" fullWidth value={editRow?.role || "admin"} onChange={(e) => onEditChange("role", e.target.value)}>
//                         <MenuItem value="admin">Admin</MenuItem>
//                         <MenuItem value="faculty">Faculty</MenuItem>
//                         <MenuItem value="student">Student</MenuItem>
//                         <MenuItem value="user">User</MenuItem>
//                     </TextField>
//                     <TextField margin="dense" label="University" variant="standard" fullWidth value={editRow?.university || ""} onChange={(e) => onEditChange("university", e.target.value)} />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setEditOpen(false)}>Cancel</Button>
//                     <Button variant="contained" onClick={saveEdit}>Save</Button>
//                 </DialogActions>
//             </Dialog>

//             {/* Delete confirm */}
//             <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
//                 <DialogTitle>Delete admin?</DialogTitle>
//                 <DialogContent dividers>
//                     <Typography>Are you sure you want to delete {delRow?.email}?</Typography>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setDelOpen(false)}>Cancel</Button>
//                     <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// }


import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  TablePagination,
  CircularProgress,
  Paper,
  Avatar,
  Chip,
  Stack,
  InputAdornment,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";

// const API_BASE = "http://localhost:5000/api";
const API_BASE = import.meta.env.VITE_API_BASE;

export default function SuperAdminList() {
  const { token } = useContext(AuthContext);
  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const [delOpen, setDelOpen] = useState(false);
  const [delRow, setDelRow] = useState(null);

  // Search and pagination state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Derived data: filtered and paged rows
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const fields = [r.name, r.email, r.university, r.role];
      return fields.some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [rows, search]);

  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page, rowsPerPage]);

  // Reset page when search or rowsPerPage changes
  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  const handleChangePage = (_evt, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (evt) => {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/superadmin/users`, {
        headers: { ...authHeader },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load users");
      // keep existing behavior: only admins
      const onlyS_Admins = (Array.isArray(data) ? data : []).filter(
        (u) => String(u.role).toLowerCase() === "superadmin"
      );
      setRows(onlyS_Admins);

      // setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onEdit = (row) => {
    setEditRow({ ...row });
    setEditOpen(true);
  };

  const onEditChange = (key, val) => setEditRow((r) => ({ ...r, [key]: val }));

  const saveEdit = async () => {
    if (!editRow?._id) return;
    try {
      const res = await fetch(`${API_BASE}/superadmin/users/${editRow._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          name: editRow.name,
          email: editRow.email,
          role: editRow.role,
          university: editRow.university,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      toast.success("Super Admin Updated..");
      setEditOpen(false);
      setEditRow(null);
      await fetchUsers();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onDelete = (row) => {
    setDelRow(row);
    setDelOpen(true);
  };

  const confirmDelete = async () => {
    if (!delRow?._id) return;
    try {
      const res = await fetch(`${API_BASE}/superadmin/users/${delRow._id}`, {
        method: "DELETE",
        headers: { ...authHeader },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      toast.success("Super Admin Deleted..");
      setDelOpen(false);
      setDelRow(null);
      await fetchUsers();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const initials = (name = "") =>
    name
      .split(" ")
      .map((p) => p[0] || "")
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const roleColor = (role) => {
    switch ((role || "").toLowerCase()) {
      case "superadmin":
        return "secondary";
      case "admin":
        return "primary";
      case "faculty":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper elevation={2} sx={{ borderRadius: 2, p: { xs: 2, md: 3 }, bgcolor: '#fff' }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h5" fontWeight={700} sx={{ color: "#2b4ddb" }}>
            Super Admins
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <TextField
              size="small"
              placeholder="Search super admins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 220, background: "#fff", borderRadius: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            {/* <Button
              // size="small"
              variant="outlined"
              onClick={() => fetchUsers()}
              startIcon={<RefreshIcon />}
            >
            </Button> */}
            <IconButton onClick={() => fetchUsers()}>
              <RefreshIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Table */}
        <TableContainer component={Box} sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>University</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Stack alignItems="center" spacing={1}>
                      <CircularProgress size={28} />
                      <Typography variant="body2" color="text.secondary">
                        Loading Super Admins...
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : pagedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      No Super Admins Found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pagedRows.map((r) => (
                  <TableRow key={r._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "primary.light",
                            color: "primary.contrastText",
                            width: 36,
                            height: 36,
                          }}
                        >
                          {initials(r.name)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {r.name || "-"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: { xs: "inline", sm: "none" } }}
                          >
                            {r.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell
                      sx={{ display: { xs: "none", sm: "table-cell" } }}
                    >
                      {r.email}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={r.role}
                        size="small"
                        color={roleColor(r.role)}
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      {r.university || "-"}
                    </TableCell>

                    <TableCell
                      sx={{ display: { xs: "none", lg: "table-cell" } }}
                    >
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleString()
                        : "-"}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => onEdit(r)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(r)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredRows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          showFirstButton
          showLastButton
        />

        {/* Edit dialog */}
        <Dialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: 700 }}>Edit Super Admin</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>

              <TextField
                margin="dense"
                label="Name"
                variant="outlined"
                size="small"
                fullWidth
                value={editRow?.name || ""}
                onChange={(e) => onEditChange("name", e.target.value)}
              />

              <TextField
                margin="dense"
                label="Email"
                variant="outlined"
                size="small"
                fullWidth
                value={editRow?.email || ""}
                onChange={(e) => onEditChange("email", e.target.value)}
              />

              <TextField
                select
                margin="dense"
                label="Role"
                variant="outlined"
                size="small"
                fullWidth
                value={editRow?.role || "admin"}
                onChange={(e) => onEditChange("role", e.target.value)}
              >
                <MenuItem value="superadmin">Super Admin</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="faculty">Faculty</MenuItem>
              </TextField>

              <TextField
                margin="dense"
                label="University"
                variant="outlined"
                size="small"
                fullWidth
                value={editRow?.university || ""}
                onChange={(e) => onEditChange("university", e.target.value)}
              />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setEditOpen(false)}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={saveEdit}
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete confirm */}
        <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
          <DialogTitle>Delete Super Admin?</DialogTitle>
          <DialogContent dividers>
            <Typography>
              Are you sure you want to delete <strong>{delRow?.email}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDelOpen(false)}
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
      </Paper>
    </Box>
  );
}
