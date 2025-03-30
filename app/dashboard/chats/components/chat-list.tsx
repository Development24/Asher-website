import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatListProps {
  chats: any[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
}

export function ChatList({
  chats,
  selectedChatId,
  onChatSelect,
  searchQuery,
  onSearchChange,
  isLoading
}: ChatListProps) {
  if (isLoading) {
    return (
      <div className="w-72 border-r">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-72 border-r">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search chats"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="divide-y overflow-y-auto h-[calc(85vh-5rem)]">
        {chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No chats found
          </div>
        ) : (
          chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={cn(
                "w-full p-4 flex items-center gap-3 hover:bg-gray-50",
                selectedChatId === chat.id && "bg-gray-50"
              )}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={chat.user.avatar} />
                  <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
                </Avatar>
                {chat.user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-start">
                  <span className="font-medium">{chat.user.name}</span>
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              {chat.isPinned && <Pin className="w-4 h-4 text-gray-400 transform -rotate-45" />}
            </button>
          ))
        )}
      </div>
    </div>
  );
} 