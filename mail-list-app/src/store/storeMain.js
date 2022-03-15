import {createStore} from 'vuex'
require('../assets/js/week')

const store = createStore({
    state(){
        return {
            selectedStudent: {},
            allStudents: [],
            allSubjects: [],
            allTeachers: [],
            myStudents: [],
            addedStudents: [],
            todo: [],
            done: [],
            includedEvals: [],
            user: {},
            date: new Date,
        }
    },
    mutations:{
        setup(state, payload){
            state.user = payload.user
            state.myStudents = payload.myStudents
            state.addedStudents = payload.addedStudents
            state.allStudents = payload.allStudents
            state.allSubjects = payload.allSubjects
            state.allTeachers = payload.allTeachers
            state.todo = []
            state.done = []

            state.addedStudents.forEach(e => {
                console.log(e.evaluations);
                let check = e.evaluations.filter(i => i.find(j=>j.active === 1 && j.week === state.date.getWeek()));
                console.log(check);
                if(check.length > 0){
                    state.done.push(e)
                }
                else{state.todo.push(e)}
            });
        },
        setSelectedStudent(state, payload){
            state.selectedStudent = payload
        },
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
        async setEvaluationAction(context, payload){
            if(payload.length === 0) return
            await fetch('http://127.0.0.1:80/evaluate',{  //<-----------------Byt Vid Publicering
                method: 'POST',
                mode: 'cors',
                headers: {
                    'content-type':'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(() => {
                context.dispatch('setup')
            })
        },
        async updateEvaluationAction(context, payload){
            if(payload.length === 0) return
            await fetch('http://127.0.0.1:80/updateEvaluation',{  //<-----------------Byt Vid Publicering
                method: 'POST',
                mode: 'cors',
                headers: {
                    'content-type':'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(() => {
                context.dispatch('setup')
            })
        },
        async setIncludedEvals(context, payload){
            fetch('http://127.0.0.1:80/activateEvaluations',{
                method: 'POST',
                mode: 'cors',
                headers: {
                    'content-type':'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(() => {
                context.dispatch('setup')
            })
        }
    },
    getters: {
        getMyStudents(state){
            return state.myStudents
        },
        getSelectedStudent(state){
            return state.selectedStudent
        },
        getOldEvals(state){
            return  state.selectedStudent.evaluations.filter(e => e[0].week !== state.date.getWeek());
        },
        getThisWeekEvaluation(){
            let studenteval = this.getSelectedStudent().evaluations
            for(let i=0; i<studenteval.length; i++){
              if(studenteval[i][0].week === this.getWeek()){
                return studenteval[i][0].evaluation
              }
            }
            return ''
        },
        getTodoStudents(state){
            return state.todo
        },
        getDoneStudents(state){
            return state.done
        },
        getIncludedEvals(state){
            return state.includedEvals
        },
        getUserId(state){
            return state.user.id
        },
        getWeek(state){
            return state.date.getWeek()
        }
    }
})

// function todoOrDone(){

// }


export default store