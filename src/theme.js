import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#4dabf5',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        // Ludo colors for token / player representations
        ludo: {
            red: '#f44336',
            blue: '#2196f3',
            green: '#4caf50',
            yellow: '#ffeb3b',
        }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(30, 30, 30, 0.8)',
                    backdropFilter: 'blur(10px)',
                },
            },
        },
    },
});

export default theme;
