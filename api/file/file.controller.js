const formidable = require('formidable')
const { upload } = require('./file.service')

async function uploadFile(req, res) {
  try {
    const form = new formidable.IncomingForm()
    const [fields, files] = await form.parse(req)
    console.log(files.file[0].filepath)
    const url = await upload(files.file[0].filepath)
    res.send(url)
  } catch (err) {
    console.log('Failed to parse file', err)
  }
}

module.exports = {
  uploadFile,
}
