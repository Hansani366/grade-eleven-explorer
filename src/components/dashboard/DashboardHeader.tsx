
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader = () => {
  const { user } = useAuth();

  return (
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
  );
};

export default DashboardHeader;
