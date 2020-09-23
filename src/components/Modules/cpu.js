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

    this.PC = new Uint16Array(1)
    this.SP = new Uint8Array(1)
    this.stack = new Uint16Array(16)

  }
  popStack(){
    if (this.SP[0] <= 0){
      return Error('cannot pop stack with no elements')
    }
    this.SP[0]--
    return this.stack[this.SP[0]]
  }
  pushStack(val){
    if (this.SP[0] >= this.stack.length - 1){
      return Error('cannot push stack with full stack')
    }
    this.stack[this.SP[0]] = val & 0xFFFF
    this.SP[0]++
  }

  startCPUProgramOn(address){
    this.PC[0] = address
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
    // this.DELAY = 0x00
    // this.SOUND = 0x00
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
