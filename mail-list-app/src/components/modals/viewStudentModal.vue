<template>
  <div class="backdrop" @click.self="$emit('closeViewStudent')">
    <div class="card view-box">
      <div class="student-info">
        <h2>
          {{ viewSelectedStudent.first_name }}
          {{ viewSelectedStudent.last_name }}
        </h2>
        <h3>{{ viewSelectedStudent.class }}</h3>
      </div>
      <hr />
      <div class="guardian-info">
        <div v-for="guardian, i in viewSelectedStudent.guardians" :key="i">
          <h2>Målsman {{i+1}}:</h2>
          <h3>
            {{ guardian.firstName }}
            {{ guardian.lastName }} <br />
            {{ guardian.mail }}
          </h3>
        </div>
      </div>
      <button class="view-active-evals" @click="viewEvaluations">
        Se alla aktiva utvärderingar
      </button>
      <viewEval v-if="includeEvalModal" @close="includeEvalClose" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import viewEval from "./viewEvaluations.vue";
export default {
  components:{
    viewEval
  },
  data(){
    return {
      includeEvalModal: false
    }
  },
  methods: {
    ...mapGetters(["getSelectedStudent"]),
    viewEvaluations(){
      this.includeEvalModal = true
    },
    includeEvalClose(){
      this.includeEvalModal = false
    }
  },
  computed: {
    viewSelectedStudent() {
      return this.getSelectedStudent();
    },
  },
};
</script>

<style scoped>
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.274);
}
.view-box {
  padding: 10px;
  width: fit-content;
  height: 45vh;
  width: 50vw;
  background-color: white;
  text-align: center;
}
.guardian-info{
  display:flex;
  justify-content: space-evenly;
}
.view-active-evals{
  margin-top: 10%;
}
</style>

