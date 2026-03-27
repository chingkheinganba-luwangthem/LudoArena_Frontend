import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button, Divider, Alert, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import CasinoIcon from '@mui/icons-material/Casino';

import { GoogleLogin } from '@react-oauth/google';

const Signup = () => {
    const [data, setData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { signup, googleAuth } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (data.password !== data.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await signup({
                name: data.name,
                email: data.email,
                password: data.password
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        setLoading(true);
        try {
            await googleAuth(credentialResponse.credential);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Google signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 'calc(100vh - 64px)',
            p: 2,
        }}>
            <Card className="glass-panel" sx={{ 
                p: { xs: 3, sm: 4 }, 
                width: '100%', 
                maxWidth: 420,
                border: '1px solid rgba(6,182,212,0.15) !important',
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Box sx={{
                        width: 64, height: 64, borderRadius: 3,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(124,58,237,0.1))',
                        mb: 2,
                    }}>
                        <CasinoIcon sx={{ fontSize: 36, color: '#22d3ee' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#e2e8f0' }}>Create Account</Typography>
                    <Typography variant="body2" color="text.secondary">Join LudoArena today</Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239,68,68,0.1)', color: '#fca5a5' }}>{error}</Alert>}

                {/* Google Sign Up - Featured at top */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google signup failed')}
                        useOneTap
                        theme="filled_blue"
                        shape="pill"
                        text="signup_with"
                        width="100%"
                    />
                </Box>

                <Divider sx={{ mb: 2, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.08)' } }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>OR</Typography>
                </Divider>

                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Full Name" name="name" variant="outlined" margin="normal" value={data.name} onChange={handleChange} required />
                    <TextField fullWidth label="Email Address" name="email" variant="outlined" margin="normal" value={data.email} onChange={handleChange} required type="email" />
                    <TextField fullWidth label="Password" name="password" type="password" variant="outlined" margin="normal" value={data.password} onChange={handleChange} required />
                    <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" variant="outlined" margin="normal" value={data.confirmPassword} onChange={handleChange} required />
                    <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 700 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                    </Button>
                </form>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Already have an account? <Link to="/login" style={{ color: '#22d3ee', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
};

export default Signup;
