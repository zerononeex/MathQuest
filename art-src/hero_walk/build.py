"""Builds art-src/hero_walk.png (the hero's 4-direction walk sheet) from
art-src/hero_sheet_magenta.png.

1. Key out the magenta, despill fringe pixels to the outline colour and snap
   every pixel to an 18-colour palette sampled from the sheet.
2. Downscale each pose to 50px tall (2x game px) with a palette mode filter.
3. Keep each view's upper body (front pose 0, back pose 5, side pose 7) and
   redraw the legs per frame from hand-drawn pixel maps (below); front/back
   arms swing 1px, passing frames bob up 1px.

Output: 3 rows (down, up, right; left = mirrored right) x 5 cols (idle,
contact, passing, contact, passing) of 30x52 cells, feet on row 50.
Run: python3 art-src/hero_walk/build.py   (needs pillow + numpy)
"""
from PIL import Image; import numpy as np, os
HERE=os.path.dirname(os.path.abspath(__file__))
P=np.array([[34,9,10],[30,30,39],[62,28,34],[100,27,34],[42,62,61],[90,49,51],[131,38,42],[50,93,89],[117,65,60],[168,57,41],[47,133,123],[151,91,75],[191,79,50],[112,123,94],[188,125,96],[177,168,120],[233,169,124],[236,194,167]],float)
a=np.array(Image.open(os.path.join(HERE,'..','hero_sheet_magenta.png')).convert('RGB')).astype(float)
r,g,b=a[...,0],a[...,1],a[...,2]
bg=(r>170)&(b>170)&(g<120)
spill=(b>g*1.3+8)&(r>g*1.3)&(b>r*0.55)&~bg
idx=((a[:,:,None,:]-P[None,None])**2).sum(-1).argmin(-1)
idx[spill]=1
idx[bg]=-1
F=[[106,27,86,150],[293,23,91,151],[629,23,88,151],[810,23,91,150],[111,201,81,152],[303,202,85,151],[631,207,82,150],[819,207,81,150],[111,386,81,164],[303,386,85,159],[631,386,82,163],[819,386,81,163]]
POSES={}
S=50/150.0  # uniform scale for all poses (source figures ~150px)
for i,(x,y,w,h) in enumerate(F):
    c=idx[y-6:y+h+6,x-6:x+w+6]
    HH=int(round(c.shape[0]*S)); W=int(round(c.shape[1]*S))
    o=np.full((HH,W),-1,int)
    for yy in range(HH):
        for xx in range(W):
            blk=c[int(yy/S):int((yy+1)/S),int(xx/S):int((xx+1)/S)].ravel()
            if (blk>=0).mean()<0.45: continue
            v=blk[blk>=0]
            cnt=np.bincount(v,minlength=len(P))
            if cnt[1]+cnt[0]>=0.34*len(v): o[yy,xx]=1 if cnt[1]>=cnt[0] else 0
            else: o[yy,xx]=cnt.argmax()
    # trim
    ys,xs=np.where(o>=0); o=o[ys.min():ys.max()+1,xs.min():xs.max()+1]
    POSES[i]=o

CW,CH=30,52          # cell size (backing px, 2x game px)
BASE=50              # foot baseline row (exclusive bottom = row 49 is last)
# legend for hand-drawn leg art
L={'.':-1,'o':1,'p':4,'P':7,'q':10,'b':5,'B':8,'h':11,'d':2,'k':0}
def art(s):
    rows=[r for r in s.strip('\n').split('\n')]
    w=max(len(r) for r in rows)
    return np.array([[L[c] for c in r.ljust(w,'.')] for r in rows])
def paste(dst,src,x,y):
    for yy in range(src.shape[0]):
        for xx in range(src.shape[1]):
            v=src[yy,xx]
            if v>=0 and 0<=y+yy<dst.shape[0] and 0<=x+xx<dst.shape[1]: dst[y+yy,x+xx]=v
def load(i): return POSES[i]

# ---------------- front / back legs (one leg, 8 wide incl. outline) ------
FRONT_LEG=art('''
oppPPpo
oppPPpo
oppPPpo
oppPPpo
opppppo
ooooooo
obhhBbo
obBBBbo
obBBBbo
obbBBbo
obBBBBbo
oooooooo
''')
BACK_LEG=art('''
opPPppo
opPPppo
opPPppo
opPPppo
opppppo
ooooooo
obBhBbo
obbBBbo
obbBBbo
obbbbbo
obbbbbo
ooooooo
''')
def lift(leg,n):
    # bend the knee: drop n pants rows (foot rises n px, leg gets shorter)
    if n<=0: return leg
    return np.concatenate([leg[:1],leg[1+n:]])
def mirror(a): return a[:,::-1]

