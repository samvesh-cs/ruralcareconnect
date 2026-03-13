import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatient } from '../context/PatientContext'
import PatientCard from '../components/common/PatientCard'
import FormInput from '../components/common/FormInput'
import ResultCard from '../components/common/ResultCard'

const DOCTOR = {
  name:  'Dr. Priya Sharma',
  qual:  'MBBS, MD (General Medicine)',
  id:    'DOC-0042',
}

export default function DoctorReviewPage() {
  const navigate = useNavigate()
  const {
    patientInfo, selectedSymptoms, diagnosisResult,
    doctorNote, setDoctorNote,
    reviewStatus, setReviewStatus,
  } = usePatient()

  const [submitting, setSubmitting] = useState(false)

  // ── Redirect guards ──
  if (!patientInfo || !diagnosisResult) {
    return (
      <div className="page-container text-center py-20 text-neutral-400">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-semibold">Incomplete session. Please start from the beginning.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">Go to Home</button>
      </div>
    )
  }

  const isFinished = reviewStatus !== 'pending'

  async function handleAction(action) {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setReviewStatus(action)
    setSubmitting(false)
  }

  // ── Post-action confirmation screen ──
  if (isFinished) {
    const isApproved  = reviewStatus === 'approved'
    const isEscalated = reviewStatus === 'escalated'

    return (
      <div className="page-container animate-slide-up">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="text-6xl mb-4">
            {isApproved ? '✅' : isEscalated ? '🚨' : '✏️'}
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">
            {isApproved  ? 'Diagnosis Approved'  :
             isEscalated ? 'Case Escalated'       : 'Modified & Saved'}
          </h2>
          <p className="text-neutral-500 text-sm mb-2">
            {isApproved  ? `Dr. ${DOCTOR.name} has approved the AI diagnosis. The care plan is ready for the patient.` :
             isEscalated ? 'This case has been flagged for referral to a higher health facility.'  :
                           'The diagnosis has been modified by the doctor.'}
          </p>
          {doctorNote && (
            <blockquote className="mt-4 px-4 py-3 bg-neutral-50 border-l-4 border-primary-400 text-sm text-left text-neutral-600 rounded-r-xl">
              <span className="section-label block mb-1">Doctor&apos;s Note</span>
              {doctorNote}
            </blockquote>
          )}
          <div className="flex gap-3 justify-center mt-8">
            <button
              onClick={() => { setSubmitting(false); navigate('/') }}
              className="btn-primary"
              id="new-consultation-btn"
            >
              Start New Consultation
            </button>
            <button onClick={() => window.print()} className="btn-secondary">
              🖨️ Print Report
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container animate-slide-up">
      {/* Doctor badge */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
          PS
        </div>
        <div>
          <p className="font-semibold text-blue-800">{DOCTOR.name}</p>
          <p className="text-xs text-blue-600">{DOCTOR.qual} · ID: {DOCTOR.id}</p>
        </div>
        <span className="ml-auto badge badge-blue">Reviewing</span>
      </div>

      {/* Patient summary */}
      <PatientCard patient={patientInfo} compact className="mb-4" />

      {/* Symptoms used */}
      <div className="mb-4">
        <p className="section-label mb-2">Reported Symptoms</p>
        <div className="flex flex-wrap gap-2">
          {selectedSymptoms.map(s => (
            <span key={s.id} className="badge badge-blue">{s.label}</span>
          ))}
        </div>
      </div>

      <h1 className="text-2xl font-bold text-neutral-800 mb-4">Review AI Diagnosis</h1>

      {/* Top AI condition — read-only */}
      <div className="space-y-3 mb-6">
        {diagnosisResult.conditions.map((c, i) => (
          <ResultCard key={c.id} condition={c} rank={i + 1} expanded={i === 0} />
        ))}
      </div>

      {/* Doctor note */}
      <div className="card mb-6">
        <h3 className="font-bold text-neutral-800 mb-3">Doctor&apos;s Remarks</h3>
        <FormInput
          id="doctor-note"
          label="Clinical notes, modifications, or observations"
          type="textarea"
          rows={4}
          value={doctorNote}
          onChange={e => setDoctorNote(e.target.value)}
          placeholder="Add your clinical observations, agreement with diagnosis, or suggested changes…"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleAction('approved')}
          disabled={submitting}
          className={`btn-primary flex-1 justify-center py-3 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          id="approve-btn"
        >
          {submitting ? '⏳ Processing…' : '✅ Approve Diagnosis'}
        </button>
        <button
          onClick={() => handleAction('modified')}
          disabled={submitting}
          className={`btn-secondary flex-1 justify-center py-3 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          id="modify-btn"
        >
          ✏️ Approve with Modifications
        </button>
        <button
          onClick={() => handleAction('escalated')}
          disabled={submitting}
          className={`btn-danger flex-1 justify-center py-3 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          id="escalate-btn"
        >
          🚨 Escalate / Refer
        </button>
      </div>

      <div className="mt-4">
        <button onClick={() => navigate('/diagnosis')} className="btn-secondary text-sm">
          ← Back to Diagnosis
        </button>
      </div>
    </div>
  )
}
