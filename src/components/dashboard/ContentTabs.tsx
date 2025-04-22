
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizCard from '../QuizCard';
import FlashcardComponent from '../FlashcardComponent';

interface ContentTabsProps {
  quizzes: any[];
  flashcards: { question: string; answer: string; }[];
  loading: boolean;
}

const ContentTabs = ({ quizzes, flashcards, loading }: ContentTabsProps) => {
  return (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quizzes.length > 0 ? (
            quizzes.slice(0, 4).map((quiz) => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
                timeMinutes={quiz.time_minutes}
                questionCount={quiz.question_count}
              />
            ))
          ) : (
            <>
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
            </>
          )}
        </div>
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
        <FlashcardComponent cards={flashcards} />
      </TabsContent>
    </Tabs>
  );
};

export default ContentTabs;
