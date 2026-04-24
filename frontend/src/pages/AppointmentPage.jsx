import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Stepper from '../components/Appointment/Stepper'
import DoctorSelection from '../components/Appointment/DoctorSelection'
import DateTimePicker from '../components/Appointment/DateTimePicker'
import PatientForm from '../components/Appointment/PatientForm'
import { submitAppointment } from '../utils/api'

export default function AppointmentPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const canProceedStep0 = !!selectedDoctor
  const canProceedStep1 = !!selectedDate && !!selectedTime

  const handleNext = () => {
    if (step === 0 && !canProceedStep0) {
      toast.error('Please select a doctor to continue')
      return
    }
    if (step === 1 && !canProceedStep1) {
      toast.error('Please select both date and time slot')
      return
    }
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (formData) => {
    setSubmitting(true)
    try {
      const { data } = await submitAppointment(formData)
      toast.success('Appointment booked successfully!')
      navigate(`/confirmation/${data.appointment._id || data._id}`, {
        state: { appointment: data.appointment || data },
      })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const stepTitles = [
    { title: 'Choose Your Doctor', sub: 'Select the specialist you want to consult' },
    { title: 'Select Date & Time', sub: 'Pick a convenient appointment slot' },
    { title: 'Patient Details', sub: 'Fill in your information to confirm the appointment' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8 pb-4"
        >
          <span className="text-teal-600 font-semibold text-xs uppercase tracking-widest">
            Mahatme Eye Hospital, Nagpur
          </span>
          <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mt-1">
            {stepTitles[step].title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{stepTitles[step].sub}</p>
        </motion.div>

        {/* Stepper */}
        <Stepper currentStep={step} />

        {/* Card */}
        <motion.div
          className="card shadow-card mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <DoctorSelection
                  selectedDoctor={selectedDoctor}
                  onSelect={(doc) => {
                    setSelectedDoctor(doc)
                    setSelectedDate(null)
                    setSelectedTime(null)
                  }}
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <DateTimePicker
                  selectedDoctor={selectedDoctor}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateChange={setSelectedDate}
                  onTimeChange={setSelectedTime}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <PatientForm
                  selectedDoctor={selectedDoctor}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons (not shown on last step — form has its own submit) */}
          {step < 2 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  (step === 0 && !canProceedStep0) || (step === 1 && !canProceedStep1)
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {step === 0 ? 'Select Date & Time' : 'Fill Patient Details'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          {step === 2 && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Date & Time
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
