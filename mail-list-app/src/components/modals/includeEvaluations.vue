<template>
  <div>
    <div class="backdrop" @click.self="closeIncludeModal">
      <div class="include-box card">
        <div>
          <h3>{{subject}}</h3>
          <ul>
            <li v-for="evals, index in oldEvaluations" :key="index">
              <input type="checkbox" @change="activateEval($event, index, evals[0])" :value="evals[0].id" :checked="checked(evals[0]) ? true:false">{{evals[0].evaluation}}
            </li>
          </ul>
        </div>
        <button @click="includeSelected">press</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      include: []
    };
  },
  methods: {
    ...mapGetters(['getThisWeekEvaluation',"getSelectedStudent", 'getOldEvals', 'getWeek']),
    ...mapActions(["setIncludedEvals"]),

    closeIncludeModal() {
      this.$emit("close");
    },
    includeSelected(){
      this.setIncludedEvals(this.include)
      this.$emit('close')
    },
    activateEval($event, index, evals){
      const toChange = [index, parseInt($event.target.value), $event.target.checked ? 1:0];
      let change = false
      this.include.forEach((e, i) => {
        if(e[0]===toChange[0]) {
          this.include.splice(i,1)
          change = true
        }
      });
      if(!change){this.include.push(toChange)}
      console.log(evals.active);
      if(evals.active === 1){evals.active = 0}
      else{evals.active = 1}

    },
    checked(evals){
      return evals.active === 1
    }
  },
  computed:{
    oldEvaluations(){
      this.$forceUpdate()
      return this.getOldEvals()
    },
    ThisWeekEvaluation(){
      return this.getThisWeekEvaluation()
    },
    subject(){
      return this.getSelectedStudent().course_code
    },
  },
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