const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const {client} = require('./postgres')
const cookie = require('cookie-parser')

//verify user
async function verifyToken(req, res, next){
    if(!req.cookies.token) return res.redirect('/profile/login');
    const token = jwt.verify(req.cookies.token, process.env.JWTKEY)
    const dbToken = await client.query(`
      SELECT email, id FROM users
      WHERE email = $1
    `, [token])
    if(!dbToken || dbToken.length === 0) return res.redirect('/profile/login')
    return next()
}
function updateCookie(req, res, next){
  res.cookie('token', req.cookies.token, {maxAge: 60000*10, httpOnly: false, sameSite:true})
  return next()
}

//verify admin
async function verifyAdmin(req, res, next){
  if(!req.cookies.token) return next()
  const token = jwt.verify(req.cookies.token, process.env.JWTKEY);
  await client.query(`
    SELECT roles.role FROM users
    JOIN roles ON users.roleid = roles.id
    WHERE users.email = $1 AND users.id = $2
  `, [token.email, token.user])
  .then(r => res.json(r.rows[0].role.trim()))
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
    res.cookie('token', cookie, {maxAge: 1000*60*10, httpOnly: false}).redirect('/profile')
  }
}

//other
function capitalize(word){
  return word[0].toUpperCase() + word.substr(1).trim()
}

module.exports = {
  verifyToken, 
  loginAuth, 
  updateCookie, 
  verifyAdmin
}