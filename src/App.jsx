import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PatientProvider } from './context/PatientContext'
import Navbar from './components/common/Navbar'

import LandingPage            from './pages/LandingPage'
import PatientRegistrationPage from './pages/PatientRegistrationPage'
import SymptomsPage           from './pages/SymptomsPage'
import DiagnosisResultPage    from './pages/DiagnosisResultPage'
import DoctorReviewPage       from './pages/DoctorReviewPage'

export default function App() {
  return (
    <PatientProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-neutral-100">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"             element={<LandingPage />} />
              <Route path="/register"     element={<PatientRegistrationPage />} />
              <Route path="/symptoms"     element={<SymptomsPage />} />
              <Route path="/diagnosis"    element={<DiagnosisResultPage />} />
              <Route path="/doctor-review" element={<DoctorReviewPage />} />
              {/* Fallback */}
              <Route path="*"            element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="text-center text-xs text-neutral-400 py-4 border-t border-neutral-200">
            © 2026 AarogyaSamhiti · AI-Assisted Rural Healthcare · Prototype
          </footer>
        </div>
      </BrowserRouter>
    </PatientProvider>
  )
}
