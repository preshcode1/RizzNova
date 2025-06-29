import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  MessageCircle, 
  Crown, 
  Ticket, 
  Settings, 
  LogOut,
  MoreHorizontal
} from "lucide-react";
import type { User, Chat } from "@shared/schema";

interface SidebarProps {
  user: User | null;
  chats: Chat[];
  currentChatId: number | null;
  onNewChat: () => void;
  onShowRedeem: () => void;
  onShowUpgrade: () => void;
}

export default function Sidebar({
  user,
  chats,
  currentChatId,
  onNewChat,
  onShowRedeem,
  onShowUpgrade,
}: SidebarProps) {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback to redirect anyway
      window.location.href = "/";
    }
  };

  const getUserInitials = (user: User | null) => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = (user: User | null) => {
    if (!user) return "User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.email) return user.email.split("@")[0];
    return "User";
  };

  return (
    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">⚡</span>
          </div>
          <h1 className="text-xl font-bold text-white">RizzGPT</h1>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="mt-5 px-3">
        <Button
          onClick={onNewChat}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-3" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="mt-5 flex-grow flex flex-col overflow-y-auto">
        <div className="px-3">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Recent Chats
          </p>
          <ScrollArea className="mt-2">
            <div className="space-y-1">
              {chats.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className={`w-full flex items-center px-3 py-2 text-sm text-left rounded-lg transition-colors duration-200 ${
                    currentChatId === chat.id
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => {
                    window.location.href = `/chat/${chat.id}`;
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-3 text-gray-500 flex-shrink-0" />
                  <span className="truncate">
                    {chat.title || "New Chat"}
                  </span>
                </Button>
              ))}
              {chats.length === 0 && (
                <p className="px-3 py-2 text-sm text-gray-500">
                  No chats yet. Start a new conversation!
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 px-3 space-y-1">
        <Button
          variant="ghost"
          onClick={onShowUpgrade}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200"
        >
          <Crown className="w-4 h-4 mr-3" />
          {user?.isPro ? "Pro Member" : "Upgrade to Pro"}
        </Button>
        <Button
          variant="ghost"
          onClick={onShowRedeem}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200"
        >
          <Ticket className="w-4 h-4 mr-3" />
          Redeem Code
        </Button>
        <Button
          variant="ghost"
          className="w-full flex items-center px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200"
        >
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </Button>
      </div>

      <Separator className="mx-3 my-3 bg-gray-700" />

      {/* User Profile */}
      <div className="flex-shrink-0 px-3">
        <div className="flex items-center space-x-3 p-2">
          <Avatar className="w-8 h-8">
            <AvatarImage 
              src={user?.profileImageUrl || undefined} 
              alt="User avatar" 
              className="object-cover"
            />
            <AvatarFallback className="bg-emerald-500 text-white text-sm">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {getUserDisplayName(user)}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || ""}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-400 hover:text-white p-1"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
