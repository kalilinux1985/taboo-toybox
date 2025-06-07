import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-950">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-white">Welcome to the Landing Page!</h1>
        
        <div className="flex gap-4 mt-6">
          <Link href="/signup">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-2 text-lg">
              Sign Up
            </Button>
          </Link>
          
          <Link href="/login">
            <Button variant="outline" className="border-violet-600 text-violet-500 hover:bg-violet-900/20 px-8 py-2 text-lg">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
