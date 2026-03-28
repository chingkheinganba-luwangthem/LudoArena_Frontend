import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Box, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CasinoIcon from '@mui/icons-material/Casino';
import FeedbackModal from './game/FeedbackModal';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const onLogout = () => {
        handleClose();
        logout();
        navigate('/landing');
    };

    // Hide navbar on landing page
    if (location.pathname === '/landing') return null;

    // Smart back navigation: on game pages go to dashboard, otherwise use history
    const handleBack = () => {
        if (location.pathname.startsWith('/game/')) {
            navigate('/');
        } else if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <AppBar 
            position="sticky" 
            elevation={0} 
            sx={{ 
                background: 'rgba(10, 10, 15, 0.75)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            <Toolbar>
                {/* Page Navigation Arrows */}
                <IconButton 
                    size="small" 
                    onClick={handleBack}
                    sx={{ 
                        color: '#94a3b8', 
                        mr: 0.5,
                        '&:hover': { color: '#e2e8f0', background: 'rgba(124,58,237,0.1)' }
                    }}
                >
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <IconButton 
                    size="small" 
                    onClick={() => navigate(1)}
                    sx={{ 
                        color: '#94a3b8', 
                        mr: 1.5,
                        '&:hover': { color: '#e2e8f0', background: 'rgba(124,58,237,0.1)' }
                    }}
                >
                    <ArrowForwardIcon fontSize="small" />
                </IconButton>

                <CasinoIcon sx={{ mr: 1, color: '#a78bfa', fontSize: 28 }} />
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: 800, 
                        cursor: 'pointer',
                        background: 'linear-gradient(135deg, #e2e8f0, #a78bfa)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '1.2rem',
                    }} 
                    onClick={() => navigate('/')}
                >
                    LudoArena
                </Typography>

                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ 
                            display: { xs: 'none', sm: 'flex' }, 
                            alignItems: 'center',
                            bgcolor: 'rgba(234, 179, 8, 0.1)', 
                            color: '#eab308', 
                            px: 2, 
                            py: 0.5, 
                            borderRadius: 4,
                            border: '1px solid rgba(234, 179, 8, 0.2)',
                        }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>💰 {user.coins}</Typography>
                        </Box>
                        <IconButton onClick={handleMenu} size="small">
                            <Avatar src={user.avatarUrl} sx={{ 
                                bgcolor: '#7c3aed', 
                                width: 34, 
                                height: 34,
                                fontSize: 14,
                                fontWeight: 'bold',
                                border: '2px solid rgba(124,58,237,0.4)',
                            }}>
                                {!user.avatarUrl ? (user.name ? user.name.charAt(0).toUpperCase() : 'U') : null}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            PaperProps={{ sx: { mt: 1.5, minWidth: 150 } }}
                        >
                            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>Profile</MenuItem>
                            <MenuItem onClick={() => { handleClose(); navigate('/leaderboard'); }}>Leaderboard</MenuItem>
                            <MenuItem onClick={() => { handleClose(); setShowFeedback(true); }}>Feedback</MenuItem>
                            <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>Settings</MenuItem>
                            <MenuItem onClick={onLogout} sx={{ color: '#ef4444' }}>Logout</MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            variant="outlined"
                            size="small"
                            onClick={() => navigate('/login')}
                            sx={{ 
                                borderColor: 'rgba(124,58,237,0.4)', 
                                color: '#a78bfa',
                                '&:hover': { borderColor: '#7c3aed', background: 'rgba(124,58,237,0.08)' }
                            }}
                        >
                            Login
                        </Button>
                        <Button 
                            variant="contained"
                            size="small"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </Button>
                    </Box>
                )}
            </Toolbar>
            <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />
        </AppBar>
    );
};

export default Navbar;
