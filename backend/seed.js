require('dotenv').config()
const mongoose = require('mongoose')
const Doctor = require('./models/Doctor')
const Admin = require('./models/Admin')

const DOCTORS = [
  {
    name: 'Dr. Suresh Mahatme',
    specialization: 'Cataract & Refractive Surgery',
    experience: 22,
    qualification: 'MS (Ophthalmology), FICO (London)',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timings: '9:00 AM – 1:00 PM',
    bio: 'Pioneer in phacoemulsification and bladeless LASIK with over 15,000 successful cataract surgeries.',
    color: 'teal',
    rating: 4.9,
    reviews: 312,
  },
  {
    name: 'Dr. Priya Mahatme',
    specialization: 'Retina & Vitreous',
    experience: 17,
    qualification: 'DNB (Ophthalmology), Fellowship Retina – LVPEI',
    availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    timings: '10:00 AM – 2:00 PM',
    bio: 'Expert in diabetic retinopathy, macular degeneration, and intravitreal injections using cutting-edge OCT guided therapy.',
    color: 'blue',
    rating: 4.8,
    reviews: 247,
  },
  {
    name: 'Dr. Anil Deshmukh',
    specialization: 'Glaucoma & Cornea',
    experience: 14,
    qualification: 'MS (Ophthalmology), Fellowship Cornea – Aravind',
    availability: ['Tue', 'Thu', 'Sat'],
    timings: '11:00 AM – 3:00 PM',
    bio: 'Specializes in advanced glaucoma management, keratoconus treatment (C3R/ICL), and corneal transplantation.',
    color: 'purple',
    rating: 4.7,
    reviews: 189,
  },
  {
    name: 'Dr. Kavita Joshi',
    specialization: 'Pediatric Ophthalmology',
    experience: 11,
    qualification: 'MS (Ophthalmology), Fellowship Pediatric Eye – NIMHANS',
    availability: ['Mon', 'Tue', 'Wed', 'Thu'],
    timings: '9:00 AM – 12:00 PM',
    bio: "Dedicated to children's eye care — squint surgery, amblyopia therapy, and childhood vision screenings.",
    color: 'green',
    rating: 4.9,
    reviews: 156,
  },
  {
    name: 'Dr. Rajesh Kulkarni',
    specialization: 'Oculoplasty & Orbit',
    experience: 16,
    qualification: 'MS (Ophthalmology), FRCS (Glasgow)',
    availability: ['Wed', 'Thu', 'Fri', 'Sat'],
    timings: '2:00 PM – 6:00 PM',
    bio: 'Expert in eyelid surgeries, orbital tumors, DCR procedures, and cosmetic eye reconstructions.',
    color: 'orange',
    rating: 4.8,
    reviews: 203,
  },
  {
    name: 'Dr. Sneha Raut',
    specialization: 'Low Vision & Neuro-Ophthalmology',
    experience: 9,
    qualification: 'MD (Ophthalmology), Fellowship Neuro-Ophth – AIIMS',
    availability: ['Tue', 'Fri', 'Sat'],
    timings: '10:00 AM – 1:00 PM',
    bio: 'Specializes in vision rehabilitation, optic nerve disorders, double vision, and visual field defects.',
    color: 'rose',
    rating: 4.7,
    reviews: 124,
  },
]

const ADMIN_USER = {
  name: 'Super Admin',
  email: process.env.ADMIN_EMAIL || 'admin@mahatmeeye.in',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  role: 'super_admin',
}

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mahatme-eye-hospital'
    await mongoose.connect(uri)
    console.log('✅ Connected to MongoDB')

    // Clear existing
    await Doctor.deleteMany({})
    await Admin.deleteMany({})
    console.log('🗑️  Cleared existing doctors and admins')

    // Seed doctors
    const doctors = await Doctor.insertMany(DOCTORS)
    console.log(`✅ Seeded ${doctors.length} doctors`)

    // Seed admin
    const admin = await Admin.create(ADMIN_USER)
    console.log(`✅ Admin user created: ${admin.email}`)

    console.log('\n🏥 Mahatme Eye Hospital database seeded successfully!')
    console.log(`\n📋 Admin credentials:`)
    console.log(`   Email:    ${ADMIN_USER.email}`)
    console.log(`   Password: ${ADMIN_USER.password}`)
    console.log('\nRun: npm run dev to start the backend server')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err.message)
    process.exit(1)
  }
}

seed()
