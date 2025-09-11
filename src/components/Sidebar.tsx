import React from 'react';
import { Home, CheckSquare, Calendar, BarChart3, Settings, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', icon: Home, url: '/' },
  { title: 'All Tasks', icon: CheckSquare, url: '/tasks' },
  { title: 'Calendar', icon: Calendar, url: '/calendar' },
  { title: 'Analytics', icon: BarChart3, url: '/analytics' },
  { title: 'AI Insights', icon: Brain, url: '/insights' },
  { title: 'Settings', icon: Settings, url: '/settings' },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-60">
      <SidebarContent>
        <div className="px-4 py-6">
          <div className="flex items-center gap-2">
            <div className="ai-gradient p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-ai-primary bg-clip-text text-transparent">
                Taskify
              </h2>
              <p className="text-xs text-muted-foreground">AI Task Manager</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted/50 rounded-md transition-colors">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}