import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { playDiceSound, playMoveSound, playWinSound, playStartSound, playFinishSound } from '../utils/soundEffects';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children, token, user }) => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [room, setRoom] = useState(null);
    const [game, setGame] = useState(null);
    const [diceResult, setDiceResult] = useState(null);
    const [isRolling, setIsRolling] = useState(false);
    const [validMoves, setValidMoves] = useState([]);
    const [lastMove, setLastMove] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const pendingRoom = useRef(null);
    const subscriptions = useRef({});

    useEffect(() => {
        if (!token) return;
        const client = new Client({
            webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL || 'http://localhost:8091/ws'),
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });
        client.onConnect = () => { setConnected(true); setStompClient(client); };
        client.activate();
        return () => client.deactivate();
    }, [token]);

    const moveToken = useCallback((gameId, userId, diceValue, tokenIndex) => {
        if (stompClient?.connected) {
            stompClient.publish({
                destination: `/app/game/${gameId}/move`,
                body: JSON.stringify({ userId, diceValue, tokenIndex })
            });
        }
    }, [stompClient]);

    const subscribeToGame = useCallback((client, gameId) => {
        if (subscriptions.current.gameState) subscriptions.current.gameState.unsubscribe();
        if (subscriptions.current.gameDice) subscriptions.current.gameDice.unsubscribe();
        if (subscriptions.current.gameMoves) subscriptions.current.gameMoves.unsubscribe();
        if (subscriptions.current.gameChat) subscriptions.current.gameChat.unsubscribe();

        subscriptions.current.gameState = client.subscribe(`/topic/game/${gameId}`, (msg) => {
            const data = JSON.parse(msg.body);
            if (data.type === 'DICE_ROLL') {
                setIsRolling(true); setDiceResult(null); setValidMoves(data.validMoves || []);
                playDiceSound();
                setTimeout(() => { setIsRolling(false); setDiceResult(data.diceValue); }, 800);
            } else {
                setGame(prevGame => {
                    // Trigger sound effects if state transitioned
                    if (data.state === 'IN_PROGRESS' && (!prevGame || prevGame.state !== 'IN_PROGRESS')) {
                        playStartSound();
                    }
                    if (data.state === 'COMPLETED' && (!prevGame || prevGame.state !== 'COMPLETED')) {
                        playWinSound();
                    }
                    return data;
                });
                setIsRolling(false); setDiceResult(null); setValidMoves([]); setLastMove(null); 
            }
        });

        subscriptions.current.gameDice = client.subscribe(`/topic/game/${gameId}/dice`, (msg) => {
            const data = JSON.parse(msg.body);
            setDiceResult(data.diceValue);
            const moves = data.validMoves || [];
            setValidMoves(moves);
            if (moves.length === 1 && Number(data.currentTurnUserId) === Number(user?.id)) {
                setTimeout(() => moveToken(gameId, user.id, data.diceValue, moves[0].tokenIndex), 1000);
            }
        });

        subscriptions.current.gameMoves = client.subscribe(`/topic/game/${gameId}/move`, (msg) => {
            const moveData = JSON.parse(msg.body);
            setLastMove(moveData);
            setMoveHistory(prev => [...prev.slice(-19), moveData]); // Keep last 20 for performance
            setValidMoves([]);
        });

        subscriptions.current.gameChat = client.subscribe(`/topic/game/${gameId}/chat`, (msg) => {
            setChatMessages(prev => [...prev, JSON.parse(msg.body)]);
        });
    }, [user, moveToken, game]);

    const subscribeToRoom = useCallback((client, roomData) => {
        if (subscriptions.current.room) subscriptions.current.room.unsubscribe();
        subscriptions.current.room = client.subscribe(`/topic/room/${roomData.roomCode}`, (msg) => {
            const data = JSON.parse(msg.body);
            if (data.state) { 
                if (data.state === 'IN_PROGRESS') {
                    // This triggers the sound for ALL players in the room (including Admin)
                    playStartSound();
                }
                setGame(data); 
                subscribeToGame(client, data.id); 
            }
            else {
                setRoom(data);
            }
        });
    }, [subscribeToGame]);

    const connectToRoom = useCallback((roomData) => {
        setRoom(roomData);
        if (stompClient?.connected) subscribeToRoom(stompClient, roomData);
        else pendingRoom.current = roomData;
    }, [stompClient, subscribeToRoom]);

    const connectToGame = useCallback((gameId) => {
        if (stompClient?.connected) subscribeToGame(stompClient, gameId);
    }, [stompClient, subscribeToGame]);

    useEffect(() => {
        if (connected && stompClient && pendingRoom.current) {
            subscribeToRoom(stompClient, pendingRoom.current);
            pendingRoom.current = null;
        }
    }, [connected, stompClient, subscribeToRoom]);

    const rollDice = useCallback((gameId, userId) => {
        if (stompClient?.connected) {
            stompClient.publish({ destination: `/app/game/${gameId}/roll-dice`, body: JSON.stringify({ userId }) });
        }
    }, [stompClient]);

    const skipTurn = useCallback((gameId, userId) => {
        if (stompClient?.connected) {
            stompClient.publish({
                destination: `/app/game/${gameId}/skip-turn`,
                body: JSON.stringify({ userId })
            });
        }
    }, [stompClient]);

    const sendChat = useCallback((gameId, userId, message) => {
        if (stompClient?.connected) {
            stompClient.publish({
                destination: `/app/game/${gameId}/chat`,
                body: JSON.stringify({ userId, message, messageType: 'TEXT' })
            });
        }
    }, [stompClient]);

    const endGame = useCallback((gameId, userId) => {
        if (stompClient?.connected) {
            stompClient.publish({
                destination: `/app/game/${gameId}/end-game`,
                body: JSON.stringify({ userId })
            });
        }
    }, [stompClient]);

    return (
        <GameContext.Provider value={{ 
            stompClient, connected, room, setRoom, connectToRoom, game, setGame, 
            connectToGame, diceResult, isRolling, validMoves, lastMove, moveHistory, chatMessages, 
            rollDice, moveToken, skipTurn, sendChat, endGame 
        }}>
            {children}
        </GameContext.Provider>
    );
};
