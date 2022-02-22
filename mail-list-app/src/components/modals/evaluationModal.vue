<template>
  <div
    class="backdrop"
    @click.self="closeEvaluationModal"
  >
    <div class="evaluation-box card">
      <div class="studentText">
        <div>
          <h1>
            {{ evaluatingStudent.first_name }} {{ evaluatingStudent.last_name }}
          </h1>
          <h3>{{ subject }}</h3>
        </div>
        <button id="include" @click="includeEval">
          <p>inkludera tidigare utverderingar</p>
        </button>
      </div>
      <textarea name="" id="" cols="150" rows="30" v-model="evaluationText"></textarea>
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
        ...mapGetters(['getSelectedStudent']),
        ...mapActions(['setEvaluationAction']),
        saveEvaluationModal(){
            if(this.evaluationText === ''){
                this.evalWarning = true
                return
            }else{
                this.setEvaluationAction([this.evaluationText, ])
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
          console.log(this.getSelectedStudent());
            return true
        }
    },
}
</script>