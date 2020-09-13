import memory from './memory.js'
import opcodeDecoder from './opcodeDecoder.js'

class cpu {

  constructor(){
    this.RAM = memory

    this.reset()
  }

  reset(){
    // 16 8-bit registers
    this.V = new Uint8Array(16)

    this.I = new Uint16Array(1)

    // Delay and sound timer registers
    this.DELAY = new Uint8ClampedArray(1)
    this.SOUND = new Uint8ClampedArray(1)

    this.PC = new Uint16Array(1)
    this.SP = new Uint8Array(1)
    this.stack = new Uint16Array(16)

  }

  startCPUProgramOn(address){
    this.PC[0] = 0x200
    this.SP[0] = 0
  }

  configure(options){
    this.RAM.setMemorySize(options.ramSize)
  }

  flushRegisters(){
    for (let i = 0; i < this.V.length; i++){
      this.V[i] = 0x00
    }
    this.I = 0x0000
    this.DELAY = 0x00
    this.SOUND = 0x00
    this.PC = 0x0000 // ?? 入口在哪？
    this.SP = 0x00
  }

  loadFromMem(address){
    return this.RAM.loadFromMem(address)
  }

  storeToMem(address, value){
    this.RAM.storeToMem(address, value)
  }

  DMA(arr, offset){
    this.RAM.DMA(arr, offset)
  }


}


export default new cpu()
