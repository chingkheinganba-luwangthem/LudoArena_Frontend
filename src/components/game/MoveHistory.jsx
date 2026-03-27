import React, { useState } from 'react';
import { Box, Card, Typography, IconButton, List, ListItem, ListItemText, Divider, Stack } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HistoryIcon from '@mui/icons-material/History';

const MoveHistory = ({ moveHistory }) => {
    const [viewIndex, setViewIndex] = useState(moveHistory.length - 1);

    React.useEffect(() => {
        setViewIndex(moveHistory.length - 1);
    }, [moveHistory.length]);

    const handleBack = () => {
        if (viewIndex > 0) setViewIndex(viewIndex - 1);
    };

    const handleForward = () => {
        if (viewIndex < moveHistory.length - 1) setViewIndex(viewIndex + 1);
    };

    return (
        <Card className="glass-panel" sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 280 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <HistoryIcon sx={{ color: '#a78bfa' }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#e2e8f0' }}>Move History</Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton size="small" onClick={handleBack} disabled={viewIndex <= 0} sx={{ color: '#94a3b8', '&:hover': { color: '#a78bfa' } }}>
                        <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#94a3b8', px: 0.5 }}>
                        {moveHistory.length > 0 ? `${viewIndex + 1}/${moveHistory.length}` : '0/0'}
                    </Typography>
                    <IconButton size="small" onClick={handleForward} disabled={viewIndex >= moveHistory.length - 1} sx={{ color: '#94a3b8', '&:hover': { color: '#a78bfa' } }}>
                        <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                </Stack>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: 'rgba(0,0,0,0.1)' }}>
                <List dense>
                    {moveHistory.slice().reverse().map((move, idx) => {
                        const actualIdx = moveHistory.length - 1 - idx;
                        const isSelected = actualIdx === viewIndex;
                        
                        return (
                            <React.Fragment key={idx}>
                                <ListItem 
                                    sx={{ 
                                        bgcolor: isSelected ? 'rgba(124,58,237,0.1)' : 'transparent',
                                        borderLeft: isSelected ? '3px solid #7c3aed' : '3px solid transparent',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'rgba(124,58,237,0.05)' },
                                    }}
                                    onClick={() => setViewIndex(actualIdx)}
                                >
                                    <ListItemText 
                                        primary={
                                            <Typography variant="body2" fontWeight={isSelected ? 'bold' : 'normal'} sx={{ color: '#e2e8f0' }}>
                                                {move.playerName} moved Token {move.tokenIndex + 1}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                🎲 {move.diceValue} | {move.isKill ? '⚔️ Kill!' : move.isHome ? '🏁 Home!' : 'Moved'}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />
                            </React.Fragment>
                        );
                    })}
                    {moveHistory.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>No moves yet in this match.</Typography>
                        </Box>
                    )}
                </List>
            </Box>
        </Card>
    );
};

export default MoveHistory;
