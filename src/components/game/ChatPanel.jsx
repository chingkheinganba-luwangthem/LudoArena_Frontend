import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, TextField, IconButton, Paper, Divider, Menu, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';

const EMOJIS = ['🎲', '👑', '🔥', '😂', '👍', '👎', '👋', '🎉', '😢', '😮', '😡', '🤝'];

const ChatPanel = ({ gameId }) => {
    const { user } = useAuth();
    const { chatMessages, sendChat } = useGame();
    const [message, setMessage] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const chatEndRef = React.useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        sendChat(gameId, user.id, message);
        setMessage('');
    };

    const handleEmojiClick = (emoji) => {
        setMessage(prev => prev + emoji);
        setAnchorEl(null);
    };

    return (
        <Card className="glass-panel" sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 350 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#e2e8f0' }}>💬 Game Chat</Typography>
            </Box>

            <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'rgba(0,0,0,0.15)' }}>
                {chatMessages.map((msg, idx) => {
                    const isMine = msg.userId === user.id;
                    return (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                            <Paper sx={{ 
                                p: 1.5, 
                                maxWidth: '80%', 
                                borderRadius: 3,
                                bgcolor: isMine ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.05)',
                                color: '#e2e8f0',
                                borderBottomRightRadius: isMine ? 0 : 12,
                                borderBottomLeftRadius: isMine ? 12 : 0,
                                border: isMine ? '1px solid rgba(124,58,237,0.2)' : '1px solid rgba(255,255,255,0.06)',
                                boxShadow: 'none',
                            }}>
                                {!isMine && (
                                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#a78bfa', display: 'block', mb: 0.5 }}>
                                        {msg.userName || 'Player'}
                                    </Typography>
                                )}
                                <Typography variant="body2" sx={{ color: '#e2e8f0' }}>{msg.message || ''}</Typography>
                                <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.5, display: 'block', textAlign: 'right', mt: 0.5, color: '#94a3b8' }}>
                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </Typography>
                            </Paper>
                        </Box>
                    );
                })}
                <div ref={chatEndRef} />
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            <Box component="form" onSubmit={handleSend} sx={{ p: 1.5, display: 'flex', alignItems: 'center' }}>
                <IconButton 
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{ mr: 1, color: '#94a3b8', '&:hover': { color: '#a78bfa' } }}
                >
                    <EmojiEmotionsIcon />
                </IconButton>
                
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.5, p: 1 }}>
                        {EMOJIS.map(emoji => (
                            <IconButton key={emoji} onClick={() => handleEmojiClick(emoji)} size="small" sx={{ fontSize: '1.2rem' }}>
                                {emoji}
                            </IconButton>
                        ))}
                    </Box>
                </Menu>

                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ 
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'rgba(255,255,255,0.03)',
                            borderRadius: 4,
                            color: '#e2e8f0',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
                            '&:hover fieldset': { borderColor: 'rgba(124,58,237,0.3)' },
                        }
                    }}
                />
                <IconButton type="submit" sx={{ ml: 1, color: message.trim() ? '#7c3aed' : '#64748b' }} disabled={!message.trim()}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Card>
    );
};

export default ChatPanel;
