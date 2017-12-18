requestAnimationFrame(function () {
document.body.innerHTML = `
<game-system 
  video-width="160"
  video-height="144"
  video-scale="3"
  >
 
 

  <cpu></cpu>
  <rom size="256" src="boot.js"></rom>
  <memory-map bit="16"></memory-map>

</game-system>
`
})

document.registerElement('game-system', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: { value: function () { return create$$(this); } }
  })
})

function create$$(element) {
  powerOn(element);
  document.addEventListener('touchstart', function init() {
    //powerOn(element);
    document.removeEventListener('touchstart', init, true)
  }, true);
}

function powerOn(element) {

  var width = parseInt(element.getAttribute('video-width')) | 0,
      height = parseInt(element.getAttribute('video-height')) | 0,
      scale = parseInt(element.getAttribute('video-scale')) | 0;
      
  element.setAttribute('tabindex', '0');
  
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = (width * scale) + 'px';
  canvas.style.height = (height * scale) + 'px';
  element.appendChild(canvas);
  
  var fps = document.createElement('div');
  fps.style.position = 'fixed';
  fps.style.top = '0';
  fps.style.right = '0';
  fps.style.textAlign = 'right';
  element.appendChild(fps);

  var debug = document.createElement('div');
  debug.style.position = 'fixed';
  debug.style.top = '0';
  debug.style.left = '0';
  element.appendChild(debug);

  
  var ctx = canvas.getContext('2d'); 
  
  
  var memorySpace = new Array(0xffff);
  for (var i=0,l=memorySpace.length; i<l;++i){
    memorySpace[i] = 0;
  }
  
  
  var colors = [
   0xd8e699,  
   0xb3be47,
   0x597d3e,
   0x274531,
  ]

  HSYNC = 0x7ffe;
  VSYNC = 0x7fff;
  VRAM = 0x8000;
  CHAR = 0x8000;
  BGMAP1 = 0x9800;
  BGMAP2 = 0x9C00;
  
  SCY = 0xFF42;
  SCX = 0xFF43;
  LY = 0xFF44;
  LYC = 0xFF45;
  
  WY = 0xFF4A;
  WX = 0xFF4B;
  
  BGP = 0xFF47;

  var pixelBuffer = ctx.createImageData(width, height);
  for (var i = 0; i < width*height; ++i) {
    pixelBuffer.data[(i*4)+3] = 0xff;
  }

  var audio = new (window.AudioContext || window.webkitAudioContext)();
  var oscillator = audio.createOscillator();
  var gain = audio.createGain();
  
  oscillator.connect(gain);
  gain.connect(audio.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.value = 0;
  gain.gain.value = 0.1


  oscillator.start();

  requestAnimationFrame(function loop() {
      oscillator.frequency.value = (oscillator.frequency.value + 10) % 400;
      if (oscillator.frequency.value > 200) {
        //oscillator.stop();
      } else {
        //oscillator.start();
      }
      requestAnimationFrame(loop);
  })


  function reqListener () {
    var cb64 = (base64Values) => {
      return atob(base64Values).split('').map(function (c) { return c.charCodeAt(0); });
    };
  
    var debugMsg = (msg) => {debug.innerHTML = msg;}
  
    var l = cb64('zu1mZswNAAsDcwCDAAwADQAIER+IiQAO3Mxu5t3d2Zm7u2djbg7szN3cmZ+7uTM+');
    var r = cb64('PEK5pbmlQjw=');
    
    var size = this.responseText.length + l.length + r.length 
    console.log('boot.js: ' + size + ' bytes')
    if (size > 256) {
      console.error('boot.js too big: ' + (size - 256) + ' bytes over')
      //return;
    }
    
    for (var i = 0; i < 256; ++i) {
      memorySpace[i] = this.responseText.charCodeAt(i);
    }
    
    (new Function(
      'F',
      'I',
      'J',
      'debug',
      'dma',
      'C', 
      'm',
      'l',
      'r',
      'H',
      'V',
      '_VR',
      'B',
      'B2',
      'C',
      'Y',
      'X',
      'P',
      'K',
      'D',
      'h',
      'G',
      'T',
      'U',
      'z',
      'LY',
      'LYC',
      'WY',
      'WX',
      this.responseText)(
        (a,b) => a.forEach(b),
        (a,b) => {for(var i=0;i<a;++i){window.i=i;b(i)}},
        (a,b,c) => {for(var i=0;i<a;++i){for(var j=0;j<b;++j){window.i=i;window.j=j;c(i,j)}}},
        debugMsg,
        (address, values) => {
          for (var i = 0, l = values.length; i < l ; ++i) {
            memorySpace[address + i] = values[i]; 
          }
        },
        cb64,
        memorySpace,
        l,
        r,
        HSYNC,
        VSYNC,
        VRAM,
        BGMAP1,
        BGMAP2,
        CHAR,
        SCY,
        SCX,
        BGP,
        252,
        BGMAP1+16,
        CHAR+16,
        BGMAP1+4,
        32,
        12,
        2,
        LY,
        LYC,
        WY,
        WX,
      ));
  }

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "boot.js");
  oReq.send();
 
  memorySpace[VSYNC] = nop;
  memorySpace[HSYNC] = nop;
 
  requestAnimationFrame(function update() {
    var t0 = performance.now();
    var n = 0;
    var y = 0;
    var x = 0;

    var scx = 0;
    var scy = 0;
    var bgp = 0;
    var y1 = 0;
         
    var x1 = 0;
    var tileIndex = 0;
    var tileByteIndex = 0;
    var tileByte = 0;
    var colorIndex = 0;
    var color = 0;
    var i = 0;

  
      
    for(n = 0 ; n < 4 ; ++n) {
      for (y = 0 ; y < height ; ++y) {    

        memorySpace[LY] = y;
        
        //y == memorySpace[LYC] && memorySpace[HSYNC](); 
        memorySpace[HSYNC]();
        
        scx = memorySpace[SCX];
        scy = memorySpace[SCY];
        bgp = memorySpace[BGP];
              
        y1 = y + scy;

        for (x = 0 ; x < width ; ++x) {
          x1 = x + scx;
           
          tileIndex = memorySpace[BGMAP1 + ((x1 >> 3) & 31) + (((y1 >> 3) & 31) << 5)];
          tileByteIndex = CHAR + (tileIndex*16) + ((y1 & 7) << 1) + ((x1 >> 2) & 1);
          tileByte = memorySpace[tileByteIndex];
          colorIndex = (tileByte >> ((3 - (x1 & 3)) << 1)) & 3;
          color = colors[(bgp >> (colorIndex << 1)) & 3]
            
          i = (x + y * width) << 2;
          //clamping should remove need for masking?
          pixelBuffer.data[i+0] = (color >> 16) & 255;
          pixelBuffer.data[i+1] = (color >> 8) & 255;
          pixelBuffer.data[i+2] = (color) & 255;
          //pixelBuffer.data[i+3]= 0xff;
        }
      } 
    }
    
    memorySpace[VSYNC](); 
  

    var t1 = performance.now();
    ctx.putImageData(pixelBuffer, 0, 0);  
    var t2 = performance.now();
  
    fps.innerHTML = Math.round(t2 - t0) + 'ms<br/>' + Math.round(100*(t2 - t1)/(t2 - t0)) + '% put'
    requestAnimationFrame(update);
  }); 
}

function nop() {}






/*
CPU
  - PC-register (bit-sized index adressering)
    => Vilken storlek på memorybus som maximalt stöds
  - memory-bus (bit-sized index adressering)
    * Förutsättning för att skapa memory map
  - instructions (fetch-decode cycle)
  - Interupts

Memory Controller ?

Gated memory (VRAM)

*/







/*
CPU/CHIPS
  - instructions/code
    * Port-mapped
    * Registers/Workram => Infinite för tillfället
    * Fixed or programmable. (core, sound, video, etc.)
  - memory buses !!
  - memory (detta är ett eget chip)
    * ROM (instructions, static)
    * RAM ? Låt detta vara oändligt för tillfället, får se senare ifall det går att begränsa
    * Memory-mapped  IO
    * IRQ ?  
*/