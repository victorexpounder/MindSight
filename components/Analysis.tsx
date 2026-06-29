"use client"

import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, Shield, FileText, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface MentalHealthAnalysis {
  summary: {
    clinicalSummary: string
    inputType: "Symptoms" | "Case Notes" | "Assessment" | "Other"
  }
  overallRecommendation: {
    label: string
    explanation: string
    confidence: number
  }
  concernClassification: {
    primaryConcern: "Stress" | "Anxiety" | "Depression" | "Trauma" | "Substance-related Concern" | "Crisis Risk" | "Other"
    possibleConcerns: {
      category: string
      confidence: number
      notes: string
    }[]
    reasoning: string
  }
  supportRecommendations: {
    recommendation: string
    rationale: string
    priority: "Immediate" | "Near-term" | "Monitor"
  }[]
  referralGuidance: {
    recommendedReferral: string
    urgency: "Low" | "Moderate" | "High" | "Immediate"
    explanation: string
  }[]
  escalationFlags: {
    issue: string
    severity: "Moderate" | "High" | "Critical"
    recommendedResponse: string
  }[]
  documentationSummary: {
    suggestedDocumentation: string
    safetyConcerns: string
    nextSteps: string
  }
  disclaimer: string
}

const getBadgeColor = (level: string) => {
  switch (level) {
    case "Low":
      return "bg-emerald-100 text-emerald-800 border-emerald-300"
    case "Moderate":
      return "bg-amber-100 text-amber-800 border-amber-300"
    case "High":
      return "bg-orange-100 text-orange-800 border-orange-300"
    case "Immediate":
    case "Critical":
      return "bg-red-100 text-red-800 border-red-300"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getSeverityColor = (level: string) => {
  switch (level) {
    case "Low":
      return "bg-emerald-50 border-emerald-200 text-emerald-900"
    case "Moderate":
      return "bg-amber-50 border-amber-200 text-amber-900"
    case "High":
      return "bg-orange-50 border-orange-200 text-orange-900"
    case "Immediate":
    case "Critical":
      return "bg-red-50 border-red-200 text-red-900"
    default:
      return "bg-gray-50 border-gray-200 text-gray-900"
  }
}

const getRecommendationIcon = (label: string) => {
  if (label.includes("Immediate") || label.includes("Crisis")) {
    return <AlertTriangle className="w-8 h-8 text-red-600" />
  }
  if (label.includes("Monitor") || label.includes("Support")) {
    return <AlertCircle className="w-8 h-8 text-amber-600" />
  }
  return <CheckCircle className="w-8 h-8 text-emerald-600" />
}

export const Typewriter = ({ text, className }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState('')
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let i = 0
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(timer)
        }
      }, 10)
      return () => clearInterval(timer)
    }
  }, [isInView, text])

  return (
    <p ref={ref} className={className || "text-gray-700 leading-relaxed"}>
      {displayText}
    </p>
  )
}

export function AnalysisResults({ data }: { data: MentalHealthAnalysis }) {
  return (
    <div className="w-full space-y-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Case Support Summary</h2>
            <p className="text-sm text-gray-600">{data.summary.inputType}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Card className="border border-gray-200 p-8 bg-white/90">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              {getRecommendationIcon(data.overallRecommendation.label)}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{data.overallRecommendation.label}</h3>
                <p className="text-sm text-gray-600">Confidence: {data.overallRecommendation.confidence}%</p>
              </div>
            </div>
            <Typewriter text={data.overallRecommendation.explanation} className="text-gray-700 leading-relaxed" />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Card className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Clinical Summary
          </h3>
          <Typewriter text={data.summary.clinicalSummary} className="text-gray-700 leading-relaxed" />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-6"
      >
        <Card className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Concern Classification
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Primary concern</span>
              <Badge className={`${getBadgeColor(data.concernClassification.primaryConcern)} border`}>{data.concernClassification.primaryConcern}</Badge>
            </div>
            <Typewriter text={data.concernClassification.reasoning} className="text-sm text-gray-600" />
            <div className="space-y-3 pt-2">
              {data.concernClassification.possibleConcerns.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">{item.category}</span>
                    <span className="text-sm text-gray-600">{item.confidence}%</span>
                  </div>
                  <Progress value={item.confidence} className="h-2" />
                  <p className="text-sm text-gray-600 mt-3">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Referral Guidance
          </h3>
          <div className="space-y-4">
            {data.referralGuidance.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{item.recommendedReferral}</h4>
                  <Badge className={`${getBadgeColor(item.urgency)} border`}>{item.urgency}</Badge>
                </div>
                <p className="text-sm text-gray-600">{item.explanation}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <Card className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Support Recommendations
          </h3>
          <div className="space-y-4">
            {data.supportRecommendations.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{item.priority}</span>
                </div>
                <p className="font-semibold text-gray-900">{item.recommendation}</p>
                <p className="text-sm text-gray-600 mt-2">{item.rationale}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {data.escalationFlags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Escalation & Safety Flags
            </h3>
            <div className="space-y-3">
              {data.escalationFlags.map((flag, idx) => (
                <div key={idx} className={`rounded-lg border-l-4 p-4 ${getSeverityColor(flag.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{flag.issue}</h4>
                    <Badge className={`${getBadgeColor(flag.severity)} border text-xs`}>{flag.severity}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{flag.recommendedResponse}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        viewport={{ once: true }}
      >
        <Card className="border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Documentation Summary</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900">Suggested documentation</p>
              <Typewriter text={data.documentationSummary.suggestedDocumentation} className="text-sm text-gray-600 mt-2" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Safety concerns</p>
              <Typewriter text={data.documentationSummary.safetyConcerns} className="text-sm text-gray-600 mt-2" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Next steps</p>
              <Typewriter text={data.documentationSummary.nextSteps} className="text-sm text-gray-600 mt-2" />
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        viewport={{ once: true }}
      >
        <Card className="border border-gray-200 p-6 bg-slate-50">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Disclaimer</h3>
          <p className="text-sm text-gray-600">{data.disclaimer}</p>
        </Card>
      </motion.div>
    </div>
  )
}
