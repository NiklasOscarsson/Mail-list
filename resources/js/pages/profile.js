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
        addSubject(){
            this.addSubjectModal = true
            console.log(this.allStudents);
            console.log(this.evaluations);
            console.log(this.subjects);
            console.log(this.teachers);
        },
        viewSubject(){
            this.viewSubjectModal = true
        },
        async sort(students, userStudentId){
            this.myStudents = await students.filter(e => userStudentId.includes(e.id));
            this.todoStudents = this.myStudents.filter(e => {
                // finns ingen utvärdering som är veckans => med e.id 
            })
            console.log(this.todoStudents);
        },
        sortEvaluations(student){
            let myEvals = this.evaluations.filter(e => e.studentid === student.id)
            myEvals = myevals.filter(e => e.week !== this.date.getWeek())
            console.log(myEvals);
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
            .then(()=> this.sort(this.allStudents, this.user.my_students_id))
        }
    }
})

app.mount('#app')


//lib.deltasignal.se