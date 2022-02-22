const {client} = require('./postgres')

async function saveEval(req, res, next) {
    let user = JWT.decode(req.cookies.token)
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
    })
}

module.exports = {saveEval}