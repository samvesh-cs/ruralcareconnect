import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatient } from '../context/PatientContext'
import PatientCard from '../components/common/PatientCard'
import ResultCard from '../components/common/ResultCard'

export default function DiagnosisResultPage() {
  const navigate = useNavigate()
  const { patientInfo, selectedSymptoms, diagnosisResult } = usePatient()
  const [expandedId, setExpandedId] = useState(null)

  // ── Redirect guards ──
  if (!patientInfo) {
    return (
      <div className="page-container text-center py-20 text-neutral-400">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-semibold">No patient registered.</p>
        <button onClick={() => navigate('/register')} className="btn-primary mt-4">Register Patient</button>
      </div>
    )
  }
  if (!diagnosisResult) {
    return (
      <div className="page-container text-center py-20 text-neutral-400">
        <p className="text-4xl mb-3">⏳</p>
        <p className="font-semibold">No diagnosis found. Please submit symptoms first.</p>
        <button onClick={() => navigate('/symptoms')} className="btn-primary mt-4">Enter Symptoms</button>
      </div>
    )
  }

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div className="page-container animate-slide-up">
      {/* Patient info */}
      <PatientCard patient={patientInfo} compact className="mb-6" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">AI Diagnosis Result</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Based on {selectedSymptoms.length} reported symptom{selectedSymptoms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-right">
          <p className="section-label">Report ID</p>
          <p className="font-mono text-sm text-neutral-600">{diagnosisResult.diagnosisId}</p>
          <p className="text-xs text-neutral-400 mt-0.5">{diagnosisResult.generatedBy}</p>
        </div>
      </div>

      {/* Symptoms quick view */}
      <div className="mb-5">
        <p className="section-label mb-2">Reported Symptoms</p>
        <div className="flex flex-wrap gap-2">
          {selectedSymptoms.map(s => (
            <span key={s.id} className="badge badge-blue">
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Referral alert */}
      {diagnosisResult.referralRecommended && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 font-medium">
          🚨 Referral Recommended — Please escalate this case to a higher facility.
        </div>
      )}

      {/* Result cards */}
      <div className="space-y-4 mb-8">
        {diagnosisResult.conditions.map((c, i) => (
          <ResultCard
            key={c.id}
            condition={c}
            rank={i + 1}
            expanded={expandedId === c.id}
            onToggle={() => toggle(c.id)}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-6">
        ⚠️ This is an AI-generated suggestion based on reported symptoms only. It is <strong>not</strong> a substitute for clinical evaluation.
        All results must be reviewed and approved by a qualified doctor before any treatment is initiated.
      </p>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => navigate('/doctor-review')}
          className="btn-primary text-base px-8 py-3"
          id="send-to-doctor-btn"
        >
          👨‍⚕️ Send to Doctor for Review →
        </button>
        <button onClick={() => navigate('/symptoms')} className="btn-secondary">
          ← Edit Symptoms
        </button>
      </div>
    </div>
  )
}
