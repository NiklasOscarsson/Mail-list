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
    CREATE TABLE reports (
      week integer NOT NULL,
      subject character(50) NOT NULL,
      report character(800) NOT NULL,
      teacher character(50) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .then(
    await client.query(`
    CREATE TABLE user (
      name character(50) NOT NULL,
      password character(50) NOT NULL,
      token character(500),
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  )
  .then(()=>{
    console.log('Setup completed');
    res.send('Setup successful');
  })
  .catch((err)=>{
    console.log(err);
    res.send('error setting up db: '+err);
  })
}

module.exports = {client, setup}