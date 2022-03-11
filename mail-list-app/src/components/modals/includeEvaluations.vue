<template>
  <div>
    <div class="backdrop" @click.self="closeIncludeModal">
      <div class="include-box card">
        <div>
          <ul>
            <li v-for="evals, index in oldEvaluations" :key="index">
              <input type="checkbox">{{evals[0].evaluation}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
    };
  },
  methods: {
    ...mapGetters(['getThisWeekEvaluation',"getSelectedStudent", 'getOldEvals', 'getWeek']),
    ...mapActions(["setIncludedEvals"]),

    closeIncludeModal() {
      this.$emit("close");
    },

  },
  computed:{
    oldEvaluations(){
      return this.getOldEvals()
    },
    ThisWeekEvaluation(){
      return this.getThisWeekEvaluation()
    }
    
  }
};
</script>

<style scoped>
.include-box {
  background-color: bisque;
  height: 50vh;
  width: 60vw;
}
ul{
  list-style: none;
}
</style>