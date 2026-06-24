import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskStatus } from '../types';

interface StatusFilterProps {
  value: TaskStatus | '';
  onChange: (value: TaskStatus | '') => void;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as TaskStatus | '');
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="status-filter-label">Filter by Status</InputLabel>
      <Select
        labelId="status-filter-label"
        value={value}
        onChange={handleChange}
        label="Filter by Status"
        sx={{
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <MenuItem value="">All Statuses</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="in-progress">In Progress</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </Select>
    </FormControl>
  );
};

export default StatusFilter;
