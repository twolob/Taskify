import React from 'react';
import { CheckCircle2, Clock, Star, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TaskStatsProps {
  totalTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
  aiSuggestedTasks: number;
}

export const TaskStats: React.FC<TaskStatsProps> = ({
  totalTasks,
  completedTasks,
  highPriorityTasks,
  aiSuggestedTasks
}) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: <Clock className="h-4 w-4" />,
      color: 'text-primary'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: 'text-success'
    },
    {
      label: 'High Priority',
      value: highPriorityTasks,
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-destructive'
    },
    {
      label: 'AI Suggested',
      value: aiSuggestedTasks,
      icon: <Star className="h-4 w-4" />,
      color: 'text-ai-primary'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg bg-background/50 ${stat.color}`}>
              {stat.icon}
            </div>
            <span className="text-2xl font-bold">{stat.value}</span>
          </div>
          
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          
          {stat.label === 'Completed' && totalTasks > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-background/30 rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{completionRate}%</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};