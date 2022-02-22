const bcrypt = require('bcrypt');
const {loginAuth} = require('./loginAuth')
const {capitalize} = require('./other')
const {verifyToken, verifyUser, updateCookie} = require('./verification')



module.exports = {
  capitalize,
  verifyToken, 
  loginAuth, 
  updateCookie, 
  verifyUser
}