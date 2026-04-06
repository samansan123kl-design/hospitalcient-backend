import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Doctor from './models/Doctor.js';

dotenv.config();

const departments = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Dermatology',
  'Pediatrics',
  'Dentistry',
  'Gastroenterology',
  'Pulmonology'
];

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzales', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const doctors = [];

departments.forEach(dept => {
  for (let i = 1; i <= 5; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `Dr. ${firstName} ${lastName}`;
    const specialization = dept;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}@medicare.com`;
    const phone = `+1-202-555-${Math.floor(1000 + Math.random() * 9000)}`;
    const experience = Math.floor(5 + Math.random() * 25);
    const consultationFee = Math.floor(100 + Math.random() * 400);

    doctors.push({
      name,
      email,
      phone,
      specialization,
      department: dept,
      experience,
      consultationFee,
      qualifications: ['MBBS', 'MD', specialization],
      availableSlots: [
        {
          date: new Date(Date.now() + 86400000), // Tomorrow
          slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM']
        }
      ]
    });
  }
});

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Option: Clear existing doctors if you want a fresh start, otherwise just add new ones
    // await Doctor.deleteMany();
    // console.log('Existing doctors cleared.');

    await Doctor.insertMany(doctors);
    console.log(`${doctors.length} doctors seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
};

seedDoctors();