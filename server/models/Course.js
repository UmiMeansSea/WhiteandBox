import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  avatar: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  category: { type: String, required: true },
  tags: [String],
  instructor: { type: String, required: true },
  instructorAvatar: String,
  instructorBio: String,
  price: { type: Number, required: true, default: 0 },
  originalPrice: Number,
  thumbnail: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  studentCount: { type: Number, default: 0 },
  isBestseller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isFree: { type: Boolean, default: false },
  totalHours: Number,
  totalLectures: Number,
  curriculum: [
    {
      sectionTitle: String,
      lectures: [{
        title: String,
        duration: String,
        type: String,
        preview: Boolean,
        url: String,
        filename: String,
        materials: [{
          title: String,
          url: String,
          filename: String,
        }],
      }]
    }
  ],
  whatYouLearn: [String],
  requirements: [String],
  reviews: [reviewSchema],
  status: { type: String, enum: ['draft', 'review', 'published'], default: 'published' }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
