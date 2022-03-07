const { client } = require('./postgres.js')
const bcrypt = require('bcrypt');

date = new Date
async function setup(res) {
  let complete = false

  // INFO TABLES

  await client.query(`
    CREATE TABLE IF NOT EXISTS userlogin(
      email character(60) NOT NULL,
      password character(80) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )
  `)
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      first_name character(20) NOT NULL,
      last_name character(20) NOT NULL,
      email character(60) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )
  `)
  .catch(err => {
    console.log('error setting up user db: ' + err);
    return false
  })
    
  await client.query(`
    CREATE TABLE IF NOT EXISTS students (
      first_name character(20) NOT NULL,
      last_name character(20) NOT NULL,
      student_mail character(50),
      class character(6),
      id serial NOT NULL,
      PRIMARY KEY (id)
    )
  `)
  .catch(err => {
    console.log('error setting up student db: ' + err);
    return false
  })
  await client.query(`
    CREATE TABLE IF NOT EXISTS guardians (
      guardian_first_name character(20) NOT NULL,
      guardian_last_name character(20) NOT NULL,
      guardian_mail character(50),
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
    .catch(err => {
      console.log('error setting up guardian db: ' + err);
      return false
    })
  await client.query(`
    CREATE TABLE IF NOT EXISTS subjects (
      subject_name character(40) NOT NULL,
      course_code character(8) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
    .catch(err => {
      console.log('error setting up subject db: ' + err);
      return false
    })
  await client.query(`
    CREATE TABLE IF NOT EXISTS all_subjects (
      subject_name character(40) NOT NULL,
      course_code character(8) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
    .catch(err => {
      console.log('error setting up all_subject db: ' + err);
      return false
    })
  await client.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      first_name character(20) NOT NULL,
      last_name character(20) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
    .catch(err => {
      console.log('error setting up teacher db: ' + err);
      return false
    })

  await client.query(`
    CREATE TABLE IF NOT EXISTS roles (
      role character(50) NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch(err => {
    console.log('error setting up roles db: ' + err);
    return false
  })
  await client.query(`
    CREATE TABLE IF NOT EXISTS evaluations (
      evaluation character(500) NOT NULL,
      week integer NOT NULL,
      active integer NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch(err => {
    console.log('error setting up evaluation db: ' + err);
    return false
  })
  complete = await client.query(`
    CREATE TABLE IF NOT EXISTS timers (
      remindDay integer NOT NULL,
      remindHour integer NOT NULL,
      sendDay integer NOT NULL,
      sendHour integer NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )`
  )
  .catch((err) => {
    console.log('error setting up timer db: ' + err);
    return false
  })




  //CONNECTING TABLES

  await client.query(`
    CREATE TABLE IF NOT EXISTS login (
      login_id integer NOT NULL,
      user_id integer NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )
  `)
  .catch((err)=>{console.log('error setting up login db');})
  await client.query(`
    CREATE TABLE IF NOT EXISTS user_role (
      role_id integer NOT NULL,
      user_id integer NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )
  `)
  .catch((err)=>{console.log('error setting up user-role db');})
  await client.query(`
    CREATE TABLE IF NOT EXISTS user_teacher (
      user_id integer NOT NULL,
      teacher_id integer NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )
  `)  
  .catch((err)=>{console.log('error setting up user-teacher db');})
  await client.query(`
    CREATE TABLE IF NOT EXISTS student_guardian (
      student_id integer NOT NULL,
      guardian1_id integer,
      guardian2_id integer,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )
  `)
  await client.query(`
    CREATE TABLE IF NOT EXISTS teacher_subject_eval (
      teacher_id integer NOT NULL,
      subject_id integer NOT NULL,
      evaluation_id integer NOT NULL,
      id serial NOT NULL,
      PRIMARY KEY (id)
    )
  `)
  .catch((err)=>{console.log('error setting up teacher-subject-eval db');})
  await client.query(`
    CREATE TABLE IF NOT EXISTS teacher_allsubjects (
      teacher_id integer NOT NULL,
      subject_id integer NOT NULL
    )
  `)
  .catch((err)=>{console.log('error setting up teacher_allsubjects db');})
  await client.query(`
    CREATE TABLE IF NOT EXISTS eval_student_user (
      evaluation_id integer NOT NULL,
      student_id integer NOT NULL,
      user_id integer NOT NULL
    )
  `)
  .catch((err)=>{console.log('error setting up user-student-eval db');})
  await client.query(`
    CREATE TABLE IF NOT EXISTS student_subject (
      student_id integer NOT NULL,
      subject_id integer NOT NULL
    )
  `)


  // FILL TABLES
  
  .then(async () => {
    const pass = await bcrypt.hash('bob', 8)
    await client.query(`
    INSERT INTO userlogin (email, password)
    VALUES ('niklas.oscarssons@gmail.com', $1)
  `, [pass])
  })
  .then(async () => {
    await client.query(`
    INSERT INTO users (first_name, last_name, email)
    VALUES ('niklas', 'oscarsson', 'niklas.oscarssons@gmail.com')
  `)
  })
  .then(async () => {
    await client.query(`
    INSERT INTO login (user_id, login_id)
    VALUES (1, 1)
  `)
  })
  .then(async () => {
    const roles = ['Admin', 'User']
    for (i = 0; i < roles.length; i++) {
      await client.query(`
        INSERT INTO roles (role)
        VALUES ($1)
      `, [roles[i]])
    }
  })
  .then(async () => {
    await client.query(`
    INSERT INTO user_role (user_id, role_id)
    VALUES (1, 1)
  `)
  })
  
  .then(async () => {  //TEMPORÄRT
    const elev = {
      fNamn: 'Lucas',
      eNamn: 'Hidenius',
      email: '2004lucke@gmail.com',
      klass: 'ES20',
    }
    await client.query(`
    INSERT INTO students (first_name, last_name, student_mail, class)
    VALUES ($1, $2, $3, $4)
  `, [elev.fNamn, elev.eNamn, elev.email, elev.klass])
  })
  .then(async () => {  //TEMPORÄRT
    const vh = {
      fNamn: 'Marita',
      eNamn: 'Hidenius',
      email: 'något@klara.se',
    }
    await client.query(`
    INSERT INTO guardians (guardian_first_name, guardian_last_name, guardian_mail)
    VALUES ($1, $2, $3)
  `, [vh.fNamn, vh.eNamn, vh.email])
  })
  .then(async () => {  //TEMPORÄRT
    const vh = {
      fNamn: 'Mikkel',
      eNamn: 'L',
      email: 'något@norge.se',
    }
    await client.query(`
    INSERT INTO guardians (guardian_first_name, guardian_last_name, guardian_mail)
    VALUES ($1, $2, $3)
  `, [vh.fNamn, vh.eNamn, vh.email])
  })
  .then(async () => {
    await client.query(`
      INSERT INTO student_guardian (student_id, Guardian1_id, Guardian2_id)
      VALUES (1, 1, 2)
    `)
  })

  .then(async () => {
    const teachers = [
      { fNamn: 'Robin', eNamn: 'Bräck' },
      { fNamn: 'Thomas', eNamn: 'Hammargren' },
      { fNamn: 'Andreas', eNamn: 'Karlsson' },
      { fNamn: 'Hanna', eNamn: 'Hörling' },
      { fNamn: 'Robert', eNamn: 'Jönsson' },
      { fNamn: 'Andreas', eNamn: 'Fritiofsson' },
      { fNamn: 'Niklas', eNamn: 'Oscarsson' },
    ]
    teachers.forEach(async e => {
      await client.query(`
        INSERT INTO teachers (first_name, last_name)
        VALUES ($1, $2)
      `, [e.fNamn, e.eNamn])
    })
  })
  .then(async () => {
    await client.query(`
      INSERT INTO user_teacher (user_id, teacher_id)
      VALUES (1, 7)
    `)
  })
  .then(async () => {
    const subjects = [
      { subject: 'Design 1', courseCode: 'DESDES01' },
      { subject: 'Digitalt skapande', courseCode: 'DIGDIG01' },
      { subject: 'Engelska', courseCode: 'ENGENG07' },
      { subject: 'Gränssnittsdesign', courseCode: 'GRÄGRÄ01' },
      { subject: 'Historia', courseCode: 'HISHIS01' },
      { subject: 'Idrott', courseCode: 'IDRIDR01' },
      { subject: 'Konstarterna och Samhället', courseCode: 'KOSKOS01' },
      { subject: 'Medieproduktion', courseCode: 'MEPMEP01' },
      { subject: 'Religion', courseCode: 'RELREL01' },
      { subject: 'Svenska', courseCode: 'SVESVE02' },
      { subject: 'Webbutveckling', courseCode: 'WEUWEB01' },
    ]
    subjects.forEach(async e => {
      await client.query(`
      INSERT INTO subjects 
      (subject_name, course_code)
      VALUES ($1, $2)
      `, [e.subject, e.courseCode])
    })
  })
  .then(async () => {
    const subjects = [
      { subject: 'Design 1', courseCode: 'DESDES01' },
      { subject: 'Digitalt skapande', courseCode: 'DIGDIG01' },
      { subject: 'Engelska', courseCode: 'ENGENG07' },
      { subject: 'Gränssnittsdesign', courseCode: 'GRÄGRÄ01' },
      { subject: 'Historia', courseCode: 'HISHIS01' },
      { subject: 'Idrott', courseCode: 'IDRIDR01' },
      { subject: 'Konstarterna och Samhället', courseCode: 'KOSKOS01' },
      { subject: 'Medieproduktion', courseCode: 'MEPMEP01' },
      { subject: 'Religion', courseCode: 'RELREL01' },
      { subject: 'Svenska', courseCode: 'SVESVE02' },
      { subject: 'Webbutveckling', courseCode: 'WEUWEB01' },
    ]
    subjects.forEach(async e => {
      await client.query(`
      INSERT INTO all_subjects 
      (subject_name, course_code)
      VALUES ($1, $2)
      `, [e.subject, e.courseCode])
    })
  })
  .then(async () => {
    let evaluation = 'bla bla bla';
    let weekNow = date.getWeek();
    await client.query(`
    INSERT INTO evaluations (evaluation, week, active)
    VALUES ($1,$2, 0)
  `, [evaluation, weekNow])
  })
  .then(async () => {
    for(let i=1; i<12; i++){
      await client.query(`
        INSERT INTO student_subject (student_id, subject_id)
        VALUES (1, $1)
      `, [i])
    }
  })
  .then(async () => {
    await client.query(`
      INSERT INTO teacher_subject_eval (teacher_id, subject_id, evaluation_id)
      VALUES (7, 11, 1)
    `)
  })
  .then(async () => {
    teacherSubject = [
      [1,1],
      [2,4],
      [2,7],
      [2,8],
      [3,3],
      [4,5],
      [4,9],
      [5,2],
      [5,6],
      [6,10],
      [7,11],
    ]
    teacherSubject.forEach(async e =>  {
      await client.query(`
        INSERT INTO teacher_allsubjects ( teacher_id, subject_id )
        VALUES ($1, $2)
      `, [e[0], e[1]])
    })
    
  })
  .then(async () => {
    await client.query(`
      INSERT INTO eval_student_user (evaluation_id, student_id, user_id)
      VALUES (1,1,1)
    `)
  })
  .then(() => {
    console.log('Setup successful');
    return true
  })
  return complete
}

module.exports = { setup }