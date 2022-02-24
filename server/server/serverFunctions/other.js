function capitalize(word) {
    return word[0].toUpperCase() + word.substr(1).trim()
}

function sorter(info) {
    //BUILD ALL SUBJECTS
    info.allSubjects.forEach(e => {
        e.teachers = info.allTeachers.filter(j => e.teacher_id === j.id)
    })

    //BUILD ALL STUDENTS
    info.allStudents.forEach(e => {
        e.guardians = []
        let filter = info.allGuardians.filter(j => j.id === e.id)
        filter.forEach(j => {
            e.guardians.push({
                firstName: j.guardian_first_name,
                lastName: j.guardian_last_name,
                mail: j.guardian_mail,
            })
        })
        let studentSubjects = info.studentSubjects.filter(i => i.student_id === e.id)
        studentSubjects = cutConnections(studentSubjects)
        e.subjects = studentSubjects
    });

    //BUILD MY STUDENTS
    info.myStudents=[]
    info.connector.forEach(e => {
        let myStudent = info.allStudents.filter(j => e.student_id === j.id)[0]
        myStudent = cutConnections(myStudent)
        myStudent.evaluations = info.rawEvaluations.filter(j => e.evaluation_id===j.id)
        info.myStudents.push(myStudent)
    })

    //BUILD ADDED STUDENTS <------------------------


    //SET TEACHING ON USER
    let teaching = info.allSubjects.filter(e=> e.teacher_id === info.user.teacher_id)
    teaching = cutConnections(teaching)
    info.user.teaching = teaching
    info = trimInfo(info)
    return info
}

 function trimInfo(trim){
    delete trim.allGuardians
    delete trim.rawEvaluations
    delete trim.connector
    delete trim.studentSubjects
    trim.user.teaching.forEach(e=>{
        delete e.teachers
    })
    

    return trim
}

function cutConnections(cut){
    cut = JSON.stringify(cut)
    cut = JSON.parse(cut)
    return cut
}

module.exports = {capitalize, sorter}