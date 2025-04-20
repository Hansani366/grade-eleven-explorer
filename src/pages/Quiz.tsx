
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, getQuizQuestions, QuizQuestion } from '@/services/api';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock } from 'lucide-react';

interface Quiz {
  id: number;
  title: string;
  description: string;
  time_minutes: number;
  question_count: number;
  subject_id: number;
}

const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadQuizData = async () => {
      if (!quizId) {
        toast({
          title: "Error",
          description: "Quiz ID is missing",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      try {
        setLoading(true);
        const quizData = await getQuizById(Number(quizId));
        
        if (!quizData) {
          toast({
            title: "Error",
            description: "Quiz not found",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        setQuiz(quizData);
        
        // Load questions
        const questionsData = await getQuizQuestions(Number(quizId));
        setQuestions(questionsData);
        
        // Update question count in quiz object
        setQuiz(prev => prev ? { ...prev, question_count: questionsData.length } : null);
      } catch (error) {
        console.error("Error loading quiz:", error);
        toast({
          title: "Error",
          description: "Failed to load quiz data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadQuizData();
  }, [quizId, navigate, toast]);
  
  const handleBack = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-lg">Loading quiz...</p>
          </div>
        </div>
      </>
    );
  }
  
  if (!quiz) {
    return (
      <>
        <Header />
        <div className="container py-8">
          <Button variant="outline" onClick={handleBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Not Found</h2>
            <p className="text-gray-600 mb-6">The quiz you are looking for does not exist.</p>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Header />
      <div className="container py-8">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{quiz.time_minutes} minutes • {quiz.question_count} questions</span>
            </div>
          </CardContent>
        </Card>
        
        {questions.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Questions:</h2>
            {questions.map((question, index) => (
              <Card key={question.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Question {index + 1}: {question.question}</h3>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
                        <span className="mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                        {option}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600">No questions available for this quiz.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizPage;
