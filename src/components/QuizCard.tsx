
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizCardProps {
  id: number;
  title: string;
  description: string;
  timeMinutes: number;
  questionCount: number;
}

const QuizCard = ({ id, title, description, timeMinutes, questionCount }: QuizCardProps) => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate(`/quiz/${id}`);
  };

  return (
    <Card className="animate-scale-in">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-2 font-poppins">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Clock className="h-4 w-4" />
          <span>{timeMinutes} min • {questionCount} questions</span>
        </div>
        <Button 
          onClick={handleStartQuiz} 
          className="w-full bg-edu-purple hover:bg-edu-purple/90 text-white"
        >
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
