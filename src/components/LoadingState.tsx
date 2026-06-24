import React from 'react';
import { Box, Skeleton, TableCell, TableRow } from '@mui/material';

export const LoadingState: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton variant="text" width="65%" height={24} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="85%" height={24} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rectangular" width={85} height={24} sx={{ borderRadius: 1 }} />
          </TableCell>
          <TableCell>
            <Skeleton variant="text" width="45%" height={24} />
          </TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default LoadingState;
