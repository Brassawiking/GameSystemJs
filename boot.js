P=(a)=>F(a,(b)=>m[h++]=b)
Z=(a,b)=>240*(a&1)+15*(b&1)
W=(a,b,c,d)=>192*(a&1)+48*(b&1)+12*(c&1)+3*(d&1)
l=cb64('zu1mZswNAAsDcwCDAAwADQAIER+IiQAO3Mxu5t3d2Zm7u2djbg7szN3cmZ+7uTM+')
r=cb64('PEK5pbmlQjw=')
I(8192,(i)=>m[VRAM+i]=0)
m[BGP]=0xfc
m[SCX]=-30
m[SCY]=-60
z=2
J(2,12,(i,j)=>m[BGMAP1+j+i*32]=z++)
m[38924]=1
h=32800
F(l,(b)=>{
x=Z(b>>7,b>>6)
y=Z(b>>5,b>>4)
z=Z(b>>3,b>>2)
w=Z(b>>1,b)
P([x,y,x,y,z,w,z,w])
})
h=32784
F(r,(b)=>{
P([W(b>>7,b>>6,b>>5,b>>4),W(b>>3,b>>2,b>>1,b)])
})
c=0
dt=0
m[HSYNC]=(y,h)=>{
//c=Math.sin((2*y/h)+(dt/20))*40
//m[SCX]=(y%2?c:c)-30
//m[SCY]=c-60
}
m[VSYNC]=()=>{
//dt++
m[SCY]--
}