import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { User, Phone, Mail, MapPin, FileText, Upload, X, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { COLOR_MAP } from '../../utils/doctors'

const SYMPTOMS = [
  'Blurred Vision', 'Eye Pain', 'Redness', 'Watering Eyes',
  'Double Vision', 'Floaters', 'Light Sensitivity', 'Dry Eyes',
  'Headache', 'Sudden Vision Loss', 'Night Blindness', 'Other'
]

export default function PatientForm({ selectedDoctor, selectedDate, selectedTime, onSubmit, submitting }) {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const colorConfig = COLOR_MAP[selectedDoctor?.color] || COLOR_MAP.teal

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.filter(
      (f) => f.size <= 10 * 1024 * 1024 // 10MB limit
    ).map((f) => ({ file: f, name: f.name, size: f.size }))
    setUploadedFiles((prev) => [...prev, ...newFiles].slice(0, 5))
  }

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }

  const onFormSubmit = (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value)
    })
    formData.append('doctorId', selectedDoctor._id)
    formData.append('doctorName', selectedDoctor.name)
    formData.append('specialization', selectedDoctor.specialization)
    formData.append('appointmentDate', format(selectedDate, 'yyyy-MM-dd'))
    formData.append('appointmentTime', selectedTime)
    formData.append('symptoms', selectedSymptoms.join(', '))
    uploadedFiles.forEach(({ file }) => formData.append('documents', file))
    onSubmit(formData)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Booking Summary */}
      <div className={`p-4 rounded-2xl mb-6 border ${colorConfig.bg} border-current/10`}>
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Appointment Summary
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${colorConfig.avatar} flex items-center justify-center text-white text-xs font-bold`}>
              {selectedDoctor?.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <div>
              <p className="text-xs text-slate-500">Doctor</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{selectedDoctor?.name}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500">Date</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">
              {selectedDate ? format(selectedDate, 'EEE, MMM d, yyyy') : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Time</p>
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">{selectedTime || '—'}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        {/* Name + Age */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="label">
              <User className="inline w-3.5 h-3.5 mr-1.5" />
              Full Name *
            </label>
            <input
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name too short' },
              })}
              className={`input-field ${errors.fullName ? 'border-red-400 ring-red-400' : ''}`}
              placeholder="Enter patient's full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.fullName.message}
              </p>
            )}
          </div>
          <div>
            <label className="label">Age *</label>
            <input
              type="number"
              {...register('age', {
                required: 'Age required',
                min: { value: 1, message: 'Invalid age' },
                max: { value: 120, message: 'Invalid age' },
              })}
              className={`input-field ${errors.age ? 'border-red-400' : ''}`}
              placeholder="Years"
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
            )}
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="label">Gender *</label>
          <div className="flex gap-3">
            {['Male', 'Female', 'Other'].map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={g}
                  {...register('gender', { required: true })}
                  className="w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">Please select gender</p>
          )}
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <Phone className="inline w-3.5 h-3.5 mr-1.5" />
              Mobile Number *
            </label>
            <input
              type="tel"
              {...register('mobile', {
                required: 'Mobile number is required',
                pattern: { value: /^[6-9]\d{9}$/, message: 'Enter valid 10-digit Indian number' },
              })}
              className={`input-field ${errors.mobile ? 'border-red-400' : ''}`}
              placeholder="10-digit mobile number"
              maxLength={10}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.mobile.message}
              </p>
            )}
          </div>
          <div>
            <label className="label">
              <Mail className="inline w-3.5 h-3.5 mr-1.5" />
              Email <span className="text-slate-400">(optional)</span>
            </label>
            <input
              type="email"
              {...register('email', {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
              })}
              className={`input-field ${errors.email ? 'border-red-400' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="label">
            <MapPin className="inline w-3.5 h-3.5 mr-1.5" />
            Address *
          </label>
          <input
            {...register('address', { required: 'Address is required' })}
            className={`input-field ${errors.address ? 'border-red-400' : ''}`}
            placeholder="Street, Area, City"
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Symptoms */}
        <div>
          <label className="label">
            <FileText className="inline w-3.5 h-3.5 mr-1.5" />
            Symptoms / Chief Complaint
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {SYMPTOMS.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border-2 transition-all ${
                  selectedSymptoms.includes(s)
                    ? 'bg-teal-600 border-teal-600 text-white'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-teal-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <textarea
            {...register('notes')}
            rows={3}
            className="input-field resize-none"
            placeholder="Describe your symptoms or any additional notes..."
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="label">
            <Upload className="inline w-3.5 h-3.5 mr-1.5" />
            Upload Documents <span className="text-slate-400">(prescriptions, reports, images)</span>
          </label>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-xl p-6 text-center hover:border-teal-400 transition-colors cursor-pointer relative">
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Upload className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Drag & drop or <span className="text-teal-600 dark:text-teal-400 font-medium">browse files</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB each (max 5 files)</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {uploadedFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{f.name}</p>
                    <p className="text-xs text-slate-400">{(f.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="w-6 h-6 rounded-full hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={!submitting ? { scale: 1.01 } : {}}
          whileTap={!submitting ? { scale: 0.99 } : {}}
          className="w-full btn-primary justify-center py-4 text-base font-semibold rounded-2xl shadow-lg shadow-teal-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting Appointment...
            </>
          ) : (
            <>
              <span>Confirm Appointment</span>
              <span className="text-teal-200">→</span>
            </>
          )}
        </motion.button>

        <p className="text-xs text-center text-slate-400">
          By submitting, you agree to receive appointment-related communications from Mahatme Eye Hospital, Nagpur.
        </p>
      </form>
    </motion.div>
  )
}
