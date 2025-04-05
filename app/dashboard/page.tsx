"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User, Shield, Clock } from "lucide-react"
import { getSession, clearSession } from "@/lib/simple-auth"

export default function Dashboard() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userSession = getSession()

    if (!userSession) {
      router.push("/sign-in")
      return
    }

    setSession(userSession)
    setLoading(false)
  }, [router])

  // Handle sign out
  const handleSignOut = () => {
    clearSession()
    router.push("/sign-in")
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="bg-blue-50 border-b">
          <CardTitle className="text-2xl font-bold text-blue-900">Dashboard</CardTitle>
          <CardDescription>Welcome to your secure dashboard</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-blue-900 flex items-center mb-2">
                <User className="h-5 w-5 mr-2" />
                Your Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{session.user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-gray-900 text-sm">{session.user.id}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-green-900 flex items-center mb-2">
                <Shield className="h-5 w-5 mr-2" />
                Security Status
              </h2>
              <p className="text-green-800">Your account is secure and using token-based authentication.</p>
              <div className="mt-2 flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                <p className="text-sm text-green-700">Active session</p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-purple-900 flex items-center mb-2">
                <Clock className="h-5 w-5 mr-2" />
                Session Information
              </h2>
              <p className="text-purple-800">Your session is protected with secure tokens.</p>
              <p className="text-sm text-purple-700 mt-1">
                For enhanced security, we recommend signing out when you're done.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t p-4">
          <Button onClick={handleSignOut} variant="outline" className="w-full flex items-center justify-center">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

