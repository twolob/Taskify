export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  aiSuggested?: boolean;
}

export interface TaskCategory {
  id: string;
  name: string;
  color: string;
  taskCount: number;
}

export interface AIInsight {
  id: string;
  type: 'suggestion' | 'priority' | 'optimization';
  title: string;
  description: string;
  actionable: boolean;
  createdAt: Date;
}