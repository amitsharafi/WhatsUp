const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const userService = require('../user/user.service')

async function query(chatsIds) {
  try {
    chatsIds = chatsIds.map((chatId) => new ObjectId(chatId))
    // const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('chat')
    let chats = await collection.find({ _id: { $in: chatsIds } }).toArray()
    chats = await userService.getMiniUsers(chats)
    return chats
  } catch (err) {
    logger.error('cannot find chats', err)
    throw err
  }
}

async function update(chat) {
  const collection = await dbService.getCollection('chat')
  chat.participants = chat.participants.map(
    (participant) => (participant = participant._id)
  )
  await collection.updateOne({ _id: chat._id }, { $set: { ...chat } })
}

async function addMsg(msg) {
  try {
    const collection = await dbService.getCollection('chat')
    await collection.updateOne(
      { _id: new ObjectId(msg.chatId) },
      { $push: { messages: msg } }
    )
  } catch (err) {
    logger.error(`cannot add message to chat ${msg.chatId}`)
  }
}

async function remove(chatId) {
  try {
    const store = asyncLocalStorage.getStore()
    const { loggedinUser } = store
    const collection = await dbService.getCollection('chat')
    // remove only if user is owner/admin
    const criteria = { _id: ObjectId(chatId) }
    if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove chat ${chatId}`, err)
    throw err
  }
}

async function isChatExist(chatsIds, contactId) {
  try {
    chatsIds = chatsIds.map((chatId) => new ObjectId(chatId))
    const collection = await dbService.getCollection('chat')
    const chats = await collection.find({ _id: { $in: chatsIds } }).toArray()
    const chat = chats.find((chat) =>
      chat.participants.includes(contactId.toString())
    )
    if (chat) return true
  } catch (err) {
    logger.error('cannot find chats', err)
  }
}

async function add(participants) {
  try {
    const chatToAdd = {
      isGroup: false,
      participants,
      createdAt: Date.now(),
      messages: [],
    }
    const collection = await dbService.getCollection('chat')
    const { insertedId } = await collection.insertOne(chatToAdd)
    chatToAdd._id = insertedId
    return chatToAdd
  } catch (err) {
    logger.error('cannot insert chat', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.loggedInUserId) criteria.loggedInUserId = filterBy.loggedInUserId
  return criteria
}

module.exports = {
  query,
  remove,
  add,
  update,
  addMsg,
  isChatExist,
}
