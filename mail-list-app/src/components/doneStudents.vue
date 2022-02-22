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
        v-for="student in doneStudents"
        :key="student.student_mail"
        @click="viewEvaluation(student)"
      >
        <li>
          <div class="student">
            <div class="table-div">
              <h4 :title="student.student_mail">
                {{ student.first_name }} {{ student.last_name }}
              </h4>
            </div>
            <div class="table-div">
              <div v-if="!student.guardian2_first_name">
                <h4 :title="student.guardian_mail">
                  {{ student.guardian1_first_name }}
                  {{ student.guardian1_last_name }}
                </h4>
              </div>
              <div v-else>
                <h5 :title="student.guardian_mail">
                  {{ student.guardian1_first_name }}
                  {{ student.guardian1_last_name }}
                  <br />
                  {{ student.guardian1_first_name }}
                  {{ student.guardian1_last_name }}
                </h5>
              </div>
            </div>
          </div>
        </li>
      </a>
    </ul>
  </div>
</template>

<script>
export default {
    data(){
        return {
            doneStudents: {},
            viewSelectedStudent:{},
            viewStudentModal: false,
        }
    },
    methods:{
        viewEvaluation(student){
            if(this.evaluatingStudent !== student){
                this.evaluationText = student.evaluations.find(e => e.week === this.date.getWeek()).evaluation
                this.evaluatingStudent = student
            }
            this.evaluatingStudent.evaluations.forEach(e => {
                if(e.active === 1){
                    this.includedEvaluations.push(e.id)
                }
            })
            this.evaluationModal = true
        },
        closeViewEvaluation(){
            this.evaluationModal = false
        }
    }
}
</script>