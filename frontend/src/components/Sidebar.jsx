import { Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}) {
  return (
    <div className="flex flex-col h-full w-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="font-bold text-xl bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          LLM Council
        </h1>
        <ThemeToggle />
      </div>

      {/* New Conversation Button */}
      <div className="p-3">
        <Button
          onClick={onNewConversation}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-4">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No conversations yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Start a new conversation above
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  conv.id === currentConversationId
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-foreground"
                )}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="font-medium text-sm truncate">
                  {conv.title || 'New Conversation'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {conv.message_count} {conv.message_count === 1 ? 'message' : 'messages'}
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
