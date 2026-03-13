/**
 * PatientCard – displays a summary of a registered patient.
 *
 * Props:
 *   patient  object  – { id, name, age, gender, village, district, phone, bloodGroup }
 *   compact  bool    – renders a smaller inline version (default false)
 *   className string
 */

const GENDER_ICON = { Male: '♂', Female: '♀', Other: '⚧' }

export default function PatientCard({ patient, compact = false, className = '' }) {
  if (!patient) return null

  if (compact) {
    return (
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary-50 border border-primary-100 ${className}`}>
        <Avatar name={patient.name} size="sm" />
        <div>
          <p className="text-sm font-semibold text-primary-800 leading-none">{patient.name}</p>
          <p className="text-xs text-neutral-500 mt-0.5">
            {patient.age}y · {patient.gender} · {patient.village}
          </p>
        </div>
        <span className="ml-auto badge badge-blue">{patient.id}</span>
      </div>
    )
  }

  return (
    <div className={`card animate-slide-up ${className}`}>
      <div className="flex items-start gap-4">
        <Avatar name={patient.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-neutral-800">{patient.name}</h2>
            <span className="badge badge-blue">{patient.id}</span>
            {patient.bloodGroup && (
              <span className="badge badge-red">{patient.bloodGroup}</span>
            )}
          </div>
          <p className="text-sm text-neutral-500 mt-0.5">
            {patient.age} yrs &nbsp;·&nbsp; {GENDER_ICON[patient.gender] || ''} {patient.gender}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <InfoRow icon="📍" label="Village"  value={patient.village}  />
        <InfoRow icon="🗺️" label="District" value={patient.district} />
        <InfoRow icon="📞" label="Phone"    value={patient.phone}    />
      </div>
    </div>
  )
}

/* ── Helpers ──────────────────────────────────────────────────── */

function Avatar({ name, size = 'md' }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  const sizeClass = size === 'lg'
    ? 'w-14 h-14 text-xl'
    : 'w-9 h-9 text-sm'

  return (
    <div className={`${sizeClass} rounded-full bg-primary-600 text-white font-bold flex items-center justify-center shrink-0 shadow`}>
      {initials}
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="section-label">{label}</span>
      <span className="font-medium text-neutral-800">
        {icon} {value || '—'}
      </span>
    </div>
  )
}
