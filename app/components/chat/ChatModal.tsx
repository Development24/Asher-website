'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Paperclip, Send, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChatMessage } from './ChatMessage'
import { useGetUserRooms, useCreateChat } from '@/services/chat/chatFn'
import { userStore } from '@/store/userStore'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  landlord: {
    name: string
    image: string
    role: string
    id?: string
  }
  propertyId: number
}

export function ChatModal({ isOpen, onClose, landlord, propertyId }: ChatModalProps) {
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = userStore((state) => state.user?.id)
  
  const { data: rooms } = useGetUserRooms()
  const { mutate: sendMessage, isPending: isSending } = useCreateChat()

  const chatRoom = rooms?.chatRooms?.find((room: any) => 
    (room.user1Id === currentUserId && room.user2Id === landlord.id) ||
    (room.user2Id === currentUserId && room.user1Id === landlord.id)
  )

  const messages = chatRoom?.messages.map((msg: any) => ({
    id: msg.id,
    content: msg.content,
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    isOwn: msg.senderId === currentUserId
  })) || []

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = () => {
    if (!message.trim() || !landlord.id) return

    sendMessage(
      {
        content: message,
        receiverId: landlord.id,
      },
      {
        onSuccess: () => {
          setMessage('')
          scrollToBottom()
        }
      }
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 w-[400px] bg-white rounded-lg shadow-xl border z-50 flex flex-col"
          style={{ height: 'calc(100vh - 2rem)' }}
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={landlord.image} />
                <AvatarFallback>{landlord.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{landlord.name}</h3>
                <p className="text-sm text-gray-500">{landlord.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg: any) => (
              <ChatMessage
                key={msg.id}
                content={msg.content}
                timestamp={msg.timestamp}
                isOwn={msg.isOwn}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                disabled={isSending}
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-red-600 hover:bg-red-700 rounded-full"
                size="icon"
                disabled={isSending}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

