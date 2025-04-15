
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AuthButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  if (user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="text-white"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    );
  }
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogin}
      className="text-white"
    >
      <User className="h-4 w-4 mr-2" />
      Login
    </Button>
  );
};

export default AuthButton;
