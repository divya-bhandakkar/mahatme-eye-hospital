import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Eye, Calendar, Phone, Star, Award, Users, Clock,
  ChevronRight, Shield, Microscope, Baby, Zap, HeartHandshake
} from 'lucide-react'

const SERVICES = [
  { icon: Zap, title: 'LASIK Surgery', desc: 'Bladeless, painless laser vision correction with same-day results.', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/40' },
  { icon: Eye, title: 'Cataract Surgery', desc: 'Micro-incision phacoemulsification with premium IOL implants.', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  { icon: Microscope, title: 'Retina Services', desc: 'Advanced treatment for diabetic retinopathy, AMD, retinal detachment.', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/40' },
  { icon: Shield, title: 'Glaucoma Clinic', desc: 'Early detection, IOP management, and surgical interventions.', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
  { icon: Baby, title: 'Paediatric Eye Care', desc: 'Squint, amblyopia, childhood refraction and vision therapy.', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/40' },
  { icon: HeartHandshake, title: 'Oculoplasty', desc: 'Eyelid surgeries, orbital tumors, cosmetic & reconstructive.', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/40' },
]

const STATS = [
  { number: '1L+', label: 'Patients Treated', icon: Users },
  { number: '22+', label: 'Years of Excellence', icon: Award },
  { number: '6', label: 'Super-specialists', icon: Eye },
  { number: '98%', label: 'Success Rate', icon: Star },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="hero-pattern min-h-[88vh] flex items-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 rounded-full px-4 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse-soft" />
              Nagpur's Premier Eye Care Centre
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
              See the World{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-teal-500 to-teal-700 bg-clip-text text-transparent">
                  Clearly
                </span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C40 2 100 1 198 6" stroke="#14b8a6" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <br /> with Expert Eye Care
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8 max-w-lg">
              Mahatme Eye Hospital, Nagpur — over two decades of restoring and preserving vision with compassion, cutting-edge technology and world-class expertise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/appointment" className="btn-primary text-base py-3.5 px-7 shadow-lg shadow-teal-500/25">
                <Calendar className="w-5 h-5" />
                Book Appointment
              </Link>
              <a href="tel:+917122123456" className="btn-secondary text-base py-3.5 px-7">
                <Phone className="w-5 h-5" />
                Call Us Now
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700/50">
              <div className="flex -space-x-2">
                {['S', 'P', 'A', 'K', 'R'].map((l, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${
                    ['from-teal-400 to-teal-600','from-blue-400 to-blue-600','from-purple-400 to-purple-600','from-green-400 to-green-600','from-orange-400 to-orange-600'][i]
                  }`}>{l}</div>
                ))}
              </div>
              <div>
                <div className="flex text-amber-400">{'★★★★★'.split('').map((s, i) => <span key={i} className="text-sm">{s}</span>)}</div>
                <p className="text-xs text-slate-500 mt-0.5">Trusted by 1 lakh+ patients</p>
              </div>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative w-96 h-96">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-teal-200/50 dark:border-teal-900/50 animate-pulse-soft" />

              {/* Main eye graphic */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/40 dark:to-teal-900/30 flex items-center justify-center shadow-glow-teal">
                <div className="text-center">
                  <Eye className="w-24 h-24 text-teal-500 mx-auto eye-blink" />
                  <p className="font-display font-bold text-teal-700 dark:text-teal-300 mt-3 text-lg">20/20</p>
                  <p className="text-xs text-slate-500">Perfect Vision</p>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 card py-2.5 px-4 shadow-lg"
              >
                <p className="text-xs text-slate-500">Today's Surgeries</p>
                <p className="text-xl font-bold text-teal-600">24 ✓</p>
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                className="absolute -bottom-4 -left-4 card py-2.5 px-4 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <div>
                    <p className="text-xs text-slate-500">Rating</p>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">4.9/5.0</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {STATS.map(({ number, label, icon: Icon }) => (
            <motion.div
              key={label}
              variants={itemVariants}
              className="text-center text-white"
            >
              <Icon className="w-7 h-7 mx-auto mb-2 text-teal-200" />
              <p className="font-display text-3xl font-bold">{number}</p>
              <p className="text-teal-100 text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-teal-600 font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h2 className="section-title mt-2">Comprehensive Eye Care Services</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              From routine eye check-ups to complex surgical procedures — all under one roof with state-of-the-art equipment.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {SERVICES.map((svc) => (
              <motion.div
                key={svc.title}
                variants={itemVariants}
                className="card card-hover group"
              >
                <div className={`w-12 h-12 rounded-2xl ${svc.bg} flex items-center justify-center mb-4`}>
                  <svc.icon className={`w-6 h-6 ${svc.color}`} />
                </div>
                <h3 className="font-display font-bold text-slate-800 dark:text-white text-lg mb-2">{svc.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{svc.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-teal-600 dark:text-teal-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-teal-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-teal-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-blue-400 blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Eye className="w-12 h-12 text-teal-400 mx-auto mb-4 eye-blink" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Your Vision is Our Priority
            </h2>
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Don't wait for eye problems to worsen. Book an appointment today with our world-class eye specialists in Nagpur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/appointment" className="btn-primary text-base py-4 px-8 bg-teal-500 hover:bg-teal-400 shadow-glow-teal">
                <Calendar className="w-5 h-5" />
                Book Appointment
              </Link>
              <a href="tel:+917122123456" className="flex items-center gap-2 justify-center text-white border-2 border-white/20 hover:border-white/40 py-4 px-8 rounded-xl transition-colors font-medium">
                <Phone className="w-5 h-5" />
                Emergency: +91 712 212 3456
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
