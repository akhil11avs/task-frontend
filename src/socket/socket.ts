import { io } from 'socket.io-client';
import { useTaskStore } from '../store/useTaskStore';
import { queryClient } from '../api/queryClient';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export const initSocket = () => {
  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
  });

  socket.on('task:statusChanged', (data: { taskId: string; status: 'pending' | 'in-progress' | 'completed' }) => {
    console.log('Real-time task status update received:', data);
    useTaskStore.getState().updateTaskStatusLocal(data.taskId, data.status);
    queryClient.invalidateQueries({ queryKey: ['tasks'] });

    // Dispatch custom event to trigger premium toast notifications
    const event = new CustomEvent('taskStatusNotification', { detail: data });
    window.dispatchEvent(event);
  });

  socket.connect();
};

export const disconnectSocket = () => {
  socket.off('connect');
  socket.off('task:statusChanged');
  socket.disconnect();
};
