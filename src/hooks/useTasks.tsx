import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks: Task[] = data?.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || undefined,
        completed: task.completed,
        priority: task.priority as 'low' | 'medium' | 'high',
        category: task.category,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
        aiSuggested: task.ai_suggested || false,
      })) || [];

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create tasks.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskData.title,
          description: taskData.description || null,
          completed: taskData.completed,
          priority: taskData.priority,
          category: taskData.category,
          due_date: taskData.dueDate?.toISOString() || null,
          ai_suggested: taskData.aiSuggested || false,
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        completed: data.completed,
        priority: data.priority as 'low' | 'medium' | 'high',
        category: data.category,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        aiSuggested: data.ai_suggested || false,
      };

      setTasks(prev => [newTask, ...prev]);
      
      toast({
        title: "Task created",
        description: "Your new task has been added successfully.",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description || null,
          completed: updates.completed,
          priority: updates.priority,
          category: updates.category,
          due_date: updates.dueDate?.toISOString() || null,
          ai_suggested: updates.aiSuggested || false,
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      const updatedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        completed: data.completed,
        priority: data.priority as 'low' | 'medium' | 'high',
        category: data.category,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        aiSuggested: data.ai_suggested || false,
      };

      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      
      toast({
        title: "Task updated",
        description: "Task has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await updateTask(taskId, { completed: !task.completed });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    refetch: fetchTasks,
  };
};