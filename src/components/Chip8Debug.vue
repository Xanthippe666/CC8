<template>
  <div id="body">


    <div id="gui">
      <canvas id="screen"></canvas>
    </div>

    <div id="ROMS">
      <label for="">test ROMS</label>
      <select v-on:change="loadROM">
        <option value="BC_test.ch8">bc test</option>
        <option value="c8_test.ch8">c8 test</option>
        <option value="KeypadTest.ch8">keypad test</option>
        <option value="test_opcode.ch8">opcode test</option>
      </select>

      <label for="">game ROMS</label>
      <select v-on:change="loadROM">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="opel">Opel</option>
        <option value="audi">Audi</option>
      </select>
    </div>

    <div id="controls">
       <p>controls</p>
       <input type="button" value="1" v-on:click="processInput">
       <input type="button" value="2" v-on:click="processInput">
       <input type="button" value="3" v-on:click="processInput">
       <input type="button" value="C" v-on:click="processInput">
       <br>
       <input type="button" value="4" v-on:click="processInput">
       <input type="button" value="5" v-on:click="processInput">
       <input type="button" value="6" v-on:click="processInput">
       <input type="button" value="D" v-on:click="processInput">
       <br>
       <input type="button" value="7" v-on:click="processInput">
       <input type="button" value="8" v-on:click="processInput">
       <input type="button" value="9" v-on:click="processInput">
       <input type="button" value="E" v-on:click="processInput">
       <br>
       <input type="button" value="A" v-on:click="processInput">
       <input type="button" value="0" v-on:click="processInput">
       <input type="button" value="B" v-on:click="processInput">
       <input type="button" value="F" v-on:click="processInput">
    </div>
    <chip8Debugger v-bind:debug="chip8InternalDebugData"
                   v-bind:commandHistory="chip8OpcodeHistory"></chip8Debugger>


  </div>
</template>

<script>
import chip8 from './Modules/chip8.js'
// import opcodeDecoder from './Modules/opcodeDecoder.js'
import fileLoader from './Modules/fileLoader.js'
import chip8Debugger from './internalDebugger'

export default {
  name: 'CLI',
  components: {
    chip8Debugger
  },
  data () {
    return {
      // visuals
      canvasScale: 1.5,

      // chip-8 emulator
      chip8: null,

      // for I/O
      地图: {
        1: '1', 2: '2',3: '3',4: 'C',
        q: '4', w: '5',e: '6',r: 'D',
        a: '7', s: '8',d: '9',f: 'E',
        z: 'A', x: '0',c: 'B',v: 'F',
      },

      // 调试
      chip8OpcodeHistory: [],
      chip8InternalDebugData: {},
    }
  },
  mounted: function(){
    this.chip8 = chip8
    this.chip8InternalDebugData = this.chip8.getCPUDebugParameters()
    const canvasEl = document.getElementById('screen')
    let winW = window.innerWidth
    let winH = window.innerHeight
    let minWin = Math.min(winW, winH)

    let canvasWidth = minWin * 0.64 * this.canvasScale
    let canvasHeight = minWin * 0.32 * this.canvasScale
    this.chip8.configureGPU(canvasEl, {
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight,
      xsize: 64,
      ysize: 32,
    })
    this.chip8.configureCPU({
      clockSpeed: 540, //Hz, meaning 540 / 60 = 9 instructions per 1/60 seconds
      ramSize: 4096, // 4kB of RAM

    })

    this.chip8.initSystem()
    this.chip8.restartSystem()

    setInterval(function(){
      let randomX = Math.floor(Math.random()*64)
      let randomY = Math.floor(Math.random()*32)
      let randomR = Math.floor(Math.random()*256)
      let randomG = Math.floor(Math.random()*256)
      let randomB = Math.floor(Math.random()*256)
      this.chip8.gpu.setPixel(randomX, randomY,randomR,randomG,randomB  )
      this.chip8.cpu.PC++
      let fakeOpcode = 'ADD V1 V3'

      // debugging
      this.updateDebuggerOneTick(fakeOpcode)
    }.bind(this), 1000 / 60)

    // 设置 输入
    window.onkeydown = this.processInputFromKeyboard

  },
  methods: {
    // load ROM I/O
    loadROM: function(e){
      fileLoader.loadROM(e, function(arr){
        this.chip8.restartSystem()
        this.chip8.loadProgramIntoRam(arr)
      }.bind(this))
    },
    // keyboard input I/O
    processInputFromKeyboard: function(e){
      let 钥匙 = e.key || e.target.value
      // console.log(typeof 钥匙)
      this.processInput(this.地图[钥匙], false)
    },
    processInput: function(e, direct = true){
      let 钥匙 = direct ? e.target.value : e

      console.log(钥匙)
       // 未完成
    },
    updateDebuggerOneTick(opcode){
      if (this.chip8OpcodeHistory.length > 100){
        this.chip8OpcodeHistory.pop()
      }
      this.chip8OpcodeHistory.unshift(opcode)

      this.chip8InternalDebugData = this.chip8.getCPUDebugParameters()
    }

  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
div#body{

  div#gui{
    position: relative;
    margin-top: 0%;
    canvas#screen{
      background-color: green;
    }
  }

  div#ROMS{
    position: relative;
  }

  div#controls{
    position: relative;
    width: 33%;
    left: 33%;
    // right: 0%;
    border: 10px solid black;
    p{
      margin: 0 0 0 0;
      color: green;
    }
    input{
      margin: 1px 1px 1px 1px;
      width: 13%;

    }
  }

}
</style>
