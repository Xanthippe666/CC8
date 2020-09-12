<template>
  <div id="body">


    <div id="gui">
      <canvas id="screen"></canvas>
    </div>

    <div id="cli">
      <div id='cliBar'>
        <label class="commandTag" for=""> >> </label>
        <input id="cliInput" type="text"
          v-on:keydown.enter="commandEnter"
          v-on:keydown.up="previousCommand"
          v-on:keydown.down="followingCommand"
          ></input>
      </div>

      <div id="history">
        <div v-for="(command, index) in commandHistory" :key="index">
          <label class="commandTag" for=""> >> </label>
          <span class="command"> {{ command }} </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import GPU from './Modules/gpu.js'
import opcodeDecoder from './Modules/opcodeDecoder.js'

export default {
  name: 'CLI',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      text: 'before',
      commandHistory: ['asdf', 'b',],
      historyIndex: 0,
      canvasScale: 1.5,
    }
  },
  mounted: function(){

    const canvasEl = document.getElementById('screen')
    let winW = window.innerWidth
    let winH = window.innerHeight
    let minWin = Math.min(winW, winH)

    let canvasWidth = minWin * 0.64 * this.canvasScale
    let canvasHeight = minWin * 0.32 * this.canvasScale
    GPU.configure(canvasEl, {
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight,
      xsize: 64,
      ysize: 32,
    })
    GPU.startGPU()
    // example
    GPU.setPixel(1, 1, 255, 0, 0)
    GPU.setPixel(15, 15, 255, 255, 0)
    GPU.setPixel(3, 3, 255, 0, 0)
    GPU.setPixel(63, 31, 255, 0, 0)

    setInterval(function(){
      let randomX = Math.floor(Math.random()*64)
      let randomY = Math.floor(Math.random()*32)
      let randomR = Math.floor(Math.random()*256)
      let randomG = Math.floor(Math.random()*256)
      let randomB = Math.floor(Math.random()*256)
      GPU.setPixel(randomX, randomY,randomR,randomG,randomB  )
    }.bind(this), 1000 / 60)
  },
  methods: {
    previousCommand: function(event){
      if (this.commandHistory.length === 0){
        return
      }
      let index = (this.commandHistory.length - 1) === this.historyIndex ?
        this.historyIndex : ++this.historyIndex

      event.target.value = this.commandHistory[index]

    },
    followingCommand: function(event){
      if (this.commandHistory.length === 0){
        return
      }
      let index = 0 === this.historyIndex ?
        this.historyIndex : --this.historyIndex

      event.target.value = this.commandHistory[index]

    },
    commandEnter: function(event){
      // console.log(event.target.value)

      if(event.target.value === '') return
      let value = event.target.value
      if (this.commandHistory.length > 10){
        this.commandHistory.pop()
      }
      let opcode = opcodeDecoder.parse(value)
      this.commandHistory.unshift(value + '  --》  ' + opcode)
      event.target.value = '' // clear it
    },


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
div#body{
  @debugBorder: 0;//0.2cm groove orange;
  @cliWidth: 55%;

  div#gui{
    position: relative;
    margin-top: 0%;
    canvas#screen{
      width: 50%;
      height: 50%;
      background-color: green;
    }
  }

  div#cli{
    position:relative;
    margin-top: 0%;
    border: @debugBorder;
    div#cliBar{
      position: relative;
      border: @debugBorder;
      width: @cliWidth;
      .commandTag{
        position: relative;
        // border: @debugBorder;
        color: green;
      }
      input#cliInput{
        background-color: skyblue;
        position: relative;
        border: @debugBorder;
        @media screen and (max-width: 399px){
          font-size: 8px;
          width: 50%;
        }
        @media screen and (min-width: 400px) and (max-width: 599px){
          font-size: 13px;
          width: 60%;
        }
        @media screen and (min-width: 600px){
          font-size: 20px;
          width: 80%;
        }

      }
    }


    #history{
      position: relative;
      margin: 0 0 0 0;
      border: @debugBorder;
      width: @cliWidth;
                  // margin-left: 10%;
      text-align: left;
      div{
        position:relative;
        .command{
        }
        .commandTag{
          color: blue;
        }
      }
    }


  }



}
</style>
