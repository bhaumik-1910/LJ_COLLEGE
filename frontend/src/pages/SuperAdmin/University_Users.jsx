// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { AuthContext } from "../../context/AuthContext";
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   Stack,
//   CircularProgress, // Added CircularProgress for a better loading indicator
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { toast } from "react-toastify";

// const API_BASE = "http://localhost:5000/api";

// export default function UniversityUsers() {
//   const { token } = useContext(AuthContext);
//   const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);

//   const [allUsers, setAllUsers] = useState([]);
//   const [universities, setUniversities] = useState([]);
//   const [selectedUni, setSelectedUni] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [editOpen, setEditOpen] = useState(false);
//   const [editRow, setEditRow] = useState(null);

//   const [delOpen, setDelOpen] = useState(false);
//   const [delRow, setDelRow] = useState(null);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/superadmin/users`, { headers: { ...authHeader } });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to load users");
//       setAllUsers(Array.isArray(data) ? data : []);
//     } catch (e) {
//       toast.error(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUniversities = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/superadmin/universities`, { headers: { ...authHeader } });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Failed to load universities");
//       setUniversities(Array.isArray(data) ? data : []);
//       if (Array.isArray(data) && data.length && !selectedUni) setSelectedUni(data[0].name);
//     } catch (e) {
//       toast.error(e.message);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchUniversities();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   const rows = useMemo(() => {
//     if (!selectedUni) return allUsers;
//     return allUsers.filter((u) => (u.university || "").toLowerCase() === selectedUni.toLowerCase());
//   }, [allUsers, selectedUni]);

//   const onEdit = (row) => {
//     setEditRow({ ...row });
//     setEditOpen(true);
//   };

//   const onEditChange = (key, val) => setEditRow((r) => ({ ...r, [key]: val }));

//   const saveEdit = async () => {
//     if (!editRow?._id) return;
//     try {
//       const res = await fetch(`${API_BASE}/superadmin/users/${editRow._id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json", ...authHeader },
//         body: JSON.stringify({
//           name: editRow.name,
//           email: editRow.email,
//           role: editRow.role,
//           university: editRow.university,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Update failed");
//       toast.success("User updated");
//       setEditOpen(false);
//       setEditRow(null);
//       await fetchUsers();
//     } catch (e) {
//       toast.error(e.message);
//     }
//   };

//   const onDelete = (row) => {
//     setDelRow(row);
//     setDelOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!delRow?._id) return;
//     try {
//       const res = await fetch(`${API_BASE}/superadmin/users/${delRow._id}`, {
//         method: "DELETE",
//         headers: { ...authHeader },
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Delete failed");
//       toast.success("User deleted");
//       setDelOpen(false);
//       setDelRow(null);
//       await fetchUsers();
//     } catch (e) {
//       toast.error(e.message);
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} spacing={2} mb={2}>
//         <Typography variant="h5" fontWeight={700}>University Users</Typography>
//         <TextField select size="small" label="University" value={selectedUni} onChange={(e) => setSelectedUni(e.target.value)} sx={{ minWidth: 220 }}>
//           {universities.map((u) => (
//             <MenuItem key={u._id || u.name} value={u.name}>{u.name}</MenuItem>
//           ))}
//         </TextField>
//       </Stack>

//       <TableContainer component={Box}>
//         <Table size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>University</TableCell>
//               <TableCell>Created</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">
//                   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
//                     <CircularProgress size={24} sx={{ mb: 1 }} />
//                     <Typography variant="body2" color="text.secondary">Loading...</Typography>
//                   </Box>
//                 </TableCell>
//               </TableRow>
//             ) : rows.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} align="center">No users</TableCell>
//               </TableRow>
//             ) : (
//               rows.map((r) => (
//                 <TableRow key={r._id} hover>
//                   <TableCell>{r.name}</TableCell>
//                   <TableCell>{r.email}</TableCell>
//                   <TableCell sx={{ textTransform: "capitalize" }}>{r.role}</TableCell>
//                   <TableCell>{r.university || "-"}</TableCell>
//                   <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</TableCell>
//                   <TableCell align="right">
//                     <IconButton size="small" onClick={() => onEdit(r)}><EditIcon /></IconButton>
//                     <IconButton size="small" color="error" onClick={() => onDelete(r)}><DeleteIcon /></IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Edit dialog */}
//       <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
//         <DialogTitle>Edit User</DialogTitle>
//         <DialogContent dividers>
//           <TextField margin="dense" label="Name" variant="standard" fullWidth value={editRow?.name || ""} onChange={(e) => onEditChange("name", e.target.value)} />
//           <TextField margin="dense" label="Email" variant="standard" fullWidth value={editRow?.email || ""} onChange={(e) => onEditChange("email", e.target.value)} />
//           <TextField select margin="dense" label="Role" variant="standard" fullWidth value={editRow?.role || "user"} onChange={(e) => onEditChange("role", e.target.value)}>
//             <MenuItem value="admin">Admin</MenuItem>
//             <MenuItem value="faculty">Faculty</MenuItem>
//             <MenuItem value="student">Student</MenuItem>
//             <MenuItem value="user">User</MenuItem>
//           </TextField>
//           <TextField select margin="dense" label="University" variant="standard" fullWidth value={editRow?.university || ""} onChange={(e) => onEditChange("university", e.target.value)}>
//             {universities.map((u) => (
//               <MenuItem key={u._id} value={u.name}>{u.name}</MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setEditOpen(false)}>Cancel</Button>
//           <Button variant="contained" onClick={saveEdit}>Save</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete confirm */}
//       <Dialog open={delOpen} onClose={() => setDelOpen(false)}>
//         <DialogTitle>Delete user?</DialogTitle>
//         <DialogContent dividers>
//           <Typography>Are you sure you want to delete {delRow?.email}?</Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDelOpen(false)}>Cancel</Button>
//           <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }


