import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('BUYER');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(''); // Add state for name

  const { signUp, signIn, user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to appropriate dashboard
  useEffect(() => {
    if (!loading && user && userRole) {
      // Redirect all users to the home page which contains ActivityFeed
      navigate('/');
    }
  }, [user, userRole, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        // Pass name to the signUp function
        await signUp(email, password, username, role, name);
        // After successful signup, switch to sign in mode
        setIsSignUp(false);
        setPassword('');
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      // Error handling is done in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-950 flex items-center justify-center'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-950 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md bg-slate-900 border-slate-700'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl text-center text-white'>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className='text-center text-slate-400'>
            {isSignUp
              ? 'Enter your details to create your account'
              : 'Enter your credentials to access your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className='space-y-4'>
            {isSignUp && (
              <>
                {/* Add Name Input Field */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='name'
                    className='text-slate-200'>
                    Name
                  </Label>
                  <Input
                    id='name'
                    type='text'
                    placeholder='Enter your name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className='bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                  />
                </div>
                {/* Existing Username Input Field */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='username'
                    className='text-slate-200'>
                    Username
                  </Label>
                  <Input
                    id='username'
                    type='text'
                    placeholder='Enter your username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className='bg-slate-800 border-slate-600 text-white placeholder-slate-400'
                  />
                </div>
              </>
            )}

            <div className='space-y-2'>
              <Label
                htmlFor='email'
                className='text-slate-200'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='bg-slate-800 border-slate-600 text-white placeholder-slate-400'
              />
            </div>

            <div className='space-y-2'>
              <Label
                htmlFor='password'
                className='text-slate-200'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='bg-slate-800 border-slate-600 text-white placeholder-slate-400'
              />
            </div>

            {isSignUp && (
              <div className='space-y-2'>
                <Label
                  htmlFor='role'
                  className='text-slate-200'>
                  Account Type
                </Label>
                <select
                  id='role'
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className='w-full h-10 px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500'>
                  <option value='BUYER'>Buyer</option>
                  <option value='SELLER'>Seller</option>
                </select>
              </div>
            )}

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white'>
              {isLoading
                ? isSignUp
                  ? 'Creating Account...'
                  : 'Signing In...'
                : isSignUp
                ? 'Create Account'
                : 'Sign In'}
            </Button>
          </form>

          <div className='mt-4 text-center'>
            <Button
              variant='link'
              onClick={() => setIsSignUp(!isSignUp)}
              className='text-violet-400 hover:text-violet-300'>
              {isSignUp
                ? 'Already have an account? Sign in'
                : 'Need an account? Sign up'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
