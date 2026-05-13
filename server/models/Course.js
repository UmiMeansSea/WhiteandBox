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
  description: {
    type: String,
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
    ref: 'Admin',
  }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
