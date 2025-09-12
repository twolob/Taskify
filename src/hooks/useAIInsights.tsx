import { useState, useEffect } from 'react';
import { Task, AIInsight } from '@/types/task';

export const useAIInsights = (tasks: Task[]) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    const generateInsights = () => {
      const newInsights: AIInsight[] = [];

      // Analyze overdue tasks
      const overdueTasks = tasks.filter(task => 
        task.dueDate && 
        new Date(task.dueDate) < new Date() && 
        !task.completed
      );

      if (overdueTasks.length > 0) {
        newInsights.push({
          id: 'overdue-tasks',
          type: 'priority',
          title: 'Overdue tasks detected',
          description: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Consider prioritizing them.`,
          actionable: true,
          createdAt: new Date()
        });
      }

      // Analyze upcoming deadlines
      const upcomingTasks = tasks.filter(task => {
        if (!task.dueDate || task.completed) return false;
        const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilDue <= 3 && daysUntilDue > 0;
      });

      if (upcomingTasks.length > 0) {
        newInsights.push({
          id: 'upcoming-deadlines',
          type: 'priority',
          title: 'Deadlines approaching',
          description: `You have ${upcomingTasks.length} task${upcomingTasks.length > 1 ? 's' : ''} due within the next 3 days.`,
          actionable: false,
          createdAt: new Date()
        });
      }

      // Analyze high priority incomplete tasks
      const highPriorityIncomplete = tasks.filter(task => 
        task.priority === 'high' && !task.completed
      );

      if (highPriorityIncomplete.length > 3) {
        newInsights.push({
          id: 'high-priority-backlog',
          type: 'optimization',
          title: 'High priority task backlog',
          description: `You have ${highPriorityIncomplete.length} high-priority tasks. Consider breaking them into smaller chunks.`,
          actionable: true,
          createdAt: new Date()
        });
      }

      // Analyze completion patterns
      const completedTasks = tasks.filter(task => task.completed);
      const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

      if (completionRate > 80 && tasks.length > 5) {
        newInsights.push({
          id: 'high-productivity',
          type: 'suggestion',
          title: 'Excellent productivity!',
          description: `You've completed ${Math.round(completionRate)}% of your tasks. Keep up the great work!`,
          actionable: false,
          createdAt: new Date()
        });
      } else if (completionRate < 30 && tasks.length > 3) {
        newInsights.push({
          id: 'low-completion',
          type: 'suggestion',
          title: 'Focus on completion',
          description: 'Consider setting smaller, more achievable goals to build momentum.',
          actionable: true,
          createdAt: new Date()
        });
      }

      // Analyze category distribution
      const categoryCount = tasks.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const dominantCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0];
      
      if (dominantCategory && dominantCategory[1] > tasks.length * 0.6 && tasks.length > 5) {
        newInsights.push({
          id: 'category-imbalance',
          type: 'optimization',
          title: 'Task category imbalance',
          description: `Most of your tasks (${dominantCategory[1]}) are in "${dominantCategory[0]}". Consider diversifying your focus areas.`,
          actionable: true,
          createdAt: new Date()
        });
      }

      // Weekly productivity insight
      const thisWeekTasks = tasks.filter(task => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(task.createdAt) > weekAgo;
      });

      if (thisWeekTasks.length > 0) {
        const thisWeekCompleted = thisWeekTasks.filter(task => task.completed).length;
        newInsights.push({
          id: 'weekly-summary',
          type: 'suggestion',
          title: 'Weekly summary',
          description: `This week you created ${thisWeekTasks.length} tasks and completed ${thisWeekCompleted}. ${thisWeekCompleted >= thisWeekTasks.length * 0.7 ? 'Great progress!' : 'Room for improvement!'}`,
          actionable: false,
          createdAt: new Date()
        });
      }

      setInsights(newInsights);
    };

    if (tasks.length > 0) {
      generateInsights();
    } else {
      setInsights([]);
    }
  }, [tasks]);

  return insights;
};