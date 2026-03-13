import { Link, useLocation } from 'react-router-dom'
import { usePatient } from '../../context/PatientContext'

// ── Step definitions for the top progress stepper ──────────────
const STEPS = [
  { label: 'Register',  path: '/register'      },
  { label: 'Symptoms',  path: '/symptoms'      },
  { label: 'Diagnosis', path: '/diagnosis'     },
  { label: 'Review',    path: '/doctor-review' },
]

export default function Navbar() {
  const location = useLocation()
  const { patientInfo, resetSession } = usePatient()

  const isLanding  = location.pathname === '/'
  const stepIndex  = STEPS.findIndex(s => s.path === location.pathname)
  const showStepper = stepIndex >= 0

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0" onClick={resetSession}>
          <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm shadow">
            AS
          </span>
          <span className="font-bold text-primary-700 group-hover:text-primary-600 transition hidden sm:block">
            AarogyaSamhiti
          </span>
        </Link>

        {/* Progress stepper — hidden on landing */}
        {showStepper && (
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Progress">
            {STEPS.map((step, i) => {
              const done    = i < stepIndex
              const current = i === stepIndex
              return (
                <div key={step.path} className="flex items-center gap-1">
                  <span
                    className={[
                      'text-xs font-semibold px-2.5 py-1 rounded-full transition-all',
                      done    ? 'bg-primary-600 text-white'                         : '',
                      current ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-300' : '',
                      !done && !current ? 'text-neutral-400' : '',
                    ].join(' ')}
                  >
                    {i + 1}. {step.label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className={`text-neutral-300 ${done ? 'text-primary-400' : ''}`}>›</span>
                  )}
                </div>
              )
            })}
          </nav>
        )}

        {/* Right side: patient pill or new session */}
        <div className="shrink-0">
          {patientInfo ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-xs text-neutral-500">
                Patient:
              </span>
              <span className="badge badge-green text-xs max-w-[120px] truncate" title={patientInfo.name}>
                {patientInfo.name}
              </span>
              <button
                onClick={resetSession}
                className="text-xs text-neutral-400 hover:text-red-500 transition ml-1"
                title="End session"
              >
                ✕
              </button>
            </div>
          ) : !isLanding ? (
            <Link to="/" className="btn-secondary text-xs py-1.5 px-3" onClick={resetSession}>
              ← Home
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}
