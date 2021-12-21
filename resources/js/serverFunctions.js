const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const {client} = require('./postgres')
const cookie = require('cookie-parser')

//verify user
async function verifyToken(req, res, next){
    if(!req.cookies.token) return res.redirect('/admin/login');
    const token = req.cookies.token
    const dbToken = await client.query(`
      SELECT token FROM users
      WHERE token = $1
    `, [token])
    if(!dbToken || dbToken.length === 0) return res.redirect('/admin/login')
    return next()
  
  }
  
  //create user
  async function encryptPassword(password){
    return await bcrypt.hash(password, 8)
  }
  //auth user
  async function checkEncryption(users, plain){
    return users.filter(e => bcrypt.compareSync(plain, e.password.trim()))[0]
  }
  async function getUser(name){
    const result = await client.query(`
      SELECT name, password, id FROM users
      WHERE name = $1
    `, [name])
    .then(r => {
      return r.rows
    })
    return result
  }
  async function setToken(user){
    date = new Date
    let token = jwt.sign({user:user.id, time:date.getTime()}, process.env.JWTKEY)
    await client.query(`
      UPDATE users 
      SET token = $1
      WHERE id = $2
    `,[token, user.id])
    return token
  }
  
  async function loginAuth(req, res, next){
    const users = await getUser(req.body.username)
    const user = await checkEncryption(users, req.body.password)
    if(user == undefined){
      console.log('Login Failed');
      res.sendFile('login.html', {root:'./views/'})
    }
    else{
      const cookie = await setToken(user)
      let name = user.name[0].toUpperCase() + user.name.substr(1).trim() //Title word
      console.log(`${name} just logged in`);
      res.cookie('token', cookie, {maxAge: 30000}).redirect('/admin')
    }
  }

module.exports = {verifyToken, getUser, setToken, loginAuth}