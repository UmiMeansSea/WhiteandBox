import Course from '../models/Course.js';
import User from '../models/User.js';
import { uploadFromBuffer } from '../config/cloudinary.js';
import redisClient from '../config/redis.js';

/**
 * @desc    Upload new course with thumbnail, video, and PDF (Unified)
 * @route   POST /api/admin/upload-course
 */
export const uploadCourse = async (req, res, next) => {
  try {
    const { title, subtitle, category, description, price } = req.body;
    const adminId = req.user.id;
    const admin = await User.findById(adminId);
    
    if (!req.files || !req.files['thumbnail'] || !req.files['video'] || !req.files['pdf']) {
      return res.status(400).json({ success: false, message: 'Please provide thumbnail, video, and pdf files.' });
    }

    // Upload to Cloudinary in parallel
    const [thumbnailResult, videoResult, pdfResult] = await Promise.all([
      uploadFromBuffer(req.files['thumbnail'][0].buffer, 'edupro/thumbnails', 'image'),
      uploadFromBuffer(req.files['video'][0].buffer, 'edupro/videos', 'video'),
      uploadFromBuffer(req.files['pdf'][0].buffer, 'edupro/pdfs', 'raw')
    ]);

    const newCourse = new Course({
      title,
      subtitle,
      category,
      description,
      price,
      adminId,
      instructor: admin?.name || 'Admin',
      instructorAvatar: admin?.avatar || '',
      instructorBio: admin?.bio || '',
      thumbnail: { secure_url: thumbnailResult.secure_url, public_id: thumbnailResult.public_id },
      video: { secure_url: videoResult.secure_url, public_id: videoResult.public_id },
      pdf: { secure_url: pdfResult.secure_url, public_id: pdfResult.public_id }
    });

    await newCourse.save();
    try { await redisClient.del('courses:all'); } catch (err) {}

    res.status(201).json({ success: true, course: newCourse });
  } catch (error) { next(error); }
};

/**
 * @desc    Get all courses (supports Redis caching)
 * @route   GET /api/courses
 */
export const getCourses = async (req, res, next) => {
  try {
    const cacheKey = 'courses:all';
    let cachedCourses = null;
    try { cachedCourses = await redisClient.get(cacheKey); } catch (err) {}

    if (cachedCourses) {
      const data = JSON.parse(cachedCourses);
      return res.status(200).json({
        success: true,
        count: data.length,
        courses: data,
        source: 'cache'
      });
    }

    const courses = await Course.find().populate('adminId', 'name avatar bio').lean();
    
    // Fallback instructor data if missing
    const formatted = courses.map(c => ({
      ...c,
      instructor: c.adminId?.name || c.instructor || 'EduPro Expert',
      instructorAvatar: c.adminId?.avatar || c.instructorAvatar || '',
      instructorBio: c.adminId?.bio || c.instructorBio || ''
    }));

    try { await redisClient.set(cacheKey, JSON.stringify(formatted), { EX: 900 }); } catch (err) {}
    res.status(200).json({ success: true, count: formatted.length, courses: formatted, source: 'database' });
  } catch (error) { next(error); }
};

/**
 * @desc    Get single course
 * @route   GET /api/courses/:id
 */
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('adminId', 'name avatar bio').lean();
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const formatted = {
      ...course,
      instructor: course.adminId?.name || course.instructor || 'EduPro Expert',
      instructorAvatar: course.adminId?.avatar || course.instructorAvatar || '',
      instructorBio: course.adminId?.bio || course.instructorBio || ''
    };
    
    res.json(formatted);
  } catch (error) { next(error); }
};

/**
 * @desc    Create basic course
 * @route   POST /api/courses
 */
export const createCourse = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.id);
    const course = new Course({
      ...req.body,
      adminId: req.user.id,
      instructor: admin?.name || 'Admin',
      instructorAvatar: admin?.avatar || '',
      instructorBio: admin?.bio || ''
    });
    await course.save();
    try { await redisClient.del('courses:all'); } catch (err) {}
    res.status(201).json(course);
  } catch (error) { next(error); }
};

