<template>
  <div>
    <div class="backdrop" @click.self="closeIncludeModal">
      <div class="include-box card">
        <div class="title">
            <h3>{{student.first_name}} {{student.last_name}}</h3>
            <p>{{student.class}}</p>
            <hr>
          </div>
        <div class="subjects">
          <ul>
            <div class="ämne" v-for="sub in subjects" :key="sub.subject_name">
              <h2>{{sub.subject_name}}</h2>
              <div v-for="evals, index in allEvaluations" :key="index">
                <li v-if="evals.active === 1 && evals.course_code === sub.course_code">
                  <p> {{evals.evaluation}} </p>
                </li>
              </div>
            </div>
          </ul>
        </div>
        <div class="buttons">
          <button @click="closeIncludeModal">Back</button>
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
      include: []
    };
  },
  methods: {
    ...mapGetters(['getThisWeekEvaluation',"getSelectedStudent", 'getWeek']),
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
    student(){
      return this.getSelectedStudent()
    },
    allEvaluations(){
      return this.getSelectedStudent().evaluations
    },
    subjects(){
      return this.getSelectedStudent().subjects
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
  min-height: 60vh;
  width: 60vw;
}
.title{
  height: 10vh;
}
.subjects{
  overflow-x: hidden;
  max-height: 50vh;
  width: 50%;
  margin: auto;
}
ul{
  text-align: start;

}
.buttons{
  height: 5vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

}
</style>