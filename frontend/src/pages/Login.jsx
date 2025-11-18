// import React, { useState, useMemo, useContext } from "react";
// import {
//     Button,
//     TextField,
//     Typography,
//     InputAdornment,
//     IconButton,
//     FormControlLabel,
//     Checkbox,
//     Box
// } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import GoogleIcon from '@mui/icons-material/Google';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import ArrowBack from '@mui/icons-material/ArrowBack';
// // import GitHubIcon from '@mui/icons-material/GitHub';
// // import LinkedInIcon from '@mui/icons-material/LinkedIn';
// import { styled } from '@mui/system';
// import { useNavigate, Link as RouterLink, Link } from "react-router-dom";
// import { toast } from "react-toastify";
// import { AuthContext } from "../context/AuthContext";
// import logo from "../assets/Register-logo.jpg";

// const Container = styled('div')(({ active }) => ({
//     backgroundColor: '#fff',
//     borderRadius: '30px',
//     boxShadow: '0 5px 15px rgba(0, 0, 0, 0.35)',
//     position: 'relative',
//     overflow: 'hidden',
//     width: '900px',
//     maxWidth: '90%',
//     minHeight: '580px',
//     transition: 'all 0.6s ease-in-out',
//     '@media (max-width: 768px)': {
//         flexDirection: 'column',
//         minHeight: '700px', /* Allow content stacking on mobile */
//     },
// }));

// const FormContainer = styled('div')({
//     position: 'absolute',
//     top: 0,
//     height: '100%',
//     transition: 'all 0.6s ease-in-out',
//     '@media (max-width: 768px)': {
//         position: 'static',
//         width: '100%',
//         height: 'auto',
//         transition: 'none',
//         zIndex: 1,
//     },
// });

// const SignInContainer = styled(FormContainer)(({ active }) => ({
//     left: 0,
//     width: '50%',
//     zIndex: 2,
//     transform: active ? 'translateX(100%)' : 'translateX(0)',
//     '@media (max-width: 768px)': {
//         width: '100%',
//         transform: 'none',
//         display: active ? 'none' : 'block',
//     },
// }));

// //SIDE PANEL MA WRITE CONTENT 
// const ToggleContainer = styled('div')(({ active }) => ({
//     position: 'absolute',
//     top: 0,
//     left: '50%',
//     width: '50%',
//     height: '100%',
//     overflow: 'hidden',
//     transition: 'all 0.6s ease-in-out',
//     borderRadius: '150px 0 0 100px',
//     zIndex: 1000,
//     transform: active ? 'translateX(-100%)' : 'translateX(0)',
//     ...(active && {
//         borderRadius: '0 150px 100px 0',
//     }),
//     '@media (max-width: 768px)': {
//         position: 'relative',
//         left: 0,
//         width: '100%',
//         height: '150px',
//         transform: 'none',
//         borderRadius: '0',
//         display: 'none', /* Hide the toggle entirely on small screens */
//     },
// }));

// const Toggle = styled('div')(({ active }) => ({
//     backgroundColor: '#512da8',
//     height: '100%',
//     background: 'linear-gradient(to right, #5c6bc0, #512da8)',
//     color: '#fff',
//     position: 'relative',
//     left: '-100%',
//     width: '200%',
//     transform: active ? 'translateX(50%)' : 'translateX(0)',
//     transition: 'all 0.6s ease-in-out',
// }));

// const TogglePanel = styled('div')({
//     position: 'absolute',
//     width: '50%',
//     height: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'column',
//     padding: '0 30px',
//     textAlign: 'center',
//     top: 0,
//     transition: 'all 0.6s ease-in-out',
// });

// const ToggleLeft = styled(TogglePanel)(({ active }) => ({
//     transform: active ? 'translateX(0)' : 'translateX(-200%)',
// }));

// const ToggleRight = styled(TogglePanel)(({ active }) => ({
//     right: 0,
//     transform: active ? 'translateX(200%)' : 'translateX(0)',
// }));


// const StyledForm = styled('form')({
//     backgroundColor: '#fff',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'column',
//     padding: '0 40px',
//     height: '100%',
//     width: '100%',
//     boxSizing: 'border-box',
// });

// const SocialIcons = styled('div')({
//     margin: '20px 0',
// });

