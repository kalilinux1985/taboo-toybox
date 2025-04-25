'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignInPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      return
    }

    // Wait for user metadata
    const session = (await supabase.auth.getSession()).data.session
    const role = session?.user.user_metadata?.role

    if (role === "SELLER") {
      router.push("/seller-settings")
    } else {
      router.push("/settings")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 text-white border border-gray-700"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-gray-800 text-white border border-gray-700"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full">
          Sign In
        </Button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-purple-400 underline hover:text-purple-300">
            Sign up HERE!
          </Link>
        </p>
      </form>
    </div>
  )
}
