import React, { useState, useMemo, useContext, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  MenuItem,
  Box
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { styled } from '@mui/system';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import studentimg from "../assets/images/student-add.png";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";

/* ---------- Styled components (responsive) ---------- */

const Container = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 30,
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  width: '100%',
  maxWidth: 1100,
  minHeight: 560,
  display: 'flex',
  margin: '24px',
  padding: '26px',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    padding: 16,
    minHeight: 'auto'
  },
}));

const LeftCard = styled('div')(({ theme }) => ({
  width: '58%',
  padding: '28px 36px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: '18px 12px',
  },
}));

const RightCard = styled('div')(({ theme }) => ({
  width: '42%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  '& img': { maxWidth: '100%', height: 'auto' },
  [theme.breakpoints.down('md')]: { display: 'none' },
}));

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

/* Rounded TextField Style */
const RoundedInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: "#fff",
    height: 48,
    "& fieldset": { borderColor: "#e1e7f0" },
    "&:hover fieldset": { borderColor: "#a7c2ff" },
    "&.Mui-focused fieldset": {
      borderColor: "#5c6bc0",
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": { padding: "12px 14px" },
});

/* ---------- Component ---------- */

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    role: "",
    university: "",
  });

  const [universities, setUniversities] = useState([]);
  const [fetchingUnis, setFetchingUnis] = useState(false);

  const navigate = useNavigate();
  const { register, loading, role: currentRole } = useContext(AuthContext);

  useEffect(() => {
    const fetchUnis = async () => {
      try {
        setFetchingUnis(true);
        const res = await fetch("http://localhost:5000/api/universities");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setUniversities(data || []);
      } catch (e) {
        toast.error("Unable to fetch universities");
      } finally {
        setFetchingUnis(false);
      }
    };
    fetchUnis();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return toast.error("Please fill all required fields");

    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match!");

    const res = await register(form);

    if (res.success) {
      toast.success("User registered successfully!");
      navigate("/login");
    } else {
      toast.error(res.message || "Error registering user");
    }
  };

  const roleOptions = useMemo(() => {
    if (currentRole === "superadmin")
      return [
        { value: "superadmin", label: "Super Admin" },
        { value: "admin", label: "Admin" }
      ];

    if (currentRole === "admin")
      return [{ value: "faculty", label: "Faculty" }];

    return [
      { value: "superadmin", label: "Super Admin" },
      { value: "admin", label: "Admin" },
      { value: "faculty", label: "Faculty" }
    ];
  }, [currentRole]);

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #f4f7fb, #eef3ff)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container>

        {/* LEFT SIDE */}
        <LeftCard>
          <StyledForm onSubmit={handleSubmit}>

            {/* ⭐ ICON JUST BESIDE THE TEXT ⭐ */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                width: "100%",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#2b4ddb",
                  lineHeight: 1.2,
                }}
              >
                REGISTER ACCOUNT
              </Typography>

              <PersonAddRoundedIcon
                sx={{ fontSize: 32, color: "#2b4ddb" }}
              />
            </Box>

            {/* Subtitle */}
            <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 2 }}>
              Create your account to access the portal
            </Typography>

            {/* Social icons */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
              <Box sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '50%',
                width: 40, height: 40,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <GoogleIcon color="primary" />
              </Box>

              <Box sx={{
                border: '1px solid #e0e0e0',
                borderRadius: '50%',
                width: 40, height: 40,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                <FacebookIcon color="primary" />
              </Box>
            </Box>

            <Typography sx={{ fontSize: 12, color: '#6b7280', mb: 1 }}>
              or use your email password
            </Typography>

            {/* Input Fields */}
            <RoundedInput fullWidth label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <RoundedInput fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={{ mt: 2 }} />

            <RoundedInput
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              sx={{ mt: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <RoundedInput
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              sx={{ mt: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <RoundedInput fullWidth label="Designation" name="designation" sx={{ mt: 2 }} value={form.designation} onChange={handleChange} />

            <RoundedInput select fullWidth label="Role" name="role" sx={{ mt: 2 }} value={form.role} onChange={handleChange}>
              {roleOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </RoundedInput>

            <RoundedInput
              select
              fullWidth
              label="University"
              name="university"
              sx={{ mt: 2 }}
              disabled={fetchingUnis}
              value={form.university}
              onChange={handleChange}
            >
              {universities.map(u => (
                <MenuItem key={u._id} value={u.name}>{u.name}</MenuItem>
              ))}
            </RoundedInput>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.2,
                borderRadius: 2,
                fontWeight: "bold",
                background: 'linear-gradient(90deg,#5c6bc0,#512da8)',
              }}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

          </StyledForm>
        </LeftCard>

        {/* RIGHT SIDE IMAGE */}
        <RightCard>
          <img src={studentimg} alt="illustration" />
        </RightCard>

      </Container>
    </Box>
  );
};

export default RegisterPage;
