const HSYNC = 0x7ffe
const VSYNC = 0x7fff
const VRAM = 0x8000
const CHAR = 0x8000
const BGMAP1 = 0x9800
const BGMAP2 = 0x9C00

const SCY = 0xFF42
const SCX = 0xFF43
const LY = 0xFF44
const LYC = 0xFF45

const WY = 0xFF4A
const WX = 0xFF4B

const BGP = 0xFF47

m[BGP]= 0b00011011 // Set palette

const tile = [
  0b11000000, 0b00000001,
  0b11000000, 0b00000001,
  0b11000000, 0b00000001,
  0b11000000, 0b00000001,
  0b11000000, 0b00000001,
  0b11000000, 0b00000001,
  0b11000000, 0b00000001,
  0b11000000, 0b00000001,
]

m[CHAR] = tile[0]
m[CHAR+1] = tile[1]
m[CHAR+2] = tile[2]
m[CHAR+3] = tile[3]
m[CHAR+4] = tile[4]
m[CHAR+5] = tile[5]
m[CHAR+6] = tile[6]
m[CHAR+7] = tile[7]
m[CHAR+8] = tile[8]
m[CHAR+9] = tile[9]
m[CHAR+10] = tile[10]
m[CHAR+11] = tile[11]
m[CHAR+12] = tile[12]
m[CHAR+13] = tile[13]
m[CHAR+14] = tile[14]
m[CHAR+15] = tile[15]

let t = 0
m[VSYNC] = () => {
  m[SCY]--
  t++
}
m[HSYNC] = () => {
  m[SCX] = Math.round(Math.sin((m[LY] + t) / 25) * 25)
}

while (true) {
  if (m[LY] >= 72 + Math.cos(t / 14) * 50) {
    m[BGP]= 0b11100100 // Set palette
  } else {
    m[BGP]= 0b00011011 // Set palette
  }
  yield
}

console.log('ROM done!')