import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
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
  Stack,
  CircularProgress,
  Paper,
  Avatar,
  Chip,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";

const API_BASE = "http://localhost:5000/api";

export default function UniversityUsers() {
  const { token } = useContext(AuthContext);
  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  // original states preserved
  const [allUsers, setAllUsers] = useState([]);
  const [universities, setUniversities] = useState([]); // kept but not shown in UI
  const [selectedUni, setSelectedUni] = useState(""); // kept for compatibility
  const [loading, setLoading] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);

  const [delOpen, setDelOpen] = useState(false);
  const [delRow, setDelRow] = useState(null);

  // search + pagination
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/superadmin/users`, {
        headers: { ...authHeader },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load users");
      setAllUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUniversities = async () => {
    try {
      const res = await fetch(`${API_BASE}/superadmin/universities`, {
        headers: { ...authHeader },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Failed to load universities");
      setUniversities(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length && !selectedUni)
        setSelectedUni(data[0].name);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUniversities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // filtered rows by search (keeps original behavior of rows based on selectedUni if needed)
  const rows = useMemo(() => {
    let list = allUsers;
    // if selectedUni is set we keep previous filtering behavior
    if (selectedUni) {
      list = list.filter(
        (u) => (u.university || "").toLowerCase() === selectedUni.toLowerCase()
      );
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) =>
      [r.name, r.email, r.role, r.university].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q)
      )
    );
  }, [allUsers, selectedUni, search]);

  // pagination slice
  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  const handleChangePage = (_evt, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (evt) => {
    setRowsPerPage(parseInt(evt.target.value, 10));
    setPage(0);
  };

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
      toast.success("User updated");
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
      toast.success("User deleted");
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
        {/* Header: title + search + refresh */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant="h5" fontWeight={700} sx={{ color: "#2b4ddb" }}>
            University Users
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <TextField select size="small" label="University" value={selectedUni} onChange={(e) => setSelectedUni(e.target.value)} sx={{ minWidth: 220 }}>
              <MenuItem value="">All Universities</MenuItem>
              {universities.map((u) => (
                <MenuItem key={u._id || u.name} value={u.name}>{u.name}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>

        {/* Table */}
        <TableContainer component={Box} sx={{ overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  Email
                </TableCell>
                <TableCell>Role</TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  University
                </TableCell>
                <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>
                  Created
                </TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Stack alignItems="center" spacing={1}>
                      <CircularProgress size={28} />
                      <Typography variant="body2" color="text.secondary">
                        Loading users...
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No users
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

                    <TableCell align="right">
                      <IconButton size="small" onClick={() => onEdit(r)}>
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
          count={rows.length}
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
          <DialogTitle>Edit User</DialogTitle>
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
                value={editRow?.role || "user"}
                onChange={(e) => onEditChange("role", e.target.value)}
              >
                <MenuItem value="superadmin">Super Admin</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="faculty">Faculty</MenuItem>
              </TextField>

              <TextField
                select
                margin="dense"
                label="University"
                variant="outlined"
                size="small"
                fullWidth
                value={editRow?.university || ""}
                onChange={(e) => onEditChange("university", e.target.value)}
              >
                <MenuItem value="">— none —</MenuItem>
                {universities.map((u) => (
                  <MenuItem key={u._id} value={u.name}>
                    {u.name}
                  </MenuItem>
                ))}
              </TextField>
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
          <DialogTitle>Delete user?</DialogTitle>
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
