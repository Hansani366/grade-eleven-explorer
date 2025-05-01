
import React from 'react';
import DashboardHeader from './DashboardHeader';
import SubjectsSection from './SubjectsSection';
import ContentTabs from './ContentTabs';
import RecentActivity from '../RecentActivity';
import { Subject } from '@/services/types';

interface DashboardLayoutProps {
  subjects: Subject[];
  activities: any[];
  quizzes: any[];
  flashcards: any[];
  loading: boolean;
  onSubjectClick: (subjectId: number) => void;
}

const DashboardLayout = ({
  subjects,
  activities,
  quizzes,
  flashcards,
  loading,
  onSubjectClick
}: DashboardLayoutProps) => {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <DashboardHeader />
      
      <SubjectsSection 
        subjects={subjects} 
        onSubjectClick={onSubjectClick} 
      />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <ContentTabs
            quizzes={quizzes}
            flashcards={flashcards}
            loading={loading}
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <RecentActivity activities={activities} />
        </div>
      </section>
    </div>
  );
};

export default DashboardLayout;
