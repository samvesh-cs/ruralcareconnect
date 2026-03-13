import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatient } from '../context/PatientContext'
import FormInput from '../components/common/FormInput'
import PatientCard from '../components/common/PatientCard'
import { dummyPatients } from '../data/patients'

const GENDER_OPTIONS   = ['Male', 'Female', 'Other'].map(v => ({ value: v, label: v }))
const BLOOD_OPTIONS    = ['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(v => ({ value: v, label: v }))
const DISTRICT_OPTIONS = ['Unnao','Lucknow','Raebareli','Barabanki','Sitapur','Hardoi'].map(v => ({ value: v, label: v }))

const EMPTY_FORM = {
  name: '', age: '', gender: '', village: '', district: '', phone: '', bloodGroup: '',
}

export default function PatientRegistrationPage() {
  const navigate = useNavigate()
  const { setPatientInfo } = usePatient()
  const [form, setForm]       = useState(EMPTY_FORM)
  const [errors, setErrors]   = useState({})
  const [preview, setPreview] = useState(null)

  function handleChange(field) {
    return e => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())    errs.name    = 'Full name is required'
    if (!form.age || form.age < 1 || form.age > 120) errs.age = 'Enter a valid age (1–120)'
    if (!form.gender)         errs.gender  = 'Select gender'
    if (!form.village.trim()) errs.village = 'Village name is required'
    if (!form.district)       errs.district= 'Select district'
    if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const patient = {
      ...form,
      age: Number(form.age),
      id: `P-${1000 + Math.floor(Math.random() * 9000)}`,
      registeredAt: new Date().toISOString(),
    }
    setPreview(patient)
  }

  function handleConfirm() {
    setPatientInfo(preview)
    navigate('/symptoms')
  }

  function loadDemo() {
    const demo = dummyPatients[0]
    setForm({
      name: demo.name, age: String(demo.age), gender: demo.gender,
      village: demo.village, district: demo.district, phone: demo.phone,
      bloodGroup: demo.bloodGroup,
    })
    setErrors({})
  }

  return (
    <div className="page-container animate-slide-up">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-800">Patient Registration</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Enter patient details to begin the consultation.
        </p>
      </div>

      {!preview ? (
        <div className="card max-w-2xl">
          {/* Demo shortcut */}
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs text-neutral-500">All fields marked <span className="text-red-500">*</span> are required</p>
            <button
              type="button"
              onClick={loadDemo}
              className="btn-secondary text-xs py-1.5 px-3"
              id="load-demo-btn"
            >
              Load Demo Patient
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <FormInput id="name"    label="Full Name"     value={form.name}        onChange={handleChange('name')}    placeholder="e.g. Savitri Devi"   error={errors.name}     required />
              <FormInput id="age"     label="Age"  type="number" value={form.age}    onChange={handleChange('age')}     placeholder="e.g. 42"              error={errors.age}      required />
              <FormInput id="gender"  label="Gender" type="select" value={form.gender} onChange={handleChange('gender')} options={GENDER_OPTIONS} placeholder="Select gender" error={errors.gender} required />
              <FormInput id="blood"   label="Blood Group" type="select" value={form.bloodGroup} onChange={handleChange('bloodGroup')} options={BLOOD_OPTIONS} placeholder="Select" />
              <FormInput id="village" label="Village"       value={form.village}     onChange={handleChange('village')} placeholder="e.g. Rampur Kalan"   error={errors.village}  required />
              <FormInput id="district" label="District" type="select" value={form.district} onChange={handleChange('district')} options={DISTRICT_OPTIONS} placeholder="Select district" error={errors.district} required />
              <FormInput id="phone"   label="Mobile Number" type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="10-digit number" error={errors.phone} required className="sm:col-span-2" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary" id="register-submit-btn">
                Register Patient →
              </button>
              <button type="button" onClick={() => { setForm(EMPTY_FORM); setErrors({}) }} className="btn-secondary">
                Clear
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ── Preview / Confirmation ── */
        <div className="max-w-2xl space-y-4 animate-slide-up">
          <div className="rounded-xl bg-primary-50 border border-primary-200 px-4 py-3 text-sm text-primary-700 font-medium">
            ✅ Patient registered successfully! Please confirm the details below.
          </div>
          <PatientCard patient={preview} />
          <div className="flex gap-3">
            <button onClick={handleConfirm} className="btn-primary" id="confirm-patient-btn">
              Confirm &amp; Continue to Symptoms →
            </button>
            <button onClick={() => setPreview(null)} className="btn-secondary">
              ← Edit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
