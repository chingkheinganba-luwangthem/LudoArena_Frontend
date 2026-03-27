import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import RoomLobby from './pages/RoomLobby';
import GameBoard from './pages/GameBoard';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import { useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🌙 Premium Dark Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' },
    secondary: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
    background: { default: '#0a0a0f', paper: '#13131a' },
    text: { primary: '#e2e8f0', secondary: '#94a3b8' },
    error: { main: '#ef4444' },
    success: { main: '#22c55e' },
    warning: { main: '#f59e0b' },
    divider: 'rgba(255,255,255,0.06)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(19, 19, 26, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            boxShadow: '0 6px 20px rgba(124, 58, 237, 0.4)',
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255,255,255,0.03)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(124, 58, 237, 0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#7c3aed' },
          },
          '& .MuiInputLabel-root': { color: '#94a3b8' },
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'rgba(19, 19, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: 'rgba(19, 19, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 10, 15, 0.8)',
          backdropFilter: 'blur(20px)',
        }
      }
    }
  }
});

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#7c3aed', fontSize: '1.2rem' }}>Loading...</div>;
  if (!user) return <Navigate to="/landing" replace />;
  return children;
};

function App() {
  const { token, user } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GameProvider token={token} user={user}>
        <Router>
          <Navbar />
          <ToastContainer position="top-right" theme="dark" />
          <Routes>
            {/* Public Routes */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/room/:roomCode" element={<ProtectedRoute><RoomLobby /></ProtectedRoute>} />
            <Route path="/game/:gameId" element={<ProtectedRoute><GameBoard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/landing" replace />} />
          </Routes>
        </Router>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
