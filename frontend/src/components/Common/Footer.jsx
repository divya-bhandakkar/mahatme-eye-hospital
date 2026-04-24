import { Link } from 'react-router-dom'
import { Eye, Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      {/* Top wave */}
      <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-600" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm leading-tight">Mahatme Eye Hospital</p>
                <p className="text-xs text-teal-400">Nagpur, Maharashtra</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Dedicated to excellence in eye care since 2002. Trusted by over 1 lakh patients across Vidarbha region.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/appointment', label: 'Book Appointment' },
                { to: '/#services', label: 'Our Services' },
                { to: '/#doctors', label: 'Our Doctors' },
                { to: '/#about', label: 'About Hospital' },
                { to: '/admin/login', label: 'Admin Portal' },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-5">Our Specialties</h4>
            <ul className="space-y-3">
              {[
                'Cataract Surgery',
                'LASIK & Refractive',
                'Retina & Vitreous',
                'Glaucoma Treatment',
                'Cornea Transplant',
                'Pediatric Eye Care',
                'Oculoplasty',
              ].map((service) => (
                <li key={service} className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white text-base mb-5">Contact & Hours</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400">123, Dhantoli Ring Road, Near Sitabuldi, Nagpur – 440012, Maharashtra</span>
              </li>
              <li className="flex gap-3 text-sm items-center">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <a href="tel:+917122123456" className="text-slate-400 hover:text-teal-400 transition-colors">+91 712 212 3456</a>
              </li>
              <li className="flex gap-3 text-sm items-center">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <a href="mailto:info@mahatmeeye.in" className="text-slate-400 hover:text-teal-400 transition-colors">info@mahatmeeye.in</a>
              </li>
              <li className="flex gap-3 text-sm">
                <Clock className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <div className="text-slate-400">
                  <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
                  <p>Sunday: 10:00 AM – 2:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Mahatme Eye Hospital, Nagpur. All rights reserved.</p>
          <p>Designed for excellence in eye care • Nagpur, Maharashtra, India</p>
        </div>
      </div>
    </footer>
  )
}
