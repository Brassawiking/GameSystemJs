'use strict';

console.log = function (...params) { postMessage(['log', params.map(x => JSON.parse(JSON.stringify(x)))]) };

(_ => {
  let cpu
  let ppu

  onmessage = e => {
    switch (e.data[0]) {
      case 'init': {
        const config = e.data[1]
        const memoryMap = new Array(0xffff)
        for (var i = 0; i < memoryMap.length; ++i){
          memoryMap[i] = 0
        }

        cpu = process_CPU(memoryMap, config)
        ppu = process_PPU(memoryMap, config)
        self._currentFrame = 0
        break
      }
      case 'frame': {
        var t0 = performance.now()
        self._currentFrame++

        while (performance.now() - t0 < 15) {
          cpu.next()
          ppu.next()
        }
        
        break
      }
    }
  }  
})()

function* process_CPU (memoryMap, config) {
  const GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor
  const request = new XMLHttpRequest()
  request.open('GET', config.rom, false)
  request.send()
  const ROM = request.responseText

  yield // SETUP END
  yield* new GeneratorFunction(
    'memoryMap',
    'm',
    'self',
    'window',
    'document',
    `'use strict';${ROM}`
  ).call(
    {},
    memoryMap,
    memoryMap,
    {},
    {},
    {}
  )
}

function* process_PPU (memoryMap, config) {
  const width = config.width
  const height = config.height
  
  const pixelBuffer = new Uint8ClampedArray(width * height * 4)
  for (var i = 0; i < width * height; ++i) {
    pixelBuffer[(i*4)+3] = 0xff
  }
    
  var colors = [
   0xd8e699,  
   0xb3be47,
   0x597d3e,
   0x274531,
  ]

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
  
  const nop = () => {}
  memoryMap[VSYNC] = nop
  memoryMap[HSYNC] = nop
  
  yield // SETUP END
  while (true) {
    var n = 0
    var y = 0
    var x = 0

    var scx = 0
    var scy = 0
    var bgp = 0
    var y1 = 0
        
    var x1 = 0
    var tileIndex = 0
    var tileByteIndex = 0
    var tileByte = 0
    var colorIndex = 0
    var color = 0
    var i = 0

    for (n = 0 ; n < 20 ; ++n) { // Stress load
      for (y = 0 ; y < height ; ++y) {    
        memoryMap[LY] = y
        
        //y == memoryMap[LYC] && memoryMap[HSYNC](); 
        memoryMap[HSYNC]()
        yield
        
        scx = memoryMap[SCX]
        scy = memoryMap[SCY]
        bgp = memoryMap[BGP]
              
        y1 = y + scy

        for (x = 0 ; x < width ; ++x) {
          x1 = x + scx
          
          tileIndex = memoryMap[BGMAP1 + ((x1 >> 3) & 31) + (((y1 >> 3) & 31) << 5)]
          tileByteIndex = CHAR + (tileIndex*16) + ((y1 & 7) << 1) + ((x1 >> 2) & 1)
          tileByte = memoryMap[tileByteIndex]
          colorIndex = (tileByte >> ((3 - (x1 & 3)) << 1)) & 3
          color = colors[(bgp >> (colorIndex << 1)) & 3]
            
          i = (x + y * width) << 2
          //clamping should remove need for masking?
          pixelBuffer[i+0] = (color >> 16) & 255
          pixelBuffer[i+1] = (color >> 8) & 255
          pixelBuffer[i+2] = (color) & 255
          //pixelBuffer.data[i+3]= 0xff;
        }
      } 
    }
    
    memoryMap[VSYNC]()  
    postMessage(['render', pixelBuffer])
    let frame = self._currentFrame
    while (frame === self._currentFrame) {
      yield
    }
    yield
  }
}
