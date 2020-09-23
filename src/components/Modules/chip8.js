//chip8 系统本生

import cpu from './cpu.js'
import gpu from './gpu.js'
import audio from './audio.js'
import hexData from './hexData.js'

class chip8 {
  constructor(){
    this.cpu = cpu
    this.gpu = gpu
    this.audio = audio

    this.IO = {
      0: false, 1: false, 2: false, 3: false,
      4: false, 5: false, 6: false, 7: false,
      8: false, 9: false, A: false, B: false,
      C: false, D: false, E: false, F: false
    }

    this.map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']

  }

  configureGPU(canvasEl, options){
    // console.log(this.gpu)
    this.gpu.setCanvas(canvasEl)
    this.gpu.configure(options)
  }

  configureCPU(options){
    this.cpu.configure(options)
  }

  configureAudio(options){
    this.audio.configure(options)
  }

  // init
  initSystem(){
    this.initCPU()
    this.initGPU()
    this.initAudio()
    this.initRAM()
  }

  initCPU(){
    this.cpu.flushRegisters()
  }

  initGPU(){
    this.gpu.startGPU()
  }

  initAudio(){
    this.audio.startAudio()
  }

  initRAM(){
    this.cpu.RAM.clearMemory()
  }

  // restart
  restartSystem(){
    this.restartFlag = true
    this.restartCPU()
    this.restartGPU()
    this.restartAudio()
  }

  // load hex charset


  restartCPU(){

    this.cpu.reset()
    this.cpu.RAM.clearMemory()
    for (let i = 0; i < 16; i++){
      this.cpu.RAM.DMA(hexData[i] , i*5)
    }

  }

  restartGPU(){
    this.gpu.clearScreen()
  }

  restartAudio(){
    this.audio.flushRegisters()
    this.audio.startAudioLoop()
  }

  onWindowResize(w, h){
    this.gpu.adjustWindowSize(w, h)
  }
  // According to reference, most programs ram located at 0x200, or 512 offset
  loadProgramIntoRam(arr, offset = 512){
    this.cpu.RAM.DMA(arr, offset)
  }

