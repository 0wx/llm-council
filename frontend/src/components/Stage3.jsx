import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';

export default function Stage3({ finalResponse }) {
  if (!finalResponse) {
    return null;
  }

  const getModelShortName = (model) => {
    const parts = model.split('/');
    return parts[parts.length - 1] || model;
  };

  return (
    <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-green-500/10">
            <Crown className="h-4 w-4 text-green-500" />
          </div>
          <CardTitle className="text-base">Stage 3: Final Council Answer</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400">
              Chairman
            </Badge>
            <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {getModelShortName(finalResponse.model)}
            </code>
          </div>
          <div className="markdown-content bg-background rounded-lg p-4 border">
            <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
