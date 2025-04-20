import React, { useEffect, useState } from 'react';
import { BookOpen, BookText, CircleDot, GraduationCap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import QuizCard from './QuizCard';
import SubjectCard from './SubjectCard';
import RecentActivity from './RecentActivity';
import FlashcardComponent from './FlashcardComponent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { getSubjects, getRecentActivities, Subject, getQuizzesBySubject, getFlashcardsBySubject } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

interface ActivityType {
  type: 'quiz' | 'note' | 'practice';
  subject: string;
  title: string;
  timestamp: string;
  score?: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);

  const { data: subjects = [] } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => getRecentActivities(5)
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        if (subjects.length > 0) {
          const mathSubject = subjects.find(s => s.title === 'Mathematics') || subjects[0];
          const quizzesData = await getQuizzesBySubject(mathSubject.id);
          setQuizzes(quizzesData);
          
          const flashcardsData = await getFlashcardsBySubject(mathSubject.id);
          setFlashcards(flashcardsData.map(f => ({
            question: f.question,
            answer: f.answer
          })));
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load your dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (subjects.length > 0) {
      loadDashboardData();
    }
    
    if (!user || loading) {
      setQuizzes([]);
      setFlashcards(fallbackFlashcards);
    }
  }, [subjects, user, toast, loading]);
  
  const fallbackFlashcards = [
    {
      question: "What is the slope-intercept form of a linear equation?",
      answer: "y = mx + b, where m is the slope and b is the y-intercept",
    },
    {
      question: "What is Newton's First Law of Motion?",
      answer: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an external force.",
    },
    {
      question: "What are the major themes in Shakespeare's 'Macbeth'?",
      answer: "Ambition, power, fate, deception, and guilt",
    },
  ];
  
  const handleSubjectClick = async (subjectId: number) => {
    try {
      setLoading(true);
      const [newQuizzes, newFlashcards] = await Promise.all([
        getQuizzesBySubject(subjectId),
        getFlashcardsBySubject(subjectId)
      ]);
      
      setQuizzes(newQuizzes);
      setFlashcards(newFlashcards.map(f => ({
        question: f.question,
        answer: f.answer
      })));
    } catch (error) {
      console.error("Error loading subject data:", error);
      toast({
        title: "Error",
        description: "Failed to load subject content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportSubjects = () => {
    const exportData = subjects.map(subject => ({
      Name: subject.name,
      Title: subject.title || subject.name,
      Progress: subject.progress || 0,
      Description: subject.description || ''
    }));
    
    exportToCSV(exportData, 'subjects');
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold font-poppins mb-6">
        {user ? `Welcome Back, ${user.user_metadata?.full_name || 'Student'}!` : 'Welcome Back, Student!'}
      </h2>

      <section>
        <h3 className="text-xl font-semibold font-poppins mb-4">Your Subjects</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subject, i) => (
            <SubjectCard
              key={i}
              title={subject.title || subject.name}
              icon={getSubjectIcon(subject.title || subject.name)}
              progress={subject.progress || 0}
              color={subject.color || "bg-edu-purple"}
              onClick={() => subject.id && handleSubjectClick(subject.id)}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="quizzes">
            <TabsList className="mb-4">
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            </TabsList>
            <TabsContent value="quizzes" className="space-y-6">
              <h3 className="text-xl font-semibold font-poppins">Recommended Quizzes</h3>
              {quizzes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quizzes.slice(0, 4).map((quiz) => (
                    <QuizCard
                      key={quiz.id}
                      id={quiz.id}
                      title={quiz.title}
                      description={quiz.description}
                      timeMinutes={quiz.time_minutes}
                      questionCount={quiz.question_count}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <QuizCard
                    id={1}
                    title="Algebra Fundamentals"
                    description="Test your understanding of basic algebraic concepts"
                    timeMinutes={15}
                    questionCount={10}
                  />
                  <QuizCard
                    id={2}
                    title="Literature Analysis"
                    description="Analyze passages from classic literature"
                    timeMinutes={20}
                    questionCount={8}
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="flashcards">
              <h3 className="text-xl font-semibold mb-4 font-poppins">Study Flashcards</h3>
              <FlashcardComponent cards={flashcards} />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <RecentActivity activities={activities} />
        </div>
      </section>
    </div>
  );
};

const getSubjectIcon = (title: string) => {
  switch (title.toLowerCase()) {
    case 'mathematics':
      return <CircleDot className="h-7 w-7" />;
    case 'physics':
      return <BookOpen className="h-7 w-7" />;
    case 'literature':
      return <BookText className="h-7 w-7" />;
    case 'history':
      return <GraduationCap className="h-7 w-7" />;
    default:
      return <BookOpen className="h-7 w-7" />;
  }
};

export default Dashboard;
