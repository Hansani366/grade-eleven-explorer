
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CircleProgress } from './CircleProgress';

interface SubjectCardProps {
  title: string;
  icon: React.ReactNode;
  progress: number;
  color: string;
  onClick: () => void;
  id?: number; // Make id optional to avoid breaking existing code
}

const SubjectCard = ({ title, icon, progress, color, onClick, id }: SubjectCardProps) => {
  return (
    <Card 
      className="transition-transform hover:scale-105 cursor-pointer animate-fade-in" 
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 ${color}`}>
          {icon}
        </div>
        <h3 className="font-medium text-lg mb-2 font-poppins">{title}</h3>
        <CircleProgress progress={progress} />
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
