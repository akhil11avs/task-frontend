import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
} from '@mui/material';
import type { TaskStatus } from '../types';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; status: TaskStatus }) => Promise<void>;
  isLoading: boolean;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ open, onClose, onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (title.trim().length < 3) {
      setErrorMsg('Title must be at least 3 characters long');
      return;
    }

    try {
      await onSubmit({ title, description, status });
      setTitle('');
      setDescription('');
      setStatus('pending');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to create task');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create New Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <TextField
              label="Title"
              required
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              slotProps={{ htmlInput: { minLength: 3, maxLength: 100 } }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              slotProps={{ htmlInput: { maxLength: 500 } }}
            />
            <FormControl fullWidth>
              <InputLabel id="create-status-label">Status</InputLabel>
              <Select
                labelId="create-status-label"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={isLoading}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTaskModal;
