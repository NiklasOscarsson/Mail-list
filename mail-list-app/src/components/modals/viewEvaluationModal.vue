<template>
  <div>
    <div class="backdrop" @click.self="closeEvaluationModal">
      <div class="evaluation-box card">
        <div class="studentText">
          <div>
            <h1>
              {{ evaluatingStudent.student.first_name }}
              {{ evaluatingStudent.student.last_name }}
            </h1>
            <h3>{{ evaluatingStudent.subject_name }}</h3>
          </div>
          <button id="include" @click="includeEvalOpen">
            <p>inkludera tidigare utverderingar</p>
          </button>
        </div>
        <textarea
          name=""
          id=""
          cols=""
          rows=""
          v-model="evaluation"
          maxlength="500"
        ></textarea>
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
    <includeEval v-if="includeEvalModal" @close="includeEvalClose" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import includeEval from "./includeEvaluations.vue";
export default {
  components: { includeEval },
  data() {
    return {
      includeEvalModal: false,
      evaluationText: "",
      evalWarning: false,
      evaluation: this.getSelectedStudent()
        .evaluations.find((e) => e.week === this.getWeek())
        .evaluation.trim(),
    };
  },
  methods: {
    ...mapGetters([
      "getSelectedStudent",
      "getIncludedEvals",
      "getUserId",
      "getWeek",
    ]),
    ...mapActions(["updateEvaluationAction"]),
    saveEvaluationModal() {
      if (this.evaluation === "") {
        this.evalWarning = true;
        setTimeout(() => {
          this.evalWarning = false;
        }, 3000);
      } else {
        this.updateEvaluationAction([
          this.evaluation,
          this.getSelectedStudent(),
          this.activeEvaluation.id,
          this.getIncludedEvals(),
        ]);
      }
    },
    closeEvaluationModal() {
      this.$emit("close");
    },
    includeEvalOpen() {
      console.log(this.includeEvalModal);
      this.includeEvalModal = true;
    },
    includeEvalClose() {
      this.includeEvalModal = false;
    },
  },
  computed: {
    evaluatingStudent() {
      return this.getSelectedStudent();
    },
    subject() {
      return true;
    },
    activeEvaluation() {
      return this.getSelectedStudent().evaluations.find(
        (e) => e.week === this.getWeek()
      );
    },
    onlyEvaluation() {
      return this.activeEvaluation.evaluation.trim();
    },
  },
};
</script>

<style scoped>
.evaluation-box {
  background-color: white;
}
.studentText {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
}
#include {
  height: 80%;
  align-self: center;
}
textarea {
  height: 40vh;
  width: 70vw;
  font-size: 1.5rem;
  resize: none;
}
.button-div {
  height: 4vh;
  width: 80%;
  margin: auto;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
#evalWarning {
  position: absolute;
  top: 50vh;
  left: 50%;
  transform: translateX(-50%);
  color: red;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}
</style>