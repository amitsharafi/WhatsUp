const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { uploadFile } = require('./file.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.post('/', requireAuth, uploadFile)

module.exports = router
