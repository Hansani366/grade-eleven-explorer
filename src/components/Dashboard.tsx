
import React from 'react';
import { BookOpen, BookText, CircleDot, GraduationCap } from 'lucide-react';
import QuizCard from './QuizCard';
import SubjectCard from './SubjectCard';
import RecentActivity from './RecentActivity';
import FlashcardComponent from './FlashcardComponent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const subjects = [
    {
      title: "Mathematics",
      icon: <CircleDot className="h-7 w-7" />,
      progress: 65,
      color: "bg-edu-purple",
    },
    {
      title: "Physics",
      icon: <BookOpen className="h-7 w-7" />,
      progress: 42,
      color: "bg-blue-500",
    },
    {
      title: "Literature",
      icon: <BookText className="h-7 w-7" />,
      progress: 78,
      color: "bg-green-500",
    },
    {
      title: "History",
      icon: <GraduationCap className="h-7 w-7" />,
      progress: 30,
      color: "bg-amber-500",
    },
  ];

  const recentActivities = [
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

  const flashcards = [
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

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold font-poppins mb-6">Welcome Back, Student!</h2>

      <section>
        <h3 className="text-xl font-semibold mb-4 font-poppins">Your Subjects</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subject, i) => (
            <SubjectCard
              key={i}
              title={subject.title}
              icon={subject.icon}
              progress={subject.progress}
              color={subject.color}
              onClick={() => console.log(`Clicked ${subject.title}`)}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuizCard
                  title="Algebra Fundamentals"
                  description="Test your understanding of basic algebraic concepts"
                  timeMinutes={15}
                  questionCount={10}
                  onClick={() => console.log("Starting Algebra quiz")}
                />
                <QuizCard
                  title="Literature Analysis"
                  description="Analyze passages from classic literature"
                  timeMinutes={20}
                  questionCount={8}
                  onClick={() => console.log("Starting Literature quiz")}
                />
              </div>
            </TabsContent>
            <TabsContent value="flashcards">
              <h3 className="text-xl font-semibold mb-4 font-poppins">Study Flashcards</h3>
              <FlashcardComponent cards={flashcards} />
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <RecentActivity activities={recentActivities} />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
