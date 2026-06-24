import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ErrorOutlined as ErrorOutlineIcon } from '@mui/icons-material';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        textAlign: 'center',
        gap: 2,
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 60 }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" color="primary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorState;
