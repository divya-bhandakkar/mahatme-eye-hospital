import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Clock, Award, ChevronRight, Check, Search } from 'lucide-react'
import { getDoctors } from '../../utils/api'
import { DOCTORS_DATA, COLOR_MAP } from '../../utils/doctors'

function DoctorAvatar({ doctor, colorConfig }) {
  const initials = doctor.name
    .replace('Dr. ', '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <div
      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorConfig.avatar} flex items-center justify-center flex-shrink-0 shadow-lg`}
    >
      <span className="text-white font-display font-bold text-lg">{initials}</span>
    </div>
  )
}

export default function DoctorSelection({ selectedDoctor, onSelect }) {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await getDoctors()
        setDoctors(data.doctors || data)
      } catch {
        // Use static data as fallback
        setDoctors(DOCTORS_DATA)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctors()
  }, [])

  const specializations = ['All', ...new Set(doctors.map((d) => d.specialization.split(' & ')[0]))]

  const filtered = doctors.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || d.specialization.includes(filter)
    return matchSearch && matchFilter
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 shimmer rounded w-3/4" />
                <div className="h-3 shimmer rounded w-1/2" />
                <div className="h-3 shimmer rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {specializations.slice(0, 5).map((spec) => (
            <button
              key={spec}
              onClick={() => setFilter(spec)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filter === spec
                  ? 'bg-teal-600 text-white shadow-glow-teal'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-950/50'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filtered.map((doctor, i) => {
            const colorConfig = COLOR_MAP[doctor.color] || COLOR_MAP.teal
            const isSelected = selectedDoctor?._id === doctor._id

            return (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                onClick={() => onSelect(doctor)}
                className={`doctor-card card cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 ${
                  isSelected ? 'selected' : ''
                } ${colorConfig.bg}`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <DoctorAvatar doctor={doctor} colorConfig={colorConfig} />
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display font-semibold text-slate-800 dark:text-white text-base leading-tight">
                          {doctor.name}
                        </h3>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorConfig.badge}`}>
                          {doctor.specialization}
                        </span>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-all duration-300 ${isSelected ? 'text-teal-500 rotate-90' : 'text-slate-300'}`} />
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {doctor.bio}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-teal-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {doctor.experience}+ yrs
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {doctor.rating} ({doctor.reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {doctor.timings}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1 mt-2.5 flex-wrap">
                      {doctor.availability?.map((day) => (
                        <span
                          key={day}
                          className="px-1.5 py-0.5 text-xs rounded bg-white/70 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-600/50"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg font-display">No doctors found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  )
}
