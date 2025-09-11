import React, { useState, useEffect } from 'react';
import { Brain, Search, Filter, MoreHorizontal } from 'lucide-react';
import { TaskCard } from '@/components/TaskCard';
import { TaskStats } from '@/components/TaskStats';
import { AIInsights } from '@/components/AIInsights';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { Task, AIInsight } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-dashboard.jpg';

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [insights, setInsights] = useState<AIInsight[]>([]);

  // Sample data initialization
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Design landing page mockups',
        description: 'Create wireframes and high-fidelity designs for the new product landing page',
        completed: false,
        priority: 'high',
        category: 'Design',
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        aiSuggested: true
      },
      {
        id: '2',
        title: 'Implement user authentication',
        description: 'Set up login/logout functionality with secure session management',
        completed: true,
        priority: 'high',
        category: 'Development',
        createdAt: new Date(),
        updatedAt: new Date(),
        aiSuggested: false
      },
      {
        id: '3',
        title: 'Write project documentation',
        description: 'Document API endpoints and component usage',
        completed: false,
        priority: 'medium',
        category: 'Documentation',
        createdAt: new Date(),
        updatedAt: new Date(),
        aiSuggested: false
      }
    ];

    const sampleInsights: AIInsight[] = [
      {
        id: '1',
        type: 'suggestion',
        title: 'Optimize task prioritization',
        description: 'Consider moving high-priority design tasks earlier in your workflow for better efficiency.',
        actionable: true,
        createdAt: new Date()
      },
      {
        id: '2',
        type: 'priority',
        title: 'Deadline approaching',
        description: 'You have 2 high-priority tasks due within the next 48 hours.',
        actionable: false,
        createdAt: new Date()
      }
    ];

    setTasks(sampleTasks);
    setInsights(sampleInsights);
  }, []);

  const categories = [...new Set(tasks.map(task => task.category)), 'General'];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
    
    toast({
      title: "Task updated",
      description: "Task status has been updated successfully.",
    });
  };

  const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setTasks(prev => [newTask, ...prev]);
    
    toast({
      title: "Task created",
      description: "Your new task has been added successfully.",
    });
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const aiSuggestedTasks = tasks.filter(task => task.aiSuggested).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Task Management Dashboard" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-ai-primary bg-clip-text text-transparent">
                AI Task Manager
              </h1>
              <p className="text-lg text-muted-foreground">
                Intelligent task management powered by AI insights
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <CreateTaskDialog 
                onCreateTask={handleCreateTask}
                categories={categories}
              />
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TaskStats
            totalTasks={totalTasks}
            completedTasks={completedTasks}
            highPriorityTasks={highPriorityTasks}
            aiSuggestedTasks={aiSuggestedTasks}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="ai-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterPriority !== 'all' || filterCategory !== 'all' 
                      ? 'Try adjusting your filters or search query.'
                      : 'Create your first task to get started!'
                    }
                  </p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <TaskCard
                      task={task}
                      onToggleComplete={handleToggleComplete}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            <AIInsights insights={insights} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
