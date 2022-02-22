const {client} = require('./postgres')
const JWT = require('jsonwebtoken')
const bcrypt =require('bcrypt')

async function getUserInfo(req, res, next) {
  let user = await getUser('niklas.oscarssons@gmail.com', 'bob')
  user.role = await getUserRole(user.id)

  console.log(user);
  getAllStudents()
  //const user = 1/* JWT.decode(req.cookies.token).user */
  //let info = await getFullInfo(user)
  //let info2 = await getMyStuff(user)
  
  //console.log(info);
  //let sortedInfo = studentSorter(info)

  res.json(user)
}

async function getUser(email, password){
  const user = await client.query(`
    SELECT login.user_id, password FROM userlogin
    INNER JOIN login
    ON userlogin.id = login.login_id
    WHERE email = $1
  `, [email])
  .then(async (r)=>{
    if(bcrypt.compareSync(password, r.rows[0].password.trim())){
      const user = await client.query(`
        SELECT first_name, last_name, email, id FROM users
        WHERE id = $1
      `,[r.rows[0].user_id])
      return user.rows[0]
    }
  })
  return user
}
async function getUserRole(id){
  const role = await client.query(`
    SELECT roles.role FROM users
    INNER JOIN user_role
    ON user_role.user_id = users.id
    INNER JOIN roles
    ON user_role.role_id = roles.id
    WHERE users.id = $1
  `, [id])
  .then((r)=>{
      return r.rows[0].role
  })
  return role
}
async function getAllStudents(){
  client.query(`
    SELECT *
    FROM students
  `
  , (err, data)=>{
    console.log(data.rows[0]);
    //FORTSÄTT HÄR
  })
}


async function getFullInfo(email){
  let info = {}
  await client.query(`
    SELECT 
    FROM 
  `)

  
  return info
}

async function getMyStuff(user){
  
}

module.exports = {getUserInfo, getUser}