
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getRecentActivities } from '@/services/api';

interface ActivityType {
  type: 'quiz' | 'note' | 'practice';
  subject: string;
  title: string;
  timestamp: string;
  score?: number;
}

export const useRecentActivities = (limit: number = 5) => {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const activitiesData = await getRecentActivities(limit);
        setActivities(activitiesData);
      } catch (error) {
        console.error("Error loading activities:", error);
        toast({
          title: "Error",
          description: "Failed to load recent activities",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [toast, limit]);

  return { activities, loading };
};
