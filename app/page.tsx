import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Lock, Key } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SecureAuth</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Secure Authentication System
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              A robust authentication system with JWT tokens and secure password handling
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/sign-up">
                <Button size="lg" className="px-8 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Key Features</h2>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div className="mt-5 text-center">
                    <h3 className="text-lg font-medium text-gray-900">Secure JWT Authentication</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Uses JSON Web Tokens stored in HTTP-only cookies for secure session management
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                    <Key className="h-6 w-6" />
                  </div>
                  <div className="mt-5 text-center">
                    <h3 className="text-lg font-medium text-gray-900">Strong Password Security</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Enforces password complexity requirements and securely hashes passwords
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="mt-5 text-center">
                    <h3 className="text-lg font-medium text-gray-900">Protected Routes</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Automatically redirects unauthenticated users to the login page
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">&copy; 2025 SecureAuth Made by Anubhab Rakshit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

