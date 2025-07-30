"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, Clock, MessageSquare, Calendar, Home } from "lucide-react";
import { useDashboardStats } from "@/services/application/applicationFn";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityItem {
  id: string;
  type: 'feedback' | 'viewing' | 'application' | 'invite';
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'cancelled';
  propertyName?: string;
  propertyId?: string;
}

export default function ActivityLogPage() {
  const { data: dashboardStats, isFetching } = useDashboardStats();
  
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'feedback' | 'viewing' | 'application'>('all');

  const dashboardData = dashboardStats?.stats;
  const recentFeedback = dashboardData?.recentFeedback || [];
  const recentInvites = dashboardData?.recentInvites || [];
  const applicationsStats = dashboardData?.applications;

  // Generate activity items from real data
  const generateActivityItems = (): ActivityItem[] => {
    const activities: ActivityItem[] = [];

    // Add feedback activities (completed feedback)
    recentFeedback.forEach((feedback: any) => {
      activities.push({
        id: `feedback-${feedback.id}`,
        type: 'feedback',
        title: 'Feedback Submitted',
        description: `You provided feedback for ${feedback.properties?.name || 'a property'}`,
        timestamp: new Date(feedback.createdAt || Date.now()),
        status: 'completed',
        propertyName: feedback.properties?.name,
        propertyId: feedback.properties?.id
      });
    });

    // Add viewing activities (accepted, declined, cancelled)
    recentInvites.forEach((invite: any) => {
      if (invite.response === 'ACCEPTED' || invite.response === 'RESCHEDULED_ACCEPTED') {
        activities.push({
          id: `viewing-${invite.id}`,
          type: 'viewing',
          title: 'Viewing Accepted',
          description: `You accepted a viewing for ${invite.properties?.name || 'a property'}`,
          timestamp: new Date(invite.updatedAt || invite.createdAt || Date.now()),
          status: 'completed',
          propertyName: invite.properties?.name,
          propertyId: invite.properties?.id
        });
      } else if (invite.response === 'DECLINED') {
        activities.push({
          id: `viewing-${invite.id}`,
          type: 'viewing',
          title: 'Viewing Declined',
          description: `You declined a viewing for ${invite.properties?.name || 'a property'}`,
          timestamp: new Date(invite.updatedAt || invite.createdAt || Date.now()),
          status: 'cancelled',
          propertyName: invite.properties?.name,
          propertyId: invite.properties?.id
        });
      } else if (invite.response === 'CANCELLED') {
        activities.push({
          id: `viewing-${invite.id}`,
          type: 'viewing',
          title: 'Viewing Cancelled',
          description: `A viewing was cancelled for ${invite.properties?.name || 'a property'}`,
          timestamp: new Date(invite.updatedAt || invite.createdAt || Date.now()),
          status: 'cancelled',
          propertyName: invite.properties?.name,
          propertyId: invite.properties?.id
        });
      }
    });

    // Add application activities (completed, rejected, cancelled)
    if (applicationsStats?.completedApplications && applicationsStats.completedApplications > 0) {
      activities.push({
        id: 'application-completed',
        type: 'application',
        title: 'Application Completed',
        description: `You completed ${applicationsStats.completedApplications} application${applicationsStats.completedApplications > 1 ? 's' : ''}`,
        timestamp: new Date(),
        status: 'completed'
      });
    }

    // Add rejected applications
    if (applicationsStats?.declinedApplications && applicationsStats.declinedApplications > 0) {
      activities.push({
        id: 'application-rejected',
        type: 'application',
        title: 'Application Rejected',
        description: `${applicationsStats.declinedApplications} application${applicationsStats.declinedApplications > 1 ? 's were' : ' was'} rejected`,
        timestamp: new Date(),
        status: 'cancelled'
      });
    }

    // Add cancelled applications
    if (applicationsStats?.cancelledApplications && applicationsStats.cancelledApplications > 0) {
      activities.push({
        id: 'application-cancelled',
        type: 'application',
        title: 'Application Cancelled',
        description: `You cancelled ${applicationsStats.cancelledApplications} application${applicationsStats.cancelledApplications > 1 ? 's' : ''}`,
        timestamp: new Date(),
        status: 'cancelled'
      });
    }

    // Sort by timestamp (newest first)
    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const activities = generateActivityItems();

  const filteredActivities = selectedFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === selectedFilter);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'feedback':
        return <MessageSquare className="h-5 w-5" />;
      case 'viewing':
        return <Calendar className="h-5 w-5" />;
      case 'application':
        return <Home className="h-5 w-5" />;
      case 'invite':
        return <Clock className="h-5 w-5" />;
      default:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: ActivityItem['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isFetching) {
    return (
      <div className="layout">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Activity Log</span>
        </div>
        <h1 className="text-3xl font-bold mb-8">Activity Log</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">Activity Log</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <div className="flex gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === 'feedback' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('feedback')}
          >
            Feedback
          </Button>
          <Button
            variant={selectedFilter === 'viewing' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('viewing')}
          >
            Viewings
          </Button>
          <Button
            variant={selectedFilter === 'application' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('application')}
          >
            Applications
          </Button>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Your activity log will show completed actions like submitted feedback, scheduled viewings, and completed applications.
            </p>
            <Button asChild>
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{activity.title}</h3>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-muted-foreground mb-2">{activity.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{format(activity.timestamp, 'MMM dd, yyyy')}</span>
                        <span>{format(activity.timestamp, 'HH:mm')}</span>
                        {activity.propertyName && (
                          <span className="font-medium text-foreground">{activity.propertyName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {activity.propertyId && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/property/${activity.propertyId}`}>
                        View Property
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 