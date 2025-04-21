
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, getQuizQuestions, QuizQuestion } from '@/services/api';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';

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
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  
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

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = () => {
    // In a real app, this would submit the answers to the backend
    toast({
      title: "Quiz Submitted",
      description: "Your answers have been submitted successfully",
    });
    
    // Navigate back to dashboard or to a results page
    setTimeout(() => navigate('/'), 1500);
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-8 flex items-center justify-center min-h-[60vh]">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-edu-gray/30 rounded-full flex items-center justify-center animate-pulse">
                <Clock className="w-8 h-8 text-edu-purple/60" />
              </div>
              <p className="text-lg font-medium">Loading quiz...</p>
            </div>
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
  
  const isAllQuestionsAnswered = questions.length > 0 && 
    questions.every(q => selectedAnswers[q.id] !== undefined);
  
  return (
    <>
      <Header />
      <div className="container py-8 max-w-4xl">
        <Button variant="outline" onClick={handleBack} className="mb-4 hover:bg-edu-gray/20">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <Card className="mb-6 overflow-hidden border-0 shadow-md">
          <div className="h-2 bg-gradient-to-r from-edu-purple to-blue-500"></div>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-3 text-gray-800">{quiz.title}</h1>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            <div className="flex items-center gap-3 text-sm text-gray-500 pb-2 border-b border-gray-100">
              <div className="bg-edu-gray/30 px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="h-4 w-4 text-edu-purple" />
                <span>{quiz.time_minutes} minutes</span>
              </div>
              <div className="bg-edu-gray/30 px-3 py-1 rounded-full">
                {quiz.question_count} questions
              </div>
            </div>
          </CardContent>
        </Card>
        
        {questions.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <span className="w-1 h-5 bg-edu-purple rounded-full mr-2"></span>
              Questions
            </h2>
            
            {questions.map((question, index) => (
              <Card key={question.id} className="overflow-hidden border-0 shadow-sm hover:shadow transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-edu-purple/10 text-edu-purple font-medium rounded-full w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <h3 className="font-medium text-lg text-gray-800">{question.question}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex} 
                        className={`flex items-center p-3 border rounded-lg transition-all duration-200 cursor-pointer ${
                          selectedAnswers[question.id] === optionIndex 
                            ? 'border-edu-purple bg-edu-purple/5' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => handleAnswerSelect(question.id, optionIndex)}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          selectedAnswers[question.id] === optionIndex 
                            ? 'bg-edu-purple text-white' 
                            : 'border border-gray-300 text-transparent'
                        }`}>
                          {selectedAnswers[question.id] === optionIndex && <CheckCircle className="h-4 w-4" />}
                        </div>
                        <span className="text-gray-700">
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleSubmit} 
                disabled={!isAllQuestionsAnswered}
                className="bg-edu-purple hover:bg-edu-purple/90 text-white py-2 px-6 rounded-lg"
              >
                Submit Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
            <p className="text-gray-600">No questions available for this quiz.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizPage;
