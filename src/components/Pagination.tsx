import React from 'react';
import { Box, Pagination as MuiPagination } from '@mui/material';

interface PaginationProps {
  page: number;
  count: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, count, onChange }) => {
  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onChange(value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 3 }}>
      <MuiPagination
        count={count}
        page={page}
        onChange={handleChange}
        color="primary"
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
      />
    </Box>
  );
};

export default Pagination;
