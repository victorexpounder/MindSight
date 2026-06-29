"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Stethoscope, ClipboardList, HeartPulse, ShieldCheck, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { usePuterStore } from "@/lib/puter"
import { generateUUID } from "@/lib/utils"
import { prepareInstructions } from "@/constants"
import Header from "@/components/Header"
import ReactMarkdown from "react-markdown"
import ClinicalNote from "@/components/ClinicalNote"
import { motion } from "framer-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export default function SupportChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<string>("")
  const [hasStarted, setHasStarted] = useState<boolean>(false)
  const { auth, kv, ai } = usePuterStore()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const saveCaseRecord = async (record: Record<string, any>) => {
    try {
      await kv.set(`case-${record.id}`, JSON.stringify(record))
    } catch (error) {
      console.error("Failed to save case record:", error)
    }
  }

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message])
  }

  const tryParseJson = (text: string) => {
    if (!text || typeof text !== "string") return null

    const normalize = (value: string) =>
      value
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .trim()

    let candidate = normalize(text)

    if ((candidate.startsWith('"') && candidate.endsWith('"')) || (candidate.startsWith("'") && candidate.endsWith("'"))) {
      candidate = normalize(candidate.slice(1, -1))
    }

    const codeFenceMatch = candidate.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    if (codeFenceMatch?.[1]) {
      candidate = normalize(codeFenceMatch[1])
    }

    const jsonMatch = candidate.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      candidate = normalize(jsonMatch[0])
    }

    try {
      return JSON.parse(candidate)
    } catch {
      return null
    }
  }

  const isValidClinicalNote = (data: any): boolean => {
    return data && typeof data === "object" && (data.summary || data.clinicalSummary || data.overallRecommendation || data.concernClassification)
  }

  const handleSubmit = async (e: React.FormEvent, customMessage?: string) => {
    e.preventDefault()
    const content = customMessage || input.trim()
    if (!content) return

    setHasStarted(true)
    setInput("")
    setStatus("")

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
    }
    addMessage(userMessage)

    try {
      setIsLoading(true)

      const response = await ai.chat(
        [
          { role: "system", content: prepareInstructions() },
          { role: "user", content },
        ],
        {
          model: "gpt-4.1-mini",
          temperature: 0.15,
          max_tokens: 1000,
        }
      )

      const generatedText =
        (response as any)?.choices?.[0]?.message?.content ||
        JSON.stringify((response as any)?.message?.content)

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: generatedText,
      }
      addMessage(assistantMessage)

      await saveCaseRecord({
        id: generateUUID(),
        source: "text",
        input: content,
        result: generatedText,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("AI error:", error)
      setStatus("Unable to reach analysis service. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push("/login?next=/")
    }
  }, [auth.isAuthenticated, router])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white/95 shadow-lg shadow-slate-200/30">
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="rounded-full bg-sky-100 p-3 text-sky-700">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Clinical support workspace</p>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Primary mental health assessment</h1>
                  </div>
                </div>

                {!hasStarted ? (
                  <div className="grid gap-4">
                    <p className="text-base leading-7 text-slate-600">
                      Use this clinician-facing assistant to review patient presentation, identify likely mental health concerns, and capture recommended referral, support, and escalation considerations.
                    </p>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { icon: HeartPulse, label: "Risk triage" },
                        { icon: ClipboardList, label: "Diagnostic insight" },
                        { icon: ShieldCheck, label: "Referral guidance" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                          <div className="flex items-center gap-2 font-medium text-slate-900">
                            <item.icon className="h-4 w-4 text-sky-600" />
                            <span>{item.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700">
                      <p className="font-semibold text-slate-900">Getting started</p>
                      <p className="mt-2">Describe the patient’s current symptom presentation, clinical concerns, or brief mental status details.</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>

            <Card className="border border-slate-200 bg-white/95 shadow-lg shadow-slate-200/30">
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Clinician chat</p>
                    <h2 className="text-xl font-semibold text-slate-900">Consultation log</h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    <MessageCircle className="h-4 w-4 text-sky-600" />
                    {messages.length} entries
                  </div>
                </div>

                <div className="h-[58vh] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                  <ScrollArea className="h-full p-5">
                    <div className="space-y-4">
                        {messages.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500">
                          <p className="text-sm">Begin by entering a clinical prompt below. The assistant will respond with structured guidance for assessment, documentation, and referral.</p>
                        </div>
                      ) : (
                        messages.map((message) => {
                          const parsed = message.role === "assistant" ? tryParseJson(message.content) : null
                          return (
                            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[85%] rounded-3xl p-4 text-sm leading-6 ${message.role === "user" ? "bg-sky-600 text-white shadow-lg shadow-sky-200/40" : "bg-white text-slate-800 border border-slate-200"}`}>
                                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em]">
                                  <span>{message.role === "user" ? "Clinician" : "Assistant"}</span>
                                </div>
                                {isValidClinicalNote(parsed) ? (
                                  <ClinicalNote data={parsed} />
                                ) : (
                                  <ReactMarkdown
                                    components={{
                                      li: ({ children }) => <li className="ml-4 list-disc text-slate-700">{children}</li>,
                                      p: ({ children }) => <p className="mb-2">{children}</p>,
                                    }}
                                  >
                                    {message.content.replace(/\\n/g, "\n\n")}
                                  </ReactMarkdown>
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}

                      {isLoading ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-4 text-slate-600 shadow-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-2.5 w-2.5 rounded-full bg-sky-600 animate-pulse" />
                            <div className="h-2.5 w-2.5 rounded-full bg-slate-400 animate-pulse delay-75" />
                            <div className="h-2.5 w-2.5 rounded-full bg-slate-400 animate-pulse delay-150" />
                          </div>
                          <p className="mt-3 text-sm">Generating clinical guidance…</p>
                        </div>
                      ) : null}
                    </div>
                  </ScrollArea>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Enter patient summary, symptom overview, or clinical concern..."
                    className="min-h-[140px] resize-none border border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-400 focus:ring-sky-200"
                    disabled={isLoading}
                  />

                  {status ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{status}</div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-600">Tip: include patient concerns, duration, and any safety indicators.</div>
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/40 transition hover:bg-sky-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send to assistant
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>

          {!hasStarted ? (
            <div className="space-y-4">
              <Card className="border border-slate-200 bg-white/95 shadow-lg shadow-slate-200/30">
                <div className="p-6">
                  <div className="flex items-center gap-3 text-slate-700">
                    <div className="rounded-full bg-slate-100 p-3 text-slate-700">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Clinical prompts</p>
                      <h3 className="text-lg font-semibold text-slate-900">Use one of these starter prompts</h3>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {[
                      { label: "Evaluate suicide risk", prompt: "Review the patient’s presenting thoughts and determine whether there are indicators of self-harm or suicidal risk." },
                      { label: "Identify anxiety features", prompt: "Assess this summary for features that align with anxiety disorders, including physiologic activation and worry." },
                      { label: "Recommend next steps", prompt: "Suggest appropriate referral, clinician follow-up, and safety planning for this patient." },
                    ].map((item) => (
                      <Button
                        key={item.label}
                        variant="outline"
                        className="justify-between rounded-2xl border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-700 hover:border-sky-300 hover:bg-slate-100"
                        onClick={(e) => handleSubmit(e, item.prompt)}
                      >
                        <span>{item.label}</span>
                        <span className="text-xs text-slate-500">Start</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="border border-slate-200 bg-white/95 shadow-lg shadow-slate-200/30">
                <div className="flex items-start gap-3 p-6">
                  <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Clinical advisory</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      This tool is intended for clinician reference. Interpret recommendations in the context of patient safety, diagnostic criteria, and local care pathways.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

