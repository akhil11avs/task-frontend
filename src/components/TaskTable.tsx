import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Task, TaskStatus } from '../types';
import LoadingState from './LoadingState';

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return {
        bg: 'rgba(76, 175, 80, 0.15)',
        color: '#4caf50',
      };
    case 'in-progress':
      return {
        bg: 'rgba(255, 152, 0, 0.15)',
        color: '#ff9800',
      };
    case 'pending':
    default:
      return {
        bg: 'rgba(33, 150, 243, 0.15)',
        color: '#2196f3',
      };
  }
};

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (!isLoading && tasks.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 6,
          textAlign: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px dashed rgba(255, 255, 255, 0.12)',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No tasks found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Create a new task to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Table sx={{ minWidth: 650 }} aria-label="task table">
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: 120 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <LoadingState />
          ) : (
            tasks.map((task) => {
              const statusStyle = getStatusColor(task.status);
              return (
                <TableRow key={task.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {task.title}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {task.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                      size="small"
                      sx={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        '& .MuiSelect-select': {
                          py: 0.5,
                          px: 1.5,
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                      }}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(task.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Edit Task">
                        <IconButton size="small" onClick={() => onEdit(task)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Task">
                        <IconButton size="small" onClick={() => onDelete(task.id)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
