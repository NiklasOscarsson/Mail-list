import {createStore} from 'vuex'

const store = createStore({
    state(){
        return {
            selectedStudent: {},
            allStudents: [],
            allTeachers: [],
            myStudents: [],
            mySubjects: [],
            myEvaluations: [],
            user: '',
            date: new Date,
        }
    },
    mutations:{
        setup(state, payload){
            state.user = payload.user
            state.myStudents = payload.myStudents
            state.myEvaluations = payload.myEvaluations
            state.allStudents = payload.all.students
            state.allTeachers = payload.all.teachers
            
            //mySubjects
        },
        setSelectedStudent(state, payload){
            state.selectedStudent = payload
        }
    },
    actions: {
        setup(context){
            fetch("http://localhost/getinfo", {
                headers: {
                "content-type": "application/json",
                },
                credentials: "same-origin",
                method: "POST",
            })
            .then(r => r.json())
            .then((r) => {
                context.commit('setup', r)
            })
        },
        setSelectedStudentAction(context, payload){
            context.commit('setSelectedStudent', payload)
        },
        setEvaluationAction(context, payload){




            if(payload == 0){
                console.log(context);
            }
            console.log(payload);
            
        },
    },
    getters: {
        getMyStudents(state){
            return state.myStudents
        },
        getSelectedStudent(state){
            return state.selectedStudent
        },
        getTodoStudents(state){
            let students = state.myStudents.filter(e => {
                let re;
                e.studentSubjects.forEach(el => {
                    if(el.evaluation.length > 0){
                        re = el.evaluation.filter(ele => ele.active === 0)
                    }
                });
                console.log(re);
                if(re.length !== 0) return true
                return false
            })
            console.log(state.mySubjects);
            return students
        },
    }
})

export default store