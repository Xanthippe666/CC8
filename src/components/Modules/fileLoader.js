function concatTypedArray(array1, array2){
  // console.log(array1, array2)
  let result = new Uint8Array(array1.length + array2.length)
  result.set(array1, 0)
  result.set(array2, array1.length)
  return result
}

// loadROM is a callback (event handler) and calls callback(program)
const fileLoader = {
  loadROM: function(e, callback = null){
    let base = './static/'
    let file
    if (e.target === undefined){
      file = base + e
    } else {
      file = base + e.target.value
    }
    console.log(file)
    var myInit = { method: 'GET',
                   headers: {
                       'Content-Type': 'application/octet-stream'
                   },
                   mode: 'cors',
                   cache: 'default' };
    var myRequest = new Request(file, myInit);
    let reader
    let program = []
    fetch(myRequest)
      .then((res) => {
        console.log(res.body)
        reader = res.body.getReader()
        return reader.read()
      })
      .then(function processText({done, value}){

        if (done){
          console.log('read complete')
          console.log(program)
          return callback(program)
        }

        program = concatTypedArray(program, value)

        return reader.read().then(processText)

      })
      .catch(console.log.bind(console))
  },
}

module.exports = fileLoader
