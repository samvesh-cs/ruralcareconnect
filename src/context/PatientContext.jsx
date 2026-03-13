import { createContext, useContext, useState } from 'react'

const PatientContext = createContext(null)

export function PatientProvider({ children }) {
  const [patientInfo, setPatientInfo] = useState(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [diagnosisResult, setDiagnosisResult] = useState(null)
  const [doctorNote, setDoctorNote]     = useState('')
  const [reviewStatus, setReviewStatus] = useState('pending') // 'pending' | 'approved' | 'escalated'

  function resetSession() {
    setPatientInfo(null)
    setSelectedSymptoms([])
    setDiagnosisResult(null)
    setDoctorNote('')
    setReviewStatus('pending')
  }

  return (
    <PatientContext.Provider value={{
      patientInfo,    setPatientInfo,
      selectedSymptoms, setSelectedSymptoms,
      diagnosisResult,  setDiagnosisResult,
      doctorNote,     setDoctorNote,
      reviewStatus,   setReviewStatus,
      resetSession,
    }}>
      {children}
    </PatientContext.Provider>
  )
}

export function usePatient() {
  const ctx = useContext(PatientContext)
  if (!ctx) throw new Error('usePatient must be used inside <PatientProvider>')
  return ctx
}
