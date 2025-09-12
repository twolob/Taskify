import React, { useState, useEffect } from 'react';
import { Brain, Search, Filter, Menu } from 'lucide-react';
import { TaskCard } from '@/components/TaskCard';
import { TaskStats } from '@/components/TaskStats';
import { AIInsights } from '@/components/AIInsights';
import { CreateTaskDialog } from '@/components/CreateTaskDialog';
import { EditTaskDialog } from '@/components/EditTaskDialog';
import { AppSidebar } from '@/components/Sidebar';
import { useTasks } from '@/hooks/useTasks';
import { useAIInsights } from '@/hooks/useAIInsights';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-dashboard.jpg';

const Dashboard = () => {
  const { toast } = useToast();
  const { tasks, loading, createTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Dynamic AI insights based on user tasks
  const insights = useAIInsights(tasks);

  const predefinedCategories = ['Work', 'Personal', 'Health', 'Finance', 'Learning', 'Shopping', 'Travel', 'General'];
  const taskCategories = [...new Set(tasks.map(task => task.category))];
  const categories = [...new Set([...predefinedCategories, ...taskCategories])];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    
    return matchesSearch && matchesPriority && matchesCategory;
  });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const aiSuggestedTasks = tasks.filter(task => task.aiSuggested).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 overflow-auto">
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
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-ai-primary bg-clip-text text-transparent">
                  Taskify
                </h1>
                <p className="text-lg text-muted-foreground">
                  Intelligent task management powered by AI insights
                </p>
              </div>
            </div>
            
            <CreateTaskDialog 
              onCreateTask={createTask}
              categories={categories}
            />
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="ai-gradient p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center animate-pulse">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Loading tasks...</h3>
                  <p className="text-muted-foreground">Please wait while we fetch your tasks.</p>
                </div>
              ) : filteredTasks.length === 0 ? (
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
                      onToggleComplete={toggleComplete}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
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
        
      <EditTaskDialog
        task={editingTask}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateTask={updateTask}
        categories={categories}
      />
    </main>
    </div>
  </SidebarProvider>
  );
};

export default Dashboard;