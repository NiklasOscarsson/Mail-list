<template>
  <div>
    <div class="backdrop" @click.self="closeModal">
      <div class="include-box card">
        <div>
          <h3 class="title">Välj ämnen</h3>
          <ul class="lista">
            <li v-for="subject, index in subjects" :key="index">
              <input type="checkbox" @change="includeSubject($event, subject.teacher_id, subject.course_code)" :checked="checked(subject.course_code) ? true:false"><h3 style="display: inline-block">{{subject.subject_name}}</h3>
            </li>
          </ul>
        </div>
        <div class="buttons">
          <button @click="addSelected">Save</button>
          <button @click="closeModal">Cancel</button>
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
    ...mapGetters(['getAllSubjects', 'getNewStudentSubjects']),
    ...mapActions(['setNewStudentSubjects']),
    closeModal(){
      this.$emit("close")
    },
    addSelected(){
      console.log(this.getAllSubjects()[0]);
      console.log(this.include);
      //setNewStudentSubjects(include)
    },
    includeSubject(e, id, code){
      this.include.push({courseCode:code, teacerId:id})
      
    },
    checked(code){
      return this.include.includes(code)
    }
  },
  computed:{
    subjects(){
      return this.getAllSubjects()
    }
  },
};

</script>

<style scoped>
.include-box {
  display: flex;
  flex-direction: column;
  background-color: bisque;
  min-height: 50vh;
  width: 60vw;
}
.lista{
  display: grid;
  grid-template-columns: 50% 50%;
  list-style: none;
  height: 33vh;
}
li{
  height: fit-content;
}
h3{
  margin: 0;
}
.buttons{
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 3vh;
}
</style>