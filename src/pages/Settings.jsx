import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Switch, Avatar, Grid, Button, Stack, TextField, Divider, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import PersonIcon from '@mui/icons-material/Person';
import PaletteIcon from '@mui/icons-material/Palette';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../services/api';

const PREDEFINED_AVATARS = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robo1',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robo2',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Luna',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Oliver',
];

const Settings = () => {
    const { user, login, updateProfile } = useAuth();
    
    // Local state for form
    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    
    // Local preferences (saved to localStorage)
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setAvatarUrl(user.avatarUrl || PREDEFINED_AVATARS[0]);
        }
        
        // Load prefs
        const prefs = localStorage.getItem('ludo_prefs');
        if (prefs) {
            try {
                const parsed = JSON.parse(prefs);
                setSoundEnabled(parsed.sound !== false);
                setNotificationsEnabled(parsed.notifications !== false);
            } catch (e) {}
        }
    }, [user]);

    const handleSaveProfile = async () => {
        if (!name.trim()) return setToast({ open: true, message: 'Name cannot be empty', severity: 'error' });
        
        setLoading(true);
        try {
            await updateProfile({ name: name.trim(), avatarUrl });
            setToast({ open: true, message: 'Profile updated successfully!', severity: 'success' });
        } catch (error) {
            setToast({ open: true, message: error?.response?.data?.message || 'Failed to update profile', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePref = (key) => {
        const currentPrefs = JSON.parse(localStorage.getItem('ludo_prefs') || '{}');
        
        if (key === 'sound') {
            const next = !soundEnabled;
            setSoundEnabled(next);
            localStorage.setItem('ludo_prefs', JSON.stringify({ ...currentPrefs, sound: next }));
        } else if (key === 'notifications') {
            const next = !notificationsEnabled;
            setNotificationsEnabled(next);
            localStorage.setItem('ludo_prefs', JSON.stringify({ ...currentPrefs, notifications: next }));
        }
    };

    return (
        <Box sx={{ 
            p: { xs: 2, md: 4 }, 
            minHeight: 'calc(100vh - 64px)', 
            bgcolor: '#0a0a0f',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Box sx={{ width: '100%', maxWidth: 800 }}>
                <Typography variant="h4" fontWeight="800" sx={{ mb: 4, color: '#e2e8f0' }}>
                    Settings
                </Typography>

                <Grid container spacing={4}>
                    {/* Profile Section */}
                    <Grid item xs={12} md={7}>
                        <Card className="glass-panel" sx={{ p: 3, height: '100%', borderRadius: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <PersonIcon sx={{ color: '#a78bfa' }} />
                                <Typography variant="h6" fontWeight="bold">Profile Customization</Typography>
                            </Box>
                            
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 'bold' }}>DISPLAY NAME</Typography>
                                <TextField 
                                    fullWidth 
                                    variant="outlined" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your display name"
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: 'rgba(255,255,255,0.03)',
                                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                            '&:hover fieldset': { borderColor: 'rgba(124,58,237,0.5)' },
                                            '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
                                        },
                                        input: { color: '#e2e8f0' }
                                    }}
                                />
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 'bold' }}>CHOOSE AVATAR</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                                {PREDEFINED_AVATARS.map((url, idx) => (
                                    <Box 
                                        key={idx}
                                        onClick={() => setAvatarUrl(url)}
                                        sx={{ 
                                            position: 'relative',
                                            cursor: 'pointer',
                                            borderRadius: '50%',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'scale(1.1)' }
                                        }}
                                    >
                                        <Avatar 
                                            src={url} 
                                            sx={{ 
                                                width: 60, height: 60, 
                                                border: avatarUrl === url ? '3px solid #7c3aed' : '2px solid transparent',
                                                bgcolor: 'rgba(124,58,237,0.1)' 
                                            }} 
                                        />
                                        {avatarUrl === url && (
                                            <CheckCircleIcon sx={{ 
                                                position: 'absolute', bottom: -4, right: -4, 
                                                color: '#22c55e', bgcolor: '#13131a', borderRadius: '50%', fontSize: 20
                                            }} />
                                        )}
                                    </Box>
                                ))}
                            </Box>

                            <Button 
                                variant="contained" 
                                startIcon={<SaveIcon />}
                                onClick={handleSaveProfile}
                                disabled={loading}
                                sx={{ 
                                    py: 1.5, px: 4, borderRadius: 2, fontWeight: 'bold',
                                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)'
                                }}
                            >
                                Save Changes
                            </Button>
                        </Card>
                    </Grid>

                    {/* Preferences Section */}
                    <Grid item xs={12} md={5}>
                        <Stack spacing={3}>
                            <Card className="glass-panel" sx={{ p: 3, borderRadius: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                    <PaletteIcon sx={{ color: '#06b6d4' }} />
                                    <Typography variant="h6" fontWeight="bold">Preferences</Typography>
                                </Box>

                                <Stack spacing={2} divider={<Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            {soundEnabled ? <VolumeUpIcon sx={{ color: '#a78bfa' }} /> : <VolumeOffIcon sx={{ color: '#64748b' }} />}
                                            <Box>
                                                <Typography variant="body1" fontWeight="bold">Sound Effects</Typography>
                                                <Typography variant="caption" color="text.secondary">Dice rolls, captures, wins</Typography>
                                            </Box>
                                        </Box>
                                        <Switch 
                                            checked={soundEnabled} 
                                            onChange={() => handleTogglePref('sound')} 
                                            color="secondary"
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            {notificationsEnabled ? <NotificationsActiveIcon sx={{ color: '#a78bfa' }} /> : <NotificationsOffIcon sx={{ color: '#64748b' }} />}
                                            <Box>
                                                <Typography variant="body1" fontWeight="bold">Notifications</Typography>
                                                <Typography variant="caption" color="text.secondary">Match invites, turns</Typography>
                                            </Box>
                                        </Box>
                                        <Switch 
                                            checked={notificationsEnabled} 
                                            onChange={() => handleTogglePref('notifications')} 
                                            color="secondary"
                                        />
                                    </Box>
                                </Stack>
                            </Card>

                            <Card className="glass-panel" sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(239, 68, 68, 0.05)' }}>
                                <Typography variant="h6" fontWeight="bold" color="error" gutterBottom>Danger Zone</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Irreversible actions related to your account.
                                </Typography>
                                <Button variant="outlined" color="error" fullWidth sx={{ borderRadius: 2 }}>
                                    Delete Account
                                </Button>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>

            <Snackbar 
                open={toast.open} 
                autoHideDuration={4000} 
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={toast.severity} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings;
