const app = Vue.createApp({
    data(){
        return {
            user: '',
            allStudents: [],
            myStudents: [],
            todoStudents: [],
            doneStudents: [],
            choosenClass: '',
            choosenStudent: {},
            subjects: [{}],
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
            console.log(this.choosenStudent);
        },
        viewSubject(){
            this.viewSubjectModal = true
        },
        sortStudents(students, userStudentId){
            this.myStudents = students.filter(e => userStudentId.includes(e.id));
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
            .then(r => {
                r.json().then(r => {
                    this.user = r[0];
                });
            })
            fetch('/getStudents', {
                headers: {
                    'content-type':'application/json'
                },
                body: JSON.stringify(token),
                credentials: 'same-origin',
                method: 'POST'
            })
            .then(r => {
                r.json().then(r => {
                    this.allStudents = r;
                    
                })
                .then(()=>{
                    this.sortStudents(this.allStudents, this.user.my_students_id)
                })
            })
            .then(()=>{
                
            })
            
        }
    }
})

app.mount('#app')