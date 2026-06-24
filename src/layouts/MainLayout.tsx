import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 800, letterSpacing: 0.5, color: 'primary.main' }}>
              TASKIFY
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout;
