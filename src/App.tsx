import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import { initSocket, disconnectSocket } from './socket/socket';
import { queryClient } from './api/queryClient';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo
    },
    secondary: {
      main: '#ec4899', // Pink
    },
    background: {
      default: '#0f111a',
      paper: '#161c2d',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
    action: {
      hover: 'rgba(99, 102, 241, 0.08)',
    },
  },
  typography: {
    fontFamily: "'Outfit', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
});

const App: React.FC = () => {
  useEffect(() => {
    initSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
