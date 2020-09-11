<template>
  <div>
    <canvas id="screen"></canvas>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      text: 'before',
    }
  },
  mounted: function(){
    this.text = require('./Modules/fileLoader.js')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas#screen{
  width: 40%;
  height: 20%;
  background-color: green;
  position:relative;
  margin-left: -40%;
}
</style>
