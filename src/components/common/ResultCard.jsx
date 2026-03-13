/**
 * ResultCard – displays a single AI diagnosis condition.
 *
 * Props:
 *   condition  object   – from diagnosisResult.conditions[]
 *   rank       number   – 1-based rank among conditions
 *   expanded   bool     – whether to show full details (default false)
 *   onToggle   fn       – toggle expanded state
 *   className  string
 */

const SEVERITY_MAP = {
  Low:      { badge: 'badge-green',  icon: '🟢', bar: 'bg-green-400'   },
  Moderate: { badge: 'badge-yellow', icon: '🟡', bar: 'bg-yellow-400'  },
  High:     { badge: 'badge-red',    icon: '🔴', bar: 'bg-red-400'     },
  Critical: { badge: 'badge-red',    icon: '🚨', bar: 'bg-red-600'     },
}

export default function ResultCard({
  condition,
  rank = 1,
  expanded = false,
  onToggle,
  className = '',
}) {
  if (!condition) return null

  const sev  = SEVERITY_MAP[condition.severity] ?? SEVERITY_MAP.Moderate
  const conf = condition.confidence ?? 0

  return (
    <div
      className={`card border transition-all duration-200 ${
        rank === 1 ? 'border-primary-300 shadow-md shadow-primary-100' : ''
      } ${className}`}
    >
      {/* ── Header ── */}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0
          ${rank === 1 ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-500'}`}>
          #{rank}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-neutral-800 leading-snug">
              {condition.name}
            </h3>
            {rank === 1 && (
              <span className="badge badge-blue text-[10px]">Top Match</span>
            )}
            <span className={`badge ${sev.badge} text-[10px]`}>
              {sev.icon} {condition.severity}
            </span>
          </div>

          {/* Confidence bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${sev.bar}`}
                style={{ width: `${conf}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-neutral-600 w-10 text-right">
              {conf}%
            </span>
          </div>
        </div>

        {/* Toggle button */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="shrink-0 text-neutral-400 hover:text-primary-600 transition text-lg leading-none"
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '▲' : '▼'}
          </button>
        )}
      </div>

      {/* ── Expandable details ── */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-4 animate-fade-in">
          <p className="text-sm text-neutral-600 leading-relaxed">
            {condition.description}
          </p>

          {/* Medications */}
          {condition.medications?.length > 0 && (
            <div>
              <p className="section-label mb-2">💊 Suggested Medications</p>
              <ul className="space-y-2">
                {condition.medications.map((med, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                    <span>
                      <span className="font-semibold text-neutral-800">{med.name}</span>
                      <span className="text-neutral-500"> — {med.dose}</span>
                      {med.note && (
                        <span className="text-neutral-400 italic"> ({med.note})</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Care advice */}
          {condition.careAdvice?.length > 0 && (
            <div>
              <p className="section-label mb-2">📋 Care Advice</p>
              <ul className="space-y-1.5">
                {condition.careAdvice.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                    <span className="text-primary-500 shrink-0">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
