import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Avatar, CircularProgress, Chip } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const colorHex = { RED: '#ef4444', BLUE: '#3b82f6', GREEN: '#22c55e', YELLOW: '#eab308' };

const Leaderboard = () => {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [myHistory, setMyHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [lbRes, histRes] = await Promise.all([
                    api.get('/games/leaderboard'),
                    user ? api.get(`/games/scores/${user.id}`) : Promise.resolve({ data: { data: [] } })
                ]);
                setLeaders(lbRes.data.data || []);
                setMyHistory(histRes.data.data || []);
            } catch (err) {
                console.error('Failed to load leaderboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: 'auto' }}>
            {/* Leaderboard */}
            <Card className="glass-panel" sx={{ p: { xs: 3, md: 4 }, mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <EmojiEventsIcon sx={{ color: '#eab308', fontSize: 36 }} />
                    <Typography variant="h4" fontWeight="bold" sx={{
                        background: 'linear-gradient(135deg, #e2e8f0, #eab308)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Leaderboard
                    </Typography>
                </Box>

                {leaders.length === 0 ? (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No games completed yet. Play a game to see the leaderboard!
                    </Typography>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {leaders.map((entry, idx) => (
                            <Box key={idx} sx={{
                                display: 'flex', alignItems: 'center', p: 2,
                                borderRadius: 3,
                                bgcolor: idx === 0 ? 'rgba(234, 179, 8, 0.08)' : 'rgba(255,255,255,0.02)',
                                border: idx === 0 ? '1px solid rgba(234, 179, 8, 0.25)' : '1px solid rgba(255,255,255,0.04)',
                                transition: 'all 0.2s ease',
                                '&:hover': { bgcolor: 'rgba(124,58,237,0.05)' },
                            }}>
                                <Typography variant="h5" fontWeight="900" sx={{
                                    width: 40, textAlign: 'center', mr: 2,
                                    color: idx === 0 ? '#eab308' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7f32' : '#475569'
                                }}>
                                    {idx + 1}
                                </Typography>
                                <Avatar sx={{
                                    bgcolor: colorHex[entry.color] || '#475569', mr: 2, width: 40, height: 40,
                                    fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                                }}>
                                    {entry.playerName?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body1" fontWeight="bold" sx={{ color: '#e2e8f0' }}>{entry.playerName}</Typography>
                                    <Typography variant="caption" sx={{ color: colorHex[entry.color] || '#94a3b8' }}>
                                        {entry.color || 'N/A'}
                                    </Typography>
                                </Box>
                                <Chip 
                                    label={`🏆 ${entry.score} pts`} 
                                    sx={{ 
                                        fontWeight: 'bold', fontSize: '0.9rem',
                                        bgcolor: 'rgba(124,58,237,0.12)',
                                        color: '#a78bfa',
                                        border: '1px solid rgba(124,58,237,0.2)',
                                    }} 
                                />
                            </Box>
                        ))}
                    </Box>
                )}
            </Card>

            {/* My Match History */}
            {user && (
                <Card className="glass-panel" sx={{ p: { xs: 3, md: 4 } }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#e2e8f0' }}>📋 My Match History</Typography>
                    {myHistory.length === 0 ? (
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                            No matches played yet.
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {myHistory.slice(0, 20).map((match, idx) => (
                                <Box key={idx} sx={{
                                    display: 'flex', alignItems: 'center', p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: match.isWin ? 'rgba(34, 197, 94, 0.06)' : 'rgba(255,255,255,0.02)',
                                    border: `1px solid ${match.isWin ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.04)'}`,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
                                }}>
                                    <Box sx={{
                                        width: 12, height: 12, borderRadius: '50%', mr: 2,
                                        bgcolor: colorHex[match.color] || '#475569'
                                    }} />
                                    <Typography variant="body2" sx={{ flexGrow: 1, color: '#e2e8f0' }}>
                                        {match.isWin ? '🏆 Victory' : '💪 Played'} as {match.color}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {match.score} pts • {new Date(match.playedAt).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Card>
            )}
        </Box>
    );
};

export default Leaderboard;
