import React from 'react';
import { Clock, Star, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onToggleComplete, 
  onEdit 
}) => {
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-low';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={cn(
      'task-card animate-fade-in',
      task.completed && 'opacity-75'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-transparent"
            onClick={() => onToggleComplete(task.id)}
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-success" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
            )}
          </Button>
          
          <div className="flex-1">
            <h3 className={cn(
              "font-semibold text-sm mb-1",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        
        {task.aiSuggested && (
          <Star className="h-4 w-4 text-ai-primary" fill="currentColor" />
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full border",
            getPriorityClass(task.priority)
          )}>
            {task.priority}
          </span>
          
          <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
            {task.category}
          </span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
};