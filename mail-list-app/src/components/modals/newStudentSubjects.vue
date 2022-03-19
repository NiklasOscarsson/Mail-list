<template>
  <div>
    <div class="backdrop" @click.self="closeModal">
      <div class="include-box card">
        <div>
          <h3 class="title">Välj ämnen</h3>
          <ul>
            <li v-for="subject, index in subjects" :key="index">
              <input type="checkbox"><h3>{{}}</h3>
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
  },
  computed:{
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
ul{
  list-style: none;
  height: 33vh;
}
.buttons{
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 3vh;
}
</style>