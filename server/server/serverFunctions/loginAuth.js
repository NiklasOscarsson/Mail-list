const {capitalize} = require('./other')
const {getUser} = require('../db/init')
const JWT = require('jsonwebtoken')


//Login auth 
async function loginAuth(req, res, next) {
    const user = await getUser(req.body.username.toLowerCase(), req.body.password.toLowerCase())
    if (user == undefined) {
        console.log(`Login failed for ${capitalize(req.body.username)}`);
        res.status(511).sendFile('login.html', { root: './views/' })
    }
    else {
        const cookie = await setToken(user)
        let name = capitalize(user.firstname) //Title word
        console.log(`${name} just logged in`);
        res.cookie('token', cookie, { maxAge: 1000 * 60 * 10, httpOnly: false }).redirect('/profile')
    }
}

// Set token
async function setToken(user) {
    date = new Date
    let token = JWT.sign({ user: user.id, email: user.email, time: date.getTime() }, process.env.JWTKEY)
    return token
}

module.exports = {
    loginAuth,
    setToken
}