import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, LogOut, Calendar, Users, Clock, CheckCircle,
  Search, RefreshCw, ExternalLink, Moon, Sun, TrendingUp,
  AlertCircle, FileText, Image, Trash2, LayoutDashboard,
  UserCheck, Stethoscope, BarChart2, X, Star, Activity
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import {
  getAllAppointments, updateAppointmentStatus, getAdminStats, getDoctors
} from '../utils/api'
import api from '../utils/api'

/* ── helpers ───────────────────────────────────────────────────────────── */
const deleteAppointment = (id) => api.delete(`/admin/appointments/${id}`)

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-400' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100  text-blue-700  dark:bg-blue-900/30  dark:text-blue-400',  dot: 'bg-blue-500'  },
  completed: { label: 'Completed', color: 'bg-teal-100  text-teal-700  dark:bg-teal-900/30  dark:text-teal-400',  dot: 'bg-teal-500'  },
  cancelled: { label: 'Cancelled', color: 'bg-red-100   text-red-600   dark:bg-red-900/30   dark:text-red-400',   dot: 'bg-red-500'   },
}

const COLOR_MAP = {
  teal:   'from-teal-400 to-teal-600',
  blue:   'from-blue-400 to-blue-600',
  purple: 'from-purple-400 to-purple-600',
  green:  'from-green-400 to-green-600',
  orange: 'from-orange-400 to-orange-600',
  rose:   'from-rose-400 to-rose-600',
  indigo: 'from-indigo-400 to-indigo-600',
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT — Sidebar + tab switcher
══════════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard({ darkMode, setDarkMode }) {
  const navigate   = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const NAV = [
    { id: 'dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
    { id: 'appointments', icon: Calendar,         label: 'Appointments' },
    { id: 'doctors',      icon: Stethoscope,      label: 'Doctors'      },
    { id: 'reports',      icon: BarChart2,        label: 'Reports'      },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">

      {/* ── Sidebar (desktop) ── */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-700/50 flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Mahatme Eye</p>
              <p className="text-xs text-teal-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-teal-600/20 text-teal-400 border border-teal-600/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              {NAV.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-slate-400">{format(new Date(), 'EEEE, MMMM do yyyy')}</p>
          </div>

          {/* Mobile tab icons */}
          <div className="flex items-center gap-1 lg:hidden">
            {NAV.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600'
                    : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
            <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg">
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop logout */}
          <button
            onClick={handleLogout}
            className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'dashboard'    && <DashboardTab />}
          {activeTab === 'appointments' && <AppointmentsTab />}
          {activeTab === 'doctors'      && <DoctorsTab />}
          {activeTab === 'reports'      && <ReportsTab />}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 1 — Dashboard overview
══════════════════════════════════════════════════════════════════════════ */
function DashboardTab() {
  const [stats,   setStats]   = useState(null)
  const [recent,  setRecent]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAdminStats(), getAllAppointments({ limit: 5, sort: '-createdAt' })])
      .then(([s, a]) => { setStats(s.data); setRecent(a.data.appointments || []) })
      .catch(() => { setStats(MOCK_STATS); setRecent(MOCK_APPOINTMENTS.slice(0, 5)) })
      .finally(() => setLoading(false))
  }, [])

  const cards = stats ? [
    { label: 'Total',     value: stats.total    || 0, icon: Calendar,    color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-950/40'   },
    { label: 'Pending',   value: stats.pending   || 0, icon: Clock,       color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Confirmed', value: stats.confirmed || 0, icon: CheckCircle, color: 'text-teal-500',   bg: 'bg-teal-50 dark:bg-teal-950/40'   },
    { label: 'Completed', value: stats.completed || 0, icon: TrendingUp,  color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/40'},
    { label: "Today",     value: stats.today     || 0, icon: Activity,    color: 'text-rose-500',   bg: 'bg-rose-50 dark:bg-rose-950/40'   },
    { label: 'Cancelled', value: stats.cancelled || 0, icon: AlertCircle, color: 'text-red-400',    bg: 'bg-red-50 dark:bg-red-950/40'     },
  ] : []

  if (loading) return <Spinner />

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm"
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Recent Appointments</h2>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
        {recent.length === 0
          ? <div className="p-10 text-center text-sm text-slate-400">No appointments yet.</div>
          : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {['Patient', 'Doctor', 'Date', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {recent.map((a, i) => {
                  const cfg = STATUS_CONFIG[a.status] || STATUS_CONFIG.pending
                  return (
                    <tr key={a._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                            {a.fullName?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="text-sm font-medium text-slate-800 dark:text-white">{a.fullName || '—'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{a.doctorName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {a.appointmentDate ? format(new Date(a.appointmentDate), 'dd MMM yyyy') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 2 — Appointments (table + detail panel + delete)
══════════════════════════════════════════════════════════════════════════ */
function AppointmentsTab() {
  const [appointments, setAppointments] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page,         setPage]         = useState(1)
  const [total,        setTotal]        = useState(0)
  const [selectedApt,  setSelectedApt]  = useState(null)
  const [updating,     setUpdating]     = useState(null)
  const PER_PAGE = 10

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAllAppointments({
        search,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        limit: PER_PAGE,
      })
      setAppointments(res.data.appointments || res.data)
      setTotal(res.data.total || 0)
    } catch {
      setAppointments(MOCK_APPOINTMENTS)
      setTotal(MOCK_APPOINTMENTS.length)
    } finally { setLoading(false) }
  }, [search, statusFilter, page])

  useEffect(() => { fetchData() }, [fetchData])

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id)
    try {
      await updateAppointmentStatus(id, status)
      toast.success(`Status updated to ${status}`)
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a))
      if (selectedApt?._id === id) setSelectedApt(p => ({ ...p, status }))
    } catch { toast.error('Failed to update status') }
    finally  { setUpdating(null) }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this appointment? This cannot be undone.')) return
    try {
      await deleteAppointment(id)
      toast.success('Appointment deleted')
      setAppointments(prev => prev.filter(a => a._id !== id))
      setTotal(t => t - 1)
      if (selectedApt?._id === id) setSelectedApt(null)
    } catch { toast.error('Failed to delete appointment') }
  }

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase()
    return (
      a.fullName?.toLowerCase().includes(q) ||
      a.doctorName?.toLowerCase().includes(q) ||
      a.mobile?.includes(q)
    ) && (statusFilter === 'all' || a.status === statusFilter)
  })

  return (
    <div>
      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, doctor, phone…"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1) }}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                statusFilter === s
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >{s}</button>
          ))}
          <button onClick={fetchData} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {loading ? <Spinner /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    {['Patient', 'Doctor', 'Date & Time', 'Contact', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {filtered.map((apt, i) => {
                    const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending
                    return (
                      <motion.tr
                        key={apt._id || i}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedApt(apt)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {apt.fullName?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800 dark:text-white">{apt.fullName || '—'}</p>
                              <p className="text-xs text-slate-400">{apt.age ? `${apt.age} yrs, ${apt.gender}` : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-700 dark:text-slate-300">{apt.doctorName || '—'}</p>
                          <p className="text-xs text-slate-400">{apt.specialization || ''}</p>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {apt.appointmentDate ? format(new Date(apt.appointmentDate), 'dd MMM yyyy') : '—'}
                          </p>
                          <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">{apt.appointmentTime || ''}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-700 dark:text-slate-300">{apt.mobile || '—'}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[120px]">{apt.email || ''}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <select
                              value={apt.status}
                              onChange={e => handleStatusUpdate(apt._id, e.target.value)}
                              disabled={updating === apt._id}
                              className="text-xs py-1.5 px-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            >
                              {Object.keys(STATUS_CONFIG).map(s => (
                                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                              ))}
                            </select>
                            <button
                              onClick={e => handleDelete(apt._id, e)}
                              title="Delete"
                              className="ml-1 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No appointments found</p>
              </div>
            )}

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <p className="text-xs text-slate-400">Showing {filtered.length} of {total}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Previous
                </button>
                <span className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300">Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={filtered.length < PER_PAGE}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail slide-over */}
      <AnimatePresence>
        {selectedApt && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-end"
            onClick={() => setSelectedApt(null)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Appointment Details</h2>
                  <button onClick={() => setSelectedApt(null)}
                    className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {(() => {
                  const cfg = STATUS_CONFIG[selectedApt.status] || STATUS_CONFIG.pending
                  return (
                    <div className="mb-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${cfg.color}`}>
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                  )
                })()}

                <DetailSection title="Patient Info">
                  <DetailRow label="Name"    value={selectedApt.fullName} />
                  <DetailRow label="Age"     value={selectedApt.age ? `${selectedApt.age} years` : null} />
                  <DetailRow label="Gender"  value={selectedApt.gender} />
                  <DetailRow label="Mobile"  value={selectedApt.mobile} />
                  <DetailRow label="Email"   value={selectedApt.email} />
                  <DetailRow label="Address" value={selectedApt.address} />
                </DetailSection>

                <DetailSection title="Appointment Info">
                  <DetailRow label="Doctor"         value={selectedApt.doctorName}      highlight />
                  <DetailRow label="Specialization" value={selectedApt.specialization} />
                  <DetailRow label="Date"           value={selectedApt.appointmentDate ? format(new Date(selectedApt.appointmentDate), 'dd MMM yyyy, EEEE') : null} highlight />
                  <DetailRow label="Time"           value={selectedApt.appointmentTime} highlight />
                </DetailSection>

                {selectedApt.symptoms && (
                  <DetailSection title="Symptoms">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedApt.symptoms}</p>
                  </DetailSection>
                )}
                {selectedApt.notes && (
                  <DetailSection title="Notes">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedApt.notes}</p>
                  </DetailSection>
                )}

                {selectedApt.documents?.length > 0 && (
                  <DetailSection title="Documents">
                    <div className="space-y-2">
                      {selectedApt.documents.map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex items-center justify-center">
                            {doc.mimetype?.includes('image') ? <Image className="w-4 h-4 text-teal-600" /> : <FileText className="w-4 h-4 text-teal-600" />}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 flex-1 truncate">{doc.originalname || doc.filename}</p>
                          <a href={`/api/files/${doc.filename}`} target="_blank" rel="noreferrer"
                            className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 hover:bg-teal-200 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </DetailSection>
                )}

                {/* Update Status */}
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
                      <button
                        key={s}
                        onClick={() => handleStatusUpdate(selectedApt._id, s)}
                        disabled={selectedApt.status === s || updating === selectedApt._id}
                        className={`py-2 px-3 rounded-xl text-xs font-medium transition-all disabled:opacity-40 ${
                          selectedApt.status === s
                            ? `${cfg.color} ring-2 ring-current/30`
                            : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={e => handleDelete(selectedApt._id, e)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 3 — Doctors
══════════════════════════════════════════════════════════════════════════ */
function DoctorsTab() {
  const [doctors,  setDoctors]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    getDoctors()
      .then(res => setDoctors(res.data.doctors || res.data))
      .catch(() => setDoctors(MOCK_DOCTORS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  )

  const ALL_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const DAY_ABBR = { Mon:'M', Tue:'T', Wed:'W', Thu:'T', Fri:'F', Sat:'S', Sun:'S' }

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search doctors or specialization…"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((doc, i) => {
            const grad = COLOR_MAP[doc.color] || COLOR_MAP.teal
            return (
              <motion.div
                key={doc._id || i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${grad}`} />
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                      {doc.name?.split(' ').filter(w => /^[A-Z]/.test(w) && w.length > 2)[0]?.[0] || doc.name?.[0] || 'D'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 dark:text-white text-sm truncate">{doc.name}</h3>
                      <p className="text-xs text-teal-600 dark:text-teal-400 truncate">{doc.specialization}</p>
                      <p className="text-xs text-slate-400 truncate">{doc.qualification}</p>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{doc.rating || '4.8'}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                      <span>{doc.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                      <span>{doc.timings || '9:00 AM – 5:00 PM'}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-1.5">Availability</p>
                    <div className="flex gap-1">
                      {ALL_DAYS.map(day => {
                        const active = (doc.availability || []).includes(day)
                        return (
                          <div key={day}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold ${
                              active ? `bg-gradient-to-br ${grad} text-white` : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                            }`}
                          >
                            {DAY_ABBR[day]}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      doc.isActive !== false
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                      {doc.isActive !== false ? '● Active' : '● Inactive'}
                    </span>
                    <span className="text-xs text-slate-400">{doc.reviews || 0} reviews</span>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              <Stethoscope className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No doctors found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 4 — Reports
══════════════════════════════════════════════════════════════════════════ */
function ReportsTab() {
  const [stats,   setStats]   = useState(null)
  const [apts,    setApts]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAdminStats(), getAllAppointments({ limit: 200 })])
      .then(([s, a]) => { setStats(s.data); setApts(a.data.appointments || []) })
      .catch(() => { setStats(MOCK_STATS); setApts(MOCK_APPOINTMENTS) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const total = stats?.total || 0

  const statusBreakdown = [
    { label: 'Pending',   value: stats?.pending   || 0, bar: 'bg-amber-400' },
    { label: 'Confirmed', value: stats?.confirmed  || 0, bar: 'bg-blue-500'  },
    { label: 'Completed', value: stats?.completed  || 0, bar: 'bg-teal-500'  },
    { label: 'Cancelled', value: stats?.cancelled  || 0, bar: 'bg-red-400'   },
  ].map(s => ({ ...s, pct: total ? Math.round((s.value / total) * 100) : 0 }))

  // Doctor-wise counts
  const doctorMap = {}
  apts.forEach(a => { if (a.doctorName) doctorMap[a.doctorName] = (doctorMap[a.doctorName] || 0) + 1 })
  const doctorStats = Object.entries(doctorMap).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6)
  const maxDoc = doctorStats[0]?.count || 1

  const weeklyTrend = stats?.weeklyTrend || []

  return (
    <div className="space-y-6">

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusBreakdown.map(({ label, value, bar, pct }) => (
          <div key={label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{pct}%</span>
            </div>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mb-3">{value}</p>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full ${bar} rounded-full`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Distribution bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Status Distribution</h3>
        {total === 0 ? <p className="text-sm text-slate-400">No data yet.</p> : (
          <>
            <div className="flex h-5 rounded-full overflow-hidden gap-0.5 mb-4">
              {statusBreakdown.filter(s => s.pct > 0).map(({ label, bar, pct }) => (
                <div key={label} className={`${bar}`} style={{ width: `${pct}%` }} title={`${label}: ${pct}%`} />
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {statusBreakdown.map(({ label, bar, value, pct }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${bar}`} />
                  <span className="text-xs text-slate-600 dark:text-slate-300">{label}: <strong>{value}</strong> ({pct}%)</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Doctor-wise */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-5">Appointments by Doctor</h3>
        {doctorStats.length === 0 ? <p className="text-sm text-slate-400">No data yet.</p> : (
          <div className="space-y-3">
            {doctorStats.map(({ name, count }) => (
              <div key={name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[220px]">{name}</span>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400 ml-2 flex-shrink-0">{count}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
                    style={{ width: `${Math.round((count / maxDoc) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly trend bar chart */}
      {weeklyTrend.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-5">Last 7 Days — New Bookings</h3>
          <div className="flex items-end gap-3 h-28">
            {weeklyTrend.map(({ _id, count }) => {
              const maxC = Math.max(...weeklyTrend.map(d => d.count), 1)
              return (
                <div key={_id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{count}</span>
                  <div
                    className="w-full bg-gradient-to-t from-teal-500 to-teal-300 rounded-t-lg"
                    style={{ height: `${Math.max(6, Math.round((count / maxC) * 80))}px` }}
                  />
                  <span className="text-xs text-slate-400">{format(new Date(_id), 'EEE')}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Grand total banner */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BarChart2 className="w-5 h-5 opacity-80" />
          <h3 className="font-semibold">Total Appointments (All Time)</h3>
        </div>
        <p className="text-5xl font-bold mb-1">{total}</p>
        <p className="text-teal-200 text-sm">Across all doctors and specializations</p>
        {stats?.today !== undefined && (
          <p className="mt-3 text-teal-100 text-sm">
            <strong className="text-white text-base">{stats.today}</strong> scheduled for today
          </p>
        )}
      </div>
    </div>
  )
}

/* ── shared helpers ─────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="p-12 text-center">
      <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
      <p className="text-slate-400 text-sm mt-3">Loading…</p>
    </div>
  )
}

function DetailSection({ title, children }) {
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function DetailRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-xs text-slate-400 flex-shrink-0">{label}</span>
      <span className={`text-sm font-medium text-right ${highlight ? 'text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'}`}>
        {value || '—'}
      </span>
    </div>
  )
}

/* ── mock fallback data ─────────────────────────────────────────────────── */
const MOCK_APPOINTMENTS = [
  { _id:'a1', fullName:'Ramesh Sharma',  age:58, gender:'Male',   mobile:'9876543210', email:'ramesh@gmail.com', address:'Sitabuldi, Nagpur',   doctorName:'Dr. Suresh Mahatme', specialization:'Cataract & Refractive Surgery', appointmentDate:new Date().toISOString(), appointmentTime:'10:00 AM', status:'pending',   symptoms:'Blurred Vision', documents:[] },
  { _id:'a2', fullName:'Priya Deshmukh', age:32, gender:'Female', mobile:'9823456780', email:'',                address:'Dharampeth, Nagpur',  doctorName:'Dr. Priya Mahatme',  specialization:'Retina & Vitreous',             appointmentDate:new Date().toISOString(), appointmentTime:'11:30 AM', status:'confirmed', symptoms:'Floaters',       documents:[] },
  { _id:'a3', fullName:'Anil Wankhede',  age:45, gender:'Male',   mobile:'8765432109', email:'anil@yahoo.com',  address:'Manewada, Nagpur',    doctorName:'Dr. Anil Deshmukh',  specialization:'Glaucoma & Cornea',             appointmentDate:new Date().toISOString(), appointmentTime:'02:00 PM', status:'completed', symptoms:'Redness',        documents:[] },
  { _id:'a4', fullName:'Sunita Patel',   age:29, gender:'Female', mobile:'7654321098', email:'',                address:'Wardha Road, Nagpur', doctorName:'Dr. Kavita Joshi',   specialization:'Pediatric Ophthalmology',       appointmentDate:new Date().toISOString(), appointmentTime:'09:30 AM', status:'cancelled', symptoms:'Double Vision',   documents:[] },
  { _id:'a5', fullName:'Vikram Joshi',   age:67, gender:'Male',   mobile:'9012345678', email:'vikram@gmail.com',address:'Itwari, Nagpur',      doctorName:'Dr. Suresh Mahatme', specialization:'Cataract & Refractive Surgery', appointmentDate:new Date().toISOString(), appointmentTime:'12:00 PM', status:'pending',   symptoms:'Vision Loss',    documents:[] },
]

const MOCK_STATS = { total:47, pending:12, confirmed:18, completed:15, cancelled:2, today:5, weeklyTrend:[] }

const MOCK_DOCTORS = [
  { _id:'d1', name:'Dr. Suresh Mahatme', specialization:'Cataract & Refractive Surgery', qualification:'MS Ophthalmology, FICO', experience:22, timings:'9:00 AM – 1:00 PM',  availability:['Mon','Tue','Wed','Thu','Fri'],       color:'teal',   rating:4.9, reviews:312, isActive:true },
  { _id:'d2', name:'Dr. Priya Mahatme',  specialization:'Retina & Vitreous',             qualification:'MS Ophthalmology, FRCS', experience:18, timings:'10:00 AM – 2:00 PM', availability:['Mon','Tue','Thu','Fri','Sat'],       color:'purple', rating:4.8, reviews:241, isActive:true },
  { _id:'d3', name:'Dr. Anil Deshmukh',  specialization:'Glaucoma & Cornea',             qualification:'MS Ophthalmology, DNB',  experience:14, timings:'2:00 PM – 6:00 PM',  availability:['Tue','Wed','Thu','Fri'],             color:'blue',   rating:4.7, reviews:189, isActive:true },
  { _id:'d4', name:'Dr. Kavita Joshi',   specialization:'Pediatric Ophthalmology',       qualification:'MS Ophthalmology',       experience:10, timings:'9:00 AM – 1:00 PM',  availability:['Mon','Wed','Fri','Sat'],             color:'rose',   rating:4.8, reviews:156, isActive:true },
]
