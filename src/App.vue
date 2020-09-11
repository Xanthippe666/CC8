<template>
  <div id="app">
    <!-- <Chip8GUI/> -->
    <Chip8CLI/>
  </div>
</template>

<script>
import Chip8GUI from './components/Chip8GUI'
import Chip8CLI from './components/Chip8CLI'

export default {
  name: 'App',
  components: {
    Chip8GUI,
    Chip8CLI
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
