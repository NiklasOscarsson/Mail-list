<template>
  <div class="main">
    
    <allMyStudents />
    <to-do-students />
    <done-students />
    <new-student />
    <button style="width: 20vw;" @click="test">test</button>
  </div>
</template>

<script>
import allMyStudents from "./components/allMyStudents.vue";
import toDoStudents from "./components/toDoStudents.vue";
import doneStudents from "./components/doneStudents.vue";
import newStudent from "./components/newStudent.vue";

export default {
  name: "App",
  components: {
    allMyStudents,
    toDoStudents,
    doneStudents,
    newStudent,
  },
  methods: {
    test(){
        console.log(this.$store.state.user);
    }
  },
};
</script>

<style>
@import url('./assets/framework/popcorn.css');
/* Admin nav */
#adminNav{
    position: fixed;
    left:0;
    top: 0;
    height: 100vh;
    width: 12%;
    min-width: 150px;
    color: transparent;
    transform: translateX(-85%);
    transition: .7s;
    background-color: gray;
}
#adminNav:hover{
    transform: translateX(0);
    color: black;
}
#adminLinks{
    padding: 10%;
}

/* Main */
.main{
    margin: 3vh 3% 0 3%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
}
.main-divs{ 
    width: 40vw;
    min-height: 40vh;
    margin-bottom: 5%;
    min-width: 420px;
}
.title{
    text-align: center;
    padding-top: 1rem;
}
.table-titles{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}
.student-list{
    padding: 0;
    list-style: none;
    margin-top: .5rem;
}
.student{
    display: flex;
    justify-content: space-evenly;
    width: 100%;
}
.table-div{
    width: 30%;
}
h4{ 
    margin-top: .5rem;
    margin-bottom: .5rem;
}
</style>
