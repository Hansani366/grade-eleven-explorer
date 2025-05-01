
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  type: 'quiz' | 'note' | 'practice';
  subject: string;
  title: string;
  timestamp: string;
  score?: number;
}

interface RecentActivityProps {
  activities: Activity[];
  loading?: boolean;
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center 
      ${type === 'quiz' ? 'bg-blue-100 text-blue-600' : 
        type === 'note' ? 'bg-green-100 text-green-600' : 
        'bg-amber-100 text-amber-600'}`}>
      {type === 'quiz' ? 'Q' : type === 'note' ? 'N' : 'P'}
    </div>
  );
};

const RecentActivity = ({ activities, loading = false }: RecentActivityProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-poppins flex items-center justify-between">
          Recent Activity
          {loading && (
            <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex gap-3 items-center">
            <ActivityIcon type={activity.type} />
            <div className="flex-1">
              <h4 className="text-sm font-medium">{activity.title}</h4>
              <p className="text-xs text-gray-500">{activity.subject} • {activity.timestamp}</p>
            </div>
            {activity.score !== undefined && (
              <div className="bg-edu-gray px-2 py-1 rounded text-sm font-medium">
                {activity.score}%
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
