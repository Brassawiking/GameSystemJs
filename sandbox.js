'use strict';

// Main thread
(_ => {
  'use strict';
  const memoryMap = {}  
  const cpu = process_CPU(memoryMap)
  const ppu = process_PPU(memoryMap)

  while (!cpu.next().done) {
    ppu.next()
  }
  console.log('done')
})()


// Worker(?) CPU
function* process_CPU (memoryMap) {
  'use strict';
  const GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor
  yield
  yield* new GeneratorFunction(
    'memoryMap',
    'window',
    'document',
    `'use strict';${ROM()}`
  )(
    memoryMap,
    {},
    {}
  )
}


// Worker PPU
function* process_PPU (memoryMap) {
  'use strict';
  memoryMap[10] = 0
  yield
  while (true) {
    console.log('wat')
    memoryMap[10]++
    yield
  }
}

// ROM code
function ROM () {return `
  while (memoryMap[10] < 5) {
    yield
  }
  x = 10
  console.log('WOHO!')
`}