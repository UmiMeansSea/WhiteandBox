import Course from '../models/Course.js';
import { uploadFromBuffer } from '../config/cloudinary.js';

/**
 * @desc    Upload new course with thumbnail, video, and PDF
 * @route   POST /api/admin/upload-course
 * @access  Private (Admin)
 */
export const uploadCourse = async (req, res, next) => {
  try {
    const { title, subtitle, category, description, price } = req.body;
    const adminId = req.user.id;
    
    if (!req.files || !req.files['thumbnail'] || !req.files['video'] || !req.files['pdf']) {
      return res.status(400).json({ success: false, message: 'Please provide thumbnail, video, and pdf files.' });
    }

    const thumbnailFile = req.files['thumbnail'][0];
    const videoFile = req.files['video'][0];
    const pdfFile = req.files['pdf'][0];

    // Upload to Cloudinary in parallel
    const [thumbnailResult, videoResult, pdfResult] = await Promise.all([
      uploadFromBuffer(thumbnailFile.buffer, 'edupro/thumbnails', 'image'),
      uploadFromBuffer(videoFile.buffer, 'edupro/videos', 'video'),
      uploadFromBuffer(pdfFile.buffer, 'edupro/pdfs', 'raw')
    ]);

    const newCourse = new Course({
      title,
      subtitle,
      category,
      description,
      price,
      adminId,
      thumbnail: {
        secure_url: thumbnailResult.secure_url,
        public_id: thumbnailResult.public_id,
      },
      video: {
        secure_url: videoResult.secure_url,
        public_id: videoResult.public_id,
      },
      pdf: {
        secure_url: pdfResult.secure_url,
        public_id: pdfResult.public_id,
      }
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: 'Course uploaded successfully',
      course: newCourse
    });

  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all courses for student dashboard (Fast-Show)
 * @route   GET /api/courses
 * @access  Public/Student
 */
export const getCourses = async (req, res, next) => {
  try {
    // Fast-Show: Use .lean() to get raw JS objects
    const courses = await Course.find().lean();
    res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    next(error);
  }
};
