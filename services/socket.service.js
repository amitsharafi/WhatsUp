const logger = require('./logger.service')

var gIo = null
const USER_LOGIN = 'user-login'
const CLIENT_EMIT_MSG = 'send-msg'
const CLIENT_EMIT_CHAT = 'send-chat'
const SERVER_EMIT_MSG = 'add-msg'
const SERVER_EMIT_CHAT = 'add-chat'
const TYPING = 'typing'

function setupSocketAPI(http) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  })
  gIo.on('connection', (socket) => {
    logger.info(`New connected socket [id: ${socket.id}]`)
    socket.on('disconnect', (socket) => {
      logger.info(`Socket disconnected [id: ${socket.id}]`)
    })
    socket.on(USER_LOGIN, ({ _id, chats }) => {
      logger.info(`new user logged in: ${_id}`)
      socket.userId = _id
      chats.forEach((chat) => {
        socket.join(chat._id || chat)
      })
      // console.log(gIo.sockets.adapter.rooms)
    })
    socket.on(TYPING, ({ chatId, userId }) => {
      socket.to(chatId).emit(TYPING, chatId)
    })
    socket.on(CLIENT_EMIT_MSG, ({ chatId, addedMsg }) => {
      socket.to(chatId).emit(SERVER_EMIT_MSG, addedMsg)
    })
    socket.on(CLIENT_EMIT_CHAT, ({ chat, userId }) => {
      socket.to(chat._id).emit(SERVER_EMIT_CHAT, chat)
    })
  })
}

async function _getUserSocket(userId) {
  const sockets = await _getAllSockets()
  const socket = sockets.find((s) => s.userId === userId)
  return socket
}
async function _getAllSockets() {
  // return all Socket instances
  const sockets = await gIo.fetchSockets()
  return sockets
}

async function createChatRoom({ usersIds, chatId }) {
  for (const userId of usersIds) {
    const socket = await _getUserSocket(userId)
    if (socket) socket.join(chatId)
  }
}

module.exports = {
  // set up the sockets service and define the API
  setupSocketAPI,
  createChatRoom,
}
