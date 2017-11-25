for(var i=0;i<8192;++i)m[VRAM+i]=0
for(var i=0;i<1024;++i)m[BGMAP1+i]=i%256
m[BGP]=27
dma(CHAR,cb64('//8AAP//5OT///////8='))