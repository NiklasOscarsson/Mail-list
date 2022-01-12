const { Client }=require('pg');
require('dotenv').config()
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken')

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
    CREATE TABLE IF NOT EXISTS subjects (
      subject character(40) NOT NULL,
      course_code character(8) NOT NULL,
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
      first_name character(20) NOT NULL,
      last_name character(20) NOT NULL,
      student_mail character(50),
      class character(4) NOT NULL,
      subjectId integer ARRAY NOT NULL,
      guardian_first_name character(20) NOT NULL,
      guardian_last_name character(20) NOT NULL,
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
      first_name character(20) NOT NULL,
      last_name character(20) NOT NULL,
      userId integer,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch(err=>{
    console.log('error setting up teacher db: '+err);
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
  await client.query(`
    CREATE TABLE IF NOT EXISTS evaluations (
      evaluation character(500) NOT NULL,
      week integer NOT NULL,
      studentId integer NOT NULL,
      userId integer NOT NULL,
      lessonId integer NOT NULL,
      teacherId integer NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch(err=>{
    console.log('error setting up evaluations db: '+err);
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
  .catch((err)=>{
    console.log('error setting up timer db: '+err);
    return false
  })
  .then(async()=>{
    const subjects = [
      {subject:'Design 1', courseCode: 'DESDES01', teacherId: [1]},
      {subject:'Digitalt skapande', courseCode: 'DIGDIG01', teacherId: [2]},
      {subject:'Engelska', courseCode: 'ENGENG07', teacherId: [3]},
      {subject:'Gränssnittsdesign', courseCode: 'GRÄGRÄ01', teacherId: [2]},
      {subject:'Historia', courseCode: 'HISHIS01', teacherId: [4]},
      {subject:'Idrott', courseCode: 'IDRIDR01', teacherId: [5]},
      {subject:'Konstarterna och Samhället', courseCode: 'KOSKOS01', teacherId: [2]},
      {subject:'Medieproduktion', courseCode: 'MEPMEP01', teacherId: [2]},
      {subject:'Religion', courseCode: 'RELREL01', teacherId: [4]},
      {subject:'Svenska', courseCode: 'SVESVE02', teacherId: [6]},
      {subject:'Webbutveckling', courseCode: 'WEUWEB01', teacherId: [7]},
    ]
    subjects.forEach(async e => {
      await client.query(`
      INSERT INTO subjects 
      (subject, course_code, teacherid)
      VALUES ($1, $2, $3)
      `, [e.subject, e.courseCode, e.teacherId])
    })
  })
  .then(async()=>{  //TEMPORÄRT
    const elev = {
      fNamn: 'Lucas',
      eNamn: 'Hidenius',
      email: '2004lucke@gmail.com',
      klass: 'ES20',
      subjects: [1,2,3,4,5,6,7,8,9,10,11],
      vhFNamn: 'Marita',
      vhENamn: 'Hidenius',
      vhEmail: 'maritahidenius@hotmail.com',
    }
    await client.query(`
    INSERT INTO students (first_name, last_name, student_mail, class, subjectid, guardian_first_name, guardian_last_name, guardian_mail)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,[elev.fNamn, elev.eNamn, elev.email, elev.klass, elev.subjects, elev.vhFNamn, elev.vhENamn, elev.vhEmail]) 
  })
  .then(async()=>{
    const teachers = [
      {fNamn: 'Robin', eNamn: 'Bräck', userId: null},
      {fNamn: 'Thomas', eNamn: 'Hammargren', userId: null},
      {fNamn: 'Andreas', eNamn: 'Karlsson', userId: null},
      {fNamn: 'Hanna', eNamn: 'Hörling', userId: null},
      {fNamn: 'Robert', eNamn: 'Jönsson', userId: null},
      {fNamn: 'Andreas', eNamn: 'Fritiofsson', userId: null},
      {fNamn: 'Niklas', eNamn: 'Oscarsson', userId: 1},
    ]
    teachers.forEach(async e => {
      await client.query(`
        INSERT INTO teachers (first_name, last_name, userid)
        VALUES ($1, $2, $3)
      `, [e.fNamn, e.eNamn, e.userId]) 
    })
  })
  .then(async()=>{
    const roles = ['Admin', 'User']
    for(i=0; i<roles.length; i++){
      await client.query(`
        INSERT INTO roles (role)
        VALUES ($1)
      `, [roles[i]]) 
    }
  })
  .then(()=>{
    dbTest()
  })
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

async function getInfo(req,res,next){
  let info = {}
  const user = JWT.decode(req.cookies.token).user
  await client.query(`
    SELECT * FROM students
  `).then(r => info.students = r.rows)
  await client.query(`
    SELECT * FROM subjects
  `).then(r => info.subjects = r.rows)
  await client.query(`
    SELECT * FROM teachers
  `).then(r => info.teachers = r.rows)
  await client.query(`
    SELECT * FROM evaluations
    WHERE userid = $1
  `, [user]).then(r => info.evaluations = r.rows)
  res.json(info)

}

//get

async function dbTest(){
  const password = await bcrypt.hash('bob', 8)
  await client.query(`
    INSERT INTO users (firstName, lastName, email, password, roleId, my_students_id)
    VALUES ('niklas', 'oscarsson', 'niklas.oscarssons@gmail.com', $1, 1, '{1}')
  `, [password]).catch(err => console.log(err))
}

module.exports = {client, setup, getInfo}