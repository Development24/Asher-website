"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, File, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
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
import { useGetEmails, useGetSentEmails, useSendOrDraftEmail, useGetDraftEmails, useGetUnreadEmails } from "@/services/email/emailFn";
import { userStore } from "@/store/userStore";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { InboxSkeleton } from "./email-skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

function ComposeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: sendOrDraftEmail, isPending, isError, error, reset } = useSendOrDraftEmail();
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSend = () => {
    if (!receiverEmail || !subject || !body) {
      setErrorMsg("All fields are required to send an email.");
      return;
    }
    setErrorMsg("");
    sendOrDraftEmail(
      { receiverEmail, subject, body, files },
      {
        onSuccess: () => {
          setReceiverEmail("");
          setSubject("");
          setBody("");
          setFiles([]);
          reset();
          onClose();
        },
        onError: () => setErrorMsg("Failed to send email."),
      }
    );
  };

  const handleSaveDraft = () => {
    if (!subject && !body) {
      setErrorMsg("Subject or body required to save draft.");
      return;
    }
    setErrorMsg("");
    sendOrDraftEmail(
      { subject, body, files, isDraft: true },
      {
        onSuccess: () => {
          setReceiverEmail("");
          setSubject("");
          setBody("");
          setFiles([]);
          reset();
          onClose();
        },
        onError: () => setErrorMsg("Failed to save draft."),
      }
    );
  };

  const handleClose = () => {
    setReceiverEmail("");
    setSubject("");
    setBody("");
    setFiles([]);
    setErrorMsg("");
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              placeholder="Recipient's email"
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              className="min-h-[120px]"
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor="attachments">Attachments</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isPending}
            />
            {files.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {files.map((file) => file.name).join(", ")}
              </div>
            )}
          </div>
          {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isPending}>Cancel</Button>
            <Button onClick={handleSaveDraft} disabled={isPending} variant="secondary">Save as Draft</Button>
            <Button onClick={handleSend} disabled={isPending} className="bg-primary-600 text-white">
              {isPending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function InboxPage() {
  const [selectedTab, setSelectedTab] = useState("inbox");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const user = userStore((state) => state.user);
  const { data: inboxData, isFetching: isFetchingInbox } = useGetEmails();
  const { data: sentData, isFetching: isFetchingSent } = useGetSentEmails();
  const { data: draftData, isFetching: isFetchingDrafts } = useGetDraftEmails();
  const { data: unreadData } = useGetUnreadEmails();
  const unreadCount = unreadData?.emails?.length || 0;

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    // Implement delete logic here (e.g., call mutation, refetch list)
  };

  const isAnySelected = selectedIds.length > 0;

  const getSenderInitial = (email: any) => {
    if (email.sender?.profile?.firstName) return email.sender.profile.firstName[0].toUpperCase();
    if (email.senderEmail) return email.senderEmail[0].toUpperCase();
    return "?";
  };

  const renderEmailRow = (email: any, isActive: boolean) => (
    <div
      key={email.id}
      className={`flex items-center px-6 py-4 border-b transition-colors rounded-lg group ${
        isActive
          ? "bg-primary-50 hover:bg-primary-100"
          : isAnySelected
          ? "bg-gray-50 text-gray-400"
          : "hover:bg-gray-100"
      }`}
      style={{ cursor: "pointer", marginBottom: "8px" }}
      onClick={() => handleSelect(email.id)}
    >
      <input
        type="checkbox"
        checked={isActive}
        onChange={() => handleSelect(email.id)}
        className="mr-4 accent-primary-600"
        onClick={(e) => e.stopPropagation()}
      />
      <Avatar className="mr-4 h-9 w-9 bg-primary-100 text-primary-700 font-bold text-lg shadow-md">
        <AvatarFallback>{getSenderInitial(email)}</AvatarFallback>
      </Avatar>
      <Link
        href={`/dashboard/inbox/${email.id}`}
        className="flex-1 flex items-center gap-2 min-w-0"
        style={{ textDecoration: "none" }}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-medium truncate max-w-[320px]">{email.subject}</span>
      </Link>
      <span className="ml-auto text-sm text-gray-400 min-w-[90px] text-right">
        {email.createdAt ? new Date(email.createdAt).toLocaleDateString() : ""}
      </span>
      <ChevronRight className="ml-4 h-5 w-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
      {isActive && (
        <button
          className="ml-4 p-2 rounded hover:bg-red-50 text-red-600 hover:text-red-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(email.id);
          }}
          aria-label="Delete email"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="layout">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Inbox</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inbox</h1>
        <Button onClick={() => setShowComposeModal(true)} className="bg-primary-600 text-white">Compose</Button>
      </div>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inbox">
            Inbox
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">
          {/* Inbox emails list */}
          {isFetchingInbox ? (
            <InboxSkeleton />
          ) : inboxData?.emails?.length ? (
            <div className="rounded-lg border overflow-hidden divide-y">
              {inboxData.emails.map((email: any) =>
                renderEmailRow(email, selectedIds.includes(email.id))
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No emails in your inbox.</div>
          )}
        </TabsContent>
        <TabsContent value="sent">
          {/* Sent emails list */}
          {isFetchingSent ? (
            <InboxSkeleton />
          ) : sentData?.emails?.length ? (
            <div className="rounded-lg border overflow-hidden divide-y">
              {sentData.emails.map((email: any) =>
                renderEmailRow(email, selectedIds.includes(email.id))
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No sent emails.</div>
          )}
        </TabsContent>
        <TabsContent value="drafts">
          {/* Drafts emails list */}
          {isFetchingDrafts ? (
            <InboxSkeleton />
          ) : draftData?.emails?.length ? (
            <div className="rounded-lg border overflow-hidden divide-y">
              {draftData.emails.map((email: any) =>
                renderEmailRow(email, selectedIds.includes(email.id))
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No drafts saved.</div>
          )}
        </TabsContent>
      </Tabs>
      {showComposeModal && <ComposeModal open={showComposeModal} onClose={() => setShowComposeModal(false)} />}
      {/* Compose Modal (to be implemented) */}
      {/* Reply and Delete actions will be implemented in detail next */}
    </div>
  );
}
