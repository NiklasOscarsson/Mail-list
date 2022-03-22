<template>
  <div class="backdrop-local">
    <div class="card styling">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
  .backdrop-local{
    background-color: rgba(0, 0, 0, 0.411);
  }
  .styling{
    height: 60%;
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    color: red
  }
</style>

