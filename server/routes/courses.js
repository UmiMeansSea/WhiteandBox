import express from 'express';
import Course from '../models/Course.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Seed data fallback (used when no DB)
const seedCourses = [
  {
    _id: '1', title: 'Mastering Minimalist Spatial Design',
    subtitle: 'A comprehensive guide to creating high-end architectural experiences through restraint and precision.',
    description: 'This course is a deep dive into the philosophy and practice of minimalist spatial design. Led by Alexei Volkov, an award-winning architect who has designed spaces for luxury brands across Europe and Asia.',
    category: 'Architecture', tags: ['Design', 'Architecture'],
    instructor: 'Alexei Volkov', instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80',
    instructorBio: 'Alexei Volkov is an award-winning architect based in Berlin with over 20 years of experience designing minimalist spaces for luxury clients.',
    price: 149, originalPrice: 299, thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80',
    rating: 4.9, reviewCount: 2341, studentCount: 12840, isBestseller: true, totalHours: 8.3, totalLectures: 24,
    whatYouLearn: ['Principles of negative space', 'Material selection for minimalist interiors', 'Lighting design', 'Case studies from award-winning projects'],
    requirements: ['Basic understanding of architectural concepts', 'Access to design software (AutoCAD or similar)'],
    curriculum: [
      { sectionTitle: 'The Philosophy of Less', lectures: [
        { title: 'Introduction & Course Overview', duration: '08:15', type: 'video', preview: true },
        { title: 'Wabi-Sabi and the Origins of Minimalism', duration: '22:40', type: 'video', preview: false },
        { title: 'The Spatial Hierarchy Framework', duration: '11:05', type: 'video', preview: false }
      ]},
      { sectionTitle: 'Material & Texture', lectures: [
        { title: 'Material Selection & Textures', duration: '18:15', type: 'video', preview: false },
        { title: 'Case Study: The Glass Pavilion', duration: '', type: 'document', preview: false }
      ]}
    ],
    reviews: [
      { user: 'Sara K.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=64&q=80', rating: 5, comment: 'Absolutely transformative. Changed how I approach every project.', createdAt: new Date() },
      { user: 'Anya M.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&q=80', rating: 5, comment: 'The Glass Pavilion case study alone is worth the price.', createdAt: new Date() }
    ],
    status: 'published'
  },
  {
    _id: '2', title: 'Brand Identity from Scratch',
    subtitle: 'Build a complete brand system: logo, typography, color, and voice.',
    description: 'A complete guide to building professional brand identities from concept to delivery.',
    category: 'Branding', tags: ['Branding', 'Graphic Design'],
    instructor: 'Maya Chen', instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&q=80',
    price: 89, originalPrice: 179, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    rating: 4.8, reviewCount: 1823, studentCount: 8420, isBestseller: true, totalHours: 6.5, totalLectures: 18,
    whatYouLearn: ['Logo design principles', 'Typography systems', 'Color theory for brand', 'Brand voice & messaging'],
    requirements: ['Basic design knowledge', 'Adobe Illustrator or Figma access'],
    curriculum: [{ sectionTitle: 'Brand Fundamentals', lectures: [{ title: 'What Makes a Great Brand', duration: '15:00', type: 'video', preview: true }]}],
    reviews: [], status: 'published'
  },
  {
    _id: '3', title: 'UX Research & Prototyping',
    subtitle: 'Human-centered research methods and high-fidelity prototyping workflows.',
    description: 'Master UX research methodologies and turn insights into compelling prototypes.',
    category: 'UX Design', tags: ['UX Design', 'Research'],
    instructor: 'Priya Nair', price: 119, thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    rating: 4.7, reviewCount: 987, studentCount: 5670, totalHours: 7.2, totalLectures: 20,
    whatYouLearn: ['User interview techniques', 'Affinity mapping', 'Wireframing', 'High-fidelity prototyping in Figma'],
    requirements: ['No prior UX experience needed'],
    curriculum: [{ sectionTitle: 'Research Fundamentals', lectures: [{ title: 'Introduction to UX Research', duration: '12:00', type: 'video', preview: true }]}],
    reviews: [], status: 'published'
  },
  {
    _id: '4', title: 'Editorial Photography Masterclass',
    subtitle: 'Lighting, composition, and post-processing for editorial work.',
    description: 'Learn professional editorial photography from concept to final delivery.',
    category: 'Photography', tags: ['Photography'],
    instructor: 'Lucas Ferreira', price: 79, thumbnail: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80',
    rating: 4.9, reviewCount: 3110, studentCount: 14200, isNew: true, totalHours: 9.0, totalLectures: 28,
    whatYouLearn: ['Lighting setups', 'Composition rules', 'Color grading in Lightroom', 'Working with editorial clients'],
    requirements: ['Own a DSLR or mirrorless camera'],
    curriculum: [], reviews: [], status: 'published'
  },
  {
    _id: '5', title: 'Full-Stack Web Development 2024',
    subtitle: 'Build complete web apps with React, Node.js, and MongoDB.',
    description: 'The most comprehensive full-stack development course covering modern tools.',
    category: 'Development', tags: ['Development', 'React', 'Node.js'],
    instructor: 'Daniel Park', price: 199, originalPrice: 399, thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    rating: 4.8, reviewCount: 5421, studentCount: 31000, isBestseller: true, totalHours: 45, totalLectures: 120,
    whatYouLearn: ['React 18', 'Node.js & Express', 'MongoDB & Mongoose', 'Deployment with Docker'],
    requirements: ['Basic HTML/CSS/JavaScript knowledge'],
    curriculum: [], reviews: [], status: 'published'
  },
  {
    _id: '6', title: 'Advanced Typography & Type Design',
    subtitle: 'Master typeface design, typographic systems, and layout excellence.',
    description: 'An advanced course for designers who want to master typography at a professional level.',
    category: 'Graphic Design', tags: ['Graphic Design', 'Typography'],
    instructor: 'Sofia Rossi', price: 69, thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80',
    rating: 4.6, reviewCount: 742, studentCount: 3200, totalHours: 5.5, totalLectures: 16,
    whatYouLearn: ['Type anatomy', 'Designing readable type systems', 'Layout hierarchy', 'Variable fonts'],
    requirements: ['Intermediate design knowledge'],
    curriculum: [], reviews: [], status: 'published'
  },
  {
    _id: '7', title: 'Creative Studio Business Model',
    subtitle: 'How to build, price, and scale a creative business.',
    description: 'The business playbook for designers, architects, and creative professionals.',
    category: 'Business', tags: ['Business'],
    instructor: 'Ahmed Hassan', price: 99, thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    rating: 4.7, reviewCount: 1244, studentCount: 6800, totalHours: 4.5, totalLectures: 14,
    whatYouLearn: ['Pricing your services', 'Client acquisition', 'Studio operations', 'Scaling beyond yourself'],
    requirements: ['Running or planning to run a creative business'],
    curriculum: [], reviews: [], status: 'published'
  },
  {
    _id: '8', title: 'Music Production for Beginners',
    subtitle: 'Make your first track from scratch — no experience needed.',
    description: 'A friendly, beginner-focused course on digital music production.',
    category: 'Music', tags: ['Music'],
    instructor: 'Jamie Walsh', price: 0, thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    rating: 4.5, reviewCount: 634, studentCount: 9100, isFree: true, totalHours: 3.5, totalLectures: 12,
    whatYouLearn: ['DAW basics', 'Beat making', 'Melody and harmony', 'Mixing essentials'],
    requirements: ['A laptop and headphones'],
    curriculum: [], reviews: [], status: 'published'
  },
  {
    _id: '9', title: 'Blender 3D: Zero to Hero',
    subtitle: 'Master 3D modeling, rendering, and animation in Blender.',
    description: 'The most comprehensive Blender course to take you from total beginner to professional 3D artist.',
    category: '3D Design', tags: ['3D Design', 'Blender'],
    instructor: 'Kenji Nakamura', price: 129, originalPrice: 259, thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    rating: 4.9, reviewCount: 4208, studentCount: 22000, isBestseller: true, totalHours: 32, totalLectures: 85,
    whatYouLearn: ['3D modeling', 'UV unwrapping', 'Materials & shaders', 'Animation & rigging'],
    requirements: ['A computer with a GPU'],
    curriculum: [], reviews: [], status: 'published'
  }
];

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    return next();
  });
}

