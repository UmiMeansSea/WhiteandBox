import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastViewedCourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null,
  },
  progress: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
      completedLessons: [String],
      percentComplete: {
        type: Number,
        default: 0,
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
