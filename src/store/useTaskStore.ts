import { create } from 'zustand';
import type { Task, TaskFilters, PaginationParams } from '../types';

interface TaskState {
  tasks: Task[];
  total: number;
  totalPages: number;
  filters: TaskFilters;
  pagination: PaginationParams;
  
  setTasks: (tasks: Task[], total: number, totalPages: number) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  updateTaskStatusLocal: (taskId: string, status: Task['status']) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  total: 0,
  totalPages: 1,
  filters: {
    search: '',
    status: '',
  },
  pagination: {
    page: 1,
    limit: 10,
  },

  setTasks: (tasks, total, totalPages) => set({ tasks, total, totalPages }),
  
  setFilters: (newFilters) => 
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 } 
    })),

  setPagination: (newPagination) => 
    set((state) => ({ 
      pagination: { ...state.pagination, ...newPagination } 
    })),

  updateTaskStatusLocal: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      ),
    })),
}));
