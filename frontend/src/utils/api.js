import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

// Attach admin token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export const getDoctors = () => api.get('/doctors')
export const getAvailableSlots = (doctorId, date) =>
  api.get(`/appointments/slots?doctorId=${doctorId}&date=${date}`)
export const submitAppointment = (formData) =>
  api.post('/appointments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const getAppointmentById = (id) => api.get(`/appointments/${id}`)
export const adminLogin = (credentials) => api.post('/auth/login', credentials)
export const getAllAppointments = (params) =>
  api.get('/admin/appointments', { params })
export const updateAppointmentStatus = (id, status) =>
  api.patch(`/admin/appointments/${id}/status`, { status })
export const getAdminStats = () => api.get('/admin/stats')
export const deleteAppointment = (id) => api.delete(`/admin/appointments/${id}`)

export default api
