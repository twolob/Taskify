import React from 'react';
import { Brain, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { AIInsight } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AIInsightsProps {
  insights: AIInsight[];
  onApplyInsight?: (insight: AIInsight) => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ 
  insights, 
  onApplyInsight 
}) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return <Lightbulb className="h-4 w-4" />;
      case 'priority': return <Target className="h-4 w-4" />;
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="ai-gradient p-2 rounded-lg">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold">AI Insights</h2>
      </div>
      
      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">AI is analyzing your tasks...</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/30 hover:border-ai-primary/30 transition-colors"
            >
              <div className="ai-gradient p-1.5 rounded-md text-white">
                {getInsightIcon(insight.type)}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {insight.description}
                </p>
                
                {insight.actionable && onApplyInsight && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => onApplyInsight(insight)}
                  >
                    Apply
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};