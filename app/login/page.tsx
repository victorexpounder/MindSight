'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, ArrowRight, ArrowLeft, Brain } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePuterStore } from "@/lib/puter"
import Link from "next/link"

interface Props {}

const page = (props: Props) => {
  const { isLoading, auth } = usePuterStore()
  const router = useRouter()
  const [next, setNext] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const nextParam = new URLSearchParams(window.location.search).get("next")
    setNext(nextParam)
  }, [])

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push(next || "")
    }
  }, [auth.isAuthenticated, next, router])

  return (
    <div className="min-h-screen bg-[url('/bg-auth.svg')] bg-cover bg-center ">
      <div className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 py-3 flex items-center">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#0369a1] rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-[#0369a1] bg-clip-text text-transparent">
                  Mindsight
                </h1>
                <p className="text-sm text-gray-600">AI-assisted mental health decision support</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="w-full h-[80vh] flex items-center justify-center  ">
        <div className="max-w-4xl mx-auto px-3 py-10 flex items-center justify-center">
          <Card className="p-8 bg-white/80 backdrop-blur-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Welcome Back</h2>
            <p className="text-gray-600 mb-6">Please log in to continue to your clinician support workspace.</p>
            {auth.isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full scale-1 bg-[#0369a1] text-white hover:bg-[#0369a1]/80 hover:text-white hover:scale-[1.05]"
                onClick={auth.signOut}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className={`w-full scale-1 bg-[#0369a1] text-white hover:bg-[#0369a1]/80 hover:text-white hover:scale-[1.05] ${
                  isLoading ? "cursor-not-allowed animate-pulse hover:scale-[1]" : ""
                }`}
                onClick={() => {
                  auth.signIn()
                }}
              >
                {isLoading ? "Logging in..." : "Login with Puter"}
                {isLoading ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}


export default page
