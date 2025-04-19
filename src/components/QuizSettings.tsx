
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getQuizSettings, updateQuizSettings, getSubjects } from '@/services/api';
import type { Subject } from '@/services/api';

const QuizSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['quizSettings'],
    queryFn: getQuizSettings
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects
  });

  const mutation = useMutation({
    mutationFn: updateQuizSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizSettings'] });
      toast({
        title: "Settings updated",
        description: "Your quiz preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      });
    }
  });

  const handleTimePreferenceChange = (value: string) => {
    mutation.mutate({ time_preference_minutes: parseInt(value) });
  };

  const handleDifficultyChange = (value: string) => {
    mutation.mutate({ difficulty_level: value });
  };

  const handleNotificationsChange = (checked: boolean) => {
    mutation.mutate({ notifications_enabled: checked });
  };

  const handleSubjectPreferenceChange = (subjectId: number) => {
    const currentPreferences = settings?.preferred_subject_ids || [];
    const newPreferences = currentPreferences.includes(subjectId)
      ? currentPreferences.filter(id => id !== subjectId)
      : [...currentPreferences, subjectId];
    
    mutation.mutate({ preferred_subject_ids: newPreferences });
  };

  return (
    <div className="space-y-6 p-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Quiz Settings</h2>
        <p className="text-muted-foreground">Customize your quiz experience</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <Select
            value={settings?.difficulty_level || 'medium'}
            onValueChange={handleDifficultyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Time Preference (minutes)</Label>
          <Input
            type="number"
            value={settings?.time_preference_minutes || 30}
            onChange={(e) => handleTimePreferenceChange(e.target.value)}
            min={5}
            max={120}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={settings?.notifications_enabled}
            onCheckedChange={handleNotificationsChange}
          />
          <Label>Enable Notifications</Label>
        </div>

        <div className="space-y-2">
          <Label>Preferred Subjects</Label>
          <div className="grid grid-cols-2 gap-2">
            {subjects.map((subject: Subject) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <Switch
                  checked={settings?.preferred_subject_ids?.includes(subject.id)}
                  onCheckedChange={() => handleSubjectPreferenceChange(subject.id)}
                />
                <Label>{subject.title}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSettings;
