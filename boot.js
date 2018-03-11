` alias
H: HSYNC,
V: VSYNC,
B: BGMAP1,
C: CHAR,
Y: SCY,
X: SCX,
P: BGP,
K: 252,
D: BGMAP1+16,
h: CHAR+16,
G: BGMAP1+4,
T: 32,
U: 12,
z: 2,
LY: LY,
LYC: LYC,
l: rawData.BITMAP_LOGO,
r: rawData.BITMAP_R_SYMBOL,
W: null,
a: null,
x: null,
`

W=(...w)=>I(4,_=>m[h]+=(x>>w[i]&1)*3<<i*2)|++h
m[P]=K
J(2,U,_=>m[G+j+i*T]=z++)
m[D]=1
F(r,b=>W(4,5,6,7,x=b)|W(0,1,2,3))
F(l,b=>J(2,2,_=>W(a=6-4*i,a,++a,a,x=b)|W(a-=3,a,++a,a)))
m[V]=_=>m[Y]--