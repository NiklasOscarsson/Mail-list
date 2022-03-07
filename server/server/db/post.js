const {client} = require('./postgres')
require('../serverFunctions/week')

async function saveEval(req, res, next) {
    let date = new Date
    let evalId;
    let subjectId;
    let teacherId = req.body[1].teacher_id;
    let studentId = req.body[1].student_id;
    let userId = req.body[2];

    // console.log(req.body[1]);
    // WRITE EVAL TO DB AND FETCH ID's
    await client.query(`
        INSERT INTO evaluations
        (evaluation, week, active)
        VALUES($1, $2, 1)
    `,[req.body[0], date.getWeek()])
    await client.query(`
        SELECT id FROM evaluations
        WHERE evaluation = $1
    `,[req.body[0]])
    .then(r => evalId = r.rows[0].id)
    await client.query(`
        SELECT id FROM Subjects
        WHERE course_code = $1
    `,[req.body[1].course_code])
    .then(r => subjectId = r.rows[0].id)

    // WRITE TO CONNECTING TABLES
    await client.query(`
        INSERT INTO teacher_subject_eval
        (teacher_id, subject_id, evaluation_id)
        VALUES ($1, $2, $3)
    `,[teacherId, subjectId, evalId])
    await client.query(`
        INSERT INTO eval_student_user
        (evaluation_id, student_id, user_id)
        VALUES ($1, $2, $3)
    `,[evalId, studentId, userId])

    res.send('hello')

    /* let user = JWT.decode(req.cookies.token)
    let evaluation = req.body.evaluation;
    let weekNow = date.getWeek();
    let sId = req.body.studentId
    let uId = user.user
    let lId = req.body.subjectId
    let tId = req.body.teacherId
    await client.query(`
      INSERT INTO evaluations (evaluation, active, week, studentid, userid, lessonid, teacherid)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
    `, [evaluation, 1, weekNow, sId, uId, lId, tId])
    .then(async () => {
        let include = req.body.include
        if (include.length > 0) {
            include = req.body.include
            await client.query(`
        UPDATE evaluations
        SET active = $1
        WHERE id IN (${include.join(',')})
    `, [1])
        }
    }).then(() => {
        res.status(200).send('Upload completed')
    }).catch((err) => {
        console.log('the error is: ' + err);
        res.status(500).send('Upload failed')
    }) */
}

module.exports = {saveEval}