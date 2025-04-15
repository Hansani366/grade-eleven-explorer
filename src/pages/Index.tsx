
import React from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-edu-gray/30 font-poppins">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Index;
