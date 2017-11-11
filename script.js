document.registerElement('game-system', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: { value: function () { return create$$(this); } }
  })
})

function create$$(element) {
  var width = 256 | 0,
      height = 256 | 0,
      scale = 2;
 
 
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
  element.appendChild(fps);

  var debug = document.createElement('div');
  debug.style.position = 'fixed';
  debug.style.top = '0';
  debug.style.left = '0';
  element.appendChild(debug);

  
  var ctx = canvas.getContext('2d'); 

 
  var palette = [
    0x777777,
    0xff0000,
    0x00ff00,
    0x0000ff,
  ]
  
  var tile1 = [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
 ];

  var tile2 = [
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
 ];

  var tile3 = [
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
];

  
  var tiles = [
    tile1,
    tile2,
    tile3,
  ]; 

  var vram = new Array(32*32);
  for (var i = 0 ; i < vram.length ; ++i) {
    vram[i] = i % (tiles.length - 1);
  }
 
 
  //vram[0] = 2;
  vram[32*32 - 1] = 2;
  
  var pixelBuffer = ctx.createImageData(width, height);
  var c = 0;
  var dt = 0;
  requestAnimationFrame(function update() {
    var t1 = performance.now();
    dt++;
    //c--;
    for(var n = 0; n < 1 ; ++n) {
      for (var y=0; y < height;++y) {    
          //palette[1] = c += 256;
        c = Math.sin((2*y/height) + (dt / 10)) * 10;
        scrollX = c;
        scrollY = c;
        
        if (y % 8 == 0) {
          var temp = palette[1];
          palette[1] = palette[2]
          palette[2] = temp;
        }
        
        for (var x=0 ; x < width ; ++x) {
          var x1 = x + scrollX;
          var y1 = y + scrollY;;
            
          var tileIndex = vram[((x1 >> 3) & 0x1f) + (((y1 >> 3) & 0x1f) << 5)];
          var tile = tiles[tileIndex];
      
          var colorIndex = tile[(x1 & 0x7) + ((y1 & 0x7) << 3)];
          var color = palette[colorIndex];
            
          var i = (x + y * width) << 2;
          pixelBuffer.data[i+0]= (color >> 16) & 0xff;
          pixelBuffer.data[i+1]= (color >> 8) & 0xff;
          pixelBuffer.data[i+2]= (color) & 0xff;
          pixelBuffer.data[i+3]= 0xff;
        }
      } 
    }

    ctx.putImageData(pixelBuffer, 0, 0);  
  
    fps.innerHTML = Math.round(performance.now() - t1) + 'ms'
    requestAnimationFrame(update);
  }); 
}




function x() {

}


/*
CPU/CHIPS
  - instructions/code
    * Port-mapped
    * Registers/Workram => Infinite för tillfället
    * Fixed or programmable. (core, sound, video, etc.)
  - memory
    * ROM (instructions, static)
    * RAM ? Låt detta vara oändligt för tillfället, får se senare ifall det går att begränsa
    * Memory-mapped  IO
    * IRQ ?
    
    
    
    
*/