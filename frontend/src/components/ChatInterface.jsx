import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';

export default function ChatInterface({
  conversation,
  onSendMessage,
  isLoading,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to ABSOLUTE MDRT</h2>
        <p className="text-muted-foreground max-w-md">
          Create a new conversation to consult the council of AI models for diverse perspectives on your questions.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {conversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Start a Conversation</h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Ask a question to consult the ABSOLUTE MDRT. Multiple AI models will provide their perspectives.
              </p>
            </div>
          ) : (
            conversation.messages.map((msg, index) => (
              <div key={index} className="space-y-4">
                {msg.role === 'user' ? (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      U
                    </div>
                    <Card className="flex-1 bg-primary/5 border-primary/10">
                      <CardContent className="p-4">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                          You
                        </div>
                        <div className="markdown-content">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-primary-foreground text-sm font-medium">
                      C
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        ABSOLUTE MDRT
                      </div>

                      {/* Stage 1 */}
                      {msg.loading?.stage1 && (
                        <Card className="border-dashed animate-pulse">
                          <CardContent className="flex items-center gap-3 p-4">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">
                              Running Stage 1: Collecting individual responses...
                            </span>
                          </CardContent>
                        </Card>
                      )}
                      {msg.stage1 && <Stage1 responses={msg.stage1} />}

                      {/* Stage 2 */}
                      {msg.loading?.stage2 && (
                        <Card className="border-dashed animate-pulse">
                          <CardContent className="flex items-center gap-3 p-4">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">
                              Running Stage 2: Peer rankings...
                            </span>
                          </CardContent>
                        </Card>
                      )}
                      {msg.stage2 && (
                        <Stage2
                          rankings={msg.stage2}
                          labelToModel={msg.metadata?.label_to_model}
                          aggregateRankings={msg.metadata?.aggregate_rankings}
                        />
                      )}

                      {/* Stage 3 */}
                      {msg.loading?.stage3 && (
                        <Card className="border-dashed animate-pulse">
                          <CardContent className="flex items-center gap-3 p-4">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">
                              Running Stage 3: Final synthesis...
                            </span>
                          </CardContent>
                        </Card>
                      )}
                      {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && conversation.messages.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center gap-3 p-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-muted-foreground">Consulting the council...</span>
              </CardContent>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area - Only show for conversations with no messages */}
      {conversation.messages.length === 0 && (
        <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <Textarea
                ref={textareaRef}
                className="flex-1 min-h-[80px] max-h-[200px] resize-none bg-background"
                placeholder="Ask your question... (Shift+Enter for new line, Enter to send)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="lg"
                className="sm:self-end gap-2"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sm:hidden">Send</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">
              Press Enter to send, Shift+Enter for new line
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