// const SocialIconLink = styled('a')({
//     border: '1px solid #ccc',
//     borderRadius: '50%',
//     display: 'inline-flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     margin: '0 5px',
//     width: '40px',
//     height: '40px',
//     color: '#333',
//     transition: 'background-color 0.3s',
//     '&:hover': {
//         backgroundColor: '#f5f5f5',
//     }
// });

// const Login = () => {
//     // // isSignUp controls the sliding animation (from Input 2)
//     const [isSignUp, setIsSignUp] = useState(false);

//     const [showPassword, setShowPassword] = useState(false);
//     const [form, setForm] = useState({ email: "", password: "" });
//     const navigate = useNavigate();

//     const { login, loading } = useContext(AuthContext);

//     const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//     // const logoUrl = "https://placehold.co/80x80/512da8/ffffff?text=Logo";

//     // Dynamic content based on screen size for mobile toggles
//     // const MobileToggle = useMemo(() => (
//     //     <Box
//     //         sx={{
//     //             display: { xs: 'flex', md: 'none' },
//     //             flexDirection: 'column',
//     //             alignItems: 'center',
//     //             p: 3,
//     //             bgcolor: '#512da8',
//     //             color: 'white',
//     //             textAlign: 'center'
//     //         }}
//     //     >
//     //         <Typography variant="h6" sx={{ mb: 1 }}>{isSignUp ? "Already Registered?" : "New Here?"}</Typography>
//     //         <Button
//     //             variant="outlined"
//     //             sx={{ borderColor: 'white', color: 'white' }}
//     //             onClick={() => setIsSignUp(prev => !prev)}
//     //         >
//     //             {isSignUp ? "Sign In" : "Sign Up"}
//     //         </Button>
//     //     </Box>
//     // ), [isSignUp]);


//     const handleLogin = async () => {
//         if (!form.email || !form.password) {
//             toast.error("Please fill all required fields");
//             return;
//         }

//         const res = await login(form.email, form.password);
//         if (res.success) {
//             // Persist email locally for header display
//             try { localStorage.setItem('email', String(form.email || '')); } catch { }
//             toast.success("Login successful!");
//             const role = String(res.role || "").toLowerCase().trim();
//             const path = role ? `/${role}-dashboard` : "/";
//             navigate(path, { replace: true });
//         } else {
//             toast.error(res.message || "Invalid credentials");
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 background: 'linear-gradient(to right, #e2e2e2, #c9d6ff)',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 minHeight: '100vh',
//                 width: '100%',
//                 fontFamily: `'Montserrat', sans-serif`,
//                 p: 2,
//             }}
//         >
//             <Container active={isSignUp}>
//                 {/* Sign In Form */}
//                 <SignInContainer active={isSignUp}>
//                     <Button
//                         startIcon={<ArrowBack />}
//                         onClick={() => navigate("/")}
//                         className="!absolute !top-6 !left-6 !text-purple-700 !font-medium hover:!bg-purple-100"
//                         variant="text"
//                         sx={{ p: 3 }}
//                     >
//                         Back
//                     </Button>
//                     <StyledForm onSubmit={handleLogin}>
//                         <Box component="img" src={logo} alt="Logo" sx={{ width: 80, height: 80, borderRadius: "50%", mb: 1 }} />
//                         <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '10px 0 5px' }}>LOGIN ACCOUNT</h1>

//                         <SocialIcons>
//                             <SocialIconLink href="#"><GoogleIcon color="primary" /></SocialIconLink>
//                             <SocialIconLink href="#"><FacebookIcon color="primary" /></SocialIconLink>
//                             {/* <SocialIconLink href="#"><GitHubIcon color="primary" /></SocialIconLink> */}
//                             {/* <SocialIconLink href="#"><LinkedInIcon color="primary" /></SocialIconLink> */}
//                         </SocialIcons>

//                         <span style={{ fontSize: '12px', color: '#555' }}>or use your email password</span>

//                         <TextField
//                             label="Email"
//                             name="email"
//                             value={form.email}
//                             onChange={handleChange}
//                             variant="standard"
//                             type="email"
//                             fullWidth
//                             sx={{ mt: 2 }}
//                         />

