const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const chatService = require('./chat.service')

async function getChats(req, res) {
  try {
    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    const chats = await chatService.query(loggedInUser.chats)
    res.send(chats)
  } catch (err) {
    logger.error('Cannot get chats', err)
    res.status(500).send({ err: 'Failed to get chats' })
  }
}

async function addMsg(req, res) {
  try {
    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    const msg = req.body
    msg.sentBy = loggedInUser._id
    msg.timestamp = Date.now()
    await chatService.addMsg(msg)
    res.send(msg)
  } catch (err) {
    logger.error(500).send({ err: 'Failed to add message' })
  }
}

async function updateChat(req, res) {
  try {
    const updatedChat = await chatService.update(req.body)
    res.send(updatedChat)
  } catch (err) {
    logger.error(500).send({ err: 'Failed to update chat' })
  }
}

async function deleteChat(req, res) {
  try {
    const deletedCount = await chatService.remove(req.params.id)
    if (deletedCount === 1) {
      res.send({ msg: 'Deleted successfully' })
    } else {
      res.status(400).send({ err: 'Cannot remove chat' })
    }
  } catch (err) {
    logger.error('Failed to delete chat', err)
    res.status(500).send({ err: 'Failed to delete chat' })
  }
}

async function addChat(req, res) {
  try {
    let loggedInUser = authService.validateToken(req.cookies.loginToken)
    const { username } = req.body
    const contact = await userService.getByUsername(username)
    if (!contact) return res.status(401).send({ err: 'User does not exist' })
    const isChatExist = await chatService.isChatExist(loggedInUser.chats, contact._id)
    if (isChatExist) return res.status(401).send({ err: 'Chat already exist' })
    const chat = await chatService.add([loggedInUser._id, contact._id.toString()])
    loggedInUser.chats.push(chat._id.toString())
    contact.chats.push(chat._id.toString())
    await userService.update(loggedInUser)
    await userService.update(contact)
    // User info is saved also in the login-token, update it
    const loginToken = authService.getLoginToken(loggedInUser)
    res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })

    // socketService.broadcast({
    //   type: 'chat-added',
    //   data: chat,
    //   userId: loggedInUser._id.toString(),
    // })
    // socketService.emitToUser({
    //   type: 'chat-about-you',
    //   data: chat,
    //   userId: chat.aboutUserId,
    // })

    // const fullUser = await userService.getById(loggedInUser._id)
    // socketService.emitTo({
    //   type: 'user-updated',
    //   data: fullUser,
    //   label: fullUser._id,
    // })

    res.send(chat)
  } catch (err) {
    logger.error('Failed to add chat', err)
    res.status(500).send({ err: 'Failed to add chat' })
  }
}

module.exports = {
  getChats,
  deleteChat,
  addChat,
  updateChat,
  addMsg,
}
