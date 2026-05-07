import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  avatar: String,
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  bio: String,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  totalRevenue: { type: Number, default: 0 },
  totalStudents: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
