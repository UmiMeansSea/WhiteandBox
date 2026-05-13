import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: String,
  duration: String,
  type: { type: String, enum: ['video', 'document'], default: 'video' },
  url: String,
  public_id: String,
  preview: { type: Boolean, default: false }
});

const sectionSchema = new mongoose.Schema({
  sectionTitle: String,
  lectures: [lectureSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  subtitle: String,
  category: {
    type: String,
    required: true,
    index: true,
  },
  description: String,
  price: {
    type: Number,
    default: 0,
  },
  thumbnail: {
    secure_url: String,
    public_id: String,
  },
  video: {
    secure_url: String,
    public_id: String,
  },
  pdf: {
    secure_url: String,
    public_id: String,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructor: String, // Fallback if no ref
  instructorAvatar: String,
  instructorBio: String,
  
  rating: { type: Number, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  studentCount: { type: Number, default: 0 },
  totalLectures: { type: Number, default: 0 },
  totalHours: { type: Number, default: 0 },
  
  whatYouLearn: [String],
  requirements: [String],
  curriculum: [sectionSchema],
  
  status: { type: String, enum: ['draft', 'review', 'published'], default: 'published' }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
