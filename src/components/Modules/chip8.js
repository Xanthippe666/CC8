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

  // According to reference, most programs ram located at 0x200, or 512 offset
  loadProgramIntoRam(arr, offset = 512){
    this.cpu.RAM.DMA(arr, offset)
  }



  // debug purposes
  getCPUDebugParameters(){
    return {
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
