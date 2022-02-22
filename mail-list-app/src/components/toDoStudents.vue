<template>
  <div id="students-todo" class="card main-divs">
    <h3 class="title">Elever att skriva om</h3>
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
        href="#"
        v-for="student in todoStudents"
        class="todo-link"
        :key="student.student_mail"
        @click="evaluate(student)"
      >
        <li>
          <div class="student">
            <div class="table-div">
              <h4 :title="student.student_mail.trim()">
                {{ student.first_name }} {{ student.last_name }}
              </h4>
            </div>
            <div class="table-div">
              <div v-if="!student.guardian2_first_name">
                <h4>
                  {{ subject }}
                </h4>
              </div>
            </div>
          </div>
        </li>
      </a>
    </ul>
    <evaluationModal v-if="evaluationModal" @close='closeEvaluationModal'/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import evaluationModal from './modals/evaluationModal.vue'
export default {
  components:{
    evaluationModal
  },
  data() {
    return {
      evaluationModal: false,
    };
  },
  methods: {
    ...mapActions(['setSelectedStudentAction']),
    ...mapGetters(['getTodoStudents']),
    evaluate(student) {
      this.setSelectedStudentAction(student);
      this.evaluationModal = true;
    },
    closeEvaluationModal() {
      this.evaluationModal = false;
    },
  },
  computed:{
    todoStudents(){
      return this.getTodoStudents()
    }
  },
};
</script>