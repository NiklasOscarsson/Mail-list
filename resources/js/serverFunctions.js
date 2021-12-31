const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const {client} = require('./postgres')
const cookie = require('cookie-parser')

//verify user
async function verifyToken(req, res, next){
    if(!req.cookies.token) return res.redirect('/admin/login');
    const token = jwt.verify(req.cookies.token, process.env.JWTKEY)
    const dbToken = await client.query(`
      SELECT email, id FROM users
      WHERE email = $1
    `, [token])
    if(!dbToken || dbToken.length === 0) return res.redirect('/admin/login')
    return next()
  }
  function updateCookie(req, res, next){
    res.cookie('token', req.cookies.token, {maxAge: 60000*5, httpOnly: true, sameSite:true})
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
  async function getUser(email){
    const result = await client.query(`
      SELECT firstName, email, password, id FROM users
      WHERE email = $1
    `, [email])
    .then(r => {
      return r.rows
    })
    return result
  }
  async function setToken(user){
    date = new Date
    let token = jwt.sign({user:user.id, email:user.email, time:date.getTime()}, process.env.JWTKEY)
    return token
  }
  
  async function loginAuth(req, res, next){
    const users = await getUser(req.body.username)
    const user = await checkEncryption(users, req.body.password)
    if(user == undefined){
      console.log(`Login failed for ${capitalize(req.body.username)}`);
      res.sendFile('login.html', {root:'./views/'})
    }
    else{
      const cookie = await setToken(user)
      let name = capitalize(user.firstname) //Title word
      console.log(`${name} just logged in`);
      res.cookie('token', cookie, {maxAge: 1000*60*5, httpOnly: true}).redirect('/admin')
    }
  }

  function capitalize(word){
    return word[0].toUpperCase() + word.substr(1).trim()
  }

module.exports = {verifyToken, getUser, setToken, loginAuth, updateCookie}