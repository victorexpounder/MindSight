
import React from 'react'
import { Button } from './ui/button'
import { Shield, PenBox, Brain } from "lucide-react"
import Link from 'next/link'

interface Props {}

const Header = (props: Props) => {
  return (
    <div className="border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0369a1] rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-[#0369a1] bg-clip-text text-transparent">
                Mindsight
              </h1>
            </div>
          </div>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => {
            window.location.reload()
          }}
        >
          <PenBox className="w-4 h-4 mr-2" />
          New Assessment
        </Button>
      </div>
    </div>
  )
}

export default Header