//                         <TextField
//                             label="Password"
//                             name="password"
//                             type={showPassword ? "text" : "password"}
//                             value={form.password}
//                             onChange={handleChange}
//                             variant="standard"
//                             fullWidth
//                             sx={{ mt: 2 }}
//                             InputProps={{
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
//                                             {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
//                                         </IconButton>
//                                     </InputAdornment>
//                                 ),
//                             }}
//                         />

//                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 1 }}>
//                             <FormControlLabel
//                                 control={<Checkbox defaultChecked size="small" />}
//                                 label={<Typography fontSize="13px">Remember me</Typography>}
//                             />

//                             <Link to="/forgot" style={{ textDecoration: 'none' }}>
//                                 <Typography fontSize="13px" sx={{ color: '#000000' }}>
//                                     Forget Password
//                                 </Typography>
//                             </Link>
//                         </Box>

//                         <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={handleLogin} disabled={loading}>
//                             {loading ? 'Signing in...' : 'Sign in'}
//                         </Button>

//                         {/* <Typography sx={{ mt: 2, fontSize: '13px' }}>
//                             Don't have an account?
//                             <Button component={RouterLink} to="/register">Register</Button>
//                         </Typography> */}

//                     </StyledForm>
//                 </SignInContainer>

//                 {/* Toggle Container (Hidden on Mobile, handles sliding on Desktop) */}
//                 <ToggleContainer>
//                     {/*  active={isSignUp} */}
//                     <Toggle>
//                         {/*  active={isSignUp} */}
//                         {/* <ToggleLeft active={isSignUp}>
//                             <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Welcome Back!</h1>
//                             <p style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '0.3px', margin: '20px 0' }}>Enter your personal details to use all of site features</p>
//                             <StyledHiddenButton variant="outlined" onClick={() => setIsSignUp(false)}>Sign In</StyledHiddenButton>
//                         </ToggleLeft> */}

//                         <ToggleRight sx={{ fontFamily: "Playwrite US Modern" }} >
//                             {/* active={isSignUp} */}
//                             <h1 style={{ fontSize: '30px', fontWeight: 700 }}>Hello,</h1>
//                             <p style={{ fontSize: '20px', lineHeight: '20px', letterSpacing: '0.3px', margin: '20px 0' }}>Login with your personal details to use all of site features..</p>
//                             {/* <StyledHiddenButton variant="outlined" onClick={() => setIsSignUp(true)}>Sign Up</StyledHiddenButton> */}
//                         </ToggleRight>
//                     </Toggle>
//                 </ToggleContainer>

//                 {/* Mobile Toggle Display (Shown on Mobile, handles stacking) */}
//                 {/* {MobileToggle} */}
//             </Container>
//         </Box >
//     );
// };

// export default Login;



