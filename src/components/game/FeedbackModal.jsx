import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Rating, TextField, Button, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import api from '../../services/api';

const FeedbackModal = ({ open, onClose }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post('/feedback', { rating, comment });
            setSubmitted(true);
            setTimeout(() => {
                onClose();
                setSubmitted(false);
                setComment('');
                setRating(5);
            }, 2000);
        } catch (err) {
            console.error('Failed to submit feedback', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, bgcolor: '#13131a', border: '1px solid rgba(255,255,255,0.1)', p: 1 } }}>
            {submitted ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight="bold" color="#22c55e" gutterBottom>🎉 Thank You!</Typography>
                    <Typography color="text.secondary">We value your opinion. Your feedback helps us make LudoArena better.</Typography>
                </Box>
            ) : (
                <>
                    <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
                        <Typography variant="h5" fontWeight="900" sx={{ color: '#e2e8f0' }}>We value your opinion.</Typography>
                    </DialogTitle>
                    <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>How would you rate your overall experience?</Typography>
                        <Rating
                            value={rating}
                            onChange={(event, newValue) => setRating(newValue)}
                            icon={<StarIcon sx={{ fontSize: 36, color: '#ffd700' }} />}
                            emptyIcon={<StarIcon sx={{ fontSize: 36, color: 'rgba(255,255,255,0.1)' }} />}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, mb: 1 }}>Kindly take a moment to tell us what you think.</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Your feedback (optional)..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            sx={{ 
                                bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2,
                                '& .MuiOutlinedInput-root': { color: '#e2e8f0', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' } }
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                        <Button 
                            variant="contained" 
                            fullWidth 
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading || !rating}
                            sx={{ 
                                borderRadius: 3, fontWeight: 'bold', py: 1.5,
                                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                '&:hover': { background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Share my feedback'}
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default FeedbackModal;
