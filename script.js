document.registerElement('game-system', {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: { value: function () { return create$$(this); } }
  })
})

function create$$(element) {
  var width = 160 | 0,
      height = 144 | 0,
      scale = 3;
      
  element.setAttribute('tabindex', '0');
  
  //document.body.appendChild(document.createElement('input'));
  //document.body.appendChild(document.createElement('textarea'));

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
  
  var cpu = {};
  cpu.addressSpaceSize = 16;
  cpu.interupts = {
    
  }
 
  var palette = [
    0x274531,
    0x597d3e,
    0xb3be47,
    0xd8e699,
  ]

  var tiles = new Array(256); 

  /*
  tiles[0] = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
  ];
 
  tiles[1] = [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
  ];
  
  tiles[2] = [
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2,
  ];

  tiles[3] = [
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
    3, 3, 3, 3, 3, 3, 3, 3,
  ];

  tiles[4] = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 2, 2, 2, 2, 2, 0,
    0, 2, 0, 0, 0, 0, 2, 0,
    0, 2, 0, 3, 3, 0, 2, 0,
    0, 2, 0, 3, 3, 0, 2, 0,
    0, 2, 0, 0, 0, 0, 2, 0,
    0, 2, 2, 2, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
  ];

  tiles[5] = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 0, 0, 1, 0,
    0, 1, 0, 3, 3, 0, 1, 0,
    0, 1, 0, 3, 3, 0, 1, 0,
    0, 1, 0, 0, 0, 0, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
  ];

  tiles[6] = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 2, 2, 2, 2, 2, 0,
    0, 2, 2, 2, 2, 2, 2, 0,
    0, 2, 2, 0, 0, 2, 2, 0,
    0, 2, 2, 0, 0, 2, 2, 0,
    0, 2, 2, 2, 2, 2, 2, 0,
    0, 2, 2, 2, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
  ];

  tiles[7] = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
  ];
  
  tiles[8] = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 2, 2, 2, 2, 2, 0,
    0, 2, 3, 3, 3, 3, 2, 0,
    0, 2, 3, 2, 2, 0, 2, 0,
    0, 2, 3, 2, 2, 0, 2, 0,
    0, 2, 0, 0, 0, 0, 2, 0,
    0, 2, 2, 2, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0,  
  ];

  tiles[9] = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 3, 3, 3, 3, 3, 3, 0,
    0, 3, 0, 0, 0, 0, 3, 0,
    0, 3, 0, 0, 0, 0, 3, 0,
    0, 3, 0, 0, 0, 0, 3, 0,
    0, 3, 0, 0, 0, 0, 3, 0,
    0, 3, 3, 3, 3, 3, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
  ];



  //bricks
  tiles[10] = [
    2, 0, 3, 2, 2, 0, 3, 2,
    2, 0, 2, 2, 2, 0, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0,
    3, 2, 2, 0, 3, 2, 2, 0,
    2, 2, 2, 0, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    2, 0, 3, 2, 2, 0, 3, 2,
    2, 0, 2, 2, 2, 0, 2, 2,
  ];

  tiles[11] = [
    0, 0, 0, 0, 0, 0, 0, 0,
    3, 2, 2, 0, 3, 2, 2, 0,
    2, 2, 2, 0, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    2, 0, 3, 2, 2, 0, 3, 2,
    2, 0, 2, 2, 2, 0, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0,
    3, 2, 2, 0, 3, 2, 2, 0,
  ];

  tiles[12] = [
    2, 2, 2, 0, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    2, 0, 3, 2, 2, 0, 3, 2,
    2, 0, 2, 2, 2, 0, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0,
    3, 2, 2, 0, 3, 2, 2, 0,
    2, 2, 2, 0, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
  ];
 
 
 
  tiles[13] = [
    0, 0, 0, 0, 0, 0, 0, 3,
    0, 0, 0, 0, 0, 0, 0, 3,
    0, 0, 0, 0, 0, 0, 0, 3,
    0, 0, 0, 0, 0, 0, 0, 3,
    0, 0, 0, 0, 0, 0, 0, 3,
    0, 0, 0, 0, 0, 0, 0, 3,
    0, 0, 0, 0, 0, 0, 0, 3,
    0, 0, 0, 0, 0, 0, 0, 3,
  ];

  tiles[14] = [
    3, 0, 0, 0, 0, 0, 0, 0,
    3, 0, 0, 0, 0, 0, 0, 0,
    3, 0, 0, 0, 0, 0, 0, 0,
    3, 0, 0, 0, 0, 0, 0, 0,
    3, 0, 0, 0, 0, 0, 0, 0,
    3, 0, 0, 0, 0, 0, 0, 0,
    3, 0, 0, 0, 0, 0, 0, 0,
    3, 0, 0, 0, 0, 0, 0, 0,
  ];
 

  tiles[15] = [
    0, 1, 3, 2, 0, 0, 0, 0,
    0, 1, 3, 2, 0, 0, 0, 0,
    0, 1, 3, 2, 0, 0, 0, 0,
    0, 1, 3, 2, 0, 0, 0, 0,
    0, 1, 3, 2, 0, 0, 0, 0,
    0, 1, 3, 2, 0, 0, 0, 0,
    0, 1, 3, 2, 0, 0, 0, 0,
    0, 1, 3, 2, 0, 0, 0, 0,
  ];

  tiles[16] = [
    0, 0, 0, 0, 2, 3, 1, 0,
    0, 0, 0, 0, 2, 3, 1, 0,
    0, 0, 0, 0, 2, 3, 1, 0,
    0, 0, 0, 0, 2, 3, 1, 0,
    0, 0, 0, 0, 2, 3, 1, 0,
    0, 0, 0, 0, 2, 3, 1, 0,
    0, 0, 0, 0, 2, 3, 1, 0,
    0, 0, 0, 0, 2, 3, 1, 0,
  ];
 
   
  tiles[17] = [
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2,
    3, 3, 3, 3, 3, 3, 3, 3,
    1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0,
  ];
  
  tiles[18] = [
    0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1,
    3, 3, 3, 3, 3, 3, 3, 3,
    2, 2, 2, 2, 2, 2, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
  ];


  var vram = [
13, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 11, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 12, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 12, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 10, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 11, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 11, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 12, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 12, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 10, 3, 3, 3, 4, 4, 4, 3, 3, 3, 3, 10, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 11, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 11, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 12, 3, 3, 6, 4, 4, 4, 3, 3, 3, 3, 12, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 10, 3, 6, 6, 3, 3, 4, 3, 5, 3, 3, 10, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 11, 5, 6, 3, 3, 3, 3, 3, 5, 5, 3, 11, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 12, 5, 5, 3, 7, 7, 7, 3, 3, 5, 3, 12, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 10, 3, 5, 3, 7, 9, 9, 3, 3, 5, 3, 10, 14, 0, 17, 17, 17, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 11, 4, 4, 3, 8, 9, 9, 3, 3, 5, 5, 11, 14, 16, 3, 3, 3, 3, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 12, 4, 5, 8, 8, 8, 3, 3, 3, 5, 5, 12, 14, 16, 3, 5, 5, 3, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 10, 3, 6, 5, 9, 9, 3, 8, 7, 5, 5, 10, 14, 16, 5, 5, 3, 3, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 11, 6, 6, 7, 9, 9, 3, 3, 7, 5, 5, 11, 14, 16, 3, 3, 3, 3, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
13, 12, 6, 3, 7, 9, 9, 3, 3, 7, 7, 5, 12, 14, 0, 18, 18, 18, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,   
  ];
  */
  /*
  for (var i = 0 ; i < vram.length ; ++i) {
    vram[i] = i % tiles.length;
    //vram[i] = i < tiles.length ? i : tiles.length - 1;
    //vram[i] = 3;
  }
  */
  
  /*
  vram[32 * 1 + 0] = 10
  vram[32 * 1 + 1] = 10
  vram[32 * 1 + 2] = 10
  vram[32 * 2 + 0] = 11
  vram[32 * 2 + 1] = 11
  vram[32 * 2 + 2] = 11  
  vram[32 * 3 + 0] = 12
  vram[32 * 3 + 1] = 12
  vram[32 * 3 + 2] = 12
  vram[32 * 4 + 0] = 10
  vram[32 * 4 + 1] = 10
  vram[32 * 4 + 2] = 10
  vram[32 * 5 + 0] = 11
  vram[32 * 5 + 1] = 11
  vram[32 * 5 + 2] = 11  
  vram[32 * 6 + 0] = 12
  vram[32 * 6 + 1] = 12
  vram[32 * 6 + 2] = 12
*/
  var vram = new Array(32*32);

  var pixelBuffer = ctx.createImageData(width, height);
  for (var i = 0; i < width*height; ++i) {
   pixelBuffer.data[(i*4)+3] = 0xff;
  }
  
  var c = 0;
  var dt = 0;
  var layers = 10;
  var posX = -3;
  var posY = -3;
  
  var keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    b: false,
    start: false,
    select: false,
  }
  
  document.addEventListener('keydown', function (e) {
    debug.innerHTML = 'DOWN:' + e.keyCode + e.code + e.which + e.key + e.charCode + e.char;
    e.preventDefault();
    
    switch(e.key) {
      case 'w': keys.up = true; break; 
      case 's': keys.down = true; break; 
      case 'a': keys.left = true; break; 
      case 'd': keys.right = true; break; 
      case 'j': keys.a = true; break; 
      case 'k': keys.b = true; break; 
      case 'e': keys.start = true; break; 
      case 'q': keys.select = true; break; 
    }

 }, true);

  document.addEventListener('keyup', function (e) {
    debug.innerHTML = 'UP:' + e.keyCode + e.code + e.which + e.key + e.charCode + e.char;
    e.preventDefault();
    
    switch(e.key) {
      case 'w': keys.up = false; break; 
      case 's': keys.down = false; break; 
      case 'a': keys.left = false; break; 
      case 'd': keys.right = false; break; 
      case 'j': keys.a = false; break; 
      case 'k': keys.b = false; break; 
      case 'e': keys.start = false; break; 
      case 'q': keys.select = false; break; 
    }
 }, true);


  function reqListener () {
    if (this.responseText.length > 256) {
      console.error('boot.js too big')
    }
    (new Function(
      'debug', 
      'vram',
      'tiles', 
      this.responseText)(
        debug,
        vram,
        tiles
      ));
  }

  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", "boot.js");
  oReq.send();

  
  requestAnimationFrame(function update() {
    var t1 = performance.now();
    dt++;
    //c--;
    
    if (keys.right) {
      posX += 1;
    }
    if (keys.left) {
      posX -= 1;
    }
    if (keys.down) {
      posY += 1;
    }
    if (keys.up) {
      posY -= 1;
    }
    
    for(var n = 0; n < layers ; ++n) {
      for (var y=0; y < height;++y) {    

        //c = Math.sin((2*y/height) + (dt / 20)) * 40;

        scrollX = y % 2 ? c : c;
        scrollY = c;
        
        if (y % 8 == 0) {
          var temp = palette[1];
          //palette[1] = palette[2]
          //palette[2] = temp;
          //palette[0] = ((y / height) * 256) & 0xffffff; 
        }
        
        for (var x=0 ; x < width ; ++x) {
          var x1 = x + scrollX;
          var y1 = y + scrollY;
            
          var tileIndex = vram[((x1 >> 3) & 0x1f) + (((y1 >> 3) & 0x1f) << 5)] || 0;
          var tile = tiles[tileIndex] || []; // fallback temp tile
      
          var colorIndex = tile[(x1 & 0x7) + ((y1 & 0x7) << 3)];
          var color = palette[colorIndex] || palette[0] //fallback color; 
            
          var i = (x + y * width) << 2;
          pixelBuffer.data[i+0] = (color >> 16) & 0xff;
          pixelBuffer.data[i+1] = (color >> 8) & 0xff;
          pixelBuffer.data[i+2] = (color) & 0xff;
          //pixelBuffer.data[i+3]= 0xff;
        }
      } 
    }
    /*
    var sprite = tiles[4];
    
    for (var sx=0 ; sx < 8 ; ++sx) {
      for (var sy=0 ; sy < 8 ; ++sy) {
        var sColorIndex = sprite[sx + (sy << 3)];
        if (!sColorIndex) {
          continue;
        }
        
        var sColor = palette[sColorIndex]; 
       
        
        var x2 = sx + posX;
        var y2 = sy + posY;
        if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height) {
          continue
        }
        
        var si = (x2 + y2 * width) << 2;
        pixelBuffer.data[si+0] = (sColor >> 16) & 0xff;
        pixelBuffer.data[si+1] = (sColor  >> 8) & 0xff;
        pixelBuffer.data[si+2] = (sColor) & 0xff;
        //pixelBuffer.data[si+3]= 0xff;      
      }    
    }
    
    */

    ctx.putImageData(pixelBuffer, 0, 0);  
   
    //debug.innerHTML = 'KEYS: ' + JSON.stringify(keys);
   
    fps.innerHTML = Math.round((performance.now() - t1)) + 'ms'
    requestAnimationFrame(update);
  }); 
}













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