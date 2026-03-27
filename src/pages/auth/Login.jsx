import React, { useState } from 'react';
import { Box, Card, Typography, TextField, Button, Divider, Alert, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import CasinoIcon from '@mui/icons-material/Casino';
import PersonIcon from '@mui/icons-material/Person';

import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, guestLogin, googleAuth } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(credentials);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        try {
            await guestLogin();
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Guest login failed');
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
            setError(err.response?.data?.message || 'Google login failed');
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
                border: '1px solid rgba(124,58,237,0.15) !important',
            }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Box sx={{
                        width: 64, height: 64, borderRadius: 3,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))',
                        mb: 2,
                    }}>
                        <CasinoIcon sx={{ fontSize: 36, color: '#a78bfa' }} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#e2e8f0' }}>Welcome Back</Typography>
                    <Typography variant="body2" color="text.secondary">Enter the arena and play Ludo</Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239,68,68,0.1)', color: '#fca5a5' }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Email Address" name="email" variant="outlined" margin="normal" value={credentials.email} onChange={handleChange} required type="email" />
                    <TextField fullWidth label="Password" name="password" type="password" variant="outlined" margin="normal" value={credentials.password} onChange={handleChange} required />
                    <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 2, mb: 1.5, py: 1.5, fontWeight: 700 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                    </Button>
                </form>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google login failed')}
                        useOneTap
                        theme="filled_blue"
                        shape="pill"
                        text="continue_with"
                    />
                </Box>

                <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Don't have an account? <Link to="/signup" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
                    </Typography>
                </Box>

                <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.08)' } }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>OR</Typography>
                </Divider>

                <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<PersonIcon />}
                    onClick={handleGuestLogin}
                    disabled={loading}
                    sx={{ 
                        py: 1.3,
                        color: '#94a3b8',
                        borderColor: 'rgba(255,255,255,0.08)',
                        fontWeight: 600,
                        '&:hover': { borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)' }
                    }}
                >
                    Play as Guest
                </Button>
            </Card>
        </Box>
    );
};

export default Login;
