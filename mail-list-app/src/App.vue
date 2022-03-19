<template>
  <div class="main">
    
    <allMyStudents class="all" />
    <to-do-students class="todo"/>
    <done-students class="done"/>
    <new-student class="new"/>
<!--     <button style="width: 20vw;" @click="test">test</button> -->
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
    margin-top: 3vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-template-areas: 
        "tl tr"
        "bl br"
    ;
    max-height: 100vh;
    max-width: 100vw;
    justify-items: center;
}
.main-divs{ 
    height: 45vh;
    width: 45vw;
    overflow-x: hidden;
    margin-bottom: 3vh;
}
.all{grid-area: tl;}
.todo{grid-area: tr;}
.done{grid-area: br;}
.new{grid-area: bl;}
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
@media screen and (max-width: 950px) {
    .main{
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        grid-template-areas: 
            'a'
            'b'
            'c'
            'd'
        ;
        max-height: 100vh;
    }
    .main-divs{ 
        height: 45vh;
        max-height: 60vh;
        width: 95vw;
        overflow-x: hidden;
        margin-bottom: 3vh;
    }
    .all{grid-area: a;}
    .todo{grid-area: b;}
    .done{grid-area: c;}
    .new{grid-area: d;}
}
</style>
