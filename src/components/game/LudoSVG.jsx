import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Box } from '@mui/material';
import ludoBg from '../../assets/ludo-bg.jpg';
import { playMoveSound, playKillSound, playFinishSound, playStarSound } from '../../utils/soundEffects';

// EXACT LudoMaster Proportions for perfect token alignment on the ludo-bg.jpg background
const TRACK_SIZE = 52;
const STEP_LENGTH = 100 / 15; // 6.6666%

// Star positions (safes) on the standard board
const STAR_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

// Exact pixel-perfect 15x15 Grid Coordinates mapped to ludo-bg.jpg
const COORDINATES_MAP = {
    // MAIN TRACK (Starts Blue, Goes Clockwise)
    0: [6.5, 13.5], 1: [6.5, 12.5], 2: [6.5, 11.5], 3: [6.5, 10.5], 4: [6.5, 9.5],
    5: [5.5, 8.5], 6: [4.5, 8.5], 7: [3.5, 8.5], 8: [2.5, 8.5], 9: [1.5, 8.5], 10: [0.5, 8.5],
    11: [0.5, 7.5], 12: [0.5, 6.5],
    13: [1.5, 6.5], 14: [2.5, 6.5], 15: [3.5, 6.5], 16: [4.5, 6.5], 17: [5.5, 6.5],
    18: [6.5, 5.5], 19: [6.5, 4.5], 20: [6.5, 3.5], 21: [6.5, 2.5], 22: [6.5, 1.5], 23: [6.5, 0.5],
    24: [7.5, 0.5], 25: [8.5, 0.5],
    26: [8.5, 1.5], 27: [8.5, 2.5], 28: [8.5, 3.5], 29: [8.5, 4.5], 30: [8.5, 5.5],
    31: [9.5, 6.5], 32: [10.5, 6.5], 33: [11.5, 6.5], 34: [12.5, 6.5], 35: [13.5, 6.5], 36: [14.5, 6.5],
    37: [14.5, 7.5], 38: [14.5, 8.5],
    39: [13.5, 8.5], 40: [12.5, 8.5], 41: [11.5, 8.5], 42: [10.5, 8.5], 43: [9.5, 8.5],
    44: [8.5, 9.5], 45: [8.5, 10.5], 46: [8.5, 11.5], 47: [8.5, 12.5], 48: [8.5, 13.5], 49: [8.5, 14.5],
    50: [7.5, 14.5], 51: [6.5, 14.5],

    // HOME ENTRANCES
    100: [7.5, 13.5], 101: [7.5, 12.5], 102: [7.5, 11.5], 103: [7.5, 10.5], 104: [7.5, 9.5], 105: [7.5, 8.5], // BLUE (Bottom up to center)
    200: [7.5, 1.5], 201: [7.5, 2.5], 202: [7.5, 3.5], 203: [7.5, 4.5], 204: [7.5, 5.5], 205: [7.5, 6.5], // GREEN (Top down to center)
    300: [1.5, 7.5], 301: [2.5, 7.5], 302: [3.5, 7.5], 303: [4.5, 7.5], 304: [5.5, 7.5], 305: [6.5, 7.5], // YELLOW (Left right to center)
    400: [13.5, 7.5], 401: [12.5, 7.5], 402: [11.5, 7.5], 403: [10.5, 7.5], 404: [9.5, 7.5], 405: [8.5, 7.5], // RED (Right left to center)

    // BASE POSITIONS mapped perfectly to ludo-bg.jpg inner white circles
    // Blue (Bottom Left Base)
    500: [2.49, 11.49], 501: [4.19, 11.49], 502: [2.49, 13.19], 503: [4.19, 13.19], 
    // Yellow (Top Left Base)
    600: [2.49, 2.49], 601: [4.19, 2.49], 602: [2.49, 4.19], 603: [4.19, 4.19],
    // Red (Bottom Right Base)
    700: [11.49, 11.49], 701: [13.19, 11.49], 702: [11.49, 13.19], 703: [13.19, 13.19],
    // Green (Top Right Base)
    800: [11.49, 2.49], 801: [13.19, 2.49], 802: [11.49, 4.19], 803: [13.19, 4.19],

    // FINISH POSITIONS (Each in its own colored triangle, not all at center)
    105: [7.5, 8.5], // BLUE finish (bottom triangle)
    205: [7.5, 6.5], // GREEN finish (top triangle)
    305: [6.5, 7.5], // YELLOW finish (left triangle)
    405: [8.5, 7.5]  // RED finish (right triangle)
};

const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};

const getBasePositionCode = (color, index) => {
    switch(color) {
        case 'BLUE': return 500 + index;
        case 'YELLOW': return 600 + index;
        case 'RED': return 700 + index;
        case 'GREEN': return 800 + index;
        default: return 500 + index;
    }
};

const preparePositions = (tokenPositions, color) => {
    const arr = Array.isArray(tokenPositions) ? tokenPositions : tokenPositions.split(',').map(Number);
    return arr.map((pos, idx) => pos === -1 ? getBasePositionCode(color, idx) : pos);
};

