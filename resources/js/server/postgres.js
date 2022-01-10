const { Client }=require('pg');
require('dotenv').config()
const bcrypt = require('bcrypt');

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASS,
  port: process.env.PGPORT,
})

async function setup(res){
  let complete = false
  await client.query(`
    CREATE TABLE IF NOT EXISTS subjects (
      subject character(40) NOT NULL,
      course_code character(6) NOT NULL,
      teacherId integer ARRAY NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch(err=>{
    console.log('error setting up lesson db: '+err);
    return false
  })
  await client.query(`
    CREATE TABLE IF NOT EXISTS students (
      name character(50) NOT NULL,
      student_mail character(50),
      class character(4) NOT NULL,
      subjectId integer ARRAY NOT NULL,
      guardian character(50) NOT NULL,
      guardian_mail character(50) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch(err=>{
    console.log('error setting up student db: '+err);
    return false
  })
  await client.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      name character(50) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch(err=>{
    console.log('error setting up teacher db: '+err);
    return false
  })
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      firstName character(20) NOT NULL,
      lastName character(20) NOT NULL,
      email character(60) NOT NULL,
      password character(80) NOT NULL,
      roleId integer NOT NULL,
      my_students_id integer ARRAY NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch(err=>{
    console.log('error setting up user db: '+err);
    return false
  })
  await client.query(`
    CREATE TABLE IF NOT EXISTS roles (
      role character(50) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch(err=>{
    console.log('error setting up roles db: '+err);
    return false
  })

  complete = await client.query(`
    CREATE TABLE IF NOT EXISTS timers (
      remindDay integer NOT NULL,
      remindHour integer NOT NULL,
      sendDay integer NOT NULL,
      sendHour integer NOT NULL,
      userId integer NOT NULL,
      studentId integer NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .then(()=>{
    console.log('Setup successful');
    return true
  })
  .catch((err)=>{
    console.log('error setting up timer db: '+err);
    return false
  })
  return complete
}

async function dbTest(){
  const password = await bcrypt.hash('bob', 8)
  await client.query(`
    INSERT INTO users (firstName, lastName, email, password, roleId, my_students_id)
    VALUES ('niklas', 'oscarsson', 'niklas.oscarssons@gmail.com', $1, 1, '{1}')
  `, [password]).catch(err => console.log(err))
}

module.exports = {client, setup , dbTest}