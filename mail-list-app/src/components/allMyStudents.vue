<template>
  <div id="my-students" class="card main-divs">
    <h3 class="title">Mina elever</h3>
    <div class="table-titles">
      <div class="table-text table-div">
        <h4>Elevens namn</h4>
      </div>
      <div class="table-text table-div">
        <h4>Elevens VH</h4>
      </div>
    </div>
    <hr />
    <ul class="student-list">
      <!-- add summary page -->
      <a href="#" v-for="student in myStudents" :key="student.student_mail" @click.prevent="viewStudent(student)">
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
    <viewStudentModal v-if="viewStudentModal" @closeViewStudent="closeViewStudent" />
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import viewStudentModal from './modals/viewStudentModal.vue'
export default {
  components:{
    viewStudentModal
  },
  data(){
    return {
      viewSelectedStudent:{},
      viewStudentModal: false,
    }
  },
  methods:{
    ...mapGetters(['getMyStudents']),
    ...mapActions(['setSelectedStudentAction']),
    viewStudent(student){
      this.setSelectedStudentAction(student)
      this.viewStudentModal = true
    },
    closeViewStudent(){
      this.viewStudentModal = false
    },
    viewEvaluations(){
      this.viewEvals = true
    },
    closeViewEvaluations(){
      this.viewEvals = false
    },
  },
  computed:{
    myStudents(){
      return this.getMyStudents()
    }
  }
}
</script>
<style scoped>

</style>