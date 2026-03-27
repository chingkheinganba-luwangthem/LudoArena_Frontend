import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import GroupIcon from '@mui/icons-material/Group';
import ComputerIcon from '@mui/icons-material/Computer';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [openCreate, setOpenCreate] = useState(false);
    const [createData, setCreateData] = useState({ color: 'RED', maxPlayers: 4, coinAmount: 100 });
    const [loading, setLoading] = useState(false);

    const [openJoin, setOpenJoin] = useState(false);
    const [joinData, setJoinData] = useState({ roomCode: '', color: 'BLUE' });

    const handleCreateRoom = async () => {
        setLoading(true);
        try {
            const res = await api.post('/rooms/create', createData);
            setOpenCreate(false);
            navigate(`/room/${res.data.data.roomCode}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async () => {
        if (!joinData.roomCode) return toast.error('Please enter a room code');
        setLoading(true);
        try {
            const res = await api.post(`/rooms/join/${joinData.roomCode}`, { color: joinData.color });
            setOpenJoin(false);
            navigate(`/room/${joinData.roomCode}`);
        } catch (err) {
            // If already in room, just navigate to it
            if (err.response?.data?.message?.includes('already in this room')) {
                setOpenJoin(false);
                navigate(`/room/${joinData.roomCode}`);
                return;
            }
            toast.error(err.response?.data?.message || 'Failed to join room');
        } finally {
            setLoading(false);
        }
    };

    const menuItems = [
        {
            title: 'Play Online',
            desc: "Join a friend's room with a room code.",
            icon: <GroupIcon sx={{ fontSize: 56, color: '#a78bfa' }} />,
            onClick: () => setOpenJoin(true),
            gradient: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))',
            borderColor: 'rgba(124,58,237,0.2)',
        },
        {
            title: 'Create Room',
            desc: 'Create a private room and invite your friends.',
            icon: <PeopleAltIcon sx={{ fontSize: 56, color: '#22d3ee' }} />,
            onClick: () => setOpenCreate(true),
            gradient: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))',
            borderColor: 'rgba(6,182,212,0.2)',
        },
        {
            title: 'vs Computer',
            desc: 'Coming Soon - Play against our AI bot!',
            icon: <ComputerIcon sx={{ fontSize: 56, color: '#22c55e' }} />,
            disabled: true,
            gradient: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.03))',
            borderColor: 'rgba(34,197,94,0.15)',
        },
        {
            title: 'Profile Stats',
            desc: 'View your game history and win rate.',
            icon: <PersonOutlineIcon sx={{ fontSize: 56, color: '#eab308' }} />,
            onClick: () => navigate('/profile'),
            gradient: 'linear-gradient(135deg, rgba(234,179,8,0.1), rgba(234,179,8,0.03))',
            borderColor: 'rgba(234,179,8,0.15)',
        },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
            {/* Header Banner */}
            <Box className="glass-panel" sx={{ 
                p: { xs: 3, md: 4 }, 
                mb: 4, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05)) !important',
                borderLeft: '4px solid #7c3aed !important',
            }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ 
                        background: 'linear-gradient(135deg, #e2e8f0, #a78bfa)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Welcome, {user?.name || 'Player'}!
                    </Typography>
                    <Typography variant="body1" color="text.secondary">Ready to roll the dice? 🎲</Typography>
                </Box>
                <Box sx={{ fontSize: '3rem', display: { xs: 'none', md: 'block' } }}>🎲</Box>
            </Box>

            {/* Main Menu Cards */}
            <Grid container spacing={3}>
                {menuItems.map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                        <Card 
                            className="glass-panel" 
                            sx={{ 
                                height: '100%', 
                                cursor: item.disabled ? 'default' : 'pointer', 
                                opacity: item.disabled ? 0.5 : 1,
                                transition: 'all 0.3s ease',
                                background: `${item.gradient} !important`,
                                border: `1px solid ${item.borderColor} !important`,
                                '&:hover': item.disabled ? {} : { 
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 40px rgba(0,0,0,0.3), 0 0 20px rgba(124,58,237,0.1) !important',
                                },
                            }} 
                            onClick={item.disabled ? undefined : item.onClick}
                        >
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
                                <Box sx={{ mb: 2 }}>{item.icon}</Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#e2e8f0' }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" align="center" sx={{ color: '#94a3b8' }}>
                                    {item.desc}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Create Room Dialog */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Create Room</DialogTitle>
                <DialogContent>
                    <TextField label="Entry Coins" fullWidth margin="normal" type="number" value={createData.coinAmount} onChange={(e) => setCreateData({...createData, coinAmount: Number(e.target.value)})} />
                    <TextField select label="Max Players" fullWidth margin="normal" value={createData.maxPlayers} onChange={(e) => setCreateData({...createData, maxPlayers: Number(e.target.value)})}>
                        <MenuItem value={2}>2 Players</MenuItem>
                        <MenuItem value={3}>3 Players</MenuItem>
                        <MenuItem value={4}>4 Players</MenuItem>
                    </TextField>
                    <TextField select label="Your Color" fullWidth margin="normal" value={createData.color} onChange={(e) => setCreateData({...createData, color: e.target.value})}>
                        <MenuItem value="RED"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#ef4444' }} /> Red</Box></MenuItem>
                        <MenuItem value="BLUE"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#3b82f6' }} /> Blue</Box></MenuItem>
                        <MenuItem value="GREEN"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#22c55e' }} /> Green</Box></MenuItem>
                        <MenuItem value="YELLOW"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#eab308' }} /> Yellow</Box></MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenCreate(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateRoom} disabled={loading}>Create</Button>
                </DialogActions>
            </Dialog>

            {/* Join Room Dialog */}
            <Dialog open={openJoin} onClose={() => setOpenJoin(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Join Room</DialogTitle>
                <DialogContent>
                    <TextField label="Room Code" fullWidth margin="normal" value={joinData.roomCode} onChange={(e) => setJoinData({...joinData, roomCode: e.target.value.toUpperCase()})} placeholder="Enter 6-character code" />
                    <TextField select label="Your Color" fullWidth margin="normal" value={joinData.color} onChange={(e) => setJoinData({...joinData, color: e.target.value})}>
                        <MenuItem value="RED"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#ef4444' }} /> Red</Box></MenuItem>
                        <MenuItem value="BLUE"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#3b82f6' }} /> Blue</Box></MenuItem>
                        <MenuItem value="GREEN"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#22c55e' }} /> Green</Box></MenuItem>
                        <MenuItem value="YELLOW"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#eab308' }} /> Yellow</Box></MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenJoin(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleJoinRoom} disabled={loading}>Join</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
