// =============================================================================
// PLACEHOLDER DATA — Replace this file with real API calls when backend is ready
// To integrate backend: import from '../lib/api' and fetch instead of using these
// =============================================================================

// ---------------------------------------------------------------------------
// PLACEHOLDER: Demo users for sign-in simulation
// Replace with: POST /api/auth/login
// ---------------------------------------------------------------------------
export const PLACEHOLDER_USERS = [
  {
    _id: 'user_instructor_1',
    name: 'James Thornton',
    email: 'instructor@edupro.demo',
    password: 'Demo@123',        // PLACEHOLDER: never store passwords in real code
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&q=80',
  },
  {
    _id: 'user_admin_1',
    name: 'James Thornton',
    email: 'admin@edupro.demo',
    password: 'Admin@123',       // PLACEHOLDER
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&q=80',
  },
  {
    _id: 'user_student_1',
    name: 'Sara Kim',
    email: 'student@edupro.demo',
    password: 'Student@123',     // PLACEHOLDER
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=64&q=80',
  },
]

// ---------------------------------------------------------------------------
// PLACEHOLDER: Course catalog
// Replace with: GET /api/courses?page=X&limit=Y&category=Z&q=search
// ---------------------------------------------------------------------------
export const PLACEHOLDER_COURSES = [
  {
    _id: 'course_1',
    title: 'Mastering Minimalist Spatial Design',
    subtitle: 'A comprehensive guide to creating high-end architectural experiences through restraint and precision.',
    category: 'Architecture',
    instructor: 'James Thornton',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&q=80',
    instructorBio: 'James is a principal architect with 18 years of experience across residential and commercial projects in Europe and the US. He has lectured at the AA School and the Royal College of Art.',
    thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80',
    price: 149,
    originalPrice: 199,
    isFree: false,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 2341,
    studentCount: 12840,
    totalLectures: 42,
    totalHours: 18,
    tags: ['Architecture', 'Design', 'Minimalism'],
    whatYouLearn: [
      'Apply the principles of negative space to real floor plans',
      'Select materials that communicate restraint and quality',
      'Document and present your work to high-end clients',
      'Translate abstract concepts into buildable spatial ideas',
      'Critique existing spaces using a structured framework',
      'Use light and proportion as primary design tools',
    ],
    requirements: [
      'Basic understanding of architectural drawing',
      'Access to AutoCAD, Revit, or SketchUp (any version)',
      'No prior minimalism experience needed',
    ],
    description: 'This course distills 18 years of high-end spatial design practice into a structured, project-based curriculum. You will learn how the world\'s most celebrated interiors achieve their power not through abundance, but through intelligent restraint. Each module builds on the last, from philosophy to material selection, to client presentation.',
    curriculum: [
      {
        sectionTitle: 'Module 1 — The Philosophy of Less',
        lectures: [
          { title: 'Introduction: Why Less Works', duration: '8:20', type: 'video', preview: true },
          { title: 'The Philosophy of Restraint', duration: '12:40', type: 'video', preview: false },
          { title: 'Case Study: The Barcelona Pavilion', duration: '', type: 'document', preview: false },
        ],
      },
      {
        sectionTitle: 'Module 2 — Material & Texture',
        lectures: [
          { title: 'Material Selection Principles', duration: '18:15', type: 'video', preview: false },
          { title: 'Working with Natural Light', duration: '14:00', type: 'video', preview: false },
          { title: 'Texture Mood Board Exercise', duration: '', type: 'document', preview: false },
        ],
      },
      {
        sectionTitle: 'Module 3 — Space & Scale',
        lectures: [
          { title: 'Proportional Systems Explained', duration: '22:10', type: 'video', preview: false },
          { title: 'Ceiling Heights & Volume', duration: '16:45', type: 'video', preview: false },
        ],
      },
    ],
    reviews: [
      { user: 'Sara K.', rating: 5, comment: 'Completely changed how I approach client projects. The material module alone was worth it.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=64&q=80' },
      { user: 'Anya M.', rating: 5, comment: 'Finished in a week. Got two new clients the following month. Incredible quality.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&q=80' },
      { user: 'Tom R.', rating: 4, comment: 'Dense but rewarding. Would have liked more downloadable resources.', avatar: null },
    ],
    status: 'published',
  },
  {
    _id: 'course_2',
    title: 'Editorial Photography for Architects',
    subtitle: 'Document your built work like a magazine. Learn the complete editorial photography workflow.',
    category: 'Photography',
    instructor: 'Mara Voss',
    instructorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&q=80',
    instructorBio: 'Mara Voss is an architectural photographer based in Berlin whose work has appeared in Wallpaper*, Dezeen, and Frame Magazine. She teaches photography workshops across Europe.',
    thumbnail: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=80',
    price: 89,
    originalPrice: 129,
    isFree: false,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewCount: 874,
    studentCount: 4210,
    totalLectures: 28,
    totalHours: 10,
    tags: ['Photography', 'Architecture', 'Editorial'],
    whatYouLearn: [
      'Set up and shoot interiors with natural and artificial light',
      'Select the right lens and camera settings for architecture',
      'Edit photos in Lightroom for an editorial aesthetic',
      'Build a portfolio that attracts publications',
    ],
    requirements: [
      'A DSLR or mirrorless camera',
      'Basic familiarity with your camera settings',
    ],
    description: 'From golden-hour exteriors to intimate interior vignettes, this course covers the complete editorial photography workflow for architects and designers who want their work seen.',
    curriculum: [
      {
        sectionTitle: 'Module 1 — Equipment & Setup',
        lectures: [
          { title: 'Gear for Architecture Photography', duration: '10:00', type: 'video', preview: true },
          { title: 'Tripod, Remote & Filters', duration: '8:30', type: 'video', preview: false },
        ],
      },
      {
        sectionTitle: 'Module 2 — Light',
        lectures: [
          { title: 'Golden Hour & Blue Hour', duration: '14:20', type: 'video', preview: false },
          { title: 'Managing Mixed Lighting Indoors', duration: '18:00', type: 'video', preview: false },
        ],
      },
    ],
    reviews: [
      { user: 'Anya M.', rating: 5, comment: 'The lighting techniques alone made this worth 10x the price.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&q=80' },
    ],
    status: 'published',
  },
  {
    _id: 'course_3',
    title: 'Brand Identity Design: From Strategy to System',
    subtitle: 'Build complete brand identities. Research, strategy, visual language, and delivery to clients.',
    category: 'Graphic Design',
    instructor: 'Leo Park',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&q=80',
    instructorBio: 'Leo Park is the creative director at Park Studio in Seoul, working with global consumer brands and cultural institutions.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    price: 0,
    originalPrice: null,
    isFree: true,
    isBestseller: false,
    isNew: false,
    rating: 4.7,
    reviewCount: 1203,
    studentCount: 22400,
    totalLectures: 35,
    totalHours: 14,
    tags: ['Branding', 'Design', 'Identity'],
    whatYouLearn: [
      'Conduct brand research and competitor analysis',
      'Develop a visual language from scratch',
      'Create logomarks, wordmarks, and brand systems',
      'Deliver brand guidelines to clients professionally',
    ],
    requirements: ['Access to Adobe Illustrator or Figma'],
    description: 'A free, comprehensive course on brand identity design. Covers the full workflow from initial client brief to final deliverable package.',
    curriculum: [
      {
        sectionTitle: 'Module 1 — Brand Strategy',
        lectures: [
          { title: 'What Is a Brand?', duration: '9:00', type: 'video', preview: true },
          { title: 'Positioning & Audience Research', duration: '15:00', type: 'video', preview: false },
        ],
      },
    ],
    reviews: [
      { user: 'Anya M.', rating: 5, comment: 'Finished the Brand Identity course in a week. Got two new clients the following month.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&q=80' },
    ],
    status: 'published',
  },
  {
    _id: 'course_4',
    title: 'Full-Stack Web Development Bootcamp',
    subtitle: 'Go from zero to a full-stack developer with React, Node.js, MongoDB, and modern tooling.',
    category: 'Development',
    instructor: 'Nina Rask',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&q=80',
    instructorBio: 'Nina Rask is a senior engineer and educator based in Stockholm. Former engineering lead at Spotify.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80',
    price: 199,
    originalPrice: 299,
    isFree: false,
    isBestseller: true,
    isNew: false,
    rating: 4.8,
    reviewCount: 5102,
    studentCount: 38900,
    totalLectures: 120,
    totalHours: 52,
    tags: ['Development', 'React', 'Node.js'],
    whatYouLearn: [
      'Build full-stack apps with React and Node.js',
      'Design and query MongoDB databases',
      'Implement authentication with JWT and sessions',
      'Deploy to production with Vercel and Railway',
    ],
    requirements: ['Basic HTML/CSS knowledge', 'A computer with internet access'],
    description: 'The most complete full-stack web development course available. Over 52 hours of content covering the MERN stack from fundamentals to deployment.',
    curriculum: [
      {
        sectionTitle: 'Module 1 — HTML & CSS Foundations',
        lectures: [
          { title: 'How the Web Works', duration: '11:00', type: 'video', preview: true },
          { title: 'HTML Structure & Semantics', duration: '18:00', type: 'video', preview: false },
        ],
      },
    ],
    reviews: [],
    status: 'published',
  },
  {
    _id: 'course_5',
    title: 'UX Research for Product Designers',
    subtitle: 'Learn the methods top product teams use to discover user needs and validate design decisions.',
    category: 'UX Research',
    instructor: 'Clara Meier',
    instructorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&q=80',
    instructorBio: 'Clara Meier is a UX research lead at a Fortune 500 tech company with over a decade of experience running user studies across mobile and web products.',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&q=80',
    price: 79,
    originalPrice: null,
    isFree: false,
    isBestseller: false,
    isNew: true,
    rating: 4.6,
    reviewCount: 312,
    studentCount: 1820,
    totalLectures: 22,
    totalHours: 8,
    tags: ['UX', 'Research', 'Design'],
    whatYouLearn: [
      'Plan and run user interviews',
      'Synthesize qualitative data into actionable insights',
      'Create usability tests and analyze results',
      'Present research findings to stakeholders',
    ],
    requirements: ['No prior research experience needed'],
    description: 'A practical course on UX research methods for product designers, PMs, and anyone who wants to build better products by understanding users deeply.',
    curriculum: [
      {
        sectionTitle: 'Module 1 — Research Foundations',
        lectures: [
          { title: 'Why Research Matters', duration: '7:00', type: 'video', preview: true },
          { title: 'Choosing the Right Method', duration: '12:00', type: 'video', preview: false },
        ],
      },
    ],
    reviews: [],
    status: 'published',
  },
  {
    _id: 'course_6',
    title: 'Music Production with Ableton Live',
    subtitle: 'Create, mix, and master electronic music from scratch using Ableton Live 11.',
    category: 'Music',
    instructor: 'DJ Kael',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&q=80',
    instructorBio: 'DJ Kael is a Berlin-based electronic music producer with releases on Ninja Tune and Warp Records.',
    thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80',
    price: 59,
    originalPrice: null,
    isFree: false,
    isBestseller: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 654,
    studentCount: 5100,
    totalLectures: 48,
    totalHours: 20,
    tags: ['Music', 'Ableton', 'Production'],
    whatYouLearn: [
      'Navigate Ableton Live 11 confidently',
      'Design original sounds with synthesis',
      'Structure full tracks from intro to outro',
      'Mix and master for streaming platforms',
    ],
    requirements: ['Ableton Live 11 (Lite version is fine)', 'Headphones or studio monitors'],
    description: 'Everything you need to produce professional-sounding electronic music, taught by a producer with a decade of releases on major labels.',
    curriculum: [
      {
        sectionTitle: 'Module 1 — Ableton Basics',
        lectures: [
          { title: 'Tour of the Interface', duration: '10:00', type: 'video', preview: true },
          { title: 'Session vs Arrangement View', duration: '14:00', type: 'video', preview: false },
        ],
      },
    ],
    reviews: [],
    status: 'published',
  },
  {
    _id: 'course_7',
    title: 'Startup Business Strategy',
    subtitle: 'Build a resilient business strategy for your startup. From market analysis to fundraising.',
    category: 'Business',
    instructor: 'Helen Marsh',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&q=80',
    instructorBio: 'Helen Marsh is a former McKinsey partner and startup advisor who has helped over 40 companies raise Series A and B rounds.',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    price: 249,
    originalPrice: 349,
    isFree: false,
    isBestseller: true,
    isNew: false,
    rating: 4.9,
    reviewCount: 887,
    studentCount: 6700,
    totalLectures: 60,
    totalHours: 24,
    tags: ['Business', 'Strategy', 'Startup'],
    whatYouLearn: [
      'Conduct market sizing and TAM/SAM/SOM analysis',
      'Build a compelling investor pitch deck',
      'Define your business model and unit economics',
      'Develop a go-to-market playbook',
    ],
    requirements: ['A business idea or early-stage startup'],
    description: 'From idea to Series A, this course gives you the strategic frameworks used by top consulting firms and venture-backed startups.',
    curriculum: [
      {
        sectionTitle: 'Module 1 — Market & Opportunity',
        lectures: [
          { title: 'Market Sizing 101', duration: '13:00', type: 'video', preview: true },
          { title: 'Competitor Mapping', duration: '11:00', type: 'video', preview: false },
        ],
      },
    ],
    reviews: [],
    status: 'published',
  },
  {
    _id: 'course_8',
    title: '3D Visualization for Interior Design',
    subtitle: 'Create stunning 3D renders for your design portfolio using Blender and V-Ray.',
    category: 'Architecture',
    instructor: 'Max Solaris',
    instructorAvatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=64&q=80',
    instructorBio: 'Max Solaris is a 3D visualization artist based in Barcelona whose renders have been featured in leading architecture publications.',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    price: 119,
    originalPrice: 159,
    isFree: false,
    isBestseller: false,
    isNew: false,
    rating: 4.7,
    reviewCount: 432,
    studentCount: 3200,
    totalLectures: 55,
    totalHours: 22,
    tags: ['3D Design', 'Architecture', 'Blender'],
    whatYouLearn: [
      'Model architectural spaces in Blender',
      'Set up physically accurate lighting rigs',
      'Apply materials and textures for realism',
      'Render and post-process in Photoshop',
    ],
    requirements: ['Blender (free download)', 'Basic knowledge of 3D concepts helpful but not required'],
    description: 'The complete workflow for creating photorealistic architectural visualizations that win clients and commissions.',
    curriculum: [
      {
        sectionTitle: 'Module 1 — Blender Fundamentals',
        lectures: [
          { title: 'Installing & Navigating Blender', duration: '12:00', type: 'video', preview: true },
          { title: 'Modeling a Room from Scratch', duration: '28:00', type: 'video', preview: false },
        ],
      },
    ],
    reviews: [],
    status: 'published',
  },
  {
    _id: 'course_9',
    title: 'Typography Masterclass',
    subtitle: 'Master the art and science of type. From choosing fonts to building complete typographic systems.',
    category: 'Graphic Design',
    instructor: 'Rin Matsuda',
    instructorAvatar: 'https://images.unsplash.com/photo-1484863137850-59afcfe05386?w=64&q=80',
    instructorBio: 'Rin Matsuda is a type designer and educator based in Tokyo, with a background at Monotype and Google Fonts.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    price: 69,
    originalPrice: null,
    isFree: false,
    isBestseller: false,
    isNew: true,
    rating: 4.8,
    reviewCount: 228,
    studentCount: 1540,
    totalLectures: 30,
    totalHours: 12,
    tags: ['Graphic Design', 'Typography', 'Fonts'],
    whatYouLearn: [
      'Understand type anatomy and classification',
      'Pair fonts effectively for any medium',
      'Build typographic scale and hierarchy',
      'Design custom lettering from scratch',
    ],
    requirements: ['Adobe Illustrator or Affinity Designer'],
    description: 'The most thorough typography course for designers. Covers history, anatomy, pairing, hierarchy, and custom lettering.',
    curriculum: [
      {
        sectionTitle: 'Module 1 — Type Anatomy',
        lectures: [
          { title: 'Parts of a Letter', duration: '9:00', type: 'video', preview: true },
          { title: 'Type Classification', duration: '11:00', type: 'video', preview: false },
        ],
      },
    ],
    reviews: [],
    status: 'published',
  },
]

