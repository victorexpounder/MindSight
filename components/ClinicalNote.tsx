import React from "react"

interface ClinicalNoteProps {
  data: any
}

export default function ClinicalNote({ data }: ClinicalNoteProps) {
  const summary = data?.summary || data?.clinicalSummary || {}
  const overall = data?.overallRecommendation || {}
  const classification = data?.concernClassification || {}
  const support = data?.supportRecommendations || []
  const referrals = data?.referralGuidance || []
  const flags = data?.escalationFlags || []
  const doc = data?.documentationSummary || {}

  return (
    <div className="prose max-w-none text-slate-800">
      <section>
        <h3 className="text-sm uppercase text-slate-500 tracking-wide">Clinical Summary</h3>
        <p className="mt-2 text-base leading-7">{summary.clinicalSummary || summary.clinicalSummary === 0 ? summary.clinicalSummary : summary}</p>
        {summary.inputType ? <p className="text-sm text-slate-600 mt-1">Type: {summary.inputType}</p> : null}
      </section>

      <section className="mt-4">
        <h3 className="text-sm uppercase text-slate-500 tracking-wide">Overall Recommendation</h3>
        <p className="mt-2 font-semibold text-slate-900">{overall.label}</p>
        {overall.explanation ? <p className="text-sm text-slate-700 mt-1">{overall.explanation}</p> : null}
        {typeof overall.confidence !== "undefined" ? (
          <p className="text-xs text-slate-500 mt-1">Confidence: {overall.confidence}%</p>
        ) : null}
      </section>

      <section className="mt-4">
        <h3 className="text-sm uppercase text-slate-500 tracking-wide">Concern Classification</h3>
        <p className="mt-2 text-sm text-slate-700">Primary: <span className="font-semibold text-slate-900">{classification.primaryConcern}</span></p>
        {classification.possibleConcerns && classification.possibleConcerns.length > 0 ? (
          <ul className="mt-2 ml-4 list-disc text-sm text-slate-700">
            {classification.possibleConcerns.map((c: any, i: number) => (
              <li key={i}>
                <span className="font-medium text-slate-900">{c.category}</span> — {c.confidence}%{c.notes ? ` — ${c.notes}` : ""}
              </li>
            ))}
          </ul>
        ) : null}
        {classification.reasoning ? <p className="mt-2 text-sm text-slate-700">Reasoning: {classification.reasoning}</p> : null}
      </section>

      <section className="mt-4">
        <h3 className="text-sm uppercase text-slate-500 tracking-wide">Support Recommendations</h3>
        <ul className="mt-2 ml-4 list-disc text-sm text-slate-700">
          {support.map((s: any, i: number) => (
            <li key={i}>
              <span className="font-medium text-slate-900">{s.recommendation || s}</span>
              {s.priority ? <span className="text-xs text-slate-500"> — {s.priority}</span> : null}
              {s.rationale ? <div className="text-sm text-slate-700 mt-1">{s.rationale}</div> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h3 className="text-sm uppercase text-slate-500 tracking-wide">Referral Guidance</h3>
        <ul className="mt-2 ml-4 list-disc text-sm text-slate-700">
          {referrals.map((r: any, i: number) => (
            <li key={i}>
              <span className="font-medium text-slate-900">{r.recommendedReferral || r}</span>
              {r.urgency ? <span className="text-xs text-slate-500"> — {r.urgency}</span> : null}
              {r.explanation ? <div className="text-sm text-slate-700 mt-1">{r.explanation}</div> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h3 className="text-sm uppercase text-slate-500 tracking-wide">Escalation / Safety Flags</h3>
        <ul className="mt-2 ml-4 list-disc text-sm text-slate-700">
          {flags.map((f: any, i: number) => (
            <li key={i}>
              <span className="font-medium text-slate-900">{f.issue || f}</span>
              {f.severity ? <span className="text-xs text-slate-500"> — {f.severity}</span> : null}
              {f.recommendedResponse ? <div className="text-sm text-slate-700 mt-1">{f.recommendedResponse}</div> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h3 className="text-sm uppercase text-slate-500 tracking-wide">Documentation Summary</h3>
        {doc.suggestedDocumentation ? <p className="mt-2 text-sm text-slate-700">{doc.suggestedDocumentation}</p> : null}
        {doc.safetyConcerns ? <p className="mt-2 text-sm text-rose-700 font-medium">Safety: {doc.safetyConcerns}</p> : null}
      </section>
    </div>
  )
}
