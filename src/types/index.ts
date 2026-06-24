export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

export type TaskStatus = Task['status'];

export interface TaskFilters {
  status?: TaskStatus | '';
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface GetTasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
