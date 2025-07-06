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

  const { data: chats = [], isLoading: chatsLoading } = useQuery<Chat[]>({
    queryKey: ["/api/chats"],
    enabled: isAuthenticated,
  });

  const { data: currentChat, isLoading: currentChatLoading } = useQuery<Chat>({
    queryKey: ["/api/chats", currentChatId],
    enabled: isAuthenticated && currentChatId !== null,
  });

  const createChatMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chats");
