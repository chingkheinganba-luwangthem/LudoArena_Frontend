import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Box, Card, Typography, Avatar, Button, CircularProgress, Stack, LinearProgress, IconButton, Drawer, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import api from '../services/api';
import LudoSVG from '../components/game/LudoSVG';
import ChatPanel from '../components/game/ChatPanel';
import LudoDice from '../components/game/LudoDice';
import FeedbackModal from '../components/game/FeedbackModal';
import TimerIcon from '@mui/icons-material/Timer';
import ChatIcon from '@mui/icons-material/Chat';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const TURN_TIME_LIMIT = 30;

const GameBoard = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { 
        game, setGame, diceResult, isRolling, validMoves, 
        lastMove, rollDice, moveToken, skipTurn, connected, endGame 
    } = useGame() || {};

    const [turnTimer, setTurnTimer] = useState(TURN_TIME_LIMIT);
    const timerRef = useRef(null);
    const [showChat, setShowChat] = useState(false);
    const [showPlayers, setShowPlayers] = useState(false);
    const [showEndGameDialog, setShowEndGameDialog] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackShown, setFeedbackShown] = useState(false);

    useEffect(() => {
        const fetchGame = async () => {
            if (!gameId) return;
            try {
                const res = await api.get(`/games/${gameId}`);
                if (res.data?.data) setGame(res.data.data);
            } catch (err) {
                console.error('Failed to load game:', err);
                navigate('/');
            }
        };
        if (!game) fetchGame();
    }, [gameId, game, setGame, navigate]);

    const players = useMemo(() => game?.players || [], [game?.players]);
    const myPlayerInfo = useMemo(() => players.find(p => p && Number(p.userId) === Number(user?.id)), [players, user?.id]);
    const isMyTurn = useMemo(() => game?.currentTurnUserId && user?.id && Number(game.currentTurnUserId) === Number(user.id), [game?.currentTurnUserId, user?.id]);
    const currentTurnPlayer = useMemo(() => {
        if (!players.length || game?.currentTurnIndex === undefined) return null;
        return players.find(p => p && Number(p.turnOrder) === Number(game.currentTurnIndex));
    }, [players, game?.currentTurnIndex]);

    useEffect(() => {
        if (!game || game.state !== 'IN_PROGRESS') return;
        setTurnTimer(TURN_TIME_LIMIT);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTurnTimer(prev => {
                if (prev <= 0) { clearInterval(timerRef.current); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [game?.currentTurnUserId, game?.currentTurnIndex, game?.state]);

    useEffect(() => {
        if (turnTimer === 0 && isMyTurn && game?.state === 'IN_PROGRESS' && skipTurn) {
            skipTurn(gameId, user.id);
        }
    }, [turnTimer, isMyTurn, gameId, user?.id, skipTurn, game?.state]);

    useEffect(() => {
        if (game?.state === 'COMPLETED' && !feedbackShown) {
            const timer = setTimeout(() => {
                setShowFeedbackModal(true);
                setFeedbackShown(true);
            }, 3000); // Show feedback after 3s of seeing the results
            return () => clearTimeout(timer);
        }
    }, [game?.state, feedbackShown]);

    if (!game || !players.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0a0a0f' }}>
                <CircularProgress sx={{ color: '#7c3aed' }} />
            </Box>
        );
    }

    const handleRollDice = () => {
        if (isMyTurn && !diceResult && !isRolling && rollDice) rollDice(gameId, user.id);
    };

    const handleTokenMove = (tokenIndex, color) => {
        if (isMyTurn && diceResult && myPlayerInfo?.color === color && moveToken) {
            moveToken(gameId, user.id, diceResult, tokenIndex);
        }
    };

    const handleEndGame = () => {
        if (endGame) endGame(gameId, user.id);
        setShowEndGameDialog(false);
    };

    const colorHex = { RED: '#ef4444', BLUE: '#3b82f6', GREEN: '#22c55e', YELLOW: '#eab308' };
    const timerPercent = (turnTimer / TURN_TIME_LIMIT) * 100;
    const timerColor = turnTimer > 15 ? '#22c55e' : turnTimer > 5 ? '#f59e0b' : '#ef4444';
    const winnerPlayer = game.winnerId ? players.find(p => Number(p.userId) === Number(game.winnerId)) : null;
    const totalPrize = game.entryFee ? game.entryFee * players.length : 0;

    // Shared player list component
    const PlayerList = () => (
        <Stack spacing={1}>
            {players.map((p, idx) => (
                <Box key={p?.userId || p?.id || idx} sx={{ 
                    display: 'flex', alignItems: 'center', p: 1.5, borderRadius: 3,
                    bgcolor: 'rgba(19, 19, 26, 0.7)',
                    border: (game?.currentTurnUserId && p?.userId && Number(game.currentTurnUserId) === Number(p.userId))
                        ? `2px solid ${colorHex[p.color?.toUpperCase()] || '#7c3aed'}` : '1px solid rgba(255,255,255,0.04)',
                }}>
                    <Avatar sx={{ width: 30, height: 30, bgcolor: colorHex[p?.color?.toUpperCase()] || '#7c3aed', mr: 1.5, fontSize: 13, fontWeight: 'bold' }}>
                        {p?.name?.charAt(0).toUpperCase() || '?'}
                    </Avatar>
                    <Typography variant="body2" fontWeight="700" sx={{ flexGrow: 1 }}>{p?.name || 'Player'}</Typography>
                    {p?.isBot && <Typography variant="caption" sx={{ color: '#64748b', mr: 0.5 }}>🤖</Typography>}
                    {p?.finished && <span>🏁</span>}
                </Box>
            ))}
        </Stack>
    );

    return (
        <Box sx={{ 
            p: { xs: 0, md: 2 }, 
            minHeight: 'calc(100vh - 64px)',
            display: 'flex', flexDirection: 'column',
            bgcolor: '#0a0a0f', color: '#e2e8f0', overflow: 'hidden',
        }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                gap: { xs: 0, md: 2 }, flexGrow: 1,
                height: { xs: 'calc(100vh - 64px)', md: 'auto' },
            }}>
                
                {/* Left Column - Desktop only */}
                <Box sx={{ width: { xs: '100%', md: '250px', lg: '300px' }, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
                    <Stack spacing={1.5} sx={{ position: { md: 'sticky' }, top: 20 }}>
                        <Card className="glass-panel" sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="overline" color="text.secondary" fontWeight="bold">MATCH STATUS</Typography>
                            <Typography variant="h6" sx={{ color: '#a78bfa', fontWeight: 800 }}>
                                {game.state === 'COMPLETED' ? '🏁 Game Over' : '⚡ In Progress'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: connected ? '#22c55e' : '#ef4444' }} />
                                <Typography variant="caption" color="text.secondary">{connected ? 'Live' : 'Offline'}</Typography>
                            </Box>
                        </Card>

                        <Card className="glass-panel" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <TimerIcon sx={{ color: timerColor, fontSize: 20 }} />
                                <Typography variant="body2" fontWeight="bold" sx={{ color: timerColor }}>{turnTimer}s</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={timerPercent} sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: timerColor } }} />
                        </Card>

                        <Card className="glass-panel" sx={{ 
                            p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center',
                            border: isMyTurn ? '1px solid rgba(124,58,237,0.4) !important' : '1px solid transparent',
                        }}>
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: isMyTurn ? '#a78bfa' : '#64748b' }}>
                                {isMyTurn ? "🎯 YOUR TURN!" : "⏳ WAITING..."}
                            </Typography>
                            <LudoDice value={diceResult} rolling={isRolling} 
                                color={(currentTurnPlayer?.color && colorHex[currentTurnPlayer.color.toUpperCase()]) ? colorHex[currentTurnPlayer.color.toUpperCase()] : '#7c3aed'}
                            />
                            <Button variant="contained" fullWidth size="large" onClick={handleRollDice} 
                                disabled={!isMyTurn || diceResult !== null || isRolling || game.state !== 'IN_PROGRESS'}
                                sx={{ mt: 3, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
                            >
                                Roll Dice
                            </Button>
                        </Card>

                        <Typography variant="overline" color="text.secondary" fontWeight="bold" sx={{ pl: 1 }}>CONTENDERS</Typography>
                        <PlayerList />

                        {game.state === 'IN_PROGRESS' && (
                            <Button variant="outlined" color="error" size="small" startIcon={<ExitToAppIcon />}
                                onClick={() => setShowEndGameDialog(true)} sx={{ mt: 1, borderRadius: 3 }}
                            >
                                End Game
                            </Button>
                        )}
                    </Stack>
                </Box>

                {/* Center: Game Board */}
                <Box sx={{ 
                    flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', 
                    minHeight: { xs: '0' }, flex: { xs: '1 1 auto', md: 'unset' },
                    position: 'relative', p: { xs: 0.5, md: 0 },
                    mb: { xs: '80px', md: 0 },
                }}>
                    <Box sx={{ 
                        width: { xs: 'min(92vw, calc(100vh - 180px))', md: 'min(85vh, 95vw)' }, 
                        height: { xs: 'min(92vw, calc(100vh - 180px))', md: 'min(85vh, 95vw)' }, 
                        aspectRatio: '1/1',
                        border: '2px solid rgba(255,255,255,0.15)', bgcolor: '#111', borderRadius: 2,
                        position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', mx: 'auto',
                    }}>
                        <LudoSVG game={game} onMoveClick={handleTokenMove} validMoves={validMoves}
                            currentTurnColor={currentTurnPlayer?.color} diceResult={diceResult} lastMove={lastMove}
                        />
                    </Box>
                </Box>

                {/* Right Column: Chat - Desktop only */}
                <Box sx={{ width: { xs: '100%', md: '300px', lg: '350px' }, flexShrink: 0, display: { xs: 'none', md: 'block' } }}>
                    <Stack sx={{ height: '100%', maxHeight: '85vh' }}>
                        <ChatPanel gameId={gameId} />
                    </Stack>
                </Box>
            </Box>

            {/* Mobile Bottom Bar */}
            <Box sx={{ 
                display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'space-between',
                px: 2, 
                pt: 1.5,
                pb: 'max(15px, env(safe-area-inset-bottom))', 
                gap: 1, bgcolor: 'rgba(13, 13, 18, 0.98)', borderTop: '1px solid rgba(255,255,255,0.1)',
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, backdropFilter: 'blur(20px)',
            }}>
                <IconButton onClick={() => setShowPlayers(true)} sx={{ color: '#a78bfa', bgcolor: 'rgba(124,58,237,0.15)', borderRadius: 2 }}>
                    <PeopleIcon />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TimerIcon sx={{ color: timerColor, fontSize: 16 }} />
                    <Typography variant="body2" fontWeight="bold" sx={{ color: timerColor, fontSize: '0.85rem' }}>{turnTimer}s</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'center' }}>
                    <Box sx={{ 
                        width: 50, 
                        height: 50, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        transform: 'scale(0.8)',
                    }}>
                        <LudoDice value={diceResult} rolling={isRolling} 
                            color={(currentTurnPlayer?.color && colorHex[currentTurnPlayer.color.toUpperCase()]) ? colorHex[currentTurnPlayer.color.toUpperCase()] : '#7c3aed'}
                        />
                    </Box>
                    <Button variant="contained" size="small" onClick={handleRollDice} 
                        disabled={!isMyTurn || diceResult !== null || isRolling || game.state !== 'IN_PROGRESS'}
                        sx={{ py: 1.2, px: 2, borderRadius: 2, fontWeight: '900', fontSize: '0.85rem', minWidth: '80px', boxShadow: isMyTurn ? '0 0 15px rgba(124,58,237,0.5)' : 'none' }}
                    >
                        {isMyTurn ? '🎲 ROLL' : '⏳ Wait'}
                    </Button>
                </Box>
                <IconButton onClick={() => setShowChat(true)} sx={{ color: '#06b6d4', bgcolor: 'rgba(6,182,212,0.15)', borderRadius: 2 }}>
                    <ChatIcon />
                </IconButton>
            </Box>

            {/* Mobile Players Drawer */}
            <Drawer anchor="left" open={showPlayers} onClose={() => setShowPlayers(false)}
                PaperProps={{ sx: { width: 280, bgcolor: '#13131a', p: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Players</Typography>
                    <IconButton onClick={() => setShowPlayers(false)} sx={{ color: '#94a3b8' }}><CloseIcon /></IconButton>
                </Box>
                <PlayerList />
                {game.state === 'IN_PROGRESS' && (
                    <Button variant="outlined" color="error" size="small" startIcon={<ExitToAppIcon />}
                        onClick={() => { setShowPlayers(false); setShowEndGameDialog(true); }} sx={{ mt: 3, borderRadius: 3 }}
                    >End Game</Button>
                )}
            </Drawer>

            {/* Mobile Chat Drawer */}
            <Drawer anchor="right" open={showChat} onClose={() => setShowChat(false)}
                PaperProps={{ sx: { width: 320, bgcolor: '#13131a' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Chat</Typography>
                    <IconButton onClick={() => setShowChat(false)} sx={{ color: '#94a3b8' }}><CloseIcon /></IconButton>
                </Box>
                <Box sx={{ flex: 1, height: 'calc(100vh - 64px)' }}><ChatPanel gameId={gameId} /></Box>
            </Drawer>

            {/* End Game Dialog */}
            <Dialog open={showEndGameDialog} onClose={() => setShowEndGameDialog(false)}
                PaperProps={{ sx: { bgcolor: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 'bold', color: '#e2e8f0' }}>End Game?</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">Are you sure? This will forfeit the match for all players.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setShowEndGameDialog(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
                    <Button onClick={handleEndGame} variant="contained" color="error" sx={{ borderRadius: 2 }}>End Game</Button>
                </DialogActions>
            </Dialog>

            {/* Completion Modal */}
            {game.state === 'COMPLETED' && (
                <Box sx={{
                    position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', 
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, rgba(0,0,0,0.9) 100%)', p: 3,
                }}>
                    <EmojiEventsIcon sx={{ fontSize: '6rem', color: '#ffd700', mb: 2, filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.5))' }} />
                    <Typography variant="h2" fontWeight="900" sx={{ 
                        background: 'linear-gradient(135deg, #ffd700, #ff8c00)', 
                        backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', 
                        textTransform: 'uppercase', mb: 1, fontSize: { xs: '2rem', md: '3.5rem' }, textAlign: 'center',
                    }}>
                        {winnerPlayer ? `${winnerPlayer.name} Wins!` : 'Game Over!'}
                    </Typography>
                    {totalPrize > 0 && (
                        <Typography variant="h5" sx={{ color: '#eab308', mb: 3, fontWeight: 700 }}>💰 Prize: {totalPrize} coins</Typography>
                    )}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                        <Button variant="contained" size="large" startIcon={<HomeIcon />} onClick={() => navigate('/')}
                            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 'bold', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                        >Dashboard</Button>
                        {game.roomCode && (
                            <Button variant="outlined" size="large" startIcon={<MeetingRoomIcon />}
                                onClick={() => navigate(`/room/${game.roomCode}`)}
                                sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.2)', color: '#e2e8f0',
                                    '&:hover': { borderColor: '#7c3aed', background: 'rgba(124,58,237,0.1)' } }}
                            >Back to Room</Button>
                        )}
                    </Stack>
                </Box>
            )}

            <FeedbackModal open={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
        </Box>
    );
};

export default GameBoard;