function normalizeAdminQuery(value) {
  if (value === true) return true;
  if (value === false) return false;
  const s = String(value || '').toLowerCase().trim();
  return s === '1' || s === 'true' || s === 'yes';
}

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const safe = String(file.originalname || 'file').replace(/[^\w.\-]+/g, '_');
      cb(null, `${Date.now()}_${safe}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 1024 }, // 1GB per file (adjust as needed)
});

// GET all courses (with category filter, search, pagination)
router.get('/', async (req, res) => {
  const { category, q, page = 1, limit = 9 } = req.query;
  const isAdmin = normalizeAdminQuery(req.query.admin);
  
  try {
    const filter = isAdmin ? {} : { status: 'published' };
    if (category && category !== 'All Topics') filter.category = category;
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { instructor: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } }
    ];
    
    const courses = await Course.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Course.countDocuments(filter);
    
    res.json({ courses, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    // Fallback to seed data if DB not connected
    let filtered = seedCourses;
    if (!isAdmin) filtered = filtered.filter(c => c.status === 'published');
    if (category && category !== 'All Topics') filtered = filtered.filter(c => c.category === category);
    if (q) filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(q.toLowerCase()) ||
      c.instructor.toLowerCase().includes(q.toLowerCase()) ||
      c.category.toLowerCase().includes(q.toLowerCase())
    );
    res.json({ courses: filtered, total: filtered.length, pages: 1 });
  }
});

// GET single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    // Fallback
    const course = seedCourses.find(c => c._id === req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  }
});

// POST new course
router.post('/', requireAdmin, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    // Fallback to demo mode
    const body = req.body || {};
    const newCourse = {
      _id: `seed_${Date.now()}`,
      title: body.title,
      subtitle: body.subtitle || '',
      description: body.description || '',
      category: body.category,
      tags: body.tags || [],
      instructor: body.instructor || req.user?.name || 'Admin',
      instructorAvatar: body.instructorAvatar || null,
      instructorBio: body.instructorBio || '',
      price: Number.isFinite(body.price) ? body.price : Number(body.price || 0),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
      thumbnail: body.thumbnail || '',
      rating: 0,
      reviewCount: 0,
      studentCount: 0,
      isBestseller: false,
      isNew: true,
      isFree: body.isFree ?? (Number(body.price || 0) === 0),
      totalHours: body.totalHours || 0,
      totalLectures: body.totalLectures || 0,
      curriculum: body.curriculum || [],
      whatYouLearn: body.whatYouLearn || [],
      requirements: body.requirements || [],
      reviews: [],
      status: body.status || 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    seedCourses.unshift(newCourse);
    res.status(201).json(newCourse);
  }
});

// PUT update course (admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    return res.json(updated);
  } catch (err) {
    const idx = seedCourses.findIndex((c) => c._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Course not found' });
    seedCourses[idx] = { ...seedCourses[idx], ...req.body, updatedAt: new Date() };
    return res.json(seedCourses[idx]);
  }
});

// POST add a lecture/material to a course curriculum (admin)
router.post('/:id/curriculum/lecture', requireAdmin, async (req, res) => {
  const { sectionTitle, lecture } = req.body || {};
  if (!lecture?.title) return res.status(400).json({ message: 'lecture.title is required' });
  const safeLecture = {
    title: lecture.title,
    duration: lecture.duration || '',
    type: lecture.type || 'video',
    preview: Boolean(lecture.preview),
    url: lecture.url || '',
    filename: lecture.filename || '',
    materials: Array.isArray(lecture.materials) ? lecture.materials : [],
  };

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const sTitle = sectionTitle || (course.curriculum?.[0]?.sectionTitle || 'New Section');
    const existingSection = course.curriculum.find((s) => s.sectionTitle === sTitle);
    if (existingSection) existingSection.lectures.push(safeLecture);
    else course.curriculum.push({ sectionTitle: sTitle, lectures: [safeLecture] });
    course.totalLectures = (course.totalLectures || 0) + 1;
    await course.save();
    return res.json(course);
  } catch {
    const idx = seedCourses.findIndex((c) => c._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Course not found' });
    const course = seedCourses[idx];
    const sTitle = sectionTitle || (course.curriculum?.[0]?.sectionTitle || 'New Section');
    const existingSection = (course.curriculum || []).find((s) => s.sectionTitle === sTitle);
    if (existingSection) existingSection.lectures = [...(existingSection.lectures || []), safeLecture];
    else course.curriculum = [...(course.curriculum || []), { sectionTitle: sTitle, lectures: [safeLecture] }];
    course.totalLectures = (course.totalLectures || 0) + 1;
    course.updatedAt = new Date();
    seedCourses[idx] = course;
    return res.json(course);
  }
});

// POST upload assets (video/material/thumbnail) for a course (admin)
router.post('/:id/assets', requireAdmin, upload.array('files', 10), async (req, res) => {
  const kind = String(req.body?.kind || '').toLowerCase().trim(); // thumbnail | video | material | asset
  const sectionTitle = req.body?.sectionTitle;
  const lectureTitle = req.body?.lectureTitle;
  const lectureType = req.body?.lectureType || (kind === 'material' ? 'document' : 'video');
  const lectureDuration = req.body?.lectureDuration || '';

  const files = (req.files || []).map((f) => ({
    originalname: f.originalname,
    filename: f.filename,
    mimetype: f.mimetype,
    size: f.size,
    url: `/uploads/${f.filename}`,
  }));

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (kind === 'thumbnail' && files[0]) {
      course.thumbnail = files[0].url;
      await course.save();
      return res.json({ course, files });
    }

    if ((kind === 'video' || kind === 'material') && files.length > 0) {
      const lecture = {
        title: lectureTitle || files[0].originalname,
        duration: lectureDuration,
        type: lectureType,
        preview: false,
        url: files[0].url,
        filename: files[0].filename,
        materials: kind === 'material' ? files.map((x) => ({ title: x.originalname, url: x.url, filename: x.filename })) : [],
      };

      const sTitle = sectionTitle || (course.curriculum?.[0]?.sectionTitle || 'New Section');
      const existingSection = course.curriculum.find((s) => s.sectionTitle === sTitle);
      if (existingSection) existingSection.lectures.push(lecture);
      else course.curriculum.push({ sectionTitle: sTitle, lectures: [lecture] });
      course.totalLectures = (course.totalLectures || 0) + 1;
      await course.save();
      return res.json({ course, files });
    }

    return res.json({ course, files });
  } catch {
    const idx = seedCourses.findIndex((c) => c._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Course not found' });
    const course = seedCourses[idx];

    if (kind === 'thumbnail' && files[0]) {
      course.thumbnail = files[0].url;
      course.updatedAt = new Date();
      seedCourses[idx] = course;
      return res.json({ course, files });
    }

    if ((kind === 'video' || kind === 'material') && files.length > 0) {
      const lecture = {
        title: lectureTitle || files[0].originalname,
        duration: lectureDuration,
        type: lectureType,
        preview: false,
        url: files[0].url,
        filename: files[0].filename,
        materials: kind === 'material' ? files.map((x) => ({ title: x.originalname, url: x.url, filename: x.filename })) : [],
      };
      const sTitle = sectionTitle || (course.curriculum?.[0]?.sectionTitle || 'New Section');
      const existingSection = (course.curriculum || []).find((s) => s.sectionTitle === sTitle);
      if (existingSection) existingSection.lectures = [...(existingSection.lectures || []), lecture];
      else course.curriculum = [...(course.curriculum || []), { sectionTitle: sTitle, lectures: [lecture] }];
      course.totalLectures = (course.totalLectures || 0) + 1;
      course.updatedAt = new Date();
      seedCourses[idx] = course;
      return res.json({ course, files });
    }

    return res.json({ course, files });
  }
});

// GET instructor courses
router.get('/instructor/:name', async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.name });
    res.json(courses);
  } catch (err) {
    const courses = seedCourses.filter(c => c.instructor === req.params.name);
    res.json(courses);
  }
});

export default router;
