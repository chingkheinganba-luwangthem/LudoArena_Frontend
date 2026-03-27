import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { playDiceSound } from '../../utils/soundEffects';

const LudoDice = ({ value, rolling, color = '#1976d2' }) => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const isFirstRender = useRef(true);

    // Face rotations to show specific numbers
    const faceRotations = {
        1: { x: 0, y: 0 },
        2: { x: 0, y: 180 },
        3: { x: 0, y: -90 },
        4: { x: 0, y: 90 },
        5: { x: -90, y: 0 },
        6: { x: 90, y: 0 }
    };

    useEffect(() => {
        if (rolling) {
            // Start a wild rotation
            const interval = setInterval(() => {
                playDiceSound();
                setRotation({
                    x: Math.floor(Math.random() * 360),
                    y: Math.floor(Math.random() * 360)
                });
            }, 100);
            return () => clearInterval(interval);
        } else if (value && faceRotations[value]) {
            // Snap to the result face
            setRotation(faceRotations[value]);
        }
    }, [rolling, value]);

    const DiceFace = ({ num, rotateX = 0, rotateY = 0, translateZ = 30 }) => (
        <Box sx={{
            position: 'absolute',
            width: 60,
            height: 60,
            bgcolor: '#fff',
            border: `2px solid ${color}`,
            borderRadius: 1,
            display: 'flex',
            flexWrap: 'wrap',
            p: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backfaceVisibility: 'hidden',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
        }}>
            {/* Dots */}
            {Array.from({ length: num }).map((_, i) => (
                <Box key={i} sx={{
                    width: num === 1 ? 15 : 10,
                    height: num === 1 ? 15 : 10,
                    bgcolor: color,
                    borderRadius: '50%',
                    m: 0.5
                }} />
            ))}
        </Box>
    );

    return (
        <Box sx={{ 
            perspective: '1000px', 
            width: 80, 
            height: 80, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}>
            <Box sx={{
                width: 60,
                height: 60,
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: rolling ? 'none' : 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <DiceFace num={1} />
                <DiceFace num={2} rotateY={180} />
                <DiceFace num={3} rotateY={90} />
                <DiceFace num={4} rotateY={-90} />
                <DiceFace num={5} rotateX={90} />
                <DiceFace num={6} rotateX={-90} />
            </Box>
        </Box>
    );
};

export default LudoDice;
