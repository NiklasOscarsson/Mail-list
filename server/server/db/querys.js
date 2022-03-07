const {client} = require('./postgres')
const JWT = require('jsonwebtoken')
const bcrypt =require('bcrypt')

async function getAllInfo(req, res, next) {
  const user = await getUser('niklas.oscarssons@gmail.com', 'bob')
  user.role = await getUserRole(user.id)
  const allStudents = await getAllStudents()
  const allGuardians = await getAllGuardians()
  const allSubjects = await getAllSubjects()
  const allTeachers = await getAllTeachers()
  const studentSubjects = await getStudentSubjects()
  const evals = await getEvaluations()
  const connect = await getConnectorTable(user.id)

  let info = {
    user: user,
    allStudents: allStudents,
    allGuardians: allGuardians,
    allSubjects: allSubjects,
    allTeachers: allTeachers,
    studentSubjects: studentSubjects,
    rawEvaluations: evals,
    connector: connect
  }
  return info
}

async function getUser(email, password){
  const user = await client.query(`
    SELECT login.user_id, password FROM userlogin
    INNER JOIN login
    ON userlogin.id = login.login_id
    WHERE email = $1
  `, [email])
  .then(async (r)=>{
    if(r.rows.length > 0 && bcrypt.compareSync(password, r.rows[0].password.trim())){
      const user = await client.query(`
        SELECT users.first_name, users.last_name, users.email, teachers.id AS teacher_id, users.id 
        FROM users
        JOIN user_teacher ON users.id = user_teacher.user_id
        JOIN teachers ON user_teacher.teacher_id = teachers.id
        WHERE users.id = $1
      `,[r.rows[0].user_id])
      .catch(err => console.log(err))
      return user.rows[0]
    }
  })
  return user
}
async function getUserRole(id){
  return await client.query(`
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
}
async function getAllStudents(){
  return await client.query(`
    SELECT *
    FROM students
  `
  )
  .then(r => {return r.rows})

}
async function getAllGuardians(){
  return await client.query(`
    SELECT students.id, guardians.guardian_first_name, guardians.guardian_last_name, guardians.guardian_mail
    FROM students
    INNER JOIN student_guardian
    ON students.id = student_guardian.student_id
    INNER JOIN guardians
    ON student_guardian.guardian1_id = students.id
    OR student_guardian.guardian2_id = students.id
  `
  )
  .then(r => {return r.rows})
}

async function getAllSubjects(){
  return await client.query(`
    SELECT all_subjects.course_code, all_subjects.subject_name, teacher_allsubjects.teacher_id
    FROM teacher_allsubjects
    JOIN all_subjects ON teacher_allsubjects.subject_id = all_subjects.id

  `)
  .then(r => {return r.rows})
}

async function getAllTeachers(){
  return await client.query(`
    SELECT *
    FROM teachers
  `)
  .then(r => {return r.rows})
}

async function getStudentSubjects(){
  return await client.query(`
    SELECT course_code, subject_name, student_subject.student_id, teacher_allsubjects.teacher_id
    FROM subjects
    INNER JOIN student_subject
    ON student_subject.subject_id = subjects.id
    JOIN teacher_allsubjects 
    ON teacher_allsubjects.subject_id = subjects.id
  `)
  .then(r => {return r.rows})
}

async function getConnectorTable(userId){
  return await client.query(`
    SELECT *
    FROM eval_student_user
    WHERE user_id = $1
  `, [userId])
  .then(r => {return r.rows})
}


async function getEvaluations(){
  return await client.query(`
    SELECT 
    evaluations.evaluation, evaluations.week, evaluations.id, evaluations.active,
    teachers.first_name, teachers.last_name,
    subjects.subject_name, subjects.course_code
    FROM teacher_subject_eval
    JOIN evaluations
    ON evaluations.id = evaluation_id
    JOIN teachers
    ON teachers.id = teacher_id
    JOIN subjects
    ON subjects.id = subject_id
  `)
  .then(r => {return r.rows})
}

module.exports = {getAllInfo, getUser, getAllStudents}