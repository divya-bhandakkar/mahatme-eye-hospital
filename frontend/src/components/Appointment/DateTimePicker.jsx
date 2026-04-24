import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'
import { format, addDays, startOfToday, isBefore, isToday, isSameDay } from 'date-fns'
import { getAvailableSlots } from '../../utils/api'
import { TIME_SLOTS, COLOR_MAP } from '../../utils/doctors'

function generateBookedSlots() {
  const booked = []
  const count = Math.floor(Math.random() * 5) + 3
  const shuffled = [...TIME_SLOTS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export default function DateTimePicker({ selectedDoctor, selectedDate, selectedTime, onDateChange, onTimeChange }) {
  const [availableSlots, setAvailableSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)

  const today = startOfToday()
  const weekDays = [...Array(7)].map((_, i) => addDays(today, i + weekOffset * 7))

  const colorConfig = COLOR_MAP[selectedDoctor?.color] || COLOR_MAP.teal

  useEffect(() => {
    if (!selectedDate || !selectedDoctor) return
    setLoading(true)

    const fetchSlots = async () => {
      try {
        const { data } = await getAvailableSlots(
          selectedDoctor._id,
          format(selectedDate, 'yyyy-MM-dd')
        )
        setAvailableSlots(data.available || TIME_SLOTS)
        setBookedSlots(data.booked || generateBookedSlots())
      } catch {
        setAvailableSlots(TIME_SLOTS)
        setBookedSlots(generateBookedSlots())
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [selectedDate, selectedDoctor])

  const handleDateClick = (day) => {
    if (isBefore(day, today)) return
    onDateChange(day)
    onTimeChange(null)
  }

  const isDayAvailable = (day) => {
    const dayName = format(day, 'EEE').slice(0, 3)
    return selectedDoctor?.availability?.includes(dayName)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Selected Doctor Reminder */}
      {selectedDoctor && (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${colorConfig.bg} border-current/10`}>
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorConfig.avatar} flex items-center justify-center text-white text-xs font-bold`}>
            {selectedDoctor.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedDoctor.name}</p>
            <p className="text-xs text-slate-500">{selectedDoctor.specialization}</p>
          </div>
          <span className="ml-auto text-xs text-teal-600 dark:text-teal-400 font-medium">Selected ✓</span>
        </div>
      )}

      {/* Date Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-500" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Select Date</h3>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWeekOffset(Math.min(3, weekOffset + 1))}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((day, i) => {
            const isPast = isBefore(day, today)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const available = isDayAvailable(day) && !isPast
            const isCurrentDay = isToday(day)

            return (
              <motion.button
                key={i}
                whileHover={available ? { scale: 1.05 } : {}}
                whileTap={available ? { scale: 0.95 } : {}}
                onClick={() => handleDateClick(day)}
                disabled={isPast || !available}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl border-2 transition-all duration-200 text-xs select-none ${
                  isSelected
                    ? 'bg-teal-600 border-teal-600 text-white shadow-glow-teal'
                    : available
                    ? 'border-slate-200 dark:border-slate-600 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/50 cursor-pointer'
                    : 'border-slate-100 dark:border-slate-800 opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900'
                } ${isCurrentDay && !isSelected ? 'border-teal-300 dark:border-teal-700' : ''}`}
              >
                <span className={`font-medium ${isSelected ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}>
                  {format(day, 'EEE')}
                </span>
                <span className={`font-bold text-sm mt-0.5 ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                  {format(day, 'd')}
                </span>
                {isCurrentDay && (
                  <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-white/70' : 'bg-teal-500'}`} />
                )}
              </motion.button>
            )
          })}
        </div>

        {selectedDate && (
          <p className="text-xs text-teal-600 dark:text-teal-400 mt-2 text-center font-medium">
            {format(selectedDate, 'EEEE, MMMM do, yyyy')}
          </p>
        )}
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-teal-500" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Select Time Slot</h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 rounded-xl shimmer" />
              ))}
            </div>
          ) : (
            <>
              <div className="mb-3 flex gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-teal-600 inline-block" /> Available
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700 inline-block" /> Booked
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = bookedSlots.includes(slot)
                  const isSelected = selectedTime === slot

                  return (
                    <motion.button
                      key={slot}
                      whileHover={!isBooked ? { scale: 1.03 } : {}}
                      whileTap={!isBooked ? { scale: 0.97 } : {}}
                      onClick={() => !isBooked && onTimeChange(slot)}
                      disabled={isBooked}
                      className={`time-slot ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                    >
                      {slot}
                    </motion.button>
                  )
                })}
              </div>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
