<template>
  <div>
    <div class="backdrop" @click.self="closeIncludeModal">
      <div class="include-box card">
        <div>

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
    ...mapGetters(["getSelectedStudent"]),
    ...mapActions(["setIncludedEvals"]),

    closeIncludeModal() {
      this.$emit("close");
    },

  },
  computed:{
    
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