const app = Vue.createApp({
    data(){
        return {
            date: new Date,
            user: '',
            allStudents: [],
            evaluations: [],
            subjects: [],
            teachers: [],
            myStudents: [],
            todoStudents: [],
            doneStudents: [],
            choosenClass: '',
            choosenStudent: {},
            addSubjectModal: false,
            viewSubjectModal: false,
            evaluationModal: false,
            evaluatingStudent: {},
            evaluationText: '',
            includedEvaluations: [],
        }
    },
    methods: {
        parseCookie(cookies){
            if(cookies[0] === "") return false
            let tokens = {}
            for(i = 0; i < cookies.length; i++){
                cookies[i] = cookies[i].split('=')
            }
            for(i = 0; i < cookies.length; i++){
                const tokenName = cookies[i][0].trim()
                tokens[tokenName] = cookies[i][1]
            }
            return tokens
        },

        evaluate(student){
            if(this.evaluatingStudent !== student){
                this.evaluationText = ''
                this.evaluatingStudent = student
            }
            this.evaluationModal = true
        },
        closeEvaluationModal(){
            this.evaluationModal = false
        },
        saveEvaluationModal(){
            if(this.evaluationText = ''){
                this.evalWarning = true /* MAKE A WARNING + SEND SHIT */
                setTimeout(()=>{this.evalWarning = false}, 5000)
            }
            const sendEvaluation = {
                evaluation: this.evaluationText,
                include: this.includedEvaluations,
                studentId: this.evaluatingStudent.id,
                userId: this.user.id,
                subjectId: this.evaluatingStudent.subject.id,
                teacherId: this.evaluatingStudent.teacher.id
            }
            console.log(sendEvaluation);
            this.evaluationModal = false
        },

        addSubject(){
            this.addSubjectModal = true
        },
        viewSubject(){
            this.viewSubjectModal = true
        },

        async sort(){
            this.myStudents = await this.sortMyStudents(this.allStudents, this.user.my_students_id)
            this.myStudents = await this.sortEvaluationsIntoStudent(this.myStudents)
            this.sortDoneAndTodoStudents()
        },
        sortMyStudents(students, userStudentId){
            myStudents =  students.filter(e => userStudentId.includes(e.id));
            return myStudents
        },

        sortEvaluationsIntoStudent(students){
            students.forEach(student => {
                student.evaluations = this.evaluations.filter(e => student.id === e.studentid )
                let teacher = this.teachers.filter(f => f.first_name.toLowerCase() === this.user.firstname.toLowerCase() && f.last_name.toLowerCase() === this.user.lastname.toLowerCase())
                let subject = this.subjects.filter(f => f.teacherid.includes(teacher[0].id))
                student.subject = {name: subject[0].subject, code: subject[0].course_code, id: subject[0].id}
                student.teacher = {name: `${teacher[0].first_name} ${teacher[0].last_name}`, id:teacher[0].id}
            });
            return students
        },
        sortDoneAndTodoStudents(){
            myStudents.forEach(e => {
                let findNew = e.evaluations.filter(f => f.week === this.date.getWeek())
                if(findNew.length === 0){
                    this.todoStudents.push(e)
                }
                else{
                    this.doneStudents.push(e)
                }
            })
        }

    },
    computed: {
        isAdmin(){
            if(this.user === '') return false
            if(this.user !== '' && this.user.role === 'user') return false
            return true
        },
        schoolClass(){
            return this.allStudents.filter(e => e.class = this.choosenClass)
        },
        newStudent(){
            if(this.choosenClass === ''){
                return {
                    studentFirstName: '',
                    studentLastName: '',
                    studentEmail: '',
                    guardianFirstName: '',
                    guardianlastName: '',
                    guardianEmail:'',
                    subjects: []
                }
            }
            return {
                studentFirstName: this.choosenStudent.first_name,
                studentLastName: this.choosenStudent.last_name,
                studentEmail: this.choosenStudent.student_mail,
                guardianFirstName: this.choosenStudent.guardian_first_name,
                guardianLastName: this.choosenStudent.guardian_last_name,
                guardianEmail: this.choosenStudent.guardian_mail,
                subjects: this.choosenStudent.subjectid
            }
        }
    },
    mounted(){
        let cookies = document.cookie.split(';')
        let token = this.parseCookie(cookies)
        if(token.token){
            fetch('/userInfo', {
                headers: {
                    'content-type':'application/json'
                },
                body: JSON.stringify(token),
                credentials: 'same-origin',
                method: 'POST'
            })
            .then(r => r.json()
            .then(r => this.user = r[0]))
            fetch('/getInfo', {
                headers: {
                    'content-type':'application/json'
                },
                body: JSON.stringify(token),
                credentials: 'same-origin',
                method: 'POST'
            })
            .then(r => r.json()
            .then(r => {
                this.allStudents = r.students
                this.evaluations = r.evaluations
                this.subjects = r.subjects
                this.teachers = r.teachers
            }))
            .then(()=> this.sort())
        }
    }
})

app.mount('#app')


//lib.deltasignal.se