def frontback(upper,legtop,cx,leg,lifts,arms,armrows,bob):
    """lifts=(left,right) px, arms=(left,right) vertical hand shift"""
    c=np.full((CH,CW),-1,int)
    up=upper.copy()
    # arm swing: move the hand/forearm blocks vertically
    for side,dy in zip((0,1),arms):
        if not dy: continue
        (x0,x1)=armrows[side][0]; (y0,y1)=armrows[side][1]
        blk=up[y0:y1,x0:x1].copy()
        paste(up,blk,x0,y0+dy)
        if dy<0:  # vacated bottom row(s) of the hand
            for k in range(-dy):
                r=y1-1-k; m=(blk[-1-k]>=0)
                # only clear pixels the moved block does not cover
                cov=blk[-1-k+dy]>=0 if -1-k+dy>=-blk.shape[0] else np.zeros_like(m)
                up[r,x0:x1]=np.where(m&~cov,-1,up[r,x0:x1])
    ox=cx-up.shape[1]//2
    top=BASE-12-upper.shape[0]+1+bob  # upper body sits on the legs (hem overlaps 1 row)
    # legs first (behind the tunic hem)
    ll=lift(leg,lifts[0]); rl=mirror(lift(leg,lifts[1]))
    ly=BASE-ll.shape[0]-lifts[0]; ry=BASE-rl.shape[0]-lifts[1]
    paste(c,ll,cx-7,ly+bob*0)
    paste(c,rl,cx,ry)
    paste(c,up,ox,top)
    return c

u0=load(0)[:38]            # front upper body incl. hem outline
u5=load(5)[:38]
# hand blocks: (xrange),(yrange) in upper-body coords
ARM0=[((0,7),(26,37)),((22,29),(26,37))]
ARM5=[((0,7),(24,36)),((22,29),(24,36))]
def dirframes(upper,leg,arms):
    cx=CW//2
    idle=frontback(upper,0,cx,leg,(0,0),(0,0),arms,0)
    f=[frontback(upper,0,cx,leg,(0,3),(1,-1),arms,0),
       frontback(upper,0,cx,leg,(0,1),(0,0),arms,-1),
       frontback(upper,0,cx,leg,(3,0),(-1,1),arms,0),
       frontback(upper,0,cx,leg,(1,0),(0,0),arms,-1)]
    return [idle]+f
down=dirframes(u0,FRONT_LEG,ARM0)
up=dirframes(u5,BACK_LEG,ARM5)

# ---------------- side (facing right) -------------------------------------
u7=load(7)[:36]
# side leg poses, hips span ~cols 0..13 of this art; 14 rows tall
SIDE={
'contact':art('''
....oppppPPPPo....
...opppppoPPPPo...
..oppppo..oPPPPo..
..opppo....oPPPPo.
.opppo......oPPPo.
.oppo.......oPPPo.
oooo........oooooo
obbo........ohhBBBo
obbbo.......obBBBBBo
obbbo.......obBBBBBo
oobbo.......oooooooo
.oooo...............
'''),
'stand':art('''
....opppPPPPo...
....opppPPPPo...
....opppPPPPo...
....opppPPPPo...
....opppPPPPo...
....oppoPPPPo...
....obboooooo...
....obbohhBBBo..
....obbobBBBBBo.
....obbobBBBBBo.
....oooooooooooo
'''),
'pass':art('''
.....opPPPPo....
.....opPPPPo....
....oppPPPPo....
...oppoPPPPo....
..oppooPPPPo....
..obbooPPPPo....
..obbboooooo....
..obbbohhBBBo...
...oooobBBBBBo..
.......obBBBBBo.
.......oooooooo.
''')}
def side(upper,legs,bob,flipLegs=False):
    c=np.full((CH,CW),-1,int)
    up=upper.copy()
    lg=legs[:,::-1] if flipLegs else legs
    lx=CW//2-lg.shape[1]//2+2
    paste(c,lg,lx,BASE-lg.shape[0])
    top=BASE-12-upper.shape[0]+2+bob
    paste(c,up,CW//2-upper.shape[1]//2,top)
    return c
def swap(a):
    m={4:7,7:4,5:8,8:5,11:5}
    return np.vectorize(lambda v:m.get(v,v))(a)
right=[side(u7,SIDE['stand'],0),
       side(u7,SIDE['contact'],0),
       side(u7,SIDE['pass'],-1),
       side(u7,swap(SIDE['contact']),0),
       side(u7,swap(SIDE['pass']),-1)]
rows=[down,up,right]
f=np.array(rows); R,C,H,W=f.shape
out=np.zeros((R*H,C*W,4),np.uint8)
for r in range(R):
    for c in range(C):
        a=f[r,c]; m=a>=0
        blk=out[r*H:(r+1)*H,c*W:(c+1)*W]
        blk[m,:3]=P.astype(np.uint8)[a[m]]; blk[m,3]=255
Image.fromarray(out).save(os.path.join(HERE,'..','hero_walk.png'),optimize=True)
print('wrote hero_walk.png',out.shape)
