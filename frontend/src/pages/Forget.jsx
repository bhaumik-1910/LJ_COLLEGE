// import React, { useContext, useState } from 'react'
// import { Box, Paper, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material'
// import Visibility from '@mui/icons-material/Visibility'
// import VisibilityOff from '@mui/icons-material/VisibilityOff'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import { AuthContext } from '../context/AuthContext'

// const Forget = () => {
//     const navigate = useNavigate()
//     const { changePassword, loading } = useContext(AuthContext)

//     const [form, setForm] = useState({ email: '', oldPassword: '', newPassword: '', confirmPassword: '' })
//     const [show, setShow] = useState({ old: false, nw: false, confirm: false })

//     const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         const email = form.email.trim()
//         if (!email) return toast.error('Please enter your email')
//         const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
//         if (!emailOk) return toast.error('Please enter a valid email')
//         if (!form.oldPassword) return toast.error('Please enter old password')
//         if (!form.newPassword || form.newPassword.length < 6) return toast.error('New password must be at least 6 characters')
//         if (form.newPassword === form.oldPassword) return toast.error('New password must be different from old password')
//         if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match')

//         const res = await changePassword({ email, oldPassword: form.oldPassword, newPassword: form.newPassword })
//         if (res?.success) {
//             toast.success(res.message || 'Password changed successfully')
//             navigate('/login', { replace: true })
//         } else {
//             toast.error(res?.message || 'Unable to change password')
//         }
//     }

//     return (
//         <Box sx={{
//             minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
//             background: 'linear-gradient(to right, #e2e2e2, #c9d6ff)', p: 2
//         }}>
//             <Paper sx={{ p: 4, width: '100%', maxWidth: 420, borderRadius: 3 }} elevation={4}>
//                 <Typography variant="h5" fontWeight={700} textAlign="center">Change Password</Typography>
//                 <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
//                     Enter your email and update your password
//                 </Typography>
//                 <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
//                     <TextField
//                         label="Email"
//                         name="email"
//                         type="email"
//                         fullWidth
//                         value={form.email}
//                         onChange={onChange}
//                         margin="normal"
//                         variant="standard"
//                     />
//                     <TextField
//                         label="Old Password"
//                         name="oldPassword"
//                         type={show.old ? 'text' : 'password'}
//                         fullWidth
//                         value={form.oldPassword}
//                         onChange={onChange}
//                         margin="normal"
//                         variant="standard"
//                         InputProps={{
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     <IconButton onClick={() => setShow((s) => ({ ...s, old: !s.old }))} edge="end">
//                                         {show.old ? <VisibilityOff /> : <Visibility />}
//                                     </IconButton>
//                                 </InputAdornment>
//                             )
//                         }}
//                     />
//                     <TextField
//                         label="New Password"
//                         name="newPassword"
//                         type={show.nw ? 'text' : 'password'}
//                         fullWidth
//                         value={form.newPassword}
//                         onChange={onChange}
//                         margin="normal"
//                         variant="standard"
//                         InputProps={{
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     <IconButton onClick={() => setShow((s) => ({ ...s, nw: !s.nw }))} edge="end">
//                                         {show.nw ? <VisibilityOff /> : <Visibility />}
//                                     </IconButton>
//                                 </InputAdornment>
//                             )
//                         }}
//                     />
//                     <TextField
//                         label="Confirm Password"
//                         name="confirmPassword"
//                         type={show.confirm ? 'text' : 'password'}
//                         fullWidth
//                         value={form.confirmPassword}
//                         onChange={onChange}
//                         margin="normal"
//                         variant="standard"
//                         InputProps={{
//                             endAdornment: (
//                                 <InputAdornment position="end">
//                                     <IconButton onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))} edge="end">
//                                         {show.confirm ? <VisibilityOff /> : <Visibility />}
//                                     </IconButton>
//                                 </InputAdornment>
//                             )
//                         }}
//                     />

