// import React, { useState, useMemo, useContext, useEffect } from "react";
// import {
//   Button,
//   TextField,
//   Typography,
//   InputAdornment,
//   IconButton,
//   MenuItem,
//   Box
// } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import GoogleIcon from '@mui/icons-material/Google';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import ArrowBack from '@mui/icons-material/ArrowBack';
// // import GitHubIcon from '@mui/icons-material/GitHub';
// // import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import { styled } from '@mui/system';
// import { useNavigate, Link as RouterLink } from "react-router-dom";
// import { toast } from "react-toastify";
// import { AuthContext } from "../context/AuthContext";
// import logo from "../assets/Register-logo.jpg";

// const Container = styled('div')(({ active }) => ({
//   backgroundColor: '#fff',
//   borderRadius: '30px',
//   boxShadow: '0 5px 15px rgba(0, 0, 0, 0.35)',
//   position: 'relative',
//   overflow: 'hidden',
//   width: '1080px',
//   maxWidth: '90%',
//   minHeight: '780px', /* Increased height for better mobile fit */
//   transition: 'all 0.6s ease-in-out',
//   '@media (max-width: 768px)': {
//     flexDirection: 'column',
//     minHeight: '700px', /* Allow content stacking on mobile */
//   },
// }));

// const FormContainer = styled('div')({
//   position: 'absolute',
//   top: 0,
//   height: '100%',
//   transition: 'all 0.6s ease-in-out',
//   '@media (max-width: 768px)': {
//     position: 'static',
//     width: '100%',
//     height: 'auto',
//     transition: 'none',
//     zIndex: 1,
//   },
// });

// const SignInContainer = styled(FormContainer)(({ active }) => ({
//   left: 0,
//   width: '50%',
//   zIndex: 2,
//   transform: active ? 'translateX(100%)' : 'translateX(0)',
//   '@media (max-width: 768px)': {
//     width: '100%',
//     transform: 'none',
//     display: active ? 'none' : 'block',
//   },
// }));

// //SIDE PANEL MA WRITE CONTENT 
// const ToggleContainer = styled('div')(({ active }) => ({
//   position: 'absolute',
//   top: 0,
//   left: '50%',
//   width: '50%',
//   height: '100%',
//   overflow: 'hidden',
//   transition: 'all 0.6s ease-in-out',
//   borderRadius: '150px 0 0 100px',
//   zIndex: 1000,
//   transform: active ? 'translateX(-100%)' : 'translateX(0)',
//   ...(active && {
//     borderRadius: '0 150px 100px 0',
//   }),
//   '@media (max-width: 768px)': {
//     position: 'relative',
//     left: 0,
//     width: '100%',
//     height: '150px',
//     transform: 'none',
//     borderRadius: '0',
//     display: 'none', /* Hide the toggle entirely on small screens */
//   },
// }));

// const Toggle = styled('div')(({ active }) => ({
//   backgroundColor: '#512da8',
//   height: '100%',
//   background: 'linear-gradient(to right, #5c6bc0, #512da8)',
//   color: '#fff',
//   position: 'relative',
//   left: '-100%',
//   width: '200%',
//   transform: active ? 'translateX(50%)' : 'translateX(0)',
//   transition: 'all 0.6s ease-in-out',
// }));

// const TogglePanel = styled('div')({
//   position: 'absolute',
//   width: '50%',
//   height: '100%',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   flexDirection: 'column',
//   padding: '0 30px',
//   textAlign: 'center',
//   top: 0,
//   transition: 'all 0.6s ease-in-out',
// });

// const ToggleLeft = styled(TogglePanel)(({ active }) => ({
//   transform: active ? 'translateX(0)' : 'translateX(-200%)',
// }));

// const ToggleRight = styled(TogglePanel)(({ active }) => ({
//   right: 0,
//   transform: active ? 'translateX(200%)' : 'translateX(0)',
// }));


// const StyledForm = styled('form')({
//   backgroundColor: '#fff',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   flexDirection: 'column',
//   padding: '0 40px',
//   height: '100%',
//   width: '100%',
//   boxSizing: 'border-box',
// });

// const SocialIcons = styled('div')({
//   margin: '20px 0',
// });

// const SocialIconLink = styled('a')({
//   border: '1px solid #ccc',
//   borderRadius: '50%',
//   display: 'inline-flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   margin: '0 5px',
//   width: '40px',
//   height: '40px',
//   color: '#333',
//   transition: 'background-color 0.3s',
//   '&:hover': {
//     backgroundColor: '#f5f5f5',
//   }
// });

// const RegisterPage = () => {
//   // // isSignUp controls the sliding animation (from Input 2)
//   const [isSignUp, setIsSignUp] = useState(false);

//   const navigate = useNavigate();

