"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Search, Paperclip, Send, ImageIcon, Pin, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PropertyInviteCard } from "./components/property-invite-card"
import { ChatMessage } from "./components/chat-message"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { css } from "@emotion/react"
import { useGetUserRooms, useGetUserChats, useCreateChat } from "@/services/chat/chatFn"
import { Skeleton } from "@/components/ui/skeleton"
import { userStore } from "@/store/userStore"

// Lazy load heavy chat components
const ChatList = dynamic(() => import("./components/chat-list").then(mod => ({ default: mod.ChatList })), {
  ssr: false,
  loading: () => <Skeleton className="w-80 h-full" />
})

const ChatArea = dynamic(() => import("./components/chat-area").then(mod => ({ default: mod.ChatArea })), {
  ssr: false,
  loading: () => <Skeleton className="flex-1 h-full" />
})

const backgroundPattern = css`
  .bg-grid-pattern {
    background-image: 
      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
    background-size: 20px 20px;
  }
`

interface Chat {
  id: string
  user: {
    name: string
    avatar: string
    online?: boolean
  }
  lastMessage: string
  timestamp: string
  isPinned?: boolean
}

interface Message {
  id: string
  content: string
  timestamp: string
  isOwn?: boolean
  status?: "sent" | "delivered" | "read"
  isPinned?: boolean
}

export default function ChatsPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = userStore((state) => state.user?.id)

  const { data: rooms, isLoading: isLoadingRooms } = useGetUserRooms()
  const { mutate: sendMessage, isPending: isSending } = useCreateChat()

  // Transform rooms data for the chat list
  const transformedChats = rooms?.chatRooms?.map((room: any) => {
    const otherUser = room.user1Id === currentUserId ? room.user2 : room.user1
    const lastMessage = room.messages[0] // Messages are already sorted by date
    
    return {
      id: room.id,
      user: {
        id: otherUser.id,
        name: otherUser.email.split('@')[0],
        avatar: otherUser.profile?.profileUrl || "/placeholder-user.jpg",
        online: false
      },
      lastMessage: lastMessage?.content || "No messages yet",
      timestamp: new Date(lastMessage?.createdAt || room.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      // Reverse the messages array to show newest messages at the bottom
      messages: [...room.messages].reverse().map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isOwn: msg.senderId === currentUserId,
        status: "sent",
        hasAttachments: !!(msg.images?.length || msg.files?.length || msg.videos?.length || msg.audios?.length),
        attachments: {
          images: msg.images || [],
          files: msg.files || [],
          videos: msg.videos || [],
          audios: msg.audios || []
        }
      }))
    }
  }) || []

  const filteredChats = transformedChats.filter((chat: any) => 
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedChat = filteredChats.find((chat: any) => chat.id === selectedChatId)

  const handleSendMessage = (files?: FileList) => {
    if ((!newMessage.trim() && !files) || !selectedChatId) return;

    const selectedChatRoom = rooms?.chatRooms?.find((room: any) => room.id === selectedChatId);
    if (!selectedChatRoom) return;

    const receiverId = selectedChatRoom.user1Id === currentUserId 
      ? selectedChatRoom.user2Id 
      : selectedChatRoom.user1Id;

    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('receiverId', receiverId);

    // Append files if they exist
    if (files) {
      Array.from(files).forEach(file => {
        // Determine the type of file and append accordingly
        if (file.type.startsWith('image/')) {
          formData.append('files', file);
        } else if (file.type.startsWith('video/')) {
          formData.append('files', file);
        } else if (file.type.startsWith('audio/')) {
          formData.append('files', file);
        } else {
          formData.append('files', file);
        }
      });
    }

    sendMessage(formData as any, {
      onSuccess: () => {
        setNewMessage("");
      }
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedChat?.messages])

  return (
    <div className="layout min-h-screen">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Chats</span>
      </div>

      <div className="flex gap-6 h-[85vh] bg-white rounded-lg border shadow-lg">
        <ChatList
          chats={filteredChats}
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isLoadingRooms}
        />

        <ChatArea
          chat={selectedChat}
          isLoading={false}
          newMessage={newMessage}
          onNewMessageChange={setNewMessage}
          onSendMessage={handleSendMessage as any}
          isSending={isSending}
          messagesEndRef={messagesEndRef}
        />
      </div>
    </div>
  )
}


