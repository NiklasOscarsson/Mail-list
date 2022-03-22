const JWT = require('jsonwebtoken')
const {client} = require('../db/init')


//verify token
async function verifyToken(req, res, next) {
    if (!req.cookies.token) return res.redirect('/profile/login');
    const token = JWT.verify(req.cookies.token, process.env.JWTKEY)
    const dbToken = await client.query(`
      SELECT email, id FROM users
      WHERE email = $1
    `, [token])
    if (!dbToken || dbToken.length === 0) return res.status(511).redirect('/profile/login')
    return next()
}

//verify user
async function verifyUser(req, res, next) {
    if (!req.cookies.token) return next()
    const token = JWT.verify(req.cookies.token, process.env.JWTKEY);
    await client.query(`
      SELECT firstname, lastname, my_students_id, roles.role FROM users
      JOIN roles ON users.roleid = roles.id
      WHERE users.email = $1 AND users.id = $2
    `, [token.email, token.user])
        .then(r => res.json(r.rows))
}

// update cookie
function updateCookie(req, res, next) {
    res.cookie('token', req.cookies.token, { maxAge: 60000 * 10, httpOnly: false, sameSite: true })
    return next()
}

module.exports = {verifyToken, verifyUser, updateCookie}