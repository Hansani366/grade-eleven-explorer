
import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import ProfileEditor from "@/components/ProfileEditor";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Please log in to view this page.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileEditor />
    </div>
  );
};

export default ProfilePage;
