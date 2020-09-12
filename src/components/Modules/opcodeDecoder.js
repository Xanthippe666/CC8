
function isHexString(string){
  if (!string.match(/^([0-9a-fA-F])+$/g)){
    return false
  } else {
    return true
  }
}

function isChip8Register(string){
  if (!string.match(/^([Vv][0-9a-fA-F])$/g)){
    return false
  } else {
    return true
  }
}

function tokenToOp(tokens){
  let byteCode //a string

  let instr = tokens[0]
  switch(instr.toUpperCase()){
    case 'SYS':
      if (tokens.length === 2
        && isHexString(tokens[1])){
        let addr = tokens[1].slice(0, 3)
        byteCode = '0x0' + addr
      }
      break
    case 'CLS':
      if (tokens.length === 1){
        byteCode = '0x00E0'
      }
      break
    case 'RET':
      if (tokens.length === 1){
        byteCode = '0x00EE'
      }
      break
    case 'JP':
      if (tokens.length === 2 && isHexString(tokens[1])){
        let addr = tokens[1].slice(0, 3)
        byteCode = '0x1' + addr
      }
      break

    case 'CALL':
      if (tokens.length === 2
        && isHexString(tokens[1])){
        let addr = tokens[1].slice(0, 3)
        byteCode = '0x2' + addr
      }
      break

    case 'SE':
      if (tokens.length === 3
        && isChip8Register(tokens[1])){
        if (isHexString(tokens[2])) {
          let reg = tokens[1].charAt(1)
          let imm = tokens[2].slice(0, 2)
          byteCode = '0x3' + reg + imm
        }
        else if (isChip8Register(tokens[2])){
          let reg1 = tokens[1].charAt(1)
          let reg2 = tokens[2].charAt(1)
          byteCode = '0x5' + reg1 + reg2 + '0'
        }
      }
      break

    case 'SNE':
      if (tokens.length === 3
        && isChip8Register(tokens[1])
        && isHexString(tokens[2])){
        let reg = tokens[1].charAt(1)
        let imm = tokens[2].slice(0, 2)
        byteCode = '0x4' + reg + imm
      }
      break

    case 'LD':
      if (tokens.length === 3
        && isChip8Register(tokens[1])){
        if (isHexString(tokens[2])) {
          let reg = tokens[1].charAt(1)
          let imm = tokens[2].slice(0, 2)
          byteCode = '0x6' + reg + imm
        }
        else if (isChip8Register(tokens[2])){
          let reg1 = tokens[1].charAt(1)
          let reg2 = tokens[2].charAt(1)
          byteCode = '0x8' + reg1 + reg2 + '0'
        }
      }
      break

    case 'ADD':
      if (tokens.length === 3
        && isChip8Register(tokens[1])){
        if (isHexString(tokens[2])) {
          let reg = tokens[1].charAt(1)
          let imm = tokens[2].slice(0, 2)
          byteCode = '0x7' + reg + imm
        }
        else if (isChip8Register(tokens[2])){
          let reg1 = tokens[1].charAt(1)
          let reg2 = tokens[2].charAt(1)
          byteCode = '0x8' + reg1 + reg2 + '4'
        }
      }
      break

    case 'SUB':
      if (tokens.length === 3
        && isChip8Register(tokens[1])){
        if (isHexString(tokens[2])) {
          let reg = tokens[1].charAt(1)
          let imm = tokens[2].slice(0, 2)
          byteCode = '0x7' + reg + imm
        }
        else if (isChip8Register(tokens[2])){
          let reg1 = tokens[1].charAt(1)
          let reg2 = tokens[2].charAt(1)
          byteCode = '0x8' + reg1 + reg2 + '4'
        }
      }
      break

    case 'OR':
      if (tokens.length === 3
        && isChip8Register(tokens[1])
        && isChip8Register(tokens[2])){
        let reg = tokens[1].charAt(1)
        let reg2 = tokens[2].charAt(1)
        byteCode = '0x8' + reg + reg2 + '1'
      }
      break

    case 'AND':
      if (tokens.length === 3
        && isChip8Register(tokens[1])
        && isChip8Register(tokens[2])){
        let reg = tokens[1].charAt(1)
        let reg2 = tokens[2].charAt(1)
        byteCode = '0x8' + reg + reg2 + '2'
      }
      break

    case 'XOR':
      if (tokens.length === 3
        && isChip8Register(tokens[1])
        && isChip8Register(tokens[2])){
        let reg = tokens[1].charAt(1)
        let reg2 = tokens[2].charAt(1)
        byteCode = '0x8' + reg + reg2 + '3'
      }
      break




    default:
      break
  }

  return byteCode
}


// opcodeDecoder.parse('ADD V0 13') -> 7013
const opcodeDecoder = {
  parse: function(val){
    let clean = val.replace(/\n|/i, '').replace(/\t|/i, '').replace(/,/,' ')
    let tokens = clean.replace(/\s+/, ' ').trim().split(' ')
    // tokens = ['ADD', 'V0', '13']
    return tokenToOp(tokens)
  },

}


module.exports = opcodeDecoder
