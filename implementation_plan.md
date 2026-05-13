# Implement MERN Backend Features

This plan outlines the steps to implement the requested backend features using Node.js, Express, and MongoDB.

## Proposed Changes

### Dependencies
We will install the following missing packages:
- `cloudinary`
- `streamifier`
- `express-session`
- `connect-mongo`

### MongoDB Connection (`server/config/db.js`)
- [NEW] `server/config/db.js`
  - Setup Mongoose connection with clear success/failure logging.

### Cloudinary Config (`server/config/cloudinary.js`)
- [NEW] `server/config/cloudinary.js`
  - Configure `cloudinary` v2.
  - Create the `uploadFromBuffer` utility function for video, image, and raw types using `cloudinary.uploader.upload_stream` and `streamifier`.

### Mongoose Models
- [NEW] `server/models/Admin.js`
  - Define the Admin schema.
- [NEW] `server/models/Student.js`
  - Define the Student schema, including `lastViewedCourse` and `progress`.
- [NEW] `server/models/Course.js`
  - Define the Course schema, storing `secure_url` and `public_id` for thumbnail, video, and pdf.
  - Add indexes on `title` and `category`.

### Course Controller (`server/controllers/courseController.js`)
- [NEW] `server/controllers/courseController.js`
  - Write `uploadCourse` logic utilizing multer in memory storage and the Cloudinary stream upload.
  - Write student dashboard logic using `.find().lean()` for fast performance.

### Server & Routes (`server/server.js` and `server/routes/admin.js`)
- [MODIFY] `server/server.js`
  - Integrate `config/db.js`.
  - Configure `express-session` with `connect-mongo` to store cookies in MongoDB.
  - Setup a global error handler.
- [NEW] `server/routes/admin.js`
  - Setup `multer` with `memoryStorage`.
  - Wire up the `POST /api/admin/upload-course` route using `multer.fields()`.

## User Review Required
Please review the plan. Let me know if you would like me to proceed with these changes!
