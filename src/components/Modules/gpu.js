class gpu {

  configure(canvas, options){
    this.canvas = canvas
    this.canvas.width = Math.ceil(options.canvasWidth)
    this.canvas.height = Math.ceil(options.canvasHeight)

    this.xsize = options.xsize //size is in absolute pixels
    this.ysize = options.ysize
    // this.vram = new Uint8ClampedArray(xsize * ysize * 4)
    this.vramSize = this.xsize * this.ysize * 4
    // console.log(this.vramSize)

    this.ctx = this.canvas.getContext('2d')
    // this.ctx.globalCompositeOperation = 'sourcein';
    this._layerOne = this.ctx.createImageData(this.xsize, this.ysize)
    this.clearScreen()

  }

  clearScreen(){
    for (let i = 0 ; i < this._layerOne.data.length; i += 4){
      this._layerOne.data[i + 0] = 0
      this._layerOne.data[i + 1] = 0
      this._layerOne.data[i + 2] = 0
      this._layerOne.data[i + 3] = 255
    }
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

      this.ctx.save()
      this.ctx.fillStyle = '#ff6';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore()

      this.ctx.drawImage(bitmaps[0], 0, 0)
      this._layerOne.data[32]++
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