//   const { register, loading, role: currentRole } = useContext(AuthContext);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     designation: "",
//     role: "",
//     university: "",
//   });

//   const [universities, setUniversities] = useState([]);
//   const [fetchingUnis, setFetchingUnis] = useState(false);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setFetchingUnis(true);
//         const res = await fetch("http://localhost:5000/api/universities");
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Failed to load universities");
//         setUniversities(Array.isArray(data) ? data : []);
//       } catch (e) {
//         toast.error(e.message || "Unable to fetch universities");
//       } finally {
//         setFetchingUnis(false);
//       }
//     };
//     load();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!form.name || !form.email || !form.password || !form.confirmPassword) {
//       toast.error("Please fill in all required fields.");
//       return;
//     }
//     if (form.password !== form.confirmPassword) {
//       toast.error("Passwords do not match!");
//       return;
//     }

//     const res = await register({
//       name: form.name,
//       email: form.email,
//       password: form.password,
//       designation: form.designation,
//       role: form.role,
//       university: form.university,
//     });

//     if (res.success) {
//       toast.success("User registered successfully!");
//       setForm({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         designation: "",
//         role: "",
//         university: "",
//       });
//       setTimeout(() => navigate("/login"), 500);
//     } else {
//       toast.error(res.message || "Error registering user");
//     }
//   };

//   //Role Display
//   const roleOptions = useMemo(() => {
//     if (currentRole === 'superadmin') return [
//       { value: 'superadmin', label: 'Super Admin' },
//       { value: 'admin', label: 'Admin' },
//     ];
//     if (currentRole === 'admin') return [
//       { value: 'faculty', label: 'Faculty' },
//     ];
//     return [
//       { value: 'superadmin', label: 'Super Admin' },
//       { value: 'admin', label: 'Admin' },
//       { value: 'faculty', label: 'Faculty' },
//     ];
//   }, [currentRole]);

//   useEffect(() => {
//     const values = roleOptions.map(r => r.value);
//     if (!values.includes(form.role)) {
//       setForm(f => ({ ...f, role: roleOptions[0]?.value || '' }));
//     }
//   }, [roleOptions]);

//   // Dynamic content based on screen size for mobile toggles
//   // const MobileToggle = useMemo(() => (
//   //   <Box
//   //     sx={{
//   //       display: { xs: 'flex', md: 'none' },
//   //       flexDirection: 'column',
//   //       alignItems: 'center',
//   //       p: 3,
//   //       bgcolor: '#512da8',
//   //       color: 'white',
//   //       textAlign: 'center'
//   //     }}
//   //   >
//   //     <Typography variant="h6" sx={{ mb: 1 }}>{isSignUp ? "Already Registered?" : "New Here?"}</Typography>
//   //     <Button
//   //                 variant="outlined"
//   //                 sx={{ borderColor: 'white', color: 'white' }}
//   //                 onClick={() => setIsSignUp(prev => !prev)}
//   //             >
//   //                 {isSignUp ? "Sign In" : "Sign Up"}
//   //             </Button>
//   //   </Box>
//   // ), [isSignUp]);

//   return (
//     <Box
//       sx={{
//         background: 'linear-gradient(to right, #e2e2e2, #c9d6ff)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '100vh',
//         width: '100%',
//         fontFamily: `'Montserrat', sans-serif`,
//         p: 2,
//       }}
//     >

//       <Container >
//         {/* active={isSignUp} */}
//         {/* Sign In Form */}
//         <SignInContainer >
//           {/* active={isSignUp} */}
//           {/* <Button
//             startIcon={<ArrowBack />}
//             onClick={() => navigate("/")}
//             className="!absolute !top-6 !left-6 !text-purple-700 !font-medium hover:!bg-purple-100"
//             variant="text"
//             sx={{ p: 3 }}
//           >
//             Back
//           </Button> */}
//           <StyledForm onSubmit={handleSubmit}>
//             <Box component="img" src={logo} alt="Logo" sx={{ width: 80, height: 80, borderRadius: "50%", mb: 1 }} />
//             <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '10px 0 5px' }}>REGISTER ACCOUNT</h1>

//             <SocialIcons>
//               <SocialIconLink href="#"><GoogleIcon color="primary" /></SocialIconLink>
//               <SocialIconLink href="#"><FacebookIcon color="primary" /></SocialIconLink>
//               {/* <SocialIconLink href="#"><GitHubIcon color="primary" /></SocialIconLink> */}
//               {/* <SocialIconLink href="#"><LinkedInIcon color="primary" /></SocialIconLink> */}
//             </SocialIcons>

//             <span style={{ fontSize: '12px', color: '#555' }}>or use your email password</span>

//             {/* Full Name */}
//             <TextField
//               fullWidth
//               label="Full Name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               variant="standard"
//               sx={{ marginTop: "8px" }}
//             />

