import cloudinary from './server/config/cloudinary.js';

async function testCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary Connection Successful:', result);
  } catch (error) {
    console.error('❌ Cloudinary Connection Failed:', error.message);
  }
}

testCloudinary();
