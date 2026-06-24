import apiClient from './client';
import type { Task, TaskFilters, PaginationParams, GetTasksResponse } from '../types';

export const taskApi = {
  getTasks: async (filters: TaskFilters, pagination: PaginationParams): Promise<GetTasksResponse> => {
    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('limit', pagination.limit.toString());
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }

    const response = await apiClient.get<GetTasksResponse>(`/tasks?${params.toString()}`);
    return response.data;
  },

  getTaskById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task> => {
    const response = await apiClient.put<Task>(`/tasks/${id}`, updates);
    return response.data;
  },

  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/tasks/${id}`);
    return response.data;
  },
};
