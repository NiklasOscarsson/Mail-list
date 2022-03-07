<template>
  <div
    class="backdrop"
    @click.self="closeEvaluationModal"
  >
    <div class="evaluation-box card">
      <div class="studentText">
        <div>
          <h1>
            {{ evaluatingStudent.student.first_name }} {{ evaluatingStudent.student.last_name }}
          </h1>
          <h3>{{ evaluatingStudent.subject_name }}</h3>
        </div>
        <button id="include" @click="includeEval">
          <p>inkludera tidigare utverderingar</p>
        </button>
      </div>
      <textarea name="" id="" cols="150" rows="30" v-model="evaluation"></textarea>
      <br />
      <div class="button-div">
        <button @click="saveEvaluationModal">Save</button>
        <button @click="closeEvaluationModal">cancel</button>
      </div>
      <div id="evalWarning" v-if="this.evalWarning">
        <h2>Kan inte skicka tom utvärdering</h2>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
    data(){
        return {
            evaluationText:'',
            evalWarning: false,
        }
    },
    methods:{
        ...mapGetters(['getSelectedStudent', 'getIncludedEvals', 'getUserId', 'getWeek']),
        ...mapActions(['updateEvaluationAction']),
        saveEvaluationModal(){
            if(this.evaluationText === ''){
                this.evalWarning = true
                setTimeout(()=>{
                  this.evalWarning = false
                }, 3000)
            }else{
                this.updateEvaluationAction([this.evaluationText, this.getSelectedStudent(), this.getIncludedEvals()]) //<--- +eval_id
            }
        },
        closeEvaluationModal(){
            this.$emit('close')
        }
    },
    computed:{
        evaluatingStudent(){
            return this.getSelectedStudent()
        },
        subject(){
            return true
        },
        evaluation(){
          return this.getSelectedStudent().evaluations.find(e => e.week === this.getWeek()).evaluation
        }
    },
}
</script>

<style scoped>
.evaluation-box{
  background-color: white;
}
.studentText{
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
}
#include{
  height: 80%;
  align-self: center;
}
textarea{
  resize: none;
}
.button-div{
  height: 4vh;
  width: 80%;
  margin: auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
#evalWarning{
  position: absolute;
  top: 50vh;
  left: 50%;
  transform: translateX(-50%);
  color: red;
  text-shadow: 
    -1px -1px 0 #000,  
     1px -1px 0 #000,
    -1px 1px 0 #000,
     1px 1px 0 #000;
}
</style>