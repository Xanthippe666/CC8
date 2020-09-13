//chip8 系统本生

import cpu from './cpu.js'
import gpu from './gpu.js'

class chip8 {
  constructor(){
    this.cpu = cpu
    this.gpu = gpu
  }

  configureGPU(canvasEl, options){
    // console.log(this.gpu)
    this.gpu.configure(canvasEl, options)
  }

  configureCPU(options){
    this.cpu.configure(options)
  }

  // init
  initSystem(){
    this.initCPU()
    this.initGPU()
    this.initRAM()
  }

  initCPU(){
    this.cpu.flushRegisters()
  }

  initGPU(){
    this.gpu.startGPU()
  }

  initRAM(){
    this.cpu.RAM.clearMemory()
  }

  // restart
  restartSystem(){
    this.restartCPU()
    this.restartGPU()
  }
  restartCPU(){
    this.cpu.reset()
    this.cpu.RAM.clearMemory()
  }

  restartGPU(){
    this.gpu.clearScreen()
  }

  onWindowResize(w, h){
    this.gpu.adjustWindowSize(w, h)
  }
  // According to reference, most programs ram located at 0x200, or 512 offset
  loadProgramIntoRam(arr, offset = 512){
    this.cpu.RAM.DMA(arr, offset)
  }

  startCPUProgramOn(address){
    this.cpu.startCPUProgramOn(address)
  }

  stopClock(){
    if (this.clock){
      clearInterval(this.clock)
    }
  }

  configClock(options){
    this.debug = options.debug
    this.clockingInterval = options.clockingInterval
    this.updateDebuggerOneTick = options.updateDebuggerOneTick
  }

  startClock(options){
    this.configClock(options)
    let {debug, clockingInterval, updateDebuggerOneTick} = options

    this.stopClock()

    this.clock = setInterval(function(){

      this.processOneCycle()

    }.bind(this), clockingInterval)
  }

  processOneCycle(){
    this.tickOneClockCycle()
    // debugging
    if (this.debug){
      this.updateDebuggerOneTick()
    }
  }
  tickOneClockCycle(){
      // process Gpu commands (if needed)
      let randomX = Math.floor(Math.random()*64)
      let randomY = Math.floor(Math.random()*32)
      let randomR = Math.floor(Math.random()*256)
      let randomG = Math.floor(Math.random()*256)
      let randomB = Math.floor(Math.random()*256)
      this.gpu.setPixel(randomX, randomY,randomR,randomG,randomB)
      if (!this.cpu.PC[0]){
        return
      }
      // process CPU commands (if needed)
      // let fakeOpcode = 'ADD V1 V3'
      let upper = this.cpu.loadFromMem(this.cpu.PC[0])
      let lower = this.cpu.loadFromMem(this.cpu.PC[0] + 1)
      let opcode = (upper << 4) + lower
      // this.processOpcode(opcode)

      // debug purposes
      let opcodeHexStr = Number(upper).toString(16).padStart(2, '0') + Number(lower).toString(16).padStart(2, '0')
      this.currentOpcode =
        '0x' + opcodeHexStr +
        ' opcode -> ' +  this.processOpcode(opcode)  +
        '   PC -> ' + this.cpu.PC

      // increment PC counter
      this.cpu.PC[0] += 2 // since each instructor is 2 bytes long
  }

  processOpcode(opcode){
    console.log(opcode)
    switch(opcode){
      case 'asdf':
        break
      case 'asdf':
        break
    }

    return ' '
  }





  // debug purposes
  getCPUDebugParameters(){
    return {
      fps: Math.floor(this.gpu.fps),
      V: this.cpu.V,
      I: this.cpu.I,
      DELAY: this.cpu.DELAY,
      SOUND: this.cpu.SOUND,
      PC: this.cpu.PC,
      SP: this.cpu.SP,
      STACK: this.cpu.stack,
      RAM: this.cpu.RAM
    }
  }
}

export default new chip8()
