<template>
  <div id="app">
    <!-- <Chip8GUI/> -->
    <!-- <Chip8CLI/> -->
    <Chip8Debug/>
  </div>
</template>

<script>
import Chip8GUI from './components/Chip8GUI'
import Chip8CLI from './components/Chip8CLI'
import Chip8Debug from './components/Chip8Debug'

export default {
  name: 'App',
  components: {
    Chip8GUI,
    Chip8CLI,
    Chip8Debug,
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
