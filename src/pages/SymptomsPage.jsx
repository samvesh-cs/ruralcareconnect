import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatient } from '../context/PatientContext'
import PatientCard from '../components/common/PatientCard'
import FormInput from '../components/common/FormInput'
import { symptomList, bodyRegions } from '../data/symptoms'
import { mockDiagnosisResult } from '../data/diagnosisResult'

export default function SymptomsPage() {
  const navigate = useNavigate()
  const { patientInfo, selectedSymptoms, setSelectedSymptoms, setDiagnosisResult } = usePatient()
  const [search,        setSearch]        = useState('')
  const [activeRegion,  setActiveRegion]  = useState('All')
  const [duration,      setDuration]      = useState('')
  const [notes,         setNotes]         = useState('')
  const [analysing,     setAnalysing]     = useState(false)

  // ── Redirect guard ──
  if (!patientInfo) {
    return (
      <div className="page-container text-center py-20 text-neutral-400">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-semibold">No patient registered.</p>
        <button onClick={() => navigate('/register')} className="btn-primary mt-4">
          Register Patient
        </button>
      </div>
    )
  }

  const regions   = ['All', ...bodyRegions]

  const filtered  = symptomList.filter(s => {
    const matchRegion  = activeRegion === 'All' || s.region === activeRegion
    const matchSearch  = s.label.toLowerCase().includes(search.toLowerCase())
    return matchRegion && matchSearch
  })

  const isSelected = (id) => selectedSymptoms.some(s => s.id === id)

  function toggleSymptom(sym) {
    setSelectedSymptoms(prev =>
      isSelected(sym.id) ? prev.filter(s => s.id !== sym.id) : [...prev, sym]
    )
  }

  function removeSymptom(id) {
    setSelectedSymptoms(prev => prev.filter(s => s.id !== id))
  }

  async function handleAnalyse() {
    if (!selectedSymptoms.length) return
    setAnalysing(true)
    // Simulate API latency with dummy data
    await new Promise(r => setTimeout(r, 1800))
    setDiagnosisResult(mockDiagnosisResult)
    setAnalysing(false)
    navigate('/diagnosis')
  }

  return (
    <div className="page-container animate-slide-up">
      {/* Patient pill */}
      <PatientCard patient={patientInfo} compact className="mb-6" />

      <h1 className="text-3xl font-bold text-neutral-800 mb-1">Symptom Input</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Select all symptoms the patient is experiencing.
      </p>

      {/* ── Selected tags ── */}
      {selectedSymptoms.length > 0 && (
        <div className="mb-5 p-4 rounded-xl bg-primary-50 border border-primary-100">
          <p className="section-label mb-2">Selected Symptoms ({selectedSymptoms.length})</p>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(s => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold"
              >
                {s.label}
                <button
                  onClick={() => removeSymptom(s.id)}
                  className="text-primary-200 hover:text-white transition"
                  aria-label={`Remove ${s.label}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card space-y-4">
        {/* Search */}
        <FormInput
          id="symptom-search"
          label="Search Symptoms"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Type to search…"
        />

        {/* Region filter */}
        <div>
          <p className="section-label mb-2">Filter by Body Region</p>
          <div className="flex flex-wrap gap-2">
            {regions.map(r => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  activeRegion === r
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Symptom grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="col-span-3 text-sm text-neutral-400 py-4 text-center">No symptoms match your search.</p>
          ) : (
            filtered.map(sym => (
              <button
                key={sym.id}
                onClick={() => toggleSymptom(sym)}
                className={`text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                  isSelected(sym.id)
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {sym.label}
              </button>
            ))
          )}
        </div>

        {/* Extra context */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
          <FormInput
            id="duration"
            label="Duration of Symptoms"
            type="select"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            placeholder="Select duration"
            options={[
              { value: '1-2 days', label: '1–2 days' },
              { value: '3-5 days', label: '3–5 days' },
              { value: '1 week',   label: 'About 1 week' },
              { value: '>1 week',  label: 'More than 1 week' },
            ]}
          />
          <FormInput
            id="notes"
            label="Additional Notes"
            type="textarea"
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Any other observations…"
          />
        </div>
      </div>

      {/* Analyse button */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleAnalyse}
          disabled={!selectedSymptoms.length || analysing}
          className={`btn-primary text-base px-8 py-3 ${
            (!selectedSymptoms.length || analysing) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          id="analyse-symptoms-btn"
        >
          {analysing ? (
            <><span className="animate-spin">⏳</span> Analysing…</>
          ) : (
            '🤖 Analyse Symptoms →'
          )}
        </button>
        <button onClick={() => navigate('/register')} className="btn-secondary">
          ← Back
        </button>
      </div>
    </div>
  )
}
