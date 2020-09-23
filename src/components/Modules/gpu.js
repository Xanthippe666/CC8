class gpu {

  adjustWindowSize(width, height){
    this.canvas.width = Math.ceil(width)
    this.canvas.height = Math.ceil(height)
  }

  constructor(){
    this.blankColor = [0, 0, 0, 255]
    this.fillColor = [0, 255, 0, 255]

  }

  setCanvas(canvas){
    this.canvas = canvas
  }
  configure(options){
    // this.canvas.width = Math.ceil(options.canvasWidth)
    // this.canvas.height = Math.ceil(options.canvasHeight)

    this.oldTime = 0
    this.xsize = options.xsize //size is in absolute pixels
    this.ysize = options.ysize
    this.vram = new Uint8ClampedArray(this.xsize * this.ysize) // Just the monochrome data of the vram
    this.clearRam = new Uint8ClampedArray(this.xsize * this.ysize)
    // this.vramSize = this.xsize * this.ysize * 4
    // console.log(this.vramSize)

    this.ctx = this.canvas.getContext('2d')
    // this.ctx.globalCompositeOperation = 'sourcein';
    this._layerOne = this.ctx.createImageData(this.xsize, this.ysize)
    this.clearScreen()

  }

  // spriteArray
  drawSprite(x, y, spriteArray){
    let collision = 0
    let startIndex = this.xsize * y

    for (let i = 0; i < spriteArray.length; i++){
      let row = spriteArray[i]
      for (let j = 0; j < 8; j++){
        let pixel = ((row >> (7-j)) & 0b1)
        let screenIndex = startIndex +  ((x + j) % this.xsize)
        // let screenIndex = (x + j) % this.xsize + this.xsize * (y + i)

        if (collision === 0 && (this.vram[screenIndex] & pixel)){
          collision = 1
        }
        this.vram[screenIndex] ^= pixel

      }
      startIndex += this.xsize
      // this.vram[(x + 0) % this.xsize + this.xsize * (y + i)] ^= ((row >> 7) & 0b1)
      // this.vram[(x + 1) % this.xsize + this.xsize * (y + i)] ^= ((row >> 6) & 0b1)
      // this.vram[(x + 2) % this.xsize + this.xsize * (y + i)] ^= ((row >> 5) & 0b1)
      // this.vram[(x + 3) % this.xsize + this.xsize * (y + i)] ^= ((row >> 4) & 0b1)
      // this.vram[(x + 4) % this.xsize + this.xsize * (y + i)] ^= ((row >> 3) & 0b1)
      // this.vram[(x + 5) % this.xsize + this.xsize * (y + i)] ^= ((row >> 2) & 0b1)
      // this.vram[(x + 6) % this.xsize + this.xsize * (y + i)] ^= ((row >> 1) & 0b1)
      // this.vram[(x + 7) % this.xsize + this.xsize * (y + i)] ^= ((row >> 0) & 0b1)
    }
    return collision
  }

  // vram binary data (monochrome) to image
  copyVramToImage(){

    for (let i = 0; i < this.vram.length; i++){
      if (this.vram[i] === 0){
        this._layerOne.data.set(this.blankColor, i << 2)
      } else {
        this._layerOne.data.set(this.fillColor, i << 2)
      }
    }


  }


  clearScreen(){
    this.vram.set(this.clearRam)
    // this.copyVramToImage()
  }

  // this._layerOne (a VRAM) -->  bitmap --> renderedImage
  render(timestamp){
    // for (let i = 0; i < this.vramSize; i += 4){
    //   this._layerOne.data[i + 0] = this.vram[i + 0]
    //   this._layerOne.data[i + 1] = this.vram[i + 1]
    //   this._layerOne.data[i + 2] = this.vram[i + 2]
    //   this._layerOne.data[i + 3] = 255
    // }

    // let that = this
    // console.log(timestamp)
    // console.log(1000/(timestamp - this.oldTime))
    this.fps = 1000/(timestamp - this.oldTime)
    this.oldTime = timestamp

    this.copyVramToImage()

    Promise.all([
      createImageBitmap(this._layerOne, {
        resizeQuality: 'pixelated',
        colorSpaceConversion: 'none',
        premultiplyAlpha: 'premultiply',
        resizeWidth: this.canvas.width,
        resizeHeight: this.canvas.height,
      })
    ]).then(function(bitmaps){
      // this.ctx.putImageData(this._imageData, 0, 0)

      this.ctx.drawImage(bitmaps[0], 0, 0)

      requestAnimationFrame(this.render.bind(this))
    }.bind(this))

  }

  startGPU(){
    requestAnimationFrame(this.render.bind(this))
  }

  // R, G, B are uint8 typed
  // x, y are absolute typed
  setPixel(x, y, R, G, B, layerNumber = 0){
      let layerData
      if (layerNumber === 0){
        layerData = this._layerOne.data
      }

      let index = (x  + y *this.xsize) * 4
      layerData[index + 0] = R
      layerData[index + 1] = G
      layerData[index + 2] = B
      layerData[index + 3] = 255
  }

}

export default new gpu()
// module.exports = gpu
