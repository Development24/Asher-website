"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Forward,
  Reply,
  Star,
  Trash2,
  Paperclip,
  Send,
  Image,
  Smile
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetEmailById, useSendEmail, useForwardEmail, useReplyToEmail, useUpdateEmailState } from "@/services/email/emailFn";
import { format } from "date-fns";
import { EmailDetailSkeleton } from "./email-detail-skeleton";
import { MessageBody } from "../../../components/email/MessageBody";
import {
  getFileTypeIcon,
  getAttachmentName,
  handleAttachmentDownload
} from "../../../services/email/email-helpers";

interface Attachment {
  name: string;
  size: string;
  type: string;
}

interface SingleEmailMessage {
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
}

// Helper to get sender display name
const getSenderDisplayName = (msg: any): string => {
  if (msg?.sender?.profile?.fullname) return String(msg.sender.profile.fullname);
  if (msg?.sender?.profile?.firstName || msg?.sender?.profile?.lastName) return `${msg.sender.profile.firstName || ""}${msg.sender.profile.lastName ? ` ${msg.sender.profile.lastName}` : ""}`;
  if (msg?.sender?.email) return String(msg.sender.email);
  return "";
};

export default function MessagePage() {
  const router = useRouter();
  const { id } = useParams();
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [forwardTo, setForwardTo] = useState("");
  const [forwardMessage, setForwardMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const { data, isFetching: isFetchingMessage } = useGetEmailById(
    id as string
  );
  const message = data?.email;
  const { mutate: sendEmail, isPending } = useSendEmail();
  const { mutate: forwardEmail, isPending: isForwarding } = useForwardEmail();
  const { mutate: replyToEmail, isPending: isReplying } = useReplyToEmail();
  const { mutate: updateEmailState, isPending: isDeleting } = useUpdateEmailState();
  const [replyError, setReplyError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [replyFiles, setReplyFiles] = useState<File[]>([]);
  const replyFileInputRef = useRef<HTMLInputElement>(null);
  const [replyReceiver, setReplyReceiver] = useState("");
  const [replySubject, setReplySubject] = useState("");

  useEffect(() => {
    if (message && !message.isRead) {
      updateEmailState({ id: message.id, isRead: true });
    }
  }, [message]);

  console.log(message);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleReplyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setReplyFiles(Array.from(e.target.files));
    }
  };

  const handleReply = () => {
    // Handle reply logic here
    console.log("Reply:", replyMessage);

    sendEmail(
      {
        senderEmail: message?.senderEmail || "",
        receiverEmail: message?.receiverEmail || "",
        subject: message?.subject || "",
        body: replyMessage
      },
      {
        onSuccess: () => {
          setShowReplyDialog(false);
          setReplyMessage("");
        }
      }
    );
  };

  const handleForward = () => {
    if (!forwardTo) return;
    forwardEmail(
      {
        emailId: message?.id,
        receiverEmail: forwardTo,
        subject: message?.subject,
        body: forwardMessage,
        files: attachments,
      },
      {
        onSuccess: () => {
          setShowForwardDialog(false);
          setForwardTo("");
          setForwardMessage("");
          setAttachments([]);
        },
      }
    );
  };

  const handleReplySend = () => {
    if (!replyMessage) {
      setReplyError("Reply message cannot be empty.");
      return;
    }
    setReplyError("");
    replyToEmail(
      { originalEmailId: message?.id || "", additionalMessage: replyMessage, files: replyFiles },
      {
        onSuccess: () => {
          setReplyMessage("");
          setReplyFiles([]);
          setShowReplyDialog(false);
        },
        onError: () => setReplyError("Failed to send reply."),
      }
    );
  };

  const handleDelete = () => {
    if (!message?.id) return;
    setDeleteError("");
    updateEmailState(
      { id: message.id, isDeleted: true },
      {
        onSuccess: () => {
          router.push("/dashboard/inbox");
        },
        onError: () => setDeleteError("Failed to delete email."),
      }
    );
  };

  // Add a function to remove a file from replyFiles
  const handleRemoveReplyFile = (index: number) => {
    setReplyFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (isFetchingMessage) {
    return <EmailDetailSkeleton />;
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Home</Link>
          <span className="text-gray-400">/</span>
          <Link href="/dashboard/inbox" className="text-gray-600 hover:text-gray-900">Inbox</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Message</span>
        </div>
        {/* Subject */}
        <h1 className="text-2xl font-bold mb-4 text-primary-900">{message?.subject || "No Subject"}</h1>
        {/* Sender & Receiver Info */}
        <div className="flex items-center gap-4 mb-6 relative">
          <Avatar className="h-12 w-12 bg-primary-100 text-primary-700 font-bold text-xl shadow-md">
            <AvatarImage src={String(message?.sender?.profile?.profileUrl ?? '')} />
            <AvatarFallback>{getSenderDisplayName(message).slice(0,2).toUpperCase() || "CP"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-lg text-primary-900">{getSenderDisplayName(message)}</div>
            <div className="text-xs text-gray-500">{message?.sender?.email || ""}</div>
          </div>
          <span className="mx-2 text-gray-400 text-lg">→</span>
          <div>
            <div className="font-semibold text-lg text-primary-900">{message?.receiver?.profile?.fullname || message?.receiver?.email}</div>
            <div className="text-xs text-gray-500">{message?.receiver?.email || ""}</div>
          </div>
          <div className="ml-auto text-xs text-gray-400">
            {message?.createdAt ? format(new Date(message.createdAt), "MMM d, yyyy, h:mm a") : ""}
          </div>
          {/* Reply icon for original message */}
          <button
            className="absolute top-0 right-0 p-2 rounded hover:bg-primary-50 text-primary-600 hover:text-primary-800 transition-colors flex items-center"
            aria-label="Reply to this message"
            onClick={() => {
              setShowReplyDialog(true);
              setReplyMessage("");
              setReplyReceiver(message?.senderEmail || "");
              setReplySubject(message?.subject?.startsWith("Re: ") ? message?.subject : `Re: ${message?.subject || ""}`);
            }}
          >
            <Reply className="h-5 w-5" />
          </button>
        </div>
        {/* Body */}
        <div className="prose mb-8 text-gray-800 text-base">
          {message?.body || <span className="text-gray-400">No message body.</span>}
        </div>
        {/* Attachments */}
        {message?.attachment && message.attachment.length > 0 && (
          <div className="mb-8">
            <h3 className="font-medium mb-2 text-primary-800">Attachments</h3>
            <ul className="flex flex-wrap gap-4">
              {message.attachment.map((url: string, idx: number) => {
                const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
                return (
                  <li key={idx} className="bg-gray-50 rounded p-2 shadow-sm flex flex-col items-center w-40">
                    {isImage && (
                      <img src={url} alt="attachment preview" className="w-32 h-24 object-cover rounded mb-2 border" />
                    )}
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all text-xs">
                      {getAttachmentName(url, idx)}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {/* Divider before replies */}
        {message?.replies && message.replies.length > 0 && <hr className="my-8 border-t border-gray-200" />}
        {/* Replies */}
        {message?.replies && message.replies.length > 0 && (
          <div className="mt-8">
            <h3 className="font-medium mb-2 text-primary-800">Replies</h3>
            <ul className="space-y-4">
              {message.replies.map((reply: any, idx: number) => {
                // Split reply.body into actual reply and quoted/original message
                let mainText = reply.body;
                let quotedText = "";
                const originalMsgIdx = reply.body.indexOf("--- Original Message ---");
                if (originalMsgIdx !== -1) {
                  mainText = reply.body.slice(0, originalMsgIdx).trim();
                  quotedText = reply.body.slice(originalMsgIdx).trim();
                }
                return (
                  <li key={reply.id || idx} className="border rounded p-3 bg-gray-50 relative">
                    <div className="flex flex-wrap items-center text-sm text-gray-700 mb-1 gap-2">
                      <span className="font-semibold">{reply.senderEmail}</span>
                      <span>to</span>
                      <span className="font-semibold">{reply.receiverEmail}</span>
                      <span className="ml-2 text-gray-400">{reply.createdAt ? format(new Date(reply.createdAt), "MMM d, yyyy, h:mm a") : ""}</span>
                      <button
                        className="ml-auto p-1 rounded hover:bg-primary-50 text-primary-600 hover:text-primary-800 transition-colors flex items-center"
                        aria-label="Reply to this message"
                        onClick={() => {
                          setShowReplyDialog(true);
                          setReplyMessage("");
                          setReplyReceiver(reply.senderEmail || "");
                          setReplySubject(reply.subject?.startsWith("Re: ") ? reply.subject : `Re: ${reply.subject || ""}`);
                        }}
                      >
                        <Reply className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mb-2 text-base text-gray-900 whitespace-pre-line">{mainText}</div>
                    {quotedText && (
                      <div className="text-xs italic text-gray-500 border-t pt-2 mt-2 whitespace-pre-line">{quotedText}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="sm:max-w-[600px] border-white/20 bg-gray-950/70 backdrop-blur-xl text-white">
          <DialogHeader>
            <DialogTitle>
              Reply to {replyReceiver}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              id="reply-to"
              type="email"
              value={replyReceiver}
              onChange={e => setReplyReceiver(e.target.value)}
              placeholder="Recipient's email"
              disabled={isReplying}
            />
            <Input
              id="reply-subject"
              value={replySubject}
              onChange={e => setReplySubject(e.target.value)}
              placeholder="Subject"
              disabled={isReplying}
            />
            <Textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Write your reply..."
              className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={isReplying}
            />
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2 border border-white/20">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/20 text-white"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/20 text-white"
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/20 text-white"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                multiple
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowReplyDialog(false)}
                disabled={isReplying}
                className="text-white hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReplySend}
                disabled={isReplying}
                className="gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <Send className="h-4 w-4" />
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
