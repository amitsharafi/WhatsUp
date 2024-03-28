const userService = require('./user.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')
const authService = require('../auth/auth.service')

async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.id)
    res.send(user)
  } catch (err) {
    logger.error('Failed to get user', err)
    res.status(500).send({ err: 'Failed to get user' })
  }
}

async function getUsersImgs(req, res) {
  try {
    const usersImgs = await userService.getProfileImgs(req.query)
    res.send(await Promise.all(usersImgs))
  } catch (err) {
    logger.error('Failed to get usersImgs', err)
    res.status(500).send({ err: 'Failed to get userImgs' })
  }
}

async function getUsers(req, res) {
  try {
    const filterBy = {
      txt: req.query?.txt || '',
      minBalance: +req.query?.minBalance || 0,
    }
    const users = await userService.query(filterBy)
    res.send(users)
  } catch (err) {
    logger.error('Failed to get users', err)
    res.status(500).send({ err: 'Failed to get users' })
  }
}

async function deleteUser(req, res) {
  try {
    await userService.remove(req.params.id)
    res.send({ msg: 'Deleted successfully' })
  } catch (err) {
    logger.error('Failed to delete user', err)
    res.status(500).send({ err: 'Failed to delete user' })
  }
}

async function updateUser(req, res) {
  try {
    const user = req.body
    const updatedUser = await userService.update(user)
    const loginToken = authService.getLoginToken(updatedUser)
    res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
    res.send(updatedUser)
  } catch (err) {
    logger.error('Failed to update user', err)
    res.status(500).send({ err: 'Failed to update user' })
  }
}

module.exports = {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  getUsersImgs,
}
