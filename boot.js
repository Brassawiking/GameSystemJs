var
i,
j,
l1=cb64('zu1mZswNAAsDcwCDAAwADQAIER+IiQAO3Mxu5t3d2Zm7u2djbg7szN3cmZ+7uTM+'),
l2=cb64('PEK5pbmlQjw='),
b
for(i=0;i<8192;++i)m[VRAM+i]=0
m[BGP]=0xfc

m[SCX] = 0;
m[SCY] = 0;

//for(i=0;i<1024;++i)m[BGMAP1+i]=i%256



var z = 2;
for(i=0;i<2;++i) {
  for(j=0;j<12;++j) {
    var x = 4+j;
    var y = 8+i;
    m[BGMAP1 + x + y*32] = z++
  }
}

m[BGMAP1 + 16 + 8*32] = 1


m[SCX] = 0;
m[SCY] = 0;
var c = 0;
var dt = 0;

m[HSYNC] = function (y, height) {
  //c = Math.sin((2*y/height) + (dt / 20)) * 40;

  //m[SCX] = y % 2 ? c : c;
  //m[SCY] = c;
}


m[VSYNC] = function () {
  //dt++;
  
  //m[SCY]--;
}

dma(CHAR+(16*1), scaleUpR(l2))
dma(CHAR+(16*2), scaleUpLogo(l1))

function scaleUpR(bytes){
  var result = [];
  for (var i=0; i < bytes.length; ++i) {
    var b = bytes[i];
  

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
    
    result.push(b1);
    result.push(b2);
 }

  return result;
}


function scaleUpLogo(bytes){
  var result = [];
  for (var i=0; i < bytes.length; i += 2) {
    var b = bytes[i];

    var x8 = (b >> 7) & 1
    var x7 = (b >> 6) & 1
    var x6 = (b >> 5) & 1
    var x5 = (b >> 4) & 1
    
    var x4 = (b >> 3) & 1
    var x3 = (b >> 2) & 1
    var x2 = (b >> 1) & 1
    var x1 = (b >> 0) & 1
    
    var b1 = (x8 << 7) | (x8 << 6) | (x8 << 5) | (x8 << 4) |(x7 << 3) |(x7 << 2) |(x7 << 1) | (x7 << 0);
    var b2 = (x6 << 7) | (x6 << 6) | (x6 << 5) | (x6 << 4) |(x5 << 3) |(x5 << 2) |(x5 << 1) | (x5 << 0);
    var b3 = (x4 << 7) | (x4 << 6) | (x4 << 5) | (x4 << 4) |(x3 << 3) |(x3 << 2) |(x3 << 1) | (x3 << 0);
    var b4 = (x2 << 7) | (x2 << 6) | (x2 << 5) | (x2 << 4) |(x1 << 3) |(x1 << 2) |(x1 << 1) | (x1 << 0);
   
   
    var b = bytes[i+1];

    var x8 = (b >> 7) & 1
    var x7 = (b >> 6) & 1
    var x6 = (b >> 5) & 1
    var x5 = (b >> 4) & 1
    
    var x4 = (b >> 3) & 1
    var x3 = (b >> 2) & 1
    var x2 = (b >> 1) & 1
    var x1 = (b >> 0) & 1
    
    var b5 = (x8 << 7) | (x8 << 6) | (x8 << 5) | (x8 << 4) |(x7 << 3) |(x7 << 2) |(x7 << 1) | (x7 << 0);
    var b6 = (x6 << 7) | (x6 << 6) | (x6 << 5) | (x6 << 4) |(x5 << 3) |(x5 << 2) |(x5 << 1) | (x5 << 0);
    var b7 = (x4 << 7) | (x4 << 6) | (x4 << 5) | (x4 << 4) |(x3 << 3) |(x3 << 2) |(x3 << 1) | (x3 << 0);
    var b8 = (x2 << 7) | (x2 << 6) | (x2 << 5) | (x2 << 4) |(x1 << 3) |(x1 << 2) |(x1 << 1) | (x1 << 0);



   
    result.push(b1);
    result.push(b2);
    result.push(b1);
    result.push(b2);

    result.push(b3);
    result.push(b4);
    result.push(b3);
    result.push(b4);

    result.push(b5);
    result.push(b6);
    result.push(b5);
    result.push(b6);

    result.push(b7);
    result.push(b8);
    result.push(b7);
    result.push(b8);
}

  return result;
}
