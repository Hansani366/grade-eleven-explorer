
import React, { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CircleProgress } from './CircleProgress';
import { useSubjectProgress } from '@/hooks/useSubjectProgress';
import { useNavigate } from 'react-router-dom';
import { getSubjectIcon } from '@/utils/icons';

interface SubjectCardProps {
  title: string;
  icon?: React.ReactNode;
  color: string;
  onClick?: () => void;
  id: number;
}

// Use memo to prevent unnecessary re-renders
const SubjectCard = memo(({ title, icon, color, id }: SubjectCardProps) => {
  const progress = useSubjectProgress(id);
  const navigate = useNavigate();
  
  // Store a stable reference to the icon
  const displayIcon = React.useMemo(() => {
    return icon || getSubjectIcon(title);
  }, [icon, title]);

  const handleClick = () => {
    navigate(`/subject/${id}`);
  };

  return (
    <Card 
      className="transition-transform hover:scale-105 cursor-pointer animate-fade-in" 
      onClick={handleClick}
    >
      <CardContent className="p-6 flex flex-col items-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 ${color}`}>
          {displayIcon}
        </div>
        <h3 className="font-medium text-lg mb-2 font-poppins">{title}</h3>
        <CircleProgress progress={progress} />
      </CardContent>
    </Card>
  );
});

// Add display name for better debugging
SubjectCard.displayName = "SubjectCard";

export default SubjectCard;
