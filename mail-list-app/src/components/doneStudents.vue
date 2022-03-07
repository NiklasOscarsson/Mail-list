<template>
  <div id="students-done" class="card main-divs">
    <h3 class="title">Färdiga elever</h3>
    <div class="table-titles">
      <div class="table-text table-div">
        <h4>Elevens namn</h4>
      </div>
      <div class="table-text table-div">
        <h4>Ämne</h4>
      </div>
    </div>
    <hr />
    <ul class="student-list">
      <!-- add input page -->

      <a
        href="#students-done"
        v-for="done in doneStudents"
        :key="done.student.student_mail.trim()"
        @click="viewEvaluation(done)"
      >
        <li>
          <div class="student">
            <div class="table-div">
              <h4 :title="done.student.student_mail">
                {{ done.student.first_name }} {{ done.student.last_name }}
              </h4>
            </div>
            <div class="table-div">
              <h4>{{ done.subject_name }}</h4>
            </div>
          </div>
        </li>
      </a>
    </ul>
    <viewEvaluationModal v-if="evaluationModal" @close='closeViewEvaluation'/>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import viewEvaluationModal from './modals/viewEvaluationModal.vue'
export default {
  components:{viewEvaluationModal},
  data(){
      return {
        date: new Date,
        evaluationModal: false,
      }
  },
  methods:{
    ...mapActions(['setSelectedStudentAction']),
    ...mapGetters(['getSelectedStudent', 'getDoneStudents', 'getWeek']),
    viewEvaluation(student){
      this.setSelectedStudentAction(student)
      this.evaluationModal = true
    },
    closeViewEvaluation(){
        this.evaluationModal = false
    }
  },
  computed:{
    SelectedStudent(){
      return this.getSelectedStudent()
    },
    doneStudents(){
      return this.getDoneStudents()
    }
  }
}
</script>