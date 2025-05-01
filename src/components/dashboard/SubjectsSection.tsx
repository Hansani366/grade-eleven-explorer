
import React, { useMemo } from 'react';
import SubjectCard from '../SubjectCard';
import { getSubjectIcon } from '@/utils/icons';
import { Subject } from '@/services/types';

interface SubjectsSectionProps {
  subjects: Subject[];
  onSubjectClick: (subjectId: number) => void;
}

const SubjectsSection = ({ subjects, onSubjectClick }: SubjectsSectionProps) => {
  // Use useMemo to prevent unnecessary re-creation of subject icons
  const subjectsWithIcons = useMemo(() => {
    return subjects.map(subject => ({
      ...subject,
      icon: getSubjectIcon(subject.title || subject.name)
    }));
  }, [subjects]);

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold mb-5 font-poppins flex items-center">
        <span className="w-1.5 h-5 bg-edu-purple rounded-full mr-2"></span>
        Your Subjects
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjectsWithIcons.map((subject) => (
          <SubjectCard
            key={subject.id}
            id={subject.id}
            title={subject.title || subject.name}
            icon={subject.icon}
            color={subject.color || "bg-edu-purple"}
            onClick={() => subject.id && onSubjectClick(subject.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default SubjectsSection;
