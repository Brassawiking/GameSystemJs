var
i,
j,
l1=cb64('zu1mZswNAAsDcwCDAAwADQAIER+IiQAO3Mxu5t3d2Zm7u2djbg7szN3cmZ+7uTM+'),
l2=cb64('PEK5pbmlQjw='),
b
for(i=0;i<8192;++i)m[VRAM+i]=0
m[BGP]=0xfc


var z = 1;
for(i=0;i<2;++i) {
  for(j=0;j<6;++j) {
    var x = 5+j;
    var y = 5+i;
    m[BGMAP1 + x + y*32]= z++
  }
}

m[SCX] = 0;
m[SCY] = 0;
var c = 0;
var dt = 0;

m[HSYNC] = function (y, height) {
 c = Math.sin((2*y/height) + (dt / 20)) * 40;

  m[SCX] = y % 2 ? c : c;
  m[SCY] = c;
}

m[VSYNC] = function (y, height) {
  dt++;
}

dma(CHAR+16, [
scaleUp(l2[0],1),scaleUp(l2[0]), 
scaleUp(l2[1],1),scaleUp(l2[1]), 
scaleUp(l2[2],1),scaleUp(l2[2]), 
scaleUp(l2[3],1),scaleUp(l2[3]), 
scaleUp(l2[4],1),scaleUp(l2[4]), 
scaleUp(l2[5],1),scaleUp(l2[5]), 
scaleUp(l2[6],1),scaleUp(l2[6]), 
scaleUp(l2[7],1),scaleUp(l2[7]),
])

function scaleUp(b,h){
  var x8 = (b >> 7) & 1
  var x7 = (b >> 6) & 1
  var x6 = (b >> 5) & 1
  var x5 = (b >> 4) & 1
  var x4 = (b >> 3) & 1
  var x3 = (b >> 2) & 1
  var x2 = (b >> 1) & 1
  var x1 = (b >> 0) & 1
  
  var b1 = (x8 << 7) | (x8 << 6) | (x7 << 5) | (x7 << 4) |(x6 << 3) |(x6 << 2) |(x5 << 1) | (x5 << 0);
  var b2 = (x4 << 7) | (x4 << 6) | (x3 << 5) | (x3 << 4) |(x2 << 3) |(x2 << 2) |(x1 << 1) | (x1 << 0);
  
  return h ? b1 : b2
}
