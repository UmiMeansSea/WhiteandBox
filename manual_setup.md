# Manual Setup & Connection Verification Guide

To get your modern MERN backend up and running, follow these steps to configure your environment and verify that everything is working correctly.

## 1. Manual Setup (Environment Variables)

You need to update your `server/.env` file with your specific credentials. Since your server now uses Cloudinary for streaming and `express-session` for persistence, these variables are required.

### Update `server/.env`
Open your `server/.env` file and add/update the following:

```env
# Database
MONGO_URI=mongodb://localhost:27017/edupro

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your_random_long_secret_string_here

# Cloudinary Credentials (Get these from your Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### How to get Cloudinary Keys:
1. Log in to [Cloudinary](https://cloudinary.com/).
2. Go to your **Dashboard**.
3. You will see **Cloud Name**, **API Key**, and **API Secret** right at the top. Copy and paste them into your `.env` file.

---

## 2. How to Check if the Connection Works

Once your `.env` is set up, follow these steps to verify the system.

### Step A: Start the Server
Open a terminal in the `server` directory and run:
```bash
npm start
```

### Step B: Check for Success Logs
Look at the terminal output. You should see these messages:
- `✅ MongoDB Connected: [your_host]` (Confirms DB is connected and `express-session` store is ready).
- `🚀 Server running on http://localhost:5000` (Confirms Express is active).

### Step C: Test the Health Endpoint
Open your browser or use a tool like Postman/Thunder Client and visit:
`http://localhost:5000/api/health`
**Expected Response:**
```json
{ "status": "ok", "message": "EduPro API is running" }
```

### Step D: Test the Fast-Show Course Endpoint
Visit: `http://localhost:5000/api/courses`
**Expected Response:**
```json
{ "success": true, "count": 0, "courses": [] }
```
*(If you see an empty array, it means the connection to MongoDB is successful and the `getCourses` logic is working with `.lean()`!)*

### Step E: Test Cloudinary (Admin Upload)
If you have Postman, you can test the streaming upload:
1. Set method to `POST`.
2. URL: `http://localhost:5000/api/admin/upload-course`.
3. Body: `form-data`.
4. Keys: `title`, `category`, `description`, `thumbnail` (file), `video` (file), `pdf` (file).
5. Send and check if you get a `201 Created` response with the Cloudinary URLs.

> [!IMPORTANT]
> If you get a **Cloudinary Error**, double-check your `API_SECRET` and `CLOUD_NAME` in the `.env` file. The server will not crash, but the upload will fail and return a clear error message.
