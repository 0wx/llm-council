import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

export default function Stage1({ responses }) {
  if (!responses || responses.length === 0) {
    return null;
  }

  const getModelShortName = (model) => {
    const parts = model.split('/');
    return parts[parts.length - 1] || model;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-blue-500/10">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <CardTitle className="text-base">Stage 1: Individual Responses</CardTitle>
          <Badge variant="secondary" className="ml-auto">
            {responses.length} models
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {responses.map((resp, index) => (
              <TabsTrigger
                key={index}
                value={String(index)}
                className="text-xs px-2 py-1.5 data-[state=active]:bg-background"
              >
                {getModelShortName(resp.model)}
              </TabsTrigger>
            ))}
          </TabsList>

          {responses.map((resp, index) => (
            <TabsContent key={index} value={String(index)} className="mt-4">
              <div className="space-y-3">
                <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded block">
                  {resp.model}
                </code>
                <div className="markdown-content text-sm">
                  <ReactMarkdown>{resp.response}</ReactMarkdown>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
