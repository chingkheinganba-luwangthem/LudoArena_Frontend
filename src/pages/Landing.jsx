import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, Stack, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BusinessIcon from '@mui/icons-material/Business';
import InfoIcon from '@mui/icons-material/Info';
import ludoBg from '../assets/ludo-bg.jpg';

const Landing = () => {
    const navigate = useNavigate();

    const features = [
        { title: 'Multiplayer', desc: 'Play with up to 4 friends in private rooms with real-time WebSocket gameplay.', icon: <GroupIcon sx={{ fontSize: 40 }} /> },
        { title: 'Leaderboards', desc: 'Compete with players worldwide and climb the global rankings.', icon: <EmojiEventsIcon sx={{ fontSize: 40 }} /> },
        { title: 'Smooth Gameplay', desc: 'Optimized for low-latency WebSocket communication with zero lag.', icon: <SpeedIcon sx={{ fontSize: 40 }} /> },
        { title: 'Secure & Fair', desc: 'Server-side game logic ensures fair play for all players.', icon: <SecurityIcon sx={{ fontSize: 40 }} /> },
        { title: 'Cross-Platform', desc: 'Play on any device — desktop, tablet, or mobile. Fully responsive.', icon: <DevicesIcon sx={{ fontSize: 40 }} /> },
        { title: 'AI Bots', desc: 'Practice against AI opponents or fill empty slots with bots.', icon: <SportsEsportsIcon sx={{ fontSize: 40 }} /> },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'transparent', position: 'relative', overflow: 'hidden' }}>
            {/* Animated Background Orbs */}
            <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <Box sx={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
                <Box sx={{ position: 'absolute', bottom: '-15%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />
                <Box sx={{ position: 'absolute', top: '40%', left: '50%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', animation: 'float 12s ease-in-out infinite' }} />
            </Box>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 14 } }}>
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ animation: 'fadeInUp 0.8s ease-out' }}>
                            <Box sx={{
                                display: 'inline-block', px: 2, py: 0.5, mb: 3, borderRadius: 20,
                                background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)',
                            }}>
                                <Typography variant="caption" sx={{ color: '#a78bfa', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                    🎲 Real-Time Multiplayer
                                </Typography>
                            </Box>

                            <Typography variant="h2" component="h1" gutterBottom sx={{
                                fontWeight: 900, fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' }, lineHeight: 1.1,
                                background: 'linear-gradient(135deg, #e2e8f0 0%, #a78bfa 50%, #06b6d4 100%)',
                                backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            }}>
                                LudoArena
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 3, color: '#94a3b8', fontWeight: 500, fontSize: { xs: '1.1rem', md: '1.4rem' }, lineHeight: 1.5 }}>
                                The Ultimate Real-Time<br />Multiplayer Ludo Experience
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 5, color: '#64748b', fontSize: { xs: '0.95rem', md: '1.1rem' }, lineHeight: 1.7, maxWidth: 500 }}>
                                Play with friends, compete in global tournaments, and climb the leaderboard.
                                Experience Ludo like never before with stunning visuals and seamless real-time gameplay.
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button variant="contained" size="large" startIcon={<SportsEsportsIcon />} endIcon={<ArrowForwardIcon />}
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        px: 4, py: 1.8, fontSize: '1.05rem', borderRadius: 3, fontWeight: 700,
                                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                        boxShadow: '0 8px 25px rgba(124, 58, 237, 0.4)',
                                        '&:hover': { background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', transform: 'translateY(-2px)', boxShadow: '0 12px 35px rgba(124, 58, 237, 0.5)' },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Play Now
                                </Button>
                                <Button variant="outlined" size="large" onClick={() => navigate('/signup')}
                                    sx={{
                                        px: 4, py: 1.8, fontSize: '1.05rem', borderRadius: 3, fontWeight: 600,
                                        borderColor: 'rgba(124, 58, 237, 0.4)', color: '#a78bfa',
                                        '&:hover': { borderColor: '#7c3aed', background: 'rgba(124, 58, 237, 0.08)', transform: 'translateY(-2px)' },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    Get Started
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'relative', animation: 'fadeInUp 1s ease-out 0.2s backwards', display: 'flex', justifyContent: 'center' }}>
                            <Box sx={{
                                width: { xs: '85%', md: '90%' }, aspectRatio: '1/1', borderRadius: 6, overflow: 'hidden',
                                border: '3px solid rgba(124, 58, 237, 0.25)',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(124, 58, 237, 0.1)',
                                animation: 'float 6s ease-in-out infinite', background: '#0d0d12',
                            }}>
                                <img src={ludoBg} alt="Ludo Board" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </Box>
                            <Box sx={{ position: 'absolute', top: -20, right: { xs: 10, md: -10 }, fontSize: '3rem', animation: 'bounce 2s infinite', filter: 'drop-shadow(0 4px 20px rgba(124, 58, 237, 0.5))' }}>🎲</Box>
                            <Box sx={{ position: 'absolute', bottom: 20, left: { xs: 0, md: -20 }, fontSize: '2.5rem', animation: 'bounce 2.5s infinite 0.5s', filter: 'drop-shadow(0 4px 20px rgba(6, 182, 212, 0.5))' }}>🏆</Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Features Grid */}
                <Box sx={{ mt: { xs: 8, md: 14 } }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 800, mb: 2, background: 'linear-gradient(135deg, #e2e8f0, #a78bfa)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Why LudoArena?
                    </Typography>
                    <Typography variant="body1" sx={{ textAlign: 'center', color: '#64748b', mb: 6, maxWidth: 600, mx: 'auto' }}>
                        Built with cutting-edge technology for the best multiplayer Ludo experience
                    </Typography>
                    <Grid container spacing={3}>
                        {features.map((feature, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card sx={{
                                    height: '100%', borderRadius: 4, background: 'rgba(19, 19, 26, 0.7)',
                                    backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default',
                                    '&:hover': { transform: 'translateY(-8px)', border: '1px solid rgba(124, 58, 237, 0.25)', boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(124, 58, 237, 0.1)' },
                                    animation: `fadeInUp 0.6s ease-out ${0.1 * idx}s backwards`,
                                }}>
                                    <CardContent sx={{ p: 4 }}>
                                        <Box sx={{ mb: 2, width: 64, height: 64, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))', color: '#a78bfa' }}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#e2e8f0' }}>{feature.title}</Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>{feature.desc}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* About Section */}
                <Box id="about" sx={{ mt: { xs: 8, md: 14 } }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 800, mb: 2, background: 'linear-gradient(135deg, #e2e8f0, #06b6d4)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        About LudoArena
                    </Typography>
                    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
                        <Card sx={{ borderRadius: 4, background: 'rgba(19, 19, 26, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.06)', p: { xs: 3, md: 5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <InfoIcon sx={{ color: '#a78bfa', fontSize: 32 }} />
                                <Typography variant="h5" fontWeight="bold" sx={{ color: '#e2e8f0' }}>Our Mission</Typography>
                            </Box>
                            <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.8, mb: 3 }}>
                                LudoArena is a full-stack, real-time multiplayer Ludo web application built with modern technologies. 
                                Our goal is to bring the classic board game experience online with stunning visuals, seamless gameplay, 
                                and a competitive environment where players can challenge friends or compete globally.
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#94a3b8', lineHeight: 1.8, mb: 3 }}>
                                Built with Spring Boot, React, WebSockets, and Material UI, LudoArena delivers a premium gaming experience 
                                with features like real-time chat, AI opponents, coin-based betting, leaderboards, and cross-platform support.
                            </Typography>
                            <Grid container spacing={3} sx={{ mt: 2 }}>
                                {[
                                    { label: 'Tech Stack', value: 'Spring Boot + React + WebSocket' },
                                    { label: 'Players', value: 'Up to 4 per game' },
                                    { label: 'AI Bots', value: 'Smart computer opponents' },
                                    { label: 'Platform', value: 'Web (Desktop & Mobile)' },
                                ].map((item, i) => (
                                    <Grid item xs={6} sm={3} key={i}>
                                        <Box sx={{ textAlign: 'center', p: 2, borderRadius: 3, bgcolor: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
                                            <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</Typography>
                                            <Typography variant="body2" sx={{ color: '#a78bfa', fontWeight: 700, mt: 0.5 }}>{item.value}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>
                    </Box>
                </Box>

                {/* Play Now For Free CTA */}
                <Box sx={{
                    mt: { xs: 8, md: 14 }, py: 6, px: 4, textAlign: 'center', borderRadius: 5,
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: 2 }}>
                        🎲 Play Now For Free!
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4, maxWidth: 500, mx: 'auto' }}>
                        Join thousands of players already battling it out on LudoArena. Your next victory awaits.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button variant="contained" size="large" startIcon={<SportsEsportsIcon />}
                            onClick={() => navigate('/signup')}
                            sx={{ px: 5, py: 1.8, borderRadius: 3, fontWeight: 700, fontSize: '1.05rem' }}
                        >
                            Create Free Account
                        </Button>
                        <Button variant="outlined" size="large" onClick={() => navigate('/login')}
                            sx={{
                                px: 4, py: 1.8, borderRadius: 3, fontWeight: 600,
                                borderColor: 'rgba(255,255,255,0.15)', color: '#e2e8f0',
                                '&:hover': { borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            Login
                        </Button>
                    </Stack>
                </Box>

                {/* Contact Section */}
                <Box id="contact" sx={{ mt: { xs: 8, md: 14 } }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 800, mb: 6, background: 'linear-gradient(135deg, #e2e8f0, #f59e0b)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Contact Us
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{
                                borderRadius: 4, background: 'rgba(19, 19, 26, 0.7)', backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.06)', p: 4, textAlign: 'center',
                                transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 15px 30px rgba(0,0,0,0.3)' }
                            }}>
                                <BusinessIcon sx={{ fontSize: 48, color: '#a78bfa', mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold" sx={{ color: '#e2e8f0', mb: 1 }}>Business Inquiry</Typography>
                                <Typography variant="body1" sx={{ color: '#06b6d4', fontWeight: 600 }}>
                                    business@ludoarena.com
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={5}>
                            <Card sx={{
                                borderRadius: 4, background: 'rgba(19, 19, 26, 0.7)', backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.06)', p: 4, textAlign: 'center',
                                transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 15px 30px rgba(0,0,0,0.3)' }
                            }}>
                                <SupportAgentIcon sx={{ fontSize: 48, color: '#22c55e', mb: 2 }} />
                                <Typography variant="h6" fontWeight="bold" sx={{ color: '#e2e8f0', mb: 1 }}>Customer Support</Typography>
                                <Typography variant="body1" sx={{ color: '#06b6d4', fontWeight: 600 }}>
                                    support@ludoarena.com
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Footer */}
                <Box sx={{ mt: { xs: 8, md: 14 }, pt: 6, pb: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Grid container spacing={4} justifyContent="center" alignItems="center">
                        <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                <SportsEsportsIcon sx={{ color: '#a78bfa', fontSize: 28 }} />
                                <Typography variant="h6" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #e2e8f0, #a78bfa)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    LudoArena
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#475569', mt: 1 }}>
                                The ultimate multiplayer Ludo experience.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <Stack direction="row" spacing={3} justifyContent="center">
                                <Typography variant="body2" sx={{ color: '#64748b', cursor: 'pointer', '&:hover': { color: '#a78bfa' }, transition: 'color 0.2s' }} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                                    About
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', cursor: 'pointer', '&:hover': { color: '#a78bfa' }, transition: 'color 0.2s' }}>
                                    Features
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', cursor: 'pointer', '&:hover': { color: '#a78bfa' }, transition: 'color 0.2s' }} onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                                    Contact
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b', cursor: 'pointer', '&:hover': { color: '#a78bfa' }, transition: 'color 0.2s' }}>
                                    Privacy Policy
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                            <Typography variant="body2" sx={{ color: '#475569' }}>
                                © 2026 LudoArena. All Rights Reserved.
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#334155', display: 'block', mt: 0.5 }}>
                                Created by chingkheinganba Luwangthem
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
};

export default Landing;
