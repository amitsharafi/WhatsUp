const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function upload(filepath) {
  try {
    const res = await cloudinary.uploader.upload(filepath)
    return res.secure_url
  } catch (err) {
    console.log('Failed upload to cloudinary', err)
  }
}

module.exports = {
  upload,
}
