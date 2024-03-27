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
    console.log('Cannot upload cloudinary file: ', err)
  }
}

async function destroy(publicId) {
  try {
    cloudinary.uploader.destroy(publicId)
  } catch (err) {
    console.log('Cannot delete cloudinary file: ', err)
  }
}

module.exports = {
  upload,
  destroy,
}
