import React, { useEffect, useState } from 'react';
import { BookOpen, BookText, CircleDot, GraduationCap } from 'lucide-react';
import QuizCard from './QuizCard';
import SubjectCard from './SubjectCard';
import RecentActivity from './RecentActivity';
import FlashcardComponent from './FlashcardComponent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { getSubjects, getRecentActivities, Subject, getQuizzesBySubject, getFlashcardsBySubject } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [activeSubject, setActiveSubject] = useState<number | null>(null);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch subjects
        const subjectsData = await getSubjects();
        setSubjects(subjectsData);
        
        // Fetch recent activities
        const activitiesData = await getRecentActivities(5);
        setActivities(activitiesData);
        
        // Fetch initial quizzes (from Mathematics subject or first available)
        if (subjectsData.length > 0) {
          const mathSubject = subjectsData.find(s => s.title === 'Mathematics') || subjectsData[0];
          setActiveSubject(mathSubject.id);
          const quizzesData = await getQuizzesBySubject(mathSubject.id);
          setQuizzes(quizzesData);
          
          // Fetch flashcards
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
    
    if (user) {
      loadDashboardData();
    }
    
    // Show sample data if not logged in or while loading
    if (!user || loading) {
      // Define fallback subjects with all required properties
      const fallbackSubjectsData: Subject[] = [
        {
          id: 1,
          title: "Mathematics",
          icon: "circle-dot",
          progress: 65,
          color: "bg-edu-purple",
          description: "Learn mathematics fundamentals",
          subject_id: 1
        },
        {
          id: 2,
          title: "Physics",
          icon: "book-open",
          progress: 42,
          color: "bg-blue-500",
          description: "Explore physics concepts",
          subject_id: 2
        },
        {
          id: 3,
          title: "Literature",
          icon: "book-text",
          progress: 78,
          color: "bg-green-500",
          description: "Study classic and modern literature",
          subject_id: 3
        },
        {
          id: 4,
          title: "History",
          icon: "graduation-cap",
          progress: 30,
          color: "bg-amber-500",
          description: "Discover world history",
          subject_id: 4
        },
      ];
      setSubjects(fallbackSubjectsData);
      setActivities(fallbackActivities);
      setFlashcards(fallbackFlashcards);
      setQuizzes([]);
    }
  }, [user, toast]);
  
  // Fallback activities
  const fallbackActivities: ActivityType[] = [
    {
      type: 'quiz',
      subject: 'Physics',
      title: 'Motion and Forces Quiz',
      timestamp: '2h ago',
      score: 85,
    },
    {
      type: 'note',
      subject: 'Literature',
      title: 'Essay Structure Notes',
      timestamp: '1d ago',
    },
    {
      type: 'practice',
      subject: 'Mathematics',
      title: 'Calculus Practice',
      timestamp: '2d ago',
      score: 92,
    },
  ];
  
  // Fallback flashcards
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
  
  const displayedSubjects = subjects.length > 0 ? subjects : [];
  const displayedActivities = activities.length > 0 ? activities : fallbackActivities;
  const displayedFlashcards = flashcards.length > 0 ? flashcards : fallbackFlashcards;
  const displayedQuizzes = quizzes.length > 0 ? quizzes : [];
  
  const handleSubjectClick = async (subjectId: number) => {
    try {
      setLoading(true);
      setActiveSubject(subjectId);
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

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-bold font-poppins bg-gradient-to-r from-edu-purple to-blue-500 bg-clip-text text-transparent">
          {user ? `Welcome Back, ${user.user_metadata?.full_name || 'Student'}!` : 'Welcome Back, Student!'}
        </h2>
        
        <div className="hidden sm:block">
          <div className="bg-edu-gray/50 px-4 py-2 rounded-full text-sm font-medium text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-semibold mb-5 font-poppins flex items-center">
          <span className="w-1.5 h-5 bg-edu-purple rounded-full mr-2"></span>
          Your Subjects
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedSubjects.map((subject, i) => (
            <SubjectCard
              key={i}
              title={subject.title}
              icon={getSubjectIcon(subject.title)}
              progress={subject.progress || 0}
              color={subject.color || "bg-edu-purple"}
              onClick={() => subject.id && handleSubjectClick(subject.id)}
              isActive={subject.id === activeSubject}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <Tabs defaultValue="quizzes" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2 bg-edu-gray/30 p-1 rounded-lg">
              <TabsTrigger value="quizzes" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-edu-purple data-[state=active]:shadow-sm">
                Quizzes
              </TabsTrigger>
              <TabsTrigger value="flashcards" className="rounded-md data-[state=active]:bg-white data-[state=active]:text-edu-purple data-[state=active]:shadow-sm">
                Flashcards
              </TabsTrigger>
            </TabsList>
            <TabsContent value="quizzes" className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold font-poppins flex items-center">
                  <span className="w-1.5 h-5 bg-blue-500 rounded-full mr-2"></span>
                  Recommended Quizzes
                </h3>
                {loading && (
                  <div className="text-sm text-gray-500 animate-pulse">Loading...</div>
                )}
              </div>
              {displayedQuizzes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayedQuizzes.slice(0, 4).map((quiz) => (
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
            <TabsContent value="flashcards" className="animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-semibold font-poppins flex items-center">
                  <span className="w-1.5 h-5 bg-green-500 rounded-full mr-2"></span>
                  Study Flashcards
                </h3>
                {loading && (
                  <div className="text-sm text-gray-500 animate-pulse">Loading...</div>
                )}
              </div>
              <FlashcardComponent cards={displayedFlashcards} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <RecentActivity activities={displayedActivities} />
        </div>
      </section>
    </div>
  );
};

// Helper function to get icons based on subject title
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