//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         sx={{ mt: 2 }}
//                         disabled={loading}
//                     >
//                         {loading ? 'Updating...' : 'Update Password'}
//                     </Button>

//                     <Button
//                         fullWidth
//                         sx={{ mt: 1 }}
//                         variant="text"
//                         onClick={() => navigate('/login')}
//                     >
//                         Back to Login
//                     </Button>
//                 </Box>
//             </Paper>
//         </Box>
//     )
// }

// export default Forget


// import React, { useContext, useState } from 'react';
// import { Box, Paper, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { AuthContext } from '../context/AuthContext';

// const API_BASE = "http://localhost:5000/api";

// const Forget = () => {
//     const navigate = useNavigate();
//     const { loading, setLoading } = useContext(AuthContext); // Assuming setLoading is available
//     const [step, setStep] = useState(1); // Step 1: Request email, Step 2: Enter OTP and new password
//     const [email, setEmail] = useState('');
//     const [otp, setOtp] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     const handleSendOtp = async (e) => {
//         e.preventDefault();
//         if (!email.trim()) {
//             return toast.error('Please enter your email');
//         }
//         setLoading(true);
//         try {
//             const res = await fetch(`${API_BASE}/users/forgot-password`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email }),
//             });
//             const data = await res.json();
//             if (res.ok) {
//                 toast.success(data.message || 'OTP sent to your email');
//                 setStep(2);
//             } else {
//                 toast.error(data.message || 'Failed to send OTP. Please check your email.');
//             }
//         } catch (err) {
//             toast.error('Network error. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleResetPassword = async (e) => {
//         e.preventDefault();
//         if (!otp) return toast.error('Please enter the OTP');
//         if (newPassword.length < 6) return toast.error('New password must be at least 6 characters');
//         if (newPassword !== confirmPassword) return toast.error('Passwords do not match');

//         setLoading(true);
//         try {
//             const res = await fetch(`${API_BASE}/users/reset-password`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, otp, newPassword }),
//             });
//             const data = await res.json();
//             if (res.ok) {
//                 toast.success(data.message || 'Password reset successfully');
//                 navigate('/login', { replace: true });
//             } else {
//                 toast.error(data.message || 'Password reset failed. Please check the OTP.');
//             }
//         } catch (err) {
//             toast.error('Network error. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Box sx={{
//             minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
//             background: 'linear-gradient(to right, #e2e2e2, #c9d6ff)', p: 2
//         }}>
//             <Paper sx={{ p: 4, width: '100%', maxWidth: 420, borderRadius: 3 }} elevation={4}>
//                 <Typography variant="h5" fontWeight={700} textAlign="center">
//                     {step === 1 ? 'Forgot Password' : 'Reset Password'}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
//                     {step === 1 ? 'Enter your email to receive a password reset link.' : 'Enter the OTP and your new password.'}
//                 </Typography>
//                 <Box component="form" onSubmit={step === 1 ? handleSendOtp : handleResetPassword} sx={{ mt: 3 }}>
//                     {step === 1 && (
//                         <TextField
//                             label="Email"
//                             name="email"
//                             type="email"
//                             fullWidth
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             margin="normal"
//                             variant="standard"
//                         />
//                     )}
//                     {step === 2 && (
//                         <>
//                             <TextField
//                                 label="OTP"
//                                 name="otp"
//                                 type="text"
//                                 fullWidth
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value)}
//                                 margin="normal"
//                                 variant="standard"
//                             />
//                             <TextField
//                                 label="New Password"
//                                 name="newPassword"
//                                 type={showPassword ? 'text' : 'password'}
//                                 fullWidth
//                                 value={newPassword}
//                                 onChange={(e) => setNewPassword(e.target.value)}
//                                 margin="normal"
//                                 variant="standard"
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                             <TextField
//                                 label="Confirm Password"
//                                 name="confirmPassword"
//                                 type={showPassword ? 'text' : 'password'}
//                                 fullWidth
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 margin="normal"
//                                 variant="standard"
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                         </>
//                     )}
//                     <Button
//                         type="submit"
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         sx={{ mt: 2 }}
//                         disabled={loading}
//                     >
//                         {loading ? 'Processing...' : (step === 1 ? 'Send OTP' : 'Reset Password')}
//                     </Button>
//                     <Button
//                         fullWidth
//                         sx={{ mt: 1 }}
//                         variant="text"
//                         onClick={() => navigate('/login')}
//                     >
//                         Back to Login
//                     </Button>
//                 </Box>
//             </Paper>
//         </Box>
//     );
// };

