"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LockKeyhole, CheckCircle2 } from "lucide-react"
import { getUserByEmail, verifyPassword, setSession, getSession } from "@/lib/simple-auth"

export default function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const session = getSession()
    if (session) {
      router.push("/dashboard")
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Find user
      const user = getUserByEmail(email)
      if (!user) {
        throw new Error("Invalid email or password")
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password)
      if (!isValid) {
        throw new Error("Invalid email or password")
      }

      // Set session
      setSession(user.id)

      // Show success message
      setSuccess(true)

      // Redirect after a delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err) {
      console.error("Sign in error:", err)
      setError(err instanceof Error ? err.message : "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Signed in successfully! Redirecting to dashboard...
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" className="bg-white" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" className="bg-white" required />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Forgot your password?
          </a>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          "Signing in..."
        ) : (
          <>
            <LockKeyhole className="mr-2 h-4 w-4" />
            Sign in
          </>
        )}
      </Button>
    </form>
  )
}

