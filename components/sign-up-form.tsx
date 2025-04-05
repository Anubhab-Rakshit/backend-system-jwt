"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, Info } from "lucide-react"
import { createUser, setSession, getSession } from "@/lib/simple-auth"

export default function SignUpForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [success, setSuccess] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const session = getSession()
    if (session) {
      router.push("/dashboard")
    }
  }, [router])

  // Password validation states
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[@$!%*?&]/.test(password)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get("email") as string
      const password = formData.get("password") as string
      const confirmPassword = formData.get("confirmPassword") as string

      if (!email || !password || !confirmPassword) {
        throw new Error("All fields are required")
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // Check password complexity
      if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
        throw new Error("Password does not meet complexity requirements")
      }

      // Create user
      const user = await createUser(email, password)

      // Set session
      setSession(user.id)

      // Show success message
      setSuccess(true)

      // Redirect after a delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (err) {
      console.error("Sign up error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Account created successfully! Redirecting to dashboard...
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" className="bg-white" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          className="bg-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Card className="mt-2">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Info className="h-4 w-4 mr-1" />
              Password Requirements
            </h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center">
                {hasMinLength ? (
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                )}
                At least 8 characters
              </li>
              <li className="flex items-center">
                {hasUppercase ? (
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                )}
                At least one uppercase letter
              </li>
              <li className="flex items-center">
                {hasLowercase ? (
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                )}
                At least one lowercase letter
              </li>
              <li className="flex items-center">
                {hasNumber ? (
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                )}
                At least one number
              </li>
              <li className="flex items-center">
                {hasSpecialChar ? (
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2 text-red-500" />
                )}
                At least one special character (@$!%*?&)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" className="bg-white" required />
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}

