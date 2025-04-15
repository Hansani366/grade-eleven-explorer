
import React from 'react';
import { BookOpen, Home, BarChart3, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, active, onClick }: NavItem) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 font-normal",
        active ? "bg-edu-purple/10 text-edu-purple" : "text-gray-600"
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
};

const Navigation = () => {
  // In a real app, this would be connected to your router
  const [activeTab, setActiveTab] = React.useState('home');
  
  return (
    <nav className="w-60 border-r p-4 hidden md:block">
      <div className="space-y-2">
        <NavItem 
          icon={<Home className="h-5 w-5" />} 
          label="Dashboard" 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
        />
        <NavItem 
          icon={<BookOpen className="h-5 w-5" />} 
          label="Subjects" 
          active={activeTab === 'subjects'} 
          onClick={() => setActiveTab('subjects')} 
        />
        <NavItem 
          icon={<BarChart3 className="h-5 w-5" />} 
          label="Progress" 
          active={activeTab === 'progress'} 
          onClick={() => setActiveTab('progress')} 
        />
        <NavItem 
          icon={<Calendar className="h-5 w-5" />} 
          label="Calendar" 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')} 
        />
      </div>
    </nav>
  );
};

export default Navigation;
