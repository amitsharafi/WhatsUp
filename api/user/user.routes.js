const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getUser, getUsers, getUsersImgs, deleteUser, updateUser, updateCookie } = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers)
router.get('/imgs', getUsersImgs)
router.get('/:id', getUser)
router.put('/', requireAuth, updateUser)
router.put('/cookie', requireAuth, updateCookie)
// router.put('/:id',  requireAuth, updateUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)

module.exports = router