//             {/* Email */}
//             <TextField
//               fullWidth
//               label="Email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               autoComplete="email"
//               variant="standard"
//               sx={{ marginTop: "8px" }}
//             />

//             {/* Password */}
//             <TextField
//               fullWidth
//               label="Password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               value={form.password}
//               onChange={handleChange}
//               variant="standard"
//               autoComplete="new-password"
//               sx={{ marginTop: "8px" }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={() => setShowPassword(!showPassword)}>
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Confirm Password */}
//             <TextField
//               fullWidth
//               label="Confirm Password"
//               name="confirmPassword"
//               type={showConfirmPassword ? "text" : "password"}
//               value={form.confirmPassword}
//               onChange={handleChange}
//               variant="standard"
//               autoComplete="new-password"
//               sx={{ marginTop: "8px" }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() =>
//                         setShowConfirmPassword(!showConfirmPassword)
//                       }
//                     >
//                       {showConfirmPassword ? (
//                         <VisibilityOff />
//                       ) : (
//                         <Visibility />
//                       )}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             {/* Designation */}
//             <TextField
//               fullWidth
//               label="Designation"
//               name="designation"
//               value={form.designation}
//               onChange={handleChange}
//               variant="standard"
//               sx={{ marginTop: "8px" }}
//             />

//             {/* Role Dropdown */}
//             <TextField
//               select
//               fullWidth
//               label="Role"
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//               variant="standard"
//               sx={{ marginTop: "8px" }}
//             >
//               {roleOptions.map(opt => (
//                 <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
//               ))}
//               {/* <MenuItem value="superadmin">Super Admin</MenuItem>
//               <MenuItem value="admin">Admin</MenuItem>
//               <MenuItem value="faculty">Faculty</MenuItem> */}
//             </TextField>

//             {/* University Dropdown */}
//             <TextField
//               select
//               fullWidth
//               label={fetchingUnis ? "Loading universities..." : "University"}
//               name="university"
//               value={form.university}
//               onChange={handleChange}
//               variant="standard"
//               sx={{ marginTop: "8px" }}
//               disabled={fetchingUnis || universities.length === 0}
//               helperText={universities.length === 0 ? "Ask admin to register your university first" : ""}
//             >
//               {universities.map((u) => (
//                 <MenuItem key={u._id} value={u.name}>{u.name}</MenuItem>
//               ))}
//             </TextField>

//             {/* Register button */}
//             <Button
//               fullWidth
//               variant="contained"
//               onClick={handleSubmit}
//               sx={{
//                 mt: 3,
//                 py: 1.2,
//                 borderRadius: 2,
//                 textTransform: "none",
//                 fontWeight: "bold",
//               }}
//               disabled={loading}
//             >
//               {loading ? 'Registering...' : 'Register'}
//             </Button>
//             {/* 
//             <Typography sx={{ mt: 2, fontSize: '13px' }}>
//               Don't have an account?
//               <Button component={RouterLink} to="/login">Login</Button>
//             </Typography> */}

//           </StyledForm>
//         </SignInContainer>

//         {/* Toggle Container (Hidden on Mobile, handles sliding on Desktop) */}
//         <ToggleContainer >
//           {/* active={isSignUp} */}
//           <Toggle >
//             {/* active={isSignUp} */}
//             {/* <ToggleLeft >
//               active={isSignUp} 
//               <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Welcome Back!</h1>
//               <p style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '0.3px', margin: '20px 0' }}>Enter your personal details to use all of site features</p>
//               <StyledHiddenButton variant="outlined" onClick={() => setIsSignUp(false)}>Sign In</StyledHiddenButton>
//             </ToggleLeft> */}

//             <ToggleRight sx={{ fontFamily: "Playwrite US Modern" }} >
//               {/* active={isSignUp} */}
//               {/*  tyle={{ fontSize: '20px', lineHeight: '20px', letterSpacing: '0.3px', margin: '20px 0' }}>Register with your personal details to use all of site features..</p> */}
//               {/* <StyledHiddenButton variant="outlined" onClick={() => setIsSignUp(true)}>Sign Up</StyledHiddenButton> */}
//             </ToggleRight>
//           </Toggle>
//         </ToggleContainer>

//         {/* Mobile Toggle Display (Shown on Mobile, handles stacking) */}
//         {/* {MobileToggle} */}
//       </Container>
//     </Box>
//   );
// };

// export default RegisterPage;
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
import logo from "../assets/Register-logo.jpg";
import studentimg from "../assets/images/student-add.png";

/* ---------- Styled components (responsive) ---------- */