  startCPUProgramOn(address){
    // this.cpu.pushStack(1)
    // this.cpu.pushStack(1)
    // this.cpu.pushStack(1)
    // console.log(this.cpu.popStack())
    //     console.log(this.cpu.popStack())
    //         console.log(this.cpu.popStack())
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

  resumeClock(){

    this.stopClock()
    this.clock = setInterval(function(){

      for (let i = 0; i < 19; i++){
        this.processOneCycle()
        if (this.stopSignal){
          this.stopSignal = false
          break
        }
      }

    }.bind(this), this.clockingInterval)
  }
  startClock(options){
    this.configClock(options)

    this.resumeClock()
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
      // let randomX = Math.floor(Math.random()*64)
      // let randomY = Math.floor(Math.random()*32)
      // let randomR = Math.floor(Math.random()*256)
      // let randomG = Math.herefloor(Math.random()*256)
      // let randomB = Math.floor(Math.random()*256)
      // this.gpu.setPixel(randomX, randomY,randomR,randomG,randomB)

      if (!this.cpu.PC[0]){
        return
      }
      // process CPU commands (if needed)
      // let fakeOpcode = 'ADD V1 V3'
      let upper = this.cpu.loadFromMem(this.cpu.PC[0])
      let lower = this.cpu.loadFromMem(this.cpu.PC[0] + 1)
      let opcode = (upper << 8) + lower

      // debug purposes
      let opcodeHexStr = Number(upper).toString(16).padStart(2, '0') + Number(lower).toString(16).padStart(2, '0')
      this.currentOpcode =
        '0x' + opcodeHexStr +
        ' ' +  this.processOpcode(opcode)  +
        '  ，  PC： ' + this.cpu.PC

      // increment PC counter
      this.cpu.PC[0] += 2 // since each instructor is 2 bytes long
  }

  processOpcode(opcode){

    // Super Chip8 instruction set
    if (opcode === 0x00FF){
      this.gpu.configure({
        xsize: 128,
        ysize: 64,
      })
      return 'HIGH'
    } else if (opcode === 0x00FE)
    {
      this.gpu.configure({
        xsize: 64,
        ysize: 32,
      })
      return 'LOW'
    }

    // normal Chip8 instruction set
    let opcodeDesc
    switch(opcode & 0xF000){
      case 0x0000:
        if (opcode === 0x00E0){
          opcodeDesc = 'CLS'

          this.gpu.clearScreen()
        } else if (opcode === 0x00EE){
          opcodeDesc = 'RET'

          this.cpu.PC[0] = this.cpu.popStack()
        } else {
          opcodeDesc = 'SYS' // <==> JP
          var {nnn, desc} = this.nnn(opcode)

          opcodeDesc += desc
          // this.cpu.PC[0] = nnn - 2
        }
        break
      case 0x1000:
        opcodeDesc = 'JP'
        var {nnn, desc} = this.nnn(opcode)
        opcodeDesc += desc

        this.cpu.PC[0] = nnn - 2
        break
      case 0x2000:
        opcodeDesc = 'CALL'
        var {nnn, desc} = this.nnn(opcode)
        opcodeDesc += desc

        this.cpu.pushStack(this.cpu.PC[0])
        this.cpu.PC[0] = nnn - 2
        break
      case 0x3000:
        opcodeDesc = 'SE'
        var {x, kk, desc} = this.xkk(opcode)
        opcodeDesc += desc

        if (this.cpu.V[x] === kk){
          this.cpu.PC[0] += 2
        }
        break
      case 0x4000:
        opcodeDesc = 'SNE'
        var {x, kk, desc} = this.xkk(opcode)
        opcodeDesc += desc

        if (this.cpu.V[x] !== kk){
          this.cpu.PC[0] += 2
        }
        break
      case 0x5000:
        opcodeDesc = 'SE'
        var {x, y, desc} = this.xy(opcode)
        opcodeDesc += desc

        if (this.cpu.V[x] === this.cpu.V[y]){
          this.cpu.PC[0] += 2
        }
        break
      case 0x6000:
        opcodeDesc = 'LD'
        var {x, kk, desc} = this.xkk(opcode)
        opcodeDesc += desc

        this.cpu.V[x] = kk
        break
      case 0x7000:
        opcodeDesc = 'ADD'
        var {x, kk, desc} = this.xkk(opcode)
        opcodeDesc += desc

        this.cpu.V[x] += kk
        break
      case 0x8000:
        var {x, y, desc} = this.xy(opcode)

        var key = opcode & 0xF
        if (key === 0){
          opcodeDesc = 'LD'

          this.cpu.V[x] = this.cpu.V[y]
        } else if (key === 1){
          opcodeDesc = 'OR'

          this.cpu.V[x] |= this.cpu.V[y]
        } else if (key === 2){
          opcodeDesc = 'AND'

          this.cpu.V[x] &= this.cpu.V[y]
        } else if (key === 3){
          opcodeDesc = 'XOR'

          this.cpu.V[x] ^= this.cpu.V[y]
        } else if (key === 4){
          opcodeDesc = 'ADD'

          if (this.cpu.V[x] + this.cpu.V[y] > 255){
            this.cpu.V[0xF] = 1
          } else {
            this.cpu.V[0xF] = 0
          }
          this.cpu.V[x] += this.cpu.V[y]
        } else if (key === 5){
          opcodeDesc = 'SUB'

          if (this.cpu.V[x] - this.cpu.V[y] > 0){
            this.cpu.V[0xF] = 1
          } else {
            this.cpu.V[0xF] = 0
          }
          this.cpu.V[x] -= this.cpu.V[y]
        } else if (key === 6){
          opcodeDesc = 'SHR'

          if (this.cpu.V[x] & 0x1 === 1){
            this.cpu.V[0xF] = 1
          } else {
            this.cpu.V[0xF] = 0
          }
          this.cpu.V[x] >>>= 1
        } else if (key === 7){
          opcodeDesc = 'SUBN'

          if (this.cpu.V[y] - this.cpu.V[x] > 0){
            this.cpu.V[0xF] = 1
          } else {
            this.cpu.V[0xF] = 0
          }
          this.cpu.V[x] = this.cpu.V[y] - this.cpu.V[x]
        } else if (key === 0xE){
          opcodeDesc = 'SHL'

          if ((this.cpu.V[x] >> 7) % 2 === 1){
            this.cpu.V[0xF] = 1
          } else {
            this.cpu.V[0xF] = 0
          }
          this.cpu.V[x] <<= 1
        }
        opcodeDesc += desc
        break
      case 0x9000:
        opcodeDesc = 'SNE'
        var {x, y, desc} = this.xy(opcode)
        opcodeDesc += desc

        if (this.cpu.V[x] !== this.cpu.V[y]){
          this.cpu.PC[0]+=2
        }

        break
      case 0xA000:
        opcodeDesc = 'LD'
        var {nnn, desc} = this.nnn(opcode)
        opcodeDesc += desc

        this.cpu.I[0] = nnn

        break
      case 0xB000:
        opcodeDesc = 'JP'
        var {nnn, desc} = this.nnn(opcode)
        opcodeDesc += desc

        this.cpu.PC[0] = nnn + this.cpu.V[0] - 2
        break
      case 0xC000:
        opcodeDesc = 'RND'
        var {x, kk, desc} = this.xkk(opcode)
        opcodeDesc += desc

        var randomByte = Math.floor(Math.random()*256)
        this.cpu.V[x] = randomByte & kk

        break
      case 0xD000:
        opcodeDesc = 'DRW'
        var {x, y, n, desc} = this.xyn(opcode)
        opcodeDesc += desc
        let xPos = this.cpu.V[x]
        let yPos = this.cpu.V[y]
        let spriteArray = this.cpu.RAM.getMemoryChunk(this.cpu.I[0], n)
        this.cpu.V[0x0f] = this.gpu.drawSprite(xPos, yPos, spriteArray)
        break
      case 0xE000:
        var {x, kk, desc} = this.xkk(opcode)

        if (kk === 0x9E){
          opcodeDesc = 'SKP'
          opcodeDesc += desc

          var key = this.map[this.cpu.V[x]]
          if (this.IO[key]){
            this.cpu.PC[0]+=2
          }
        } else if (kk === 0xA1){
          opcodeDesc = 'SKNP'
          opcodeDesc += desc

          var key = this.map[this.cpu.V[x]]
          if (!this.IO[key]){
            this.cpu.PC[0]+=2
          }
        }
        break
      case 0xF000:
        var {x, kk, desc} = this.xkk(opcode)

        if (kk === 0x07){
          opcodeDesc = 'LD'
          opcodeDesc += desc
          opcodeDesc += ' DT'

          this.cpu.V[x] = this.audio.DELAY[0]
        } else if (kk === 0x0A){
          opcodeDesc = 'LD'
          opcodeDesc += desc
          opcodeDesc += ' K'
          console.log('here')
          this.stopClock()
          this.stopSignal = true
          this.waitForKeyFlag = true
          this.waitForKeyReg = x

        } else if (kk === 0x15){
          opcodeDesc = 'LD'
          opcodeDesc += ' DT'
          opcodeDesc += desc

          this.audio.DELAY[0] = this.cpu.V[x]
        } else if (kk === 0x18){
          opcodeDesc = 'LD'
          opcodeDesc += ' ST'
          opcodeDesc += desc

          this.audio.SOUND[0] = this.cpu.V[x]
        } else if (kk === 0x1E){
          opcodeDesc = 'ADD'
          opcodeDesc += ' I'
          opcodeDesc += desc

          this.cpu.I[0] += this.cpu.V[x]
        } else if (kk === 0x29){
          opcodeDesc = 'LD'
          opcodeDesc += ' F'
          opcodeDesc += desc

          this.cpu.I[0] = 5 * this.cpu.V[x]

        } else if (kk === 0x33){
          opcodeDesc = 'LD'
          opcodeDesc += ' BCD'
          opcodeDesc += desc

         this.cpu.RAM.storeToMem(this.cpu.I[0], Math.floor(this.cpu.V[x] / 100) % 10)
         this.cpu.RAM.storeToMem(this.cpu.I[0] + 1, Math.floor(this.cpu.V[x] / 10) % 10)
         this.cpu.RAM.storeToMem(this.cpu.I[0] + 2, Math.floor(this.cpu.V[x] / 1) % 10)
          // this.cpu.RAM[this.cpu.I[0]] = (this.cpu.V[x] / 100) % 10
          // this.cpu.RAM[this.cpu.I[0] + 1] = (this.cpu.V[x] / 10) % 10
          // this.cpu.RAM[this.cpu.I[0] + 2] = (this.cpu.V[x] / 1) % 10
        } else if (kk === 0x55){
          opcodeDesc = 'LD'
          opcodeDesc += ' [I]'
          opcodeDesc += desc

          for (let i = 0; i <= x; i++){
            this.cpu.RAM.storeToMem(this.cpu.I[0] + i, this.cpu.V[i])
            // this.cpu.RAM[this.cpu.I[0] + i] = this.cpu.V[i]
          }
          // this.cpu.RAM.DMA(this.cpu.V, this.cpu.I[0])
        } else if (kk === 0x65){
          opcodeDesc = 'LD'
          opcodeDesc += desc
          opcodeDesc += ' [I]'

          // this.cpu.V = this.cpu.RAM.getMemoryChunk(this.cpu.I[0], 16)
          for (let i = 0; i <= x; i++){
            this.cpu.V[i] = this.cpu.RAM.loadFromMem(this.cpu.I[0] + i)
          }
        }

        break
    }

    return opcodeDesc
  }

  waitForKeyCallback(key){
    this.resumeClock()
    this.cpu.V[this.waitForKeyReg] = Number('0x' + key)
    this.stopSignal = false
    this.waitForKeyFlag = false
    // this.waitForKeyReg = x
  }

  // helper functions for bytecode -> opcode
  xkk(opcode){
    let regIndex = (opcode & 0x0F00) >> 8
    let byteData = (opcode & 0x00FF)
    let opcodeDesc = ' V' + regIndex + ' ' + Number(byteData).toString(16)
    return {x: regIndex, kk: byteData, desc: opcodeDesc}
  }
  xy(opcode){
    let reg1 = (opcode & 0x0F00) >> 8
    let reg2 = (opcode & 0x00F0) >> 4
    let opcodeDesc = ' V' + reg1 + ' V' + reg2
    return {x: reg1, y: reg2, desc: opcodeDesc}
  }
  nnn(opcode){
    let addr = (opcode & 0x0FFF)
    let opcodeDesc = ' $' + Number(addr).toString(16)
    return {nnn: addr, desc: opcodeDesc}
  }
  xyn(opcode){
    let reg1 = (opcode & 0x0F00) >> 8
    let reg2 = (opcode & 0x00F0) >> 4
    let nibble = (opcode & 0x000F)
    let opcodeDesc = ' V' + reg1 + ' V' + reg2 + ' nib: ' + nibble
    return {x: reg1, y: reg2, n: nibble, desc: opcodeDesc}
  }

  // debug purposes
  getCPUDebugParameters(){
    return {
      fps: Math.floor(this.gpu.fps),
      V: this.cpu.V,
      I: this.cpu.I,
      DELAY: this.audio.DELAY,
      SOUND: this.audio.SOUND,
      PC: this.cpu.PC,
      SP: this.cpu.SP,
      STACK: this.cpu.stack,
      IO: this.IO,
      RAM: {RAM: this.cpu.RAM.RAM},
    }
  }
}

export default new chip8()
