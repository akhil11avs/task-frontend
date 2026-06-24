import React, { useState, useEffect } from 'react';
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
import type { Task, TaskStatus } from '../types';

interface EditTaskModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  isLoading: boolean;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ open, task, onClose, onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setErrorMsg('');
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!task) {
      return;
    }

    if (title.trim().length < 3) {
      setErrorMsg('Title must be at least 3 characters long');
      return;
    }

    try {
      await onSubmit(task.id, { title, description, status });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to update task');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
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
              <InputLabel id="edit-status-label">Status</InputLabel>
              <Select
                labelId="edit-status-label"
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
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTaskModal;
