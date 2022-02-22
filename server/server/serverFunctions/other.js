function capitalize(word) {
    return word[0].toUpperCase() + word.substr(1).trim()
}

function studentSorter(info) {
    let sortedInfo = {}

    sortedInfo.user = info.teachers.filter(e => e.userid === info.user.id)[0]
    
    sortedInfo.myStudents = info.students.filter(e => info.user.mystudentsid.includes(e.id))
    sortedInfo.myStudents.forEach(e => { 
        e.studentSubjects = info.subjects.filter(s => e.subjectid.includes(s.id))
        let sort = info.teachers.filter(t => e.assignedteachers.includes(t.id))
        e.studentSubjects.forEach((ss) => {
            ss.teacher = sort.filter(t => ss.teacherid.includes(t.id))
        })
        let evaluations = info.evaluations.filter(ev => ev.studentid === e.id)
        e.studentSubjects.forEach((ss) => {
            ss.evaluation = evaluations.filter(ev => ss.id === ev.lessonid)
        })
    });

    sortedInfo.all = {}
    sortedInfo.all.students = info.students
    sortedInfo.all.teachers = info.teachers
    sortedInfo.all.subjects = info.subjects
    sortedInfo.all.evaluations = info.evaluations

    sortedInfo = trimInfo(sortedInfo)

    return sortedInfo
}

function trimInfo(trim){
    delete trim.user.id
    trim.myStudents.forEach(e => {
        delete e.id
        delete e.subjectid
        delete e.assignedteachers
        e.studentSubjects.forEach(subject => {
            delete subject.id
            delete subject.teacherid
            subject.teacher.forEach(teacher => {
                delete teacher.id
                delete teacher.userid
            })
        })
    })


    return trim
}

module.exports = {capitalize, studentSorter}