/**
 * @desc    Update course details
 * @route   PUT /api/courses/:id
 */
export const updateCourse = async (req, res, next) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    try { await redisClient.del('courses:all'); } catch (err) {}
    res.json(updated);
  } catch (error) { next(error); }
};

/**
 * @desc    Upload assets individually
 * @route   POST /api/courses/:id/assets
 */
export const uploadAssets = async (req, res, next) => {
  try {
    const { kind, sectionTitle, lectureTitle, lectureType, lectureDuration } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!req.files || !req.files[0]) return res.status(400).json({ message: 'No file uploaded' });

    const file = req.files[0];
    const resourceType = kind === 'video' ? 'video' : (kind === 'thumbnail' ? 'image' : 'raw');
    const result = await uploadFromBuffer(file.buffer, `edupro/${kind}s`, resourceType);

    if (kind === 'thumbnail') {
      course.thumbnail = { secure_url: result.secure_url, public_id: result.public_id };
    } else {
      const lecture = {
        title: lectureTitle || file.originalname,
        duration: lectureDuration || '0:00',
        type: lectureType || (kind === 'material' ? 'document' : 'video'),
        url: result.secure_url,
        public_id: result.public_id,
        preview: false
      };

      const sTitle = sectionTitle || 'Course Content';
      const existingSection = course.curriculum.find(s => s.sectionTitle === sTitle);
      if (existingSection) existingSection.lectures.push(lecture);
      else course.curriculum.push({ sectionTitle: sTitle, lectures: [lecture] });
      
      course.totalLectures = (course.totalLectures || 0) + 1;
    }

    await course.save();
    try { await redisClient.del('courses:all'); } catch (err) {}
    res.json({ success: true, course });
  } catch (error) { next(error); }
};

/**
 * @desc    Add lecture via URL
 * @route   POST /api/courses/:id/curriculum/lecture
 */
export const addLecture = async (req, res, next) => {
  try {
    const { sectionTitle, lecture } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const sTitle = sectionTitle || 'Course Content';
    const existingSection = course.curriculum.find(s => s.sectionTitle === sTitle);
    
    if (existingSection) existingSection.lectures.push(lecture);
    else course.curriculum.push({ sectionTitle: sTitle, lectures: [lecture] });
    
    course.totalLectures = (course.totalLectures || 0) + 1;
    await course.save();
    try { await redisClient.del('courses:all'); } catch (err) {}
    res.json(course);
  } catch (error) { next(error); }
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/admin/courses/:id
 */
export const deleteCourse = async (req, res, next) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: `Course not found in database (ID: ${req.params.id})` });
    try { await redisClient.del('courses:all'); } catch (err) {}
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) { next(error); }
};

/**
 * @desc    Delete a specific lecture from curriculum
 * @route   DELETE /api/admin/courses/:id/curriculum/:lectureId
 */
export const deleteLecture = async (req, res, next) => {
  try {
    const { id, lectureId } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, message: `Course not found (ID: ${id})` });

    // Remove the lecture from any section it might be in
    let removed = false;
    course.curriculum.forEach(section => {
      const initialLen = section.lectures.length;
      section.lectures = section.lectures.filter(lec => lec._id.toString() !== lectureId);
      if (section.lectures.length < initialLen) removed = true;
    });

    if (!removed) return res.status(404).json({ message: 'Lecture not found' });

    course.totalLectures = Math.max(0, (course.totalLectures || 1) - 1);
    await course.save();
    try { await redisClient.del('courses:all'); } catch (err) {}
    res.json({ success: true, course });
  } catch (error) { next(error); }
};

/**
 * @desc    Get platform stats
 * @route   GET /api/admin/stats
 */
export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalCourses, moderationQueue] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Course.countDocuments({ status: 'review' })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCourses,
        moderationQueue
      }
    });
  } catch (error) { next(error); }
};
