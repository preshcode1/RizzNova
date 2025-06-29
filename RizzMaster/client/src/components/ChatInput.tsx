import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function ChatInput({ onSendMessage, disabled, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 96) + "px"; // Max 4 lines
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask RizzGPT anything about dating, relationships, or social skills..."
              className="resize-none border-gray-300 rounded-lg pr-12 focus:ring-emerald-500 focus:border-emerald-500 min-h-[44px] max-h-24"
              disabled={disabled}
              rows={1}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!message.trim() || disabled}
              className="absolute right-2 bottom-2 w-8 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg p-0"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          RizzGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
