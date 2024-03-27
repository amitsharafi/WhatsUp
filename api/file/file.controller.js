const formidable = require('formidable')
const { upload, destroy } = require('./file.service')

async function uploadFile(req, res) {
  try {
    const form = new formidable.IncomingForm()
    const [fields, files] = await form.parse(req)
    console.log(files.file[0].filepath)
    const url = await upload(files.file[0].filepath)
    res.send(url)
  } catch (err) {
    console.log('Failed to upload file: ', err)
  }
}
async function deleteFile(req, res) {
  try {
    const publicId = req.body.url.split('/').pop().split('.')[0]
    destroy(publicId)
  } catch (err) {
    console.log('Failed to delete file: ', err)
  }
}

module.exports = {
  uploadFile,
  deleteFile,
}
