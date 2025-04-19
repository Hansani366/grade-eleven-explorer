
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';

const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setConnectionError(false);
    
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        if (error.message === 'Failed to fetch' || error.name === 'AuthRetryableFetchError') {
          console.error('Connection error:', error);
          setConnectionError(true);
          toast({
            title: "Connection error",
            description: "Unable to connect to authentication service. Please check your internet connection.",
            variant: "destructive",
          });
        } else {
          console.error('Login error:', error);
          toast({
            title: "Login failed",
            description: error.message || "Please check your credentials and try again",
            variant: "destructive",
          });
        }
        return;
      }

      console.log('Login successful:', data);
      
      toast({
        title: "Login successful",
        description: "Welcome back to your learning dashboard",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error logging in:', error);
      setConnectionError(true);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {connectionError && (
        <div className="bg-red-50 p-3 rounded-md border border-red-200 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
            <p className="text-sm text-red-700">
              Unable to connect to the authentication service. Please check your internet connection and try again.
            </p>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-edu-purple hover:bg-edu-purple/90" 
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
};

export default LoginForm;
