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
            console.log(payload);
            state.user = payload.user
            state.myStudents = payload.myStudents
            state.allStudents = payload.allStudents
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
            
            return state.myStudents
        },
    }
})

export default store