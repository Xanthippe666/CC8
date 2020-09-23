<template>
  <div id="body">


    <div id="gui">
      <canvas id="screen"></canvas>
    </div>

    <div id="ROMS">
      <label for="">test ROMS</label>
      <select v-on:change="loadROM">
        <option value="testRoms/BC_test.ch8">bc test</option>
        <option value="testRoms/c8_test.ch8">c8 test</option>
        <option value="testRoms/KeypadTest.ch8">keypad test</option>
        <option value="testRoms/test_opcode.ch8">opcode test</option>
      </select>

      <label for="">game ROMS</label>
      <select v-on:change="loadROM">
        <option value="gameRoms/Space Invaders.ch8">Space Invaders</option>
        <option value="gameRoms/Blitz.ch8">Blitz</option>
        <option value="gameRoms/Breakout.ch8">Breakout</option>
        <option value="gameRoms/Brix.ch8">Brix</option>
        <option value="gameRoms/Connect4.ch8">Connect4</option>
        <option value="gameRoms/Flightrunner.ch8">Flightrunner</option>
        <option value="gameRoms/Hidden.ch8">Hidden</option>
        <option value="gameRoms/Merlin.ch8">Merlin</option>
        <option value="gameRoms/Missile.ch8">Missile</option>
        <option value="gameRoms/Outlaw.ch8">Outlaw</option>
        <option value="gameRoms/Pong.ch8">Pong</option>
        <option value="gameRoms/Tank.ch8">Tank</option>
        <option value="gameRoms/TicTac.ch8">TicTac</option>
        <option value="gameRoms/UFO.ch8">UFO</option>
        <option value="gameRoms/Vers.ch8">Vers</option>

        <option value="gameRoms/1dcell.ch8">1dcell</option>
        <option value="gameRoms/8ceattourny_d1.ch8">8ceattourny_d1</option>

        <option value="gameRoms/blackrainbow.ch8">blackrainbow </option>

        <option value="gameRoms/snake.ch8">snake </option>

        <option value="gameRoms/trucksimul8or.ch8">trucksimul8or </option>

        <option value="gameRoms/supersquare.ch8">supersquare </option>

        <option value="gameRoms/Tetris.ch8">tetris </option>
      </select>

       <br><br>
       <label for="">scale</label>
      <input type="range" v-model="canvasScale" value="80"
            v-on:change="processWindowAdjust">{{canvasScale/100}}

            <label for="">game speed</label>
      fast<input type="range" v-model="gameSpeed" value="80"
            v-on:change="processGameSpeedAdjust">slow

     <input type="button" value="oneCycle" v-on:click="oneCycle">
      <input type="button" value="continue" v-on:click="startEmulation">
      <input type="button" value="pause" v-on:click="stopEmulation">
      <input type="button" value="restart" v-on:click="restartEmulation">
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
      canvasScale: 80, // default out of 100
      screenX: 64, // default
      screenY: 32, // default

      // chip-8 emulator
      chip8: null,
      clock: null,
      gameSpeed: 30, // default

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


    this.chip8.configureGPU(canvasEl, {
      xsize: 64,
      ysize: 32,
    })
    this.chip8.configureCPU({
      clockSpeed: 540, //Hz, meaning 540 / 60 = 9 instructions per 1/60 seconds
      ramSize: 4096, // 4kB of RAM
    })
    this.chip8.configureAudio({
      frequency: 540,
      clockingInterval: 1000 / 60,
    })
    this.chip8.initSystem()

    this.chip8.configClock({
      debug: true,
      clockingInterval: this.gameSpeed,
      updateDebuggerOneTick: this.updateDebuggerOneTick.bind(this),
    })

    // 设置 输入
    window.onkeydown = this.processInputFromKeyboardKeyDown
    window.onkeyup = this.processInputFromKeyboardKeyUp
    window.onresize = this.processWindowAdjust
    this.processWindowAdjust()

    // Load the default game ROM
    this.loadROM('gameRoms/Pong.ch8')
  },
  methods: {
    // load ROM I/O
    loadROM: function(e){
      this.currentROM = e
      fileLoader.loadROM(e, (arr) => {
        // restart the system but keep the GPU running
        const canvasEl = document.getElementById('screen')
        this.chip8.configureGPU(canvasEl, {
          xsize: 64,
          ysize: 32,
        })
        this.chip8.restartSystem()
        this.chip8.loadProgramIntoRam(arr, 0x200)
        this.clearDebugInfo()

        // where to start program
        this.chip8.startCPUProgramOn(0x200)

        // this.stopEmulation()
        this.startEmulation()

      })
    },
    oneCycle: function(){
      this.chip8.processOneCycle()
    },
    restartEmulation: function(){
      if (!this.currentROM){
        alert('先选个游戏硬盘')
      } else {
        this.loadROM(this.currentROM)
      }
    },
    stopEmulation: function(){
      this.chip8.stopClock()
    },
    startEmulation: function(){
      this.chip8.stopClock()
      this.chip8.resumeClock()
    },
    clearDebugInfo: function(){
      // 调试
      this.chip8OpcodeHistory =  []
      this.chip8InternalDebugData =  {}
    },
    // keyboard input I/O
    processInputFromKeyboardKeyDown: function(e){
      // flag to cpu of keypress
      this.chip8.keyPressedFlag = true
      let 钥匙 = e.key || e.target.value
      if (this.地图[钥匙]){
        let btn = this.地图[钥匙]
        this.chip8.keyPressed = btn
        this.processInput(btn, true, false)
      }
    },
    processInputFromKeyboardKeyUp: function(e){
      this.chip8.keyPressedFlag = false
      let 钥匙 = e.key || e.target.value
      if (this.地图[钥匙]){
        let btn = this.地图[钥匙]
        this.chip8.keyPressed = btn
        this.processInput(btn, false, false)
      }
    },
    processInput: function(e, press, direct = true){
      let 钥匙 = direct ? e.target.value : e

      console.log(钥匙)
      // 未完成

      this.chip8.IO[钥匙] = press
      console.log(this.chip8.IO[钥匙])

      if(this.chip8.waitForKeyFlag){
        console.log('callback')
        this.chip8.waitForKeyCallback(钥匙)
      }
    },
    updateDebuggerOneTick(opcode){
      if (this.chip8OpcodeHistory.length > 100){
        this.chip8OpcodeHistory.pop()
      }
      this.chip8OpcodeHistory.unshift(this.chip8.currentOpcode)

      this.chip8InternalDebugData = this.chip8.getCPUDebugParameters()
    },
    processGameSpeedAdjust: function(e){
      this.chip8.configClock({
        debug: true,
        clockingInterval: this.gameSpeed,  // 1000 / 60
        updateDebuggerOneTick: this.updateDebuggerOneTick.bind(this),
      })
      this.startEmulation()
    },
    processWindowAdjust: function(e){
      this.screenX = this.chip8.gpu.xsize
      this.screenY = this.chip8.gpu.ysize

      // let winW = window.innerWidth
      // let winH = window.innerHeight
      let minWin = window.innerWidth // Math.sqrt(winW*winH)

      let canvasWidth = minWin * this.canvasScale / 100
      let canvasHeight = minWin * this.screenY /this.screenX * this.canvasScale / 100
      // console.log(canvasWidth, canvasHeight)
      this.chip8.onWindowResize(canvasWidth, canvasHeight)
      return {canvasWidth: canvasWidth, canvasHeight: canvasHeight}
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
    select{
      font-size: 20px;
    }
    input{
      font-size: 20px;
    }
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