// export default Forget;

import React, { useCallback, useContext, useState } from 'react';
import { Box, Paper, TextField, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Forget = () => {
    const navigate = useNavigate();
    const { loading, forgotPassword, resetPassword } = useContext(AuthContext);

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        const enteredEmail = email.trim();
        if (!enteredEmail) {
            return toast.error('Please enter your email.');
        }

        const res = await forgotPassword(enteredEmail);
        if (res.success) {
            toast.success(res.message);
            setStep(2);
        } else {
            toast.error(res.message);
        }
    };

    // const handleResetPassword = async (e) => {
    //     e.preventDefault();
    //     if (!otp) return toast.error('Please enter the OTP.');
    //     if (newPassword.length < 6) return toast.error('New password must be at least 6 characters.');
    //     if (newPassword !== confirmPassword) return toast.error('Passwords do not match.');

    //     const res = await resetPassword({ otp, newPassword });
    //     if (res.success) {
    //         toast.success(res.message);
    //         navigate('/login', { replace: true });
    //     } else {
    //         toast.error(res.message);
    //     }
    // };
    const handleResetPassword = useCallback(async (e) => {
        e.preventDefault();

        // Frontend validation
        if (!otp || !newPassword || !confirmPassword) {
            return toast.error('Please fill all fields.');
        }
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match.');
        }

        // Correct way to call the function: Pass email, OTP, and newPassword
        const res = await resetPassword({ email, otp, newPassword });

        if (res.success) {
            toast.success(res.message);
            navigate('/login', { replace: true });
        } else {
            toast.error(res.message);
        }
    }, [email, otp, newPassword, confirmPassword, resetPassword, navigate]);

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to right, #e2e2e2, #c9d6ff)', p: 2 }}>
            <Paper sx={{ p: 4, width: '100%', maxWidth: 420, borderRadius: 3 }} elevation={4}>
                <Typography variant="h5" fontWeight={700} textAlign="center">
                    {step === 1 ? 'Forgot Password' : 'Reset Password'}
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                    {step === 1 ? 'Enter your email to receive a password reset OTP.' : 'Enter the OTP sent to your email and your new password.'}
                </Typography>
                <Box component="form" onSubmit={step === 1 ? handleSendOtp : handleResetPassword} sx={{ mt: 3 }}>
                    {step === 1 && (
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            variant="standard"
                        />
                    )}
                    {step === 2 && (
                        <>
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                variant="standard"
                            />
                            <TextField
                                label="OTP"
                                name="otp"
                                type="text"
                                fullWidth
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                margin="normal"
                                variant="standard"
                            />
                            <TextField
                                label="New Password"
                                name="newPassword"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                margin="normal"
                                variant="standard"
                                sx={{ mt: 2 }}
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
                            <TextField
                                label="Confirm Password"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                margin="normal"
                                variant="standard"
                                sx={{ mt: 2 }}
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
                        </>
                    )}
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
                        {loading ? 'Processing...' : (step === 1 ? 'Send OTP' : 'Reset Password')}
                    </Button>
                    <Button fullWidth sx={{ mt: 1 }} variant="text" onClick={() => navigate('/login')}>
                        Back to Login
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Forget;