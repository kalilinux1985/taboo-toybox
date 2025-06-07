'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client'; // Import Supabase client
import { useRouter } from 'next/navigation'; // Import for navigation
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('buyer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          username: username,
          user_type: userType,
        },
        // If email confirmation is enabled, the user is created but needs to confirm.
        // Redirecting immediately to /activity-feed might be premature if confirmation is required.
        // Consider your app's flow and security requirements.
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else if (data.user) {
      // Assuming successful user creation in auth.users (and trigger populates public.users if applicable)
      setSuccessMessage('Signup successful! Redirecting to your feed...');
      // Forcing a refresh after push can sometimes help ensure Supabase session is recognized by middleware/server components.
      router.push('/activity-feed');
      router.refresh(); // Add this to potentially help update server-side session state
    } else {
        setError("An unexpected error occurred during sign up. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-violet-500">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label className='text-violet-500 mb-5 font-serif text-[20px]'>Sign up as a:</Label>
              <RadioGroup defaultValue="comfortable">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">Default</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="comfortable" id="r2" />
                  <Label htmlFor="r2">Comfortable</Label>
                </div>
              </RadioGroup>
            </div>
            {error && <p className="text-sm text-red-600 py-2 text-center">{error}</p>}
            {successMessage && <p className="text-sm text-green-600 py-2 text-center">{successMessage}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}