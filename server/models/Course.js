import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  subtitle: {
    type: String,
  },
  description: {
    type: String,
  },
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
    type: String, // String to support demo IDs
  }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
