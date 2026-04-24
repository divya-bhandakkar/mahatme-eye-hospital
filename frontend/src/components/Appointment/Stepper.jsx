import { motion } from 'framer-motion'
import { Check, Stethoscope, Calendar, ClipboardList } from 'lucide-react'

const STEPS = [
  { label: 'Choose Doctor', icon: Stethoscope, desc: 'Select your specialist' },
  { label: 'Date & Time', icon: Calendar, desc: 'Pick a slot' },
  { label: 'Your Details', icon: ClipboardList, desc: 'Fill your info' },
]

export default function Stepper({ currentStep }) {
  return (
    <div className="w-full py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connector line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 mx-10 z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-400 mx-10 z-0 transition-all duration-500"
            style={{ width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 80px * ${currentStep / (STEPS.length - 1)})` }}
          />

          {STEPS.map((step, index) => {
            const Icon = step.icon
            const isCompleted = index < currentStep
            const isActive = index === currentStep

            return (
              <div key={step.label} className="flex flex-col items-center gap-2 z-10">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? '#0d9488'
                      : isActive
                      ? '#0d9488'
                      : undefined,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-teal-600 border-teal-600 shadow-glow-teal'
                      : isActive
                      ? 'bg-teal-600 border-teal-600 shadow-glow-teal'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                  ) : (
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`}
                    />
                  )}
                </motion.div>

                <div className="text-center hidden sm:block">
                  <p
                    className={`text-xs font-semibold transition-colors ${
                      isActive ? 'text-teal-600 dark:text-teal-400' : isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-400 hidden lg:block">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile: current step label */}
        <div className="sm:hidden text-center mt-3">
          <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
            Step {currentStep + 1}: {STEPS[currentStep]?.label}
          </p>
        </div>
      </div>
    </div>
  )
}
