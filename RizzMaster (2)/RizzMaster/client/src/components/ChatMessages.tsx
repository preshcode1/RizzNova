import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Bot, User } from "lucide-react";
import type { ChatMessage } from "@shared/schema";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RizzGPT!</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your AI-powered dating and relationship assistant. Ask me anything about dating, 
              relationships, or social interactions!
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className="flex space-x-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className={
                message.role === "user" 
                  ? "bg-blue-100 text-blue-600" 
                  : "bg-emerald-500 text-white"
              }>
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Card className={`px-4 py-3 ${
                message.role === "user" 
                  ? "bg-gray-100 border-gray-200" 
                  : "bg-white border-gray-200"
              }`}>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-900 whitespace-pre-wrap mb-0">
                    {message.content}
                  </p>
                </div>
              </Card>
              <p className="text-xs text-gray-500 mt-1">
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex space-x-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-emerald-500 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Card className="px-4 py-3 bg-white border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </Card>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
