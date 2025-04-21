"use client";

import { useState } from "react";
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
import { useGetEmailById, useSendEmail } from "@/services/email/emailFn";
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

export default function MessagePage() {
  const router = useRouter();
  const { id } = useParams();
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [forwardTo, setForwardTo] = useState("");
  const [forwardMessage, setForwardMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const { data: message, isFetching: isFetchingMessage } = useGetEmailById(
    id as string
  );
  const { mutate: sendEmail, isPending } = useSendEmail();

  console.log(message);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleReply = () => {
    // Handle reply logic here
    console.log("Reply:", replyMessage);

    sendEmail(
      {
        senderEmail: message?.senderEmail,
        receiverEmail: message?.receiverEmail,
        subject: message?.subject,
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
    // Handle forward logic here
    console.log("Forward to:", forwardTo);
    console.log("Message:", forwardMessage);
    setShowForwardDialog(false);
    setForwardTo("");
    setForwardMessage("");
  };

  if (isFetchingMessage) {
    return <EmailDetailSkeleton />;
  }

  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          href="/dashboard/inbox"
          className="text-gray-600 hover:text-gray-900"
        >
          Inbox
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Message</span>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to inbox
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowReplyDialog(true)}
            >
              <Reply className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowForwardDialog(true)}
            >
              <Forward className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">{message?.subject}</h1>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={message?.sender?.profile?.profileUrl} />
                <AvatarFallback>CP</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{`${message?.sender?.profile?.firstName} ${message?.sender?.profile?.lastName}`}</div>
                <div className="text-sm text-gray-500">
                  {message?.sender?.email}
                </div>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {format(new Date(message?.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>

          <MessageBody text={message?.body} />

          {message?.attachment && message?.attachment?.length > 0 && (
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Attachments</h3>
              <div className="space-y-2">
                {message?.attachment?.map(
                  (attachment: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-lg">
                        {getFileTypeIcon(attachment)}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">
                          {getAttachmentName(attachment, index)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleAttachmentDownload(
                            attachment,
                            getAttachmentName(attachment, index)
                          )
                        }
                      >
                        Download
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent className="sm:max-w-[600px] border-white/20 bg-gray-950/70 backdrop-blur-xl text-white">
          <DialogHeader>
            <DialogTitle>
              Reply to {message?.sender?.profile?.fullname}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Write your reply..."
              className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
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
                disabled={isPending}
                className="text-white hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReply}
                loading={isPending}
                className="gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <Send className="h-4 w-4" />
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Forward Dialog */}
      <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
        <DialogContent className="sm:max-w-[600px] border-white/20 bg-gray-950/70 backdrop-blur-xl text-white">
          <DialogHeader>
            <DialogTitle>Forward Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forward-to">To</Label>
              <Input
                id="forward-to"
                value={forwardTo}
                onChange={(e) => setForwardTo(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <Textarea
              value={forwardMessage}
              onChange={(e) => setForwardMessage(e.target.value)}
              placeholder="Add a message..."
              className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <div className="space-y-2">
              <Label htmlFor="forward-attachments">Attachments</Label>
              <Input
                id="forward-attachments"
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowForwardDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleForward}
                className="gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <Send className="h-4 w-4" />
                Forward
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
