
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from 'lucide-react';
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
    <Card className="animate-scale-in overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 h-full flex flex-col">
      <div className="h-1.5 bg-gradient-to-r from-edu-purple to-blue-500"></div>
      <CardContent className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-lg mb-2 font-poppins text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-1">{description}</p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <div className="bg-edu-gray/30 px-2 py-1 rounded-full flex items-center gap-1">
            <Clock className="h-3 w-3 text-edu-purple" />
            <span>{timeMinutes} min</span>
          </div>
          <div className="bg-edu-gray/30 px-2 py-1 rounded-full">
            {questionCount} questions
          </div>
        </div>
        
        <Button 
          onClick={handleStartQuiz} 
          variant="outline"
          className="w-full group hover:bg-edu-purple hover:text-white border-edu-purple/30 text-edu-purple transition-colors"
        >
          Start Quiz
          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizCard;
