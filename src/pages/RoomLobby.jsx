import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Grid, Button, Avatar, Chip, CircularProgress, IconButton, Snackbar, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import api from '../services/api';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const RoomLobby = () => {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { room, connectToRoom, game, connected } = useGame();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await api.get(`/rooms/${roomCode}`);
                setRoomData(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Room not found');
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [roomCode]);

    useEffect(() => {
        if (roomData) connectToRoom(roomData);
    }, [roomData, connectToRoom, connected]);

    useEffect(() => {
        if (game && game.state === 'IN_PROGRESS') {
            navigate(`/game/${game.id}`);
        }
    }, [game, navigate]);

    const handleLeave = async () => {
        try {
            await api.delete(`/rooms/${roomCode}/leave`);
            navigate('/');
        } catch (err) { console.error(err); }
    };

    const handleStartGame = async () => {
        setStarting(true);
        try {
            await api.post(`/games/start/${roomCode}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start game');
            setStarting(false);
        }
    };

    const handleAddBot = async () => {
        try {
            await api.post(`/rooms/${roomCode}/add-bot`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add bot');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>;
    
    if (error && !roomData) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10, flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ color: '#ef4444', mb: 3 }}>{error}</Typography>
            <Button variant="contained" onClick={() => navigate('/')}>Return Home</Button>
        </Box>
    );

    const displayRoom = room || roomData;
    if (!displayRoom) return null;

    const isAdmin = displayRoom.adminId === user?.id;
    const canStart = isAdmin && displayRoom.players.length >= 2;

    const colorHex = { RED: '#ef4444', BLUE: '#3b82f6', GREEN: '#22c55e', YELLOW: '#eab308' };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
            <Card className="glass-panel" sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" sx={{ 
                            mb: 1,
                            background: 'linear-gradient(135deg, #e2e8f0, #a78bfa)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Room Lobby
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', alignItems: 'center', 
                            bgcolor: 'rgba(124,58,237,0.1)', 
                            border: '1px solid rgba(124,58,237,0.25)',
                            px: 2.5, py: 1, borderRadius: 3 
                        }}>
                            <Typography variant="h5" sx={{ mr: 2, letterSpacing: 3, fontWeight: 800, color: '#a78bfa', fontFamily: 'monospace' }}>
                                {roomCode}
                            </Typography>
                            <IconButton size="small" onClick={copyToClipboard} sx={{ color: '#a78bfa', '&:hover': { color: '#e2e8f0' } }}>
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                        <Chip 
                            label={`Entry: 💰 ${displayRoom.coinAmount}`} 
                            sx={{ 
                                mb: 1, fontWeight: 'bold',
                                bgcolor: 'rgba(234,179,8,0.1)',
                                color: '#eab308',
                                border: '1px solid rgba(234,179,8,0.2)',
                            }} 
                        />
                        <Typography variant="body2" color="text.secondary">
                            Players: {displayRoom.players.length} / {displayRoom.maxPlayers}
                        </Typography>
                        {!connected && (
                            <Typography variant="caption" sx={{ color: '#f59e0b' }}>
                                Connecting...
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {displayRoom.players.map((player) => (
                        <Grid item xs={12} sm={6} key={player.userId}>
                            <Card sx={{ 
                                bgcolor: 'rgba(255,255,255,0.03)', 
                                borderLeft: `5px solid ${colorHex[player.color]}`,
                                border: `1px solid rgba(255,255,255,0.06)`,
                                borderLeftWidth: 5,
                                borderLeftColor: colorHex[player.color],
                                p: 2, 
                                display: 'flex', 
                                alignItems: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                            }}>
                                <Avatar sx={{ bgcolor: colorHex[player.color], mr: 2, fontWeight: 'bold' }}>
                                    {player.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" sx={{ color: '#e2e8f0' }}>{player.name}</Typography>
                                    <Typography variant="caption" sx={{ color: colorHex[player.color], fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {player.color}
                                    </Typography>
                                </Box>
                                {displayRoom.adminId === player.userId && (
                                    <Chip size="small" label="Admin" sx={{ bgcolor: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }} />
                                )}
                            </Card>
                        </Grid>
                    ))}
                    
                    {Array.from({ length: displayRoom.maxPlayers - displayRoom.players.length }).map((_, idx) => (
                        <Grid item xs={12} sm={6} key={`empty-${idx}`}>
                            <Card sx={{ 
                                bgcolor: 'transparent', 
                                border: '1px dashed rgba(255,255,255,0.1)',
                                p: 2, 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: 76
                            }}>
                                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>Waiting for player...</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, flexWrap: 'wrap', gap: 2 }}>
                    <Button 
                        variant="outlined" 
                        startIcon={<ExitToAppIcon />}
                        onClick={handleLeave}
                        disabled={starting}
                        sx={{ 
                            color: '#ef4444', 
                            borderColor: 'rgba(239,68,68,0.3)',
                            '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' }
                        }}
                    >
                        Leave Room
                    </Button>
                    
                    {isAdmin && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<SmartToyIcon />}
                                onClick={handleAddBot}
                                disabled={displayRoom.players.length >= displayRoom.maxPlayers || starting}
                                sx={{ 
                                    color: '#22d3ee',
                                    borderColor: 'rgba(6,182,212,0.3)',
                                    '&:hover': { borderColor: '#06b6d4', bgcolor: 'rgba(6,182,212,0.08)' }
                                }}
                            >
                                Add Bot
                            </Button>
                            <Button 
                                variant="contained" 
                                size="large"
                                startIcon={<PlayArrowIcon />}
                                onClick={handleStartGame}
                                disabled={!canStart || starting}
                                sx={{ minWidth: 180, fontWeight: 700 }}
                            >
                                {starting ? <CircularProgress size={24} color="inherit" /> : 'Start Game'}
                            </Button>
                        </Box>
                    )}
                    
                    {!isAdmin && (
                        <Typography variant="body1" sx={{ alignSelf: 'center', fontStyle: 'italic', color: '#94a3b8' }}>
                            Waiting for admin to start...
                        </Typography>
                    )}
                </Box>
            </Card>

            <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)}>
                <Alert severity="success" sx={{ bgcolor: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                    Room code copied!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RoomLobby;
