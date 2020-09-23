

class memory {
  constructor(){
    this.RAM = new Uint8Array(4096)
    
  }
  setMemorySize(ramSize){
    this.RAM = new Uint8Array(ramSize)
    this.clearMemory()
  }

  clearMemory(){
    for (let i = 0; i < this.RAM.length; i++){
      this.RAM[i] = 0x00
    }
  }
  getMemoryChunk(address, bytes){
    return this.RAM.subarray(address, address + bytes)
  }
  loadFromMem(address){
    return this.RAM[address]
  }

  storeToMem(address, value){
    this.RAM[address] = value
  }

  DMA(arr, offset){
    this.RAM.set(arr, offset)
  }

}

export default new memory()
