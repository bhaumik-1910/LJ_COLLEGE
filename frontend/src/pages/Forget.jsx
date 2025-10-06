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
        const res = await resetPassword({ email, otp, newPassword, confirmPassword });

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
                                InputProps={{ readOnly: true }}
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
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 }}
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