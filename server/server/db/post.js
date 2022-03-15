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
        RETURNING id
    `,[req.body[0], date.getWeek()])
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
    .then(() => {
        res.status(200).send('Upload completed')
    }).catch((err) => {
        console.log('the error is: ' + err);
        res.status(500).send('Upload failed')
    }) 


    // let user = JWT.decode(req.cookies.token)
}
async function updateEval(req, res, next){
    await client.query(`
        UPDATE evaluations
        SET evaluation = ($1)
        WHERE id = $2
    `, [req.body[0], req.body[2]])
    .then(()=>{
        res.status(200).send('Upload completed')
    })
    .catch(()=>{
        console.log('the error is: ' + err);
        res.status(500).send('Upload failed')
    })
}

async function activateEvaluations(req, res, next){
    req.body.forEach(async (e)=> {
        await client.query(`
            UPDATE evaluations
            SET active = $1
            WHERE id = $2
        `, [e[2], e[1]])
        .catch(()=>{
            console.log('the error is: ' + err);
            return res.status(500).send('Update failed')
        }) 
    })
    res.status(200).send('Upload completed')
}

module.exports = {saveEval, updateEval, activateEvaluations}