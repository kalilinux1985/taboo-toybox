'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

export default function SignUpPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("BUYER")
  const [error, setError] = useState("")

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          role,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    const session = (await supabase.auth.getSession()).data.session
    const userRole = session?.user.user_metadata?.role

    if (userRole === "SELLER") {
      router.push("/seller-settings")
    } else {
      router.push("/settings")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-gray-800 text-white border border-gray-700" />
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="bg-gray-800 text-white border border-gray-700" />
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-gray-800 text-white border border-gray-700" />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-gray-800 text-white border border-gray-700" />

        <RadioGroup value={role} onValueChange={setRole} className="flex justify-between gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BUYER" id="buyer" className="bg-gray-800 border border-gray-700" />
            <label htmlFor="buyer">Buyer</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SELLER" id="seller" className="bg-gray-800 border border-gray-700" />
            <label htmlFor="seller">Seller</label>
          </div>
        </RadioGroup>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full">Sign Up</Button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/signin" className="text-purple-400 underline hover:text-purple-300">
            Sign in HERE!
          </Link>
        </p>
      </form>
    </div>
  )
}