const Container = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 30,
  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  maxWidth: 1100,
  minHeight: 560,
  display: 'flex',
  alignItems: 'stretch',
  transition: 'all 0.35s ease-in-out',
  margin: '24px',
  padding: '26px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    minHeight: 'auto',
    padding: 16,
    borderRadius: 20,
  },
}));

const LeftCard = styled('div')(({ theme }) => ({
  width: '58%',
  padding: '28px 36px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxSizing: 'border-box',
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
  boxSizing: 'border-box',
  '& img': {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    borderRadius: 18,
  },
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const StyledForm = styled('form')(({ theme }) => ({
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  padding: '0',
  height: '100%',
  width: '100%',
  boxSizing: 'border-box',
}));

const SocialIcons = styled('div')({
  margin: '12px 0 18px',
  display: 'flex',
  gap: 8,
});

const SocialIconLink = styled('a')({
  border: '1px solid #e0e0e0',
  borderRadius: '50%',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 40,
  height: 40,
  color: '#333',
  textDecoration: 'none',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#fafafa',
  },
});

/* ---------- Rounded / outlined TextField to match screenshot ---------- */

const RoundedInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: "#fff",
    height: 48,
    "& fieldset": {
      borderColor: "#e1e7f0",
    },
    "&:hover fieldset": {
      borderColor: "#a7c2ff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#5c6bc0",
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 14px",
  },
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
    const load = async () => {
      try {
        setFetchingUnis(true);
        const res = await fetch("http://localhost:5000/api/universities");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load universities");
        setUniversities(Array.isArray(data) ? data : []);
      } catch (e) {
        toast.error(e.message || "Unable to fetch universities");
      } finally {
        setFetchingUnis(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const res = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      designation: form.designation,
      role: form.role,
      university: form.university,
    });

    if (res.success) {
      toast.success("User registered successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        designation: "",
        role: "",
        university: "",
      });
      setTimeout(() => navigate("/login"), 500);
    } else {
      toast.error(res.message || "Error registering user");
    }
  };

  const roleOptions = useMemo(() => {
    if (currentRole === 'superadmin') return [
      { value: 'superadmin', label: 'Super Admin' },
      { value: 'admin', label: 'Admin' },
    ];
    if (currentRole === 'admin') return [
      { value: 'faculty', label: 'Faculty' },
    ];
    return [
      { value: 'superadmin', label: 'Super Admin' },
      { value: 'admin', label: 'Admin' },
      { value: 'faculty', label: 'Faculty' },
    ];
  }, [currentRole]);

  useEffect(() => {
    const values = roleOptions.map(r => r.value);
    if (!values.includes(form.role)) {
      setForm(f => ({ ...f, role: roleOptions[0]?.value || '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleOptions]);

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #f4f7fb, #eef3ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        fontFamily: `'Montserrat', sans-serif`,
        p: 2,
      }}
    >
      <Container>
        <LeftCard>
          <StyledForm onSubmit={handleSubmit}>
            {/* header: logo + title side-by-side */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              width: '100%',
              mb: 1
            }}>
              <Box component="img" src={logo} alt="Logo" sx={{ width: 80, height: 80, borderRadius: "50%" }} />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#2b4ddb', lineHeight: 1 }}>
                  REGISTER ACCOUNT
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#6b7280', mt: 0.5 }}>
                  Create your account to access the portal
                </Typography>
              </Box>
            </Box>

            <SocialIcons>
              <SocialIconLink href="#"><GoogleIcon color="primary" /></SocialIconLink>
              <SocialIconLink href="#"><FacebookIcon color="primary" /></SocialIconLink>
            </SocialIcons>

            <Typography sx={{ fontSize: 12, color: '#6b7280', mb: 1 }}>or use your email password</Typography>

            {/* Full Name */}
            <RoundedInput
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />

            {/* Email */}
            <RoundedInput
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              margin="normal"
              variant="outlined"
            />

            {/* Password */}
            <RoundedInput
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <RoundedInput
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Designation */}
            <RoundedInput
              fullWidth
              label="Designation"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            />

            {/* Role Dropdown */}
            <RoundedInput
              select
              fullWidth
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            >
              {roleOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </RoundedInput>

            {/* University Dropdown */}
            <RoundedInput
              select
              fullWidth
              label={fetchingUnis ? "Loading universities..." : "University"}
              name="university"
              value={form.university}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              disabled={fetchingUnis || universities.length === 0}
              helperText={universities.length === 0 ? "Ask admin to register your university first" : ""}
            >
              {universities.map((u) => (
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
                textTransform: "none",
                fontWeight: "bold",
                background: 'linear-gradient(90deg,#5c6bc0,#512da8)'
              }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </StyledForm>
        </LeftCard>

        <RightCard>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img src={studentimg || logo} alt="illustration" />
          </Box>
        </RightCard>
      </Container>
    </Box>
  );
};

export default RegisterPage;


