import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

function deAnonymizeText(text, labelToModel) {
  if (!labelToModel) return text;

  let result = text;
  Object.entries(labelToModel).forEach(([label, model]) => {
    const modelShortName = model.split('/')[1] || model;
    result = result.replace(new RegExp(label, 'g'), `**${modelShortName}**`);
  });
  return result;
}

const getModelShortName = (model) => {
  const parts = model.split('/');
  return parts[parts.length - 1] || model;
};

export default function Stage2({ rankings, labelToModel, aggregateRankings }) {
  if (!rankings || rankings.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-purple-500/10">
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </div>
          <CardTitle className="text-base">Stage 2: Peer Rankings</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Each model evaluated all responses (anonymized as Response A, B, C, etc.) and provided rankings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aggregate Rankings */}
        {aggregateRankings && aggregateRankings.length > 0 && (
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg p-4 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-4 w-4 text-amber-500" />
              <h4 className="font-semibold text-sm">Aggregate Rankings (Street Cred)</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Combined results across all peer evaluations (lower score is better)
            </p>
            <div className="space-y-2">
              {aggregateRankings.map((agg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md bg-background/50",
                    index === 0 && "ring-2 ring-amber-500/30 bg-amber-500/5"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                    index === 0 ? "bg-amber-500 text-white" :
                    index === 1 ? "bg-gray-400 text-white" :
                    index === 2 ? "bg-orange-700 text-white" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {index + 1}
                  </div>
                  <span className="flex-1 text-sm font-medium font-mono">
                    {getModelShortName(agg.model)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Avg: {agg.average_rank.toFixed(2)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ({agg.rankings_count} votes)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Evaluations */}
        <div>
          <h4 className="font-medium text-sm mb-3">Raw Evaluations</h4>
          <Tabs defaultValue="0" className="w-full">
            <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
              {rankings.map((rank, index) => (
                <TabsTrigger
                  key={index}
                  value={String(index)}
                  className="text-xs px-2 py-1.5 data-[state=active]:bg-background"
                >
                  {getModelShortName(rank.model)}
                </TabsTrigger>
              ))}
            </TabsList>

            {rankings.map((rank, index) => (
              <TabsContent key={index} value={String(index)} className="mt-4">
                <div className="space-y-3">
                  <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded block">
                    {rank.model}
                  </code>
                  <div className="markdown-content text-sm">
                    <ReactMarkdown>
                      {deAnonymizeText(rank.ranking, labelToModel)}
                    </ReactMarkdown>
                  </div>

                  {rank.parsed_ranking && rank.parsed_ranking.length > 0 && (
                    <div className="pt-3 mt-3 border-t border-dashed">
                      <span className="text-xs font-medium text-primary">Extracted Ranking:</span>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        {rank.parsed_ranking.map((label, i) => (
                          <li key={i} className="text-sm font-mono">
                            {labelToModel && labelToModel[label]
                              ? getModelShortName(labelToModel[label])
                              : label}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
