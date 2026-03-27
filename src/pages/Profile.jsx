import React from 'react';
import { Box, Card, Typography, Avatar, Grid, Divider, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CasinoIcon from '@mui/icons-material/Casino';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const winRate = user.gamesPlayed > 0 
        ? Math.round((user.gamesWon / user.gamesPlayed) * 100) 
        : 0;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
            <Card className="glass-panel" sx={{ p: { xs: 3, md: 4 }, position: 'relative' }}>
                <IconButton 
                    onClick={() => navigate('/')} 
                    sx={{ position: 'absolute', top: 16, right: 16, color: '#94a3b8', '&:hover': { color: '#e2e8f0' } }}
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Avatar 
                        src={user.avatarUrl} 
                        sx={{ 
                            width: 120, height: 120, mb: 2, 
                            bgcolor: '#7c3aed', 
                            fontSize: 48,
                            border: '4px solid rgba(124,58,237,0.4)',
                            boxShadow: '0 0 30px rgba(124,58,237,0.2)',
                        }}
                    >
                        {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold" sx={{ 
                        background: 'linear-gradient(135deg, #e2e8f0, #a78bfa)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {user.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">{user.email || 'Guest User'}</Typography>
                    <Box sx={{ 
                        mt: 2, 
                        bgcolor: 'rgba(234,179,8,0.1)', 
                        color: '#eab308', 
                        px: 3, py: 1, 
                        borderRadius: 8, 
                        border: '1px solid rgba(234,179,8,0.2)',
                    }}>
                        <Typography variant="h6" fontWeight="bold">💰 {user.coins} Coins</Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.06)' }} />

                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3, color: '#e2e8f0' }}>
                    📊 Game Statistics
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ 
                            textAlign: 'center', p: 3, 
                            bgcolor: 'rgba(124,58,237,0.08)', 
                            borderRadius: 4,
                            border: '1px solid rgba(124,58,237,0.15)',
                        }}>
                            <CasinoIcon sx={{ color: '#a78bfa', fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#e2e8f0' }}>{user.gamesPlayed}</Typography>
                            <Typography variant="body2" color="text.secondary">Games Played</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ 
                            textAlign: 'center', p: 3, 
                            bgcolor: 'rgba(234,179,8,0.08)', 
                            borderRadius: 4,
                            border: '1px solid rgba(234,179,8,0.15)',
                        }}>
                            <EmojiEventsIcon sx={{ color: '#eab308', fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" sx={{ color: '#e2e8f0' }}>{user.gamesWon}</Typography>
                            <Typography variant="body2" color="text.secondary">Games Won</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ 
                            textAlign: 'center', p: 3, 
                            bgcolor: winRate >= 50 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', 
                            borderRadius: 4,
                            border: `1px solid ${winRate >= 50 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
                        }}>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: winRate >= 50 ? '#22c55e' : '#ef4444', mb: 1 }}>
                                {winRate}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Win Rate</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
};

export default Profile;
