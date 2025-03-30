"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, File, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetEmails } from "@/services/email/emailFn";
import { userStore } from "@/store/userStore";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { InboxSkeleton } from "./email-skeleton";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  isStarred: boolean;
  hasAttachment: boolean;
  isRead: boolean;
}

interface Profile {
  fullname: string;
  profileUrl: string | null;
  firstName: string;
  lastName: string;
}

interface User {
  email: string;
  role: string[];
  profile: Profile;
}

interface Email {
  id: string;
  senderEmail: string;
  receiverEmail: string;
  subject: string;
  body: string;
  attachment: string[];
  isReadBySender: boolean;
  isReadByReceiver: boolean;
  isDraft: boolean;
  isSent: boolean;
  createdAt: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
}



export default function InboxPage() {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const user = userStore((state) => state.user);
  const { data: emails, isFetching: isFetchingEmails } = useGetEmails(
    user?.email || ""
  );

  const messages: Email[] = emails?.emails;

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    );
  };

  // const toggleStar = (messageId: string) => {
  //   setMessages(prev => prev.map(message =>
  //     message.id === messageId
  //       ? { ...message, isStarred: !message.isStarred }
  //       : message
  //   ))
  // }

  // const deleteSelected = () => {
  //   setMessages(prev => prev.filter(message => !selectedMessages.includes(message.id)))
  //   setSelectedMessages([])
  // }

  const filteredMessages = messages?.filter((message) => {
    switch (filter) {
      case "draft":
        return message.isDraft;
      case "sent":
        return message.isSent;
      default:
        return true;
    }
  });

  if (isFetchingEmails) {
    return <InboxSkeleton />;
  }

  return (
    <div className="layout">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Inbox</span>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Inbox</h1>
          <p className="text-gray-500">
            Keep track of all your conversations in one place.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search for email" className="pl-9" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="starred">Starred</SelectItem>
              </SelectContent>
            </Select>
            {selectedMessages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                // onClick={deleteSelected}
              >
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {filteredMessages?.map((message) => (
            <Link
              key={message.id}
              href={`/dashboard/inbox/${message.id}`}
              className={`block relative rounded-lg border p-4 hover:bg-gray-50 ${
                message?.isReadByReceiver ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedMessages.includes(message.id)}
                  onCheckedChange={() => toggleMessageSelection(message.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // toggleStar(message.id)
                  }}
                  className={`p-1 rounded-full hover:bg-gray-100 ${
                    message.isDraft ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  <Star className="h-4 w-4" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={`font-medium ${
                        !message.isReadByReceiver && "text-gray-900"
                      }`}
                    >
                      {message?.sender?.profile?.firstName} {message?.sender?.profile?.lastName}
                    </span>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {format(new Date(message?.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <h3
                    className={`text-sm ${
                      !message.isReadByReceiver && "font-medium text-gray-900"
                    }`}
                  >
                    {message?.subject}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 max-w-60">
                    {message?.body}
                  </p>
                  {message?.attachment?.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                      <File className="h-4 w-4" />
                      <span>{message?.attachment?.length} attachment</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-gray-500">
            Showing {filteredMessages?.length} messages
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
