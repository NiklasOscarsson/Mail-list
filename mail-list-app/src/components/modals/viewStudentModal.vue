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
        <div>
          <h2>Målsman 1:</h2>
          <h3>
            {{ viewSelectedStudent.guardian1_first_name }}
            {{ viewSelectedStudent.guardian1_last_name }} <br />
            {{ viewSelectedStudent.guardian1_mail }}
          </h3>
        </div>
        <div v-if="viewSelectedStudent.guardian2_first_name">
          <h2>Målsman 2:</h2>
          <h3>
            {{ viewSelectedStudent.guardian2_first_name }}
            {{ viewSelectedStudent.guardian2_last_name }} <br />
            {{ viewSelectedStudent.guardian2_mail }}
          </h3>
        </div>
      </div>
      <button class="view-active-evals" @click="viewEvaluations">
        Se alla aktiva utvärderingar
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  methods: {
    ...mapGetters(["getSelectedStudent"]),
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
}
</style>

