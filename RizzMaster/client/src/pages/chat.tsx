import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useRoute } from "wouter";
import Sidebar from "@/components/Sidebar";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import RedeemCodeModal from "@/components/RedeemCodeModal";
import UpgradeModal from "@/components/UpgradeModal";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import type { Chat, ChatMessage, User } from "@shared/schema";

export default function ChatPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, params] = useRoute("/chat/:id?");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const currentChatId = params?.id ? parseInt(params.id) : null;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user chats
  const { data: chats = [], isLoading: chatsLoading } = useQuery<Chat[]>({
    queryKey: ["/api/chats"],
    enabled: isAuthenticated,
  });

  // Fetch current chat if ID is provided
  const { data: currentChat, isLoading: currentChatLoading } = useQuery<Chat>({
    queryKey: ["/api/chats", currentChatId],
    enabled: isAuthenticated && currentChatId !== null,
  });

  // Create new chat mutation
  const createChatMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chats");
      return response.json();
    },
    onSuccess: (newChat: Chat) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
      window.location.href = `/chat/${newChat.id}`;
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!currentChatId) throw new Error("No chat selected");
      const response = await apiRequest("POST", `/api/chats/${currentChatId}/messages`, {
        message,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats", currentChatId] });
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      // Check for OpenAI quota error
      if (error.message.includes("OpenAI quota exceeded")) {
        toast({
          title: "OpenAI Quota Exceeded",
          description: "Please add credits to your OpenAI account to continue chatting.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNewChat = () => {
    createChatMutation.mutate();
  };

  const handleSendMessage = (message: string) => {
    if (!currentChatId) {
      // Create new chat first
      createChatMutation.mutate();
      return;
    }
    sendMessageMutation.mutate(message);
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const messages = currentChat?.messages as ChatMessage[] || [];
console.log("Messages:", messages);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar
          user={user as User}
          chats={chats}
          currentChatId={currentChatId}
          onNewChat={handleNewChat}
          onShowRedeem={() => setShowRedeemModal(true)}
          onShowUpgrade={() => setShowUpgradeModal(true)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white hover:bg-white hover:bg-opacity-20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <Sidebar
              user={user as User}
              chats={chats}
              currentChatId={currentChatId}
              onNewChat={handleNewChat}
              onShowRedeem={() => setShowRedeemModal(true)}
              onShowUpgrade={() => setShowUpgradeModal(true)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">⚡</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">RizzNova</h1>
          </div>
          <div className="w-6" />
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col bg-white">
          <ChatMessages
            messages={messages}
            isLoading={currentChatLoading || sendMessageMutation.isPending}
          />
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={sendMessageMutation.isPending}
            isLoading={sendMessageMutation.isPending}
          />
        </div>
      </div>

      {/* Modals */}
      <RedeemCodeModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
      />
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
