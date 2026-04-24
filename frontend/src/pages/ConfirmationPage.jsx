import { useParams, useLocation, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Clock, User, Phone, Download, Home, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { getAppointmentById } from '../utils/api'

export default function ConfirmationPage() {
  const { id } = useParams()
  const location = useLocation()
  const [appointment, setAppointment] = useState(location.state?.appointment || null)
  const [loading, setLoading] = useState(!appointment)

  useEffect(() => {
    if (!appointment && id) {
      getAppointmentById(id)
        .then(({ data }) => setAppointment(data.appointment || data))
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [id, appointment])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    )
  }

  const apt = appointment || {}

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-teal-950/30 dark:to-slate-900 pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center mx-auto">
              <CheckCircle className="w-12 h-12 text-teal-600 dark:text-teal-400" />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-1 -right-1 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-glow-teal"
            >
              <span className="text-white text-xs font-bold">✓</span>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mt-4">
              Appointment Confirmed!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              We've received your appointment request. You'll be contacted to confirm.
            </p>
          </motion.div>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card shadow-card-hover"
        >
          {/* Header */}
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100 dark:border-slate-700 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white text-sm">Mahatme Eye Hospital, Nagpur</p>
              <p className="text-xs text-teal-600 dark:text-teal-400">Appointment #{String(apt._id || id || '').slice(-8).toUpperCase()}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4">
            <Detail icon={User} label="Doctor" value={apt.doctorName || '—'} highlight />
            <Detail icon={Eye} label="Specialization" value={apt.specialization || '—'} />
            <Detail icon={Calendar} label="Date" value={apt.appointmentDate ? format(new Date(apt.appointmentDate), 'EEEE, MMMM do, yyyy') : '—'} highlight />
            <Detail icon={Clock} label="Time" value={apt.appointmentTime || '—'} highlight />
            <Detail icon={User} label="Patient" value={apt.fullName || '—'} />
            <Detail icon={Phone} label="Mobile" value={apt.mobile || '—'} />
          </div>

          {/* Status badge */}
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">Pending Confirmation</span>
            </div>
            <span className="text-xs text-slate-400">We'll call within 2 hours</span>
          </div>
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">What's next?</p>
          <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
            <li>• Our team will call you on {apt.mobile || 'your registered number'} to confirm</li>
            <li>• Please arrive 15 minutes before your slot</li>
            <li>• Carry previous prescriptions or reports if available</li>
            <li>• Hospital address: 123, Dhantoli Ring Road, Nagpur</li>
          </ul>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 mt-6"
        >
          <Link to="/" className="flex-1 btn-secondary justify-center py-3">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link to="/appointment" className="flex-1 btn-primary justify-center py-3">
            <Calendar className="w-4 h-4" />
            New Appointment
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

function Detail({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-teal-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className={`text-sm font-medium truncate ${highlight ? 'text-teal-700 dark:text-teal-300' : 'text-slate-700 dark:text-slate-200'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}
