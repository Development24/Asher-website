import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Link, Paperclip, ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/app/components/EmptyState";
import { ChatMessage } from "./chat-message";
import { Input } from "@/components/ui/input";
import { PropertyInviteCard } from "./property-invite-card";
import { useRef } from "react";
import { AudioRecorder } from './audio-recorder';

interface ChatAreaProps {
  chat: any;
  isLoading: boolean;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: (files?: FileList | Blob) => void;
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatArea({
  chat,
  isLoading,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  isSending,
  messagesEndRef
}: ChatAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onSendMessage(files);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleAudioComplete = (audioBlob: Blob) => {
    // Create a File from the Blob
    const audioFile = new File([audioBlob], `voice-message-${Date.now()}.mp3`, {
      type: 'audio/mpeg'
    });
    
    // Create a FileList-like object
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(audioFile);
    
    onSendMessage(dataTransfer.files);
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          emptyText="Select a chat"
          handleClick={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={chat.user.avatar} />
            <AvatarFallback>{chat.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{chat.user.name}</div>
            <div className="text-sm text-gray-500">
              {chat.user.online ? "Online" : "Offline"}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Link href="/dashboard/search">
            <Button variant="outline" size="sm" className="mr-2">
              Browse Property
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                {chat.isPinned ? "Unpin chat" : "Pin chat"}
              </DropdownMenuItem>
              <DropdownMenuItem>Clear chat</DropdownMenuItem>
              <DropdownMenuItem>Block user</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{
          backgroundImage:
            'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Sla3geGzHSLBqJIPH8LUCTjknjoKhO.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <PropertyInviteCard
          image="https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg"
          title="Rosewood Apartments"
          location="12 Oak Lane, Lagos, Nigeria"
          price="₦280,000"
          specs={["3 Bedrooms", "2 Bathrooms"]}
          onAccept={() => console.log("Accepted")}
          onReject={() => console.log("Rejected")}
          onReschedule={() => console.log("Rescheduled")}
        />

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-2/3" />
            ))}
          </div>
        ) : (
          <>
            {chat.messages?.map((message: any) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                timestamp={message.timestamp}
                isOwn={message.isOwn}
                status={message.status}
                isPinned={message.isPinned}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
          {/* Hidden file inputs */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            multiple
          />
          <input
            type="file"
            ref={mediaInputRef}
            className="hidden"
            accept="image/*,video/*,audio/*"
            onChange={handleFileSelect}
            multiple
          />

          {/* File upload button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          {/* Media upload button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-gray-100"
            onClick={() => mediaInputRef.current?.click()}
            disabled={isSending}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>

          {/* Audio Recorder */}
          <AudioRecorder 
            onRecordingComplete={handleAudioComplete}
            isDisabled={isSending}
          />

         <div className="flex-1 flex w-full">
         <Input
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isSending}
          />
         </div>
          <Button
            className="bg-red-600 hover:bg-red-700 rounded-full "
            size="icon"
            onClick={() => onSendMessage()}
            disabled={isSending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 