
import React from 'react';
import { CircleDot, BookOpen, BookText, GraduationCap } from 'lucide-react';

export const getSubjectIcon = (title: string) => {
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
