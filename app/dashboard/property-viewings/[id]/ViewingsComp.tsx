import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {MessageSquare, Mail, Calendar, Clock} from 'lucide-react'
import Image from "next/image";
interface ScheduleDisplayProps {
    date: string;
    time: string;
    isStrikethrough?: boolean;
    label?: string;
    className?: string;
  }
  
export const ScheduleDisplay = ({
    date,
    time,
    isStrikethrough,
    label,
    className
  }: ScheduleDisplayProps) => (
    <div className={cn("space-y-2", className)}>
      {label && (
        <h3 className="text-sm font-medium text-gray-500 mb-2">{label}</h3>
      )}
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className={isStrikethrough ? "line-through" : ""}>{date}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className={isStrikethrough ? "line-through" : ""}>{time}</span>
      </div>
    </div>
  );
  
  export const ViewingActions = ({
    onReschedule,
    onCancel,
    variant = "secondary"
  }: {
    onReschedule: () => void;
    onCancel: () => void;
    variant?: "primary" | "secondary";
  }) => (
    <div className="space-y-3">
      <Button variant="outline" className="w-full" onClick={onReschedule}>
        {variant === "primary" ? "Reschedule viewing" : "Reschedule"}
      </Button>
      <Button
        variant="outline"
        className="w-full text-red-600 hover:bg-red-50"
        onClick={onCancel}
      >
        {variant === "primary" ? "Cancel viewing" : "Reject"}
      </Button>
    </div>
  );
  
  export const ContactAgentSection = ({ landlord }: { landlord: any }) => (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Contact Agent</h2>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-12 h-12">
          <Image
            src={landlord?.user?.profile?.profileUrl || "/placeholder.svg"}
            alt={landlord?.user?.profile?.fullname || "Agent"}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div>
          <div className="font-medium">
            {landlord?.user?.profile?.firstName}{" "}
            {landlord?.user?.profile?.lastName}
          </div>
          <div className="text-sm text-gray-600">{landlord?.user?.email}</div>
        </div>
      </div>
      <div className="space-y-3">
        <Button className="w-full flex items-center justify-center gap-2" onClick={() => {
          window.open(`https://wa.me/${landlord?.user?.profile?.phoneNumber}`, '_blank');
        }}>
          <MessageSquare className="w-4 h-4" />
          Chat with agent
        </Button>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {
            window.open(`mailto:${landlord?.user?.email}`, '_blank');
          }}
        >
          <Mail className="w-4 h-4" />
          Email agent
        </Button>
      </div>
    </div>
  );