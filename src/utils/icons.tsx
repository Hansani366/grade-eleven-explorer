
import React from 'react';
import { 
  CircleDot, 
  BookOpen, 
  BookText, 
  GraduationCap, 
  Atom, 
  Calculator, 
  Brain, 
  Globe, 
  Scroll 
} from 'lucide-react';

export const getSubjectIcon = (title: string) => {
  const subjectMap: { [key: string]: React.ReactNode } = {
    'mathematics': <Calculator className="h-7 w-7" />,
    'physics': <Atom className="h-7 w-7" />,
    'literature': <Scroll className="h-7 w-7" />,
    'history': <Globe className="h-7 w-7" />,
    'computer science': <BookOpen className="h-7 w-7" />,
    'chemistry': <CircleDot className="h-7 w-7" />,
    'biology': <Brain className="h-7 w-7" />,
    'default': <GraduationCap className="h-7 w-7" />
  };

  // Convert title to lowercase and find the matching icon, fallback to default
  return subjectMap[title.toLowerCase()] || subjectMap['default'];
};

// Optional: Export individual icons for direct use if needed
export const SubjectIcons = {
  Mathematics: <Calculator className="h-7 w-7" />,
  Physics: <Atom className="h-7 w-7" />,
  Literature: <Scroll className="h-7 w-7" />,
  History: <Globe className="h-7 w-7" />,
  ComputerScience: <BookOpen className="h-7 w-7" />,
  Chemistry: <CircleDot className="h-7 w-7" />,
  Biology: <Brain className="h-7 w-7" />,
  Default: <GraduationCap className="h-7 w-7" />
};
