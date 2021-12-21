const { Client }=require('pg');
require('dotenv').config()

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PGPASS,
  port: process.env.PORT,
})

async function setup(res){
  await client.query(`
    CREATE TABLE IF NOT EXISTS reports (
      week integer NOT NULL,
      subject character(50) NOT NULL,
      report character(800) NOT NULL,
      teacher character(50) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch(err=>{
    console.log(err);
    return res.send('error setting up db: '+err);
  })

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      name character(50) NOT NULL,
      password character(50) NOT NULL,
      token character(500),
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .then(()=>{
    console.log('Setup completed');
    return res.send('Setup successful');
  })
  .catch((err)=>{
    console.log(err);
    return res.send('error setting up db: '+err);
  })
}

async function dbTest(){
  await client.query(`
    INSERT INTO users (name, password)
    VALUES ('niklas', 'bob')
  `).then(r => console.log(r)).catch(err => console.log(err))
}

module.exports = {client, setup , dbTest}