'use strict';

const width = 160
const height = 144
const scale = 3

const canvas = document.body.appendChild(document.createElement('canvas'))
const ctx = canvas.getContext('2d')
canvas.width = width
canvas.height = height
canvas.style.width = (width * scale) + 'px'
canvas.style.height = (height * scale) + 'px'

const fps = document.body.appendChild(document.createElement('div'))
fps.style.position = 'fixed'
fps.style.top = '0'
fps.style.right = '0'
fps.style.textAlign = 'right'

const pixelBuffer = ctx.createImageData(width, height)

const worker = new Worker('sandbox2.js')
worker.onmessage = e => {
  switch(e.data[0]) {
    case 'log':
      console.log(...e.data[1])
      break
    case 'render':
      render(e.data[1])
      break
  }
}

worker.postMessage(['init', {
  width,
  height,
  rom: 'rom.js'
}])

requestAnimationFrame(function frame () {
  worker.postMessage(['frame'])
  requestAnimationFrame(frame)
})

var prevT
function render (buffer) {
  requestAnimationFrame((t) => {
    prevT = prevT || t
    fps.innerHTML = Math.round(t - prevT) + 'ms'
    prevT = t
    for (var i = 0 ; i < pixelBuffer.data.length ; ++i) {
      pixelBuffer.data[i] = buffer[i]
    }
    ctx.putImageData(pixelBuffer, 0, 0)
  })
}