import Link from "next/link"
import SignUpForm from "@/components/sign-up-form"
import { UserPlus, ArrowLeft } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-8 py-12 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Create an Account</h1>
        <p className="text-center text-gray-600 mb-6">Join our platform to get started</p>
        <SignUpForm />
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

