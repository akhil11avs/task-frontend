import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTasks } from '../hooks/useTasks';
import { useTaskStore } from '../store/useTaskStore';
import SearchBar from '../components/SearchBar';
import StatusFilter from '../components/StatusFilter';
import TaskTable from '../components/TaskTable';
import Pagination from '../components/Pagination';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import ErrorState from '../components/ErrorState';
import type { Task, TaskStatus } from '../types';

export const Dashboard: React.FC = () => {
  const {
    tasks,
    totalPages,
    isLoading,
    error,
    refetch,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const { filters, pagination, setFilters, setPagination } = useTaskStore();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'error' | 'warning'>('success');

  const showToast = (message: string, severity: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  useEffect(() => {
    const handleSocketUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ taskId: string; status: TaskStatus }>;
      const { taskId, status } = customEvent.detail;
      
      const task = useTaskStore.getState().tasks.find((t) => t.id === taskId);
      if (task) {
        showToast(`Task "${task.title}" status changed to "${status}" in real-time!`, 'info');
      }
    };

    window.addEventListener('taskStatusNotification', handleSocketUpdate);
    return () => {
      window.removeEventListener('taskStatusNotification', handleSocketUpdate);
    };
  }, []);

  const handleCreateTask = async (data: { title: string; description: string; status: TaskStatus }) => {
    await createTask(data);
    showToast('Task created successfully!', 'success');
  };

  const handleUpdateTask = async (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    await updateTask({ id, updates: data });
    showToast('Task updated successfully!', 'success');
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      await updateTask({ id, updates: { status } });
      showToast('Task status updated!', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update task status', 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        showToast('Task deleted successfully!', 'success');
      } catch (err: any) {
        showToast('Failed to delete task', 'error');
      }
    }
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  if (error) {
    return <ErrorState message="Could not retrieve tasks." onRetry={refetch} />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            Tasks
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your tasks and track updates in real-time.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ borderRadius: 2, px: 3, py: 1.2, fontWeight: 'bold' }}
        >
          Add Task
        </Button>
      </Box>

      {/* Search and Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <SearchBar
            value={filters.search || ''}
            onChange={(val) => setFilters({ search: val })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatusFilter
            value={filters.status || ''}
            onChange={(val) => setFilters({ status: val })}
          />
        </Grid>
      </Grid>

      {/* Task table list */}
      <TaskTable
        tasks={tasks}
        isLoading={isLoading}
        onEdit={handleEditClick}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />

      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination
          page={pagination.page}
          count={totalPages}
          onChange={(page) => setPagination({ page })}
        />
      )}

      {/* Modals */}
      <CreateTaskModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={false}
      />

      <EditTaskModal
        open={editModalOpen}
        task={selectedTask}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleUpdateTask}
        isLoading={false}
      />

      {/* Snackbar alerts */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%', borderRadius: 2 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