const getNextPosition = (currentPos, color) => {
    if (currentPos >= 500) {
        if (color === 'RED') return 39;
        if (color === 'GREEN') return 26;
        if (color === 'YELLOW') return 13;
        if (color === 'BLUE') return 0;
    }

    if (color === 'RED' && currentPos === 37) return 400; // Entering RED Home
    if (color === 'GREEN' && currentPos === 24) return 200; // Entering GREEN Home
    if (color === 'YELLOW' && currentPos === 11) return 300; // Entering YELLOW Home
    if (color === 'BLUE' && currentPos === 50) return 100; // Entering BLUE Home

    // Progressing in home stretch
    if (currentPos >= 100 && currentPos < 105) return currentPos + 1;
    if (currentPos >= 200 && currentPos < 205) return currentPos + 1;
    if (currentPos >= 300 && currentPos < 305) return currentPos + 1;
    if (currentPos >= 400 && currentPos < 405) return currentPos + 1;

    // Standard track progression
    if (currentPos < 51) return (currentPos + 1);
    if (currentPos === 51) return 0;

    return currentPos;
};

const LudoSVG = ({ game, onMoveClick, validMoves, currentTurnColor, diceResult, lastMove }) => {
    // Flat LudoMaster colors mapping and border colors
    const colorHex = { RED: '#ff141c', BLUE: '#2eafff', GREEN: '#00b550', YELLOW: '#ffd200' };
    const strokeHex = { RED: '#fff', BLUE: '#fff', GREEN: '#fff', YELLOW: '#fff' };
    
    const [animatingPositions, setAnimatingPositions] = useState({});
    const prevGameRef = useRef(null);
    const processedMoves = useRef(new Set()); // Track processed moves to prevent double-animation
    const animatingRef = useRef(new Set()); // Track currently animating tokens

    useLayoutEffect(() => {
        if (!game || !game.players) return;
        const prevGame = prevGameRef.current;
        
        if (prevGame) {
            game.players.forEach((player) => {
                const prevPlayer = prevGame.players.find(p => p.userId === player.userId);
                if (!prevPlayer) return;

                const currentPos = preparePositions(player.tokenPositions, player.color);
                const prevPos = preparePositions(prevPlayer.tokenPositions, prevPlayer.color);

                currentPos.forEach((pos, tIdx) => {
                    const moveKey = `${player.userId}-${tIdx}-${prevPos[tIdx]}-${pos}`;
                    const tokenKey = `${player.userId}-${tIdx}`;
                    
                    // Only animate if position changed AND not already processed/animating
                    if (pos !== prevPos[tIdx] && !processedMoves.current.has(moveKey) && !animatingRef.current.has(tokenKey)) {
                        processedMoves.current.add(moveKey);
                        // Synchronously set to start position before browser paints!
                        setAnimatingPositions(prev => ({ ...prev, [tokenKey]: prevPos[tIdx] }));
                        
                        // Fire the async animation
                        animateToken(player.userId, tIdx, prevPos[tIdx], pos, player.color);
                    }
                });
            });
        }
        
        // Update prev game ref AFTER processing
        prevGameRef.current = JSON.parse(JSON.stringify(game));
        
        // Clean up old processed moves (keep last 50)
        if (processedMoves.current.size > 50) {
            const arr = Array.from(processedMoves.current);
            processedMoves.current = new Set(arr.slice(-25));
        }
    }, [game]);

    const animateToken = async (userId, tokenIndex, startPos, endPos, color) => {
        const tokenKey = `${userId}-${tokenIndex}`;
        
        // Mark as animating to prevent concurrent animations
        animatingRef.current.add(tokenKey);
        
        const cleanup = () => {
            animatingRef.current.delete(tokenKey);
            setAnimatingPositions(prev => {
                const next = { ...prev };
                delete next[tokenKey];
                return next;
            });
        };

        try {
            // Handle Base -> Track (Spawn)
            if (startPos >= 500 && endPos < 500) {
                await playMoveSound();
                setAnimatingPositions(prev => ({ ...prev, [tokenKey]: endPos }));
                if (STAR_POSITIONS.includes(endPos)) setTimeout(() => playStarSound(), 200);
                setTimeout(cleanup, 500);
                return;
            }

            // Handle Track -> Base (Killed)
            if (endPos >= 500 && startPos < 500) {
                await playKillSound();
                setAnimatingPositions(prev => ({ ...prev, [tokenKey]: endPos }));
                setTimeout(cleanup, 300);
                return;
            }

            // Stepping animation for track and home exactly like Ludo King
            let current = startPos;
            let steps = 0;
            const maxSteps = 60; // Safety limit
            while (current !== endPos && steps < maxSteps) {
                current = getNextPosition(current, color);
                steps++;
                setAnimatingPositions(prev => ({ ...prev, [tokenKey]: current }));
                
                const isLastStep = current === endPos;
                const isHomeFinished = isLastStep && lastMove?.isHome && Number(lastMove.userId) === Number(userId) && lastMove.tokenIndex === tokenIndex;
                
                if (!isHomeFinished) {
                    await playMoveSound();
                }
                
                await new Promise(r => setTimeout(r, 200)); 
            }

            if (endPos === 105 || endPos === 205 || endPos === 305 || endPos === 405) {
                await playFinishSound();
            } else if (STAR_POSITIONS.includes(endPos)) {
                await playStarSound();
            } else if (lastMove && lastMove.tokenIndex === tokenIndex && lastMove.isKill) {
                await playKillSound();
            }

            setTimeout(cleanup, 150);
        } catch (e) {
            console.warn('Animation error:', e);
            cleanup();
        }
    };

    if (!game || !game.players) return null;

    const allTokens = [];
    game.players.forEach(player => {
        if (!player || !player.tokenPositions) return;
        const positions = preparePositions(player.tokenPositions, player.color);

        positions.forEach((pos, tIdx) => {
            const displayedPos = animatingPositions[`${player.userId}-${tIdx}`] !== undefined 
                ? animatingPositions[`${player.userId}-${tIdx}`] 
                : pos;

            allTokens.push({
                player,
                pos: displayedPos,
                actualPos: pos,
                tokenIndex: tIdx,
                groupId: (displayedPos < TRACK_SIZE || (displayedPos >= 100 && displayedPos < 500)) ? `TRACK-${displayedPos}` : `OTHER-${(player.color || '').toUpperCase()}-${displayedPos}`,
                color: (player.color || '').toUpperCase()
            });
        });
    });

    const groups = allTokens.reduce((acc, token) => {
        if (!acc[token.groupId]) acc[token.groupId] = [];
        acc[token.groupId].push(token);
        return acc;
    }, {});

    return (
        <Box className="ludo-container" sx={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
        }}>
            <Box className="ludo" sx={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative',
                backgroundImage: `url(${ludoBg})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}>

                
                {/* Tokens Layer */}
                <Box className="player-pieces" sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {Object.keys(groups).map(groupId => {
                        const tokens = groups[groupId];
                        const count = tokens.length;
                        
                        return tokens.map((token, idx) => {
                            const coord = COORDINATES_MAP[token.pos] || COORDINATES_MAP[500];
                            
                            // Stack tokens elegantly if multiple on same spot
                            let dLeft = 0, dTop = 0;
                            let scale = 1;

                            if (count > 1 && token.pos < 500) {
                                scale = 0.85; // Shrink slightly
                                if (count === 2) {
                                    dLeft = idx === 0 ? -0.8 : 0.8;
                                    dTop = idx === 0 ? -0.8 : 0.8;
                                } else if (count === 3) {
                                    dLeft = idx === 0 ? 0 : idx === 1 ? -1 : 1;
                                    dTop = idx === 0 ? -1 : 0.8;
                                } else if (count >= 4) {
                                    dLeft = idx % 2 === 0 ? -0.9 : 0.9;
                                    dTop = idx < 2 ? -0.9 : 0.9;
                                }
                            }

                            const isMyTurn = (token.color === currentTurnColor) && diceResult !== null;
                            const isValid = isMyTurn && (validMoves.includes(token.tokenIndex) || token.pos >= 500 && diceResult === 6);
                            
                            return (
                                <Box 
                                    className="player-piece-wrapper"
                                    key={`token-${token.color}-${token.tokenIndex}`}
                                    style={{
                                        position: 'absolute',
                                        width: '5.2%',
                                        height: '5.2%',
                                        transform: `translate(-50%, -50%) scale(${scale})`,
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        pointerEvents: 'auto',
                                        left: `${coord[0] * STEP_LENGTH + dLeft}%`,
                                        top: `${coord[1] * STEP_LENGTH + dTop}%`,
                                        zIndex: isValid ? 100 : 10 + idx + (token.pos >= 100 ? 50 : 0)
                                    }}
                                >
                                    {/* Flat Ludo Token Styling */}
                                    <Box className={`player-piece ${isValid ? 'highlight' : ''}`}
                                         onClick={() => isValid && onMoveClick(token.tokenIndex, token.color)}
                                         style={{
                                             backgroundColor: colorHex[token.color] || '#ccc',
                                             width: '100%',
                                             height: '100%',
                                             borderRadius: '50%',
                                             position: 'absolute',
                                             cursor: isValid ? 'pointer' : 'default',
                                             pointerEvents: 'auto',
                                             border: `2px solid ${strokeHex[token.color] || '#fff'}`,
                                             boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                                             filter: isValid ? `drop-shadow(0 0 10px ${colorHex[token.color]})` : 'none',
                                             animation: isValid ? 'piece-pulse 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                                         }}
                                    >
                                    </Box>
                                    
                                    {count > 4 && idx === 0 && (
                                        <Box className="piece-count-badge" style={{ backgroundColor: strokeHex[token.color], boxShadow: `0 0 8px ${strokeHex[token.color]}` }}>
                                            {count}
                                        </Box>
                                    )}
                                </Box>
                            );
                        });
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default LudoSVG;
