import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/taskApi';
import { useTaskStore } from '../store/useTaskStore';
import type { Task } from '../types';

export const useTasks = () => {
  const queryClient = useQueryClient();
  const { filters, pagination, setTasks, tasks, total, totalPages } = useTaskStore();

  const { isLoading, error, refetch } = useQuery({
    queryKey: ['tasks', filters, pagination],
    queryFn: async () => {
      const response = await taskApi.getTasks(filters, pagination);
      // Sync tasks into Zustand store
      setTasks(response.tasks, response.total, response.totalPages);
      return response;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Task, 'id' | 'createdAt'>> }) =>
      taskApi.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks,
    total,
    totalPages,
    isLoading,
    error,
    refetch,
    createTask: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutateAsync,
    isUpdating: updateTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,
  };
};
