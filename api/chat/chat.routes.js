const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addMsg, addChat, getChats, deleteChat, updateChat } = require('./chat.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getChats)
router.post('/', log, requireAuth, addChat)
router.put('/', log, updateChat)
router.put('/msg', requireAuth, addMsg)
router.delete('/:id', requireAuth, deleteChat)

module.exports = router