// ---------------------------------------------------------------------------
// PLACEHOLDER: Instructor dashboard stats
// Replace with: GET /api/users/dashboard/stats
// ---------------------------------------------------------------------------
export const PLACEHOLDER_DASHBOARD_STATS = {
  // totalRevenue removed — not displayed
  totalStudents: 12840,     // PLACEHOLDER
  avgRating: 4.9,           // PLACEHOLDER
  totalReviews: 2341,       // PLACEHOLDER
  activeCourses: 3,         // PLACEHOLDER
}

// ---------------------------------------------------------------------------
// PLACEHOLDER: Monthly revenue chart data
// Replace with: GET /api/users/dashboard/monthly-revenue
// ---------------------------------------------------------------------------
export const PLACEHOLDER_MONTHLY = [
  { m: 'Jan', v: 48 },  // PLACEHOLDER
  { m: 'Feb', v: 66 },
  { m: 'Mar', v: 56 },
  { m: 'Apr', v: 86 },
  { m: 'May', v: 100 },
  { m: 'Jun', v: 72 },
  { m: 'Jul', v: 40 },
  { m: 'Aug', v: 30 },
]

// ---------------------------------------------------------------------------
// PLACEHOLDER: Instructor's own courses for the dashboard table
// Replace with: GET /api/users/me/courses
// ---------------------------------------------------------------------------
export const PLACEHOLDER_MY_COURSES = [
  { _id: 'course_1', title: 'Mastering Minimalist Spatial Design', category: 'Architecture', studentCount: 12840, rating: 4.9, status: 'published', thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=96&q=80' },
  { _id: 'course_2', title: 'Editorial Photography for Architects', category: 'Photography', studentCount: 4210, rating: 4.8, status: 'published', thumbnail: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=96&q=80' },
  { _id: 'course_new', title: 'Running a Creative Studio Business', category: 'Business', studentCount: 0, rating: null, status: 'review', thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=96&q=80' },
]

// ---------------------------------------------------------------------------
// PLACEHOLDER: Recent reviews on the dashboard
// Replace with: GET /api/users/me/reviews
// ---------------------------------------------------------------------------
export const PLACEHOLDER_RECENT_REVIEWS = [
  { user: 'Sara K.', course: 'Mastering Minimalist Spatial Design', rating: 5, comment: 'Absolutely transformative. Changed how I approach every project.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=64&q=80' },
  { user: 'Anya M.', course: 'Editorial Photography for Architects', rating: 5, comment: 'The lighting techniques alone made this worth 10x the price.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&q=80' },
]

// ---------------------------------------------------------------------------
// PLACEHOLDER: Admin dashboard stats
// Replace with: GET /api/admin/stats
// ---------------------------------------------------------------------------
export const PLACEHOLDER_ADMIN_STATS = {
  totalUsers: 12402,          // PLACEHOLDER
  totalCourses: 1204,         // PLACEHOLDER
  moderationQueue: 17,        // PLACEHOLDER
  // revenue removed — not shown in UI
}
