import opcodeDecoder from '../../../src/components/Modules/opcodeDecoder.js'

describe.skip('opcodeDecoder - should return the correct byte code', () => {
  it('SYS address', () => {
    let bytecode = opcodeDecoder.parse('SYS 123')
    expect(bytecode).to.equal('0x0123')
  })
  it('CLS', () => {
    let bytecode = opcodeDecoder.parse('CLS')
    expect(bytecode).to.equal('0x00E0')
  })
  it('RET', () => {
    let bytecode = opcodeDecoder.parse('RET')
    expect(bytecode).to.equal('0x00EE')
  })
  it('JP - address', () => {
    let bytecode = opcodeDecoder.parse('JP 123')
    expect(bytecode).to.equal('0x1123')
  })
 it('JP - offset address', () => {
   let bytecode = opcodeDecoder.parse('JP V0 123')
   expect(bytecode).to.equal('0xB123')
 })
  it('CALL address', () => {
    let bytecode = opcodeDecoder.parse('CALL 123')
    expect(bytecode).to.equal('0x2123')
  })
  it('SE - reg immediate', () => {
    let bytecode = opcodeDecoder.parse('SE V3 22')
    expect(bytecode).to.equal('0x3322')
  })
  it('SE - reg reg', () => {
    let bytecode = opcodeDecoder.parse('SE V3 V5')
    expect(bytecode).to.equal('0x5350')
  })
  it('SNE - reg immediate', () => {
    let bytecode = opcodeDecoder.parse('SNE V3 23')
    expect(bytecode).to.equal('0x4323')
  })
  it('SNE - reg reg', () => {
    let bytecode = opcodeDecoder.parse('SUBN V3 V5')
    expect(bytecode).to.equal('0x8357')
  })
  it('LD - reg immediate', () => {
    let bytecode = opcodeDecoder.parse('LD V3 23')
    expect(bytecode).to.equal('0x6323')
  })
  it('LD - reg reg', () => {
    let bytecode = opcodeDecoder.parse('LD V3 V5')
    expect(bytecode).to.equal('0x8350')
  })
  it('LD - I address', () => {
    let bytecode = opcodeDecoder.parse('LD I 123')
    expect(bytecode).to.equal('0xA123')
  })
  it('LD - reg DT', () => {
    let bytecode = opcodeDecoder.parse('LD V1 DT')
    expect(bytecode).to.equal('0xF107')
  })
  it('LD - reg K', () => {
    let bytecode = opcodeDecoder.parse('LD V3 K')
    expect(bytecode).to.equal('0xF30A')
  })
  it('LD - DT reg', () => {
    let bytecode = opcodeDecoder.parse('LD DT V3')
    expect(bytecode).to.equal('0xF315')
  })
  it('LD - ST reg', () => {
    let bytecode = opcodeDecoder.parse('LD ST V3')
    expect(bytecode).to.equal('0xF318')
  })
  it('LD - F reg', () => {
    let bytecode = opcodeDecoder.parse('LD F V3')
    expect(bytecode).to.equal('0xF329')
  })
  it('LD - B reg', () => {
    let bytecode = opcodeDecoder.parse('LD B V5')
    expect(bytecode).to.equal('0xF533')
  })
  it('LD - addr of I [I], reg', () => {
    let bytecode = opcodeDecoder.parse('LD [I], V1')
    expect(bytecode).to.equal('0xF155')
  })
  it('LD - reg, addr of I [I]', () => {
    let bytecode = opcodeDecoder.parse('LD V1 [I]')
    expect(bytecode).to.equal('0xF165')
  })
  it('SKNP - reg', () => {
    let bytecode = opcodeDecoder.parse('SKNP V3')
    expect(bytecode).to.equal('0xE3A1')
  })
  it('ADD - reg immediate', () => {
    let bytecode = opcodeDecoder.parse('ADD V3 23')
    expect(bytecode).to.equal('0x7323')
  })
  it('ADD - reg reg', () => {
    let bytecode = opcodeDecoder.parse('ADD V3 V5')
    expect(bytecode).to.equal('0x8354')
  })
  it('ADD - I reg', () => {
    let bytecode = opcodeDecoder.parse('ADD I V3')
    expect(bytecode).to.equal('0xF31E')
  })
  it('OR - address', () => {
    let bytecode = opcodeDecoder.parse('OR V3 V5')
    expect(bytecode).to.equal('0x8351')
  })
  it('AND - address', () => {
    let bytecode = opcodeDecoder.parse('AND V3 V5')
    expect(bytecode).to.equal('0x8352')
  })
  it('XOR - address', () => {
    let bytecode = opcodeDecoder.parse('XOR V3 V5')
    expect(bytecode).to.equal('0x8353')
  })
  it('SUB - address', () => {
    let bytecode = opcodeDecoder.parse('SUB V3 V5')
    expect(bytecode).to.equal('0x8355')
  })
  it('SHR - address', () => {
    let bytecode = opcodeDecoder.parse('SHR V3 V5')
    expect(bytecode).to.equal('0x8356')
  })
  it('SUBN - address', () => {
    let bytecode = opcodeDecoder.parse('SUBN V3 V5')
    expect(bytecode).to.equal('0x8357')
  })
  it('SHL - address', () => {
    let bytecode = opcodeDecoder.parse('SUBN V3 V5')
    expect(bytecode).to.equal('0x835E')
  })
  it('RND - reg immediate', () => {
    let bytecode = opcodeDecoder.parse('RND V3 23')
    expect(bytecode).to.equal('0xC323')
  })
  it('DRW - reg immediate', () => {
    let bytecode = opcodeDecoder.parse('DRW V3 V1 4')
    expect(bytecode).to.equal('0xD314')
  })
  it('DRW - reg reg nibble', () => {
    let bytecode = opcodeDecoder.parse('DRW V3 V1 4')
    expect(bytecode).to.equal('0xD314')
  })
  it('SKP - reg', () => {
    let bytecode = opcodeDecoder.parse('SKP V3')
    expect(bytecode).to.equal('0xE39E')
  })
  it('SKNP - reg', () => {
    let bytecode = opcodeDecoder.parse('SKNP V3')
    expect(bytecode).to.equal('0xE3A1')
  })

})
