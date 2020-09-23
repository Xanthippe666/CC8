

class audio{
  constructor(){
    // Delay and sound timer registers
    this.DELAY = new Uint8ClampedArray(1)
    this.SOUND = new Uint8ClampedArray(1)


    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.vol =  0;
    this.frequency = 520 // Hz
  }

  startAudio(){
    this.oscillator = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();

    this.oscillator.type = 'sine'; //sine, sawtooth, square, triangle, custom
    this.oscillator.frequency.value = this.frequency;
    this.oscillator.start();

    this.gainNode.gain.value = this.vol;
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination)
  }

  updateAudio(){
    this.oscillator.frequency.value = this.frequency;
    this.gainNode.gain.value = this.vol;
  }
  flushRegisters(){

    this.DELAY[0] = 0x00
    this.SOUND[0] = 0x00

  }

  configure(options){
    this.frequency = options.frequency
    this.clockingInterval = options.clockingInterval
  }

  startAudioLoop(){
    if(this.timer){
      clearInterval(this.timer)
    }
    // 60Hz the counter will decrement
    this.timer = setInterval(function(){
      this.SOUND[0]--
      this.DELAY[0]--

      this.updateAudio()
      // this.frequency++
      if (this.SOUND[0] === 0){
        this.vol = 0
      } else {
        this.vol = 0.5
      }
    }.bind(this), this.clockingInterval )/// 60)
  }

}


export default new audio()
