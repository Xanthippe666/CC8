<template>
  <div id="app">
    <Chip8Debug/>
  </div>
</template>

<script>
import Chip8Debug from './components/Chip8Debug'

export default {
  name: 'App',
  components: {
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