import React, { useState, useMemo, useContext } from "react";
import {
    Button,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    Box
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/system';
import { useNavigate, Link as RouterLink, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/Register-logo.jpg";

const Container = styled('div')(({ active }) => ({
    backgroundColor: '#fff',
    borderRadius: '30px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.35)',
    position: 'relative',
    overflow: 'hidden',
    width: '900px',
    maxWidth: '90%',
    minHeight: '580px',
    transition: 'all 0.6s ease-in-out',
    '@media (max-width: 768px)': {
        flexDirection: 'column',
        minHeight: '700px',
    },
}));

const FormContainer = styled('div')({
    position: 'absolute',
    top: 0,
    height: '100%',
    transition: 'all 0.6s ease-in-out',
    '@media (max-width: 768px)': {
        position: 'static',
        width: '100%',
        height: 'auto',
        transition: 'none',
        zIndex: 1,
    },
});

const SignInContainer = styled(FormContainer)(({ active }) => ({
    left: 0,
    width: '50%',
    zIndex: 2,
    transform: active ? 'translateX(100%)' : 'translateX(0)',
    '@media (max-width: 768px)': {
        width: '100%',
        transform: 'none',
        display: active ? 'none' : 'block',
    },
}));

const ToggleContainer = styled('div')(({ active }) => ({
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '50%',
    height: '100%',
    overflow: 'hidden',
    transition: 'all 0.6s ease-in-out',
    borderRadius: '150px 0 0 100px',
    zIndex: 1000,
    transform: active ? 'translateX(-100%)' : 'translateX(0)',
    ...(active && {
        borderRadius: '0 150px 100px 0',
    }),
    '@media (max-width: 768px)': {
        position: 'relative',
        left: 0,
        width: '100%',
        height: '150px',
        transform: 'none',
        borderRadius: '0',
        display: 'none',
    },
}));

const Toggle = styled('div')(({ active }) => ({
    backgroundColor: '#512da8',
    height: '100%',
    background: 'linear-gradient(to right, #5c6bc0, #512da8)',
    color: '#fff',
    position: 'relative',
    left: '-100%',
    width: '200%',
    transform: active ? 'translateX(50%)' : 'translateX(0)',
    transition: 'all 0.6s ease-in-out',
}));

const TogglePanel = styled('div')({
    position: 'absolute',
    width: '50%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0 30px',
    textAlign: 'center',
    top: 0,
    transition: 'all 0.6s ease-in-out',
});

const ToggleRight = styled(TogglePanel)(({ active }) => ({
    right: 0,
    transform: active ? 'translateX(200%)' : 'translateX(0)',
}));

const StyledForm = styled('form')({
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0 40px',
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
});

const SocialIcons = styled('div')({
    margin: '20px 0',
});

const SocialIconLink = styled('a')({
    border: '1px solid #ccc',
    borderRadius: '50%',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 5px',
    width: '40px',
    height: '40px',
    color: '#333',
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    }
});

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const { login, loading } = useContext(AuthContext);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Now accepts optional event and prevents default so Enter works
    const handleLogin = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!form.email || !form.password) {
            toast.error("Please fill all required fields");
            return;
        }

        const res = await login(form.email, form.password);
        if (res.success) {
            try { localStorage.setItem('email', String(form.email || '')); } catch { }
            toast.success("Login successful!");
            const role = String(res.role || "").toLowerCase().trim();
            const path = role ? `/${role}-dashboard` : "/";
            navigate(path, { replace: true });
        } else {
            toast.error(res.message || "Invalid credentials");
        }
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(to right, #e2e2e2, #c9d6ff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                width: '100%',
                fontFamily: `'Montserrat', sans-serif`,
                p: 2,
            }}
        >
            <Container active={isSignUp}>
                <SignInContainer active={isSignUp}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/")}
                        className="!absolute !top-6 !left-6 !text-purple-700 !font-medium hover:!bg-purple-100"
                        variant="text"
                        sx={{ p: 3 }}
                    >
                        Back
                    </Button>

                    {/* Enter key now submits because form has onSubmit */}
                    <StyledForm onSubmit={handleLogin}>
                        <Box component="img" src={logo} alt="Logo" sx={{ width: 80, height: 80, borderRadius: "50%", mb: 1 }} />
                        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '10px 0 5px' }}>LOGIN ACCOUNT</h1>

                        <SocialIcons>
                            <SocialIconLink href="#"><GoogleIcon color="primary" /></SocialIconLink>
                            <SocialIconLink href="#"><FacebookIcon color="primary" /></SocialIconLink>
                        </SocialIcons>

                        <span style={{ fontSize: '12px', color: '#555' }}>or use your email password</span>

                        <TextField
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            variant="standard"
                            type="email"
                            fullWidth
                            sx={{ mt: 2 }}
                        />

                        <TextField
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            variant="standard"
                            fullWidth
                            sx={{ mt: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mt: 1 }}>
                            <FormControlLabel
                                control={<Checkbox defaultChecked size="small" />}
                                label={<Typography fontSize="13px">Remember me</Typography>}
                            />

                            <Link to="/forgot" style={{ textDecoration: 'none' }}>
                                <Typography fontSize="13px" sx={{ color: '#000000' }}>
                                    Forget Password
                                </Typography>
                            </Link>
                        </Box>

                        {/* keep design same: button now type="submit" so Enter triggers it */}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>

                    </StyledForm>
                </SignInContainer>

                <ToggleContainer>
                    <Toggle>
                        <ToggleRight sx={{ fontFamily: "Playwrite US Modern" }} >
                            <h1 style={{ fontSize: '30px', fontWeight: 700 }}>Hello,</h1>
                            <p style={{ fontSize: '20px', lineHeight: '20px', letterSpacing: '0.3px', margin: '20px 0' }}>Login with your personal details to use all of site features..</p>
                        </ToggleRight>
                    </Toggle>
                </ToggleContainer>
            </Container>
        </Box>
    );
};

export default Login;

