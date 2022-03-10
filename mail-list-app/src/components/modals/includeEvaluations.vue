<template>
  <div>
    <div class="backdrop" @click.self="closeIncludeModal">
      <div class="include-box card">
        <div>
          <ul>
            <li v-for="evals, index in evaluations" :key="index">
              <p>{{evals[0].evaluation}}</p>
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
    ...mapGetters(["getSelectedStudent", 'getSelectedEvals']),
    ...mapActions(["setIncludedEvals"]),

    closeIncludeModal() {
      this.$emit("close");
    },

  },
  computed:{
    evaluations(){
      return this.getSelectedEvals()
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
</style>