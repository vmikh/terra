"""Convert PALEOMAP geographic rasters to a unified satellite-style rendering.
Coordinates of published coastlines are retained; relief colour is illustrative.
Pre-750 Ma / post-present gap frames are explicitly speculative deformations,
not tectonic reconstructions. Signed coast distance supports continuous blending.
Requires Pillow, numpy, scipy. No network access.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
OUT=Path('public/textures/surface');OUT.mkdir(exist_ok=True)
W,H=1024,512
rng=np.random.default_rng(1729)
y,x=np.mgrid[0:H,0:W]
lat=np.abs((y/H-.5)*2)
noise=np.zeros((H,W))
for scale,amp in [(1,.12),(3,.20),(9,.35),(27,.55)]:
 n=ndi.gaussian_filter(rng.normal(size=(H,W)),scale,mode='wrap');noise+=amp*n/(n.std()+1e-9)
noise=np.clip(noise,-2,2)/4+.5
# Actual Earth texture contributes fine-scale variation to every rendered surface.
earth=np.array(Image.open('public/textures/earth.jpg').convert('RGB').resize((W,H)))/255
lum=earth.mean(2);detail=lum-ndi.gaussian_filter(lum,3,mode='wrap')

def read(path):return np.array(Image.open(path).convert('RGB').resize((W,H),Image.Resampling.LANCZOS))/255

def analyse(a,future=False):
 r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
 water=(b>r*1.12)&(b>g*.96)
 land=ndi.median_filter((~water).astype(float),size=5)>.5
 labels,n=ndi.label(land);sizes=np.bincount(labels.ravel());land&=sizes[labels]>25
 ice=(np.minimum(np.minimum(r,g),b)>.66)&(np.max(a,2)-np.min(a,2)<.12)&land
 vegetation=np.clip((g-r)*7+.42,0,1)
 if future:vegetation=np.clip((1-lat)*.25,0,1)
 height=np.clip((r+g+b)/3+.25*(r-g),0,1)
 return land,vegetation,height,ice.astype(float)

def warp(fields,dx,dy):
 coords=[np.clip(y+dy*np.sin(x/W*np.pi*4),0,H-1),(x+dx+35*np.sin(y/H*np.pi*2))%W]
 return tuple(ndi.map_coordinates(a.astype(float),coords,order=1,mode='wrap') for a in fields)

def save(name,fields,land_fraction=None):
 land,veg,height,ice=fields
 if land_fraction is not None:
  # Age-dependent land fraction, inferred rather than presented as measured.
  smooth=ndi.gaussian_filter(land.astype(float),8,mode='wrap')+.07*noise
  land=smooth>np.quantile(smooth,1-land_fraction)
 else:land=land>.5
 # Tile in longitude so the dateline never becomes an artificial coast.
 tiled=np.tile(land,(1,3))
 dist=(ndi.distance_transform_edt(tiled)-ndi.distance_transform_edt(~tiled))[:,W:2*W]
 field=np.stack([np.clip(.5+dist/128,0,1),np.clip(height,0,1),np.clip(veg,0,1)],2)
 Image.fromarray((field*255).astype('uint8')).save(OUT/(name+'-field.png'),optimize=True)
 coast=np.clip(1-np.maximum(-dist,0)/10,0,1)
 ocean=np.array([.025,.067,.125])[None,None,:]+coast[:,:,None]*np.array([.018,.075,.078])[None,None,:]
 ocean+=((noise-.5)*.01)[:,:,None]
 # Forest, scrub, desert and exposed rock in the same subdued natural palette.
 desert=np.array([.50,.43,.29]);forest=np.array([.13,.23,.14])
 vegetation=np.clip(veg*.75+(.55-noise)*.22,0,1)
 ground=desert+(forest-desert)*vegetation[:,:,None]
 terrain=np.clip(.76+noise*.5+detail*.45+(height-.5)*.18,.45,1.3)
 ground*=terrain[:,:,None]
 ground=ground*(1-ice[:,:,None]*.94)+np.array([.78,.84,.86])*ice[:,:,None]*.94
 result=np.where(land[:,:,None],ground,ocean)
 Image.fromarray((np.clip(result,0,1)*255).astype('uint8')).save(OUT/(name+'.jpg'),quality=91)
 return float(np.average(land,weights=np.broadcast_to(np.cos((y/H-.5)*np.pi),(H,W))))

manifest={}
ages=json.load(open('app/paleo-ages.json'))
for age in ages:
 fields=analyse(read(f'public/textures/paleo/{age}.jpg'))
 manifest[str(age)]=save(str(age),fields)
base=analyse(read('public/textures/paleo/750.jpg'))
for name,dx,dy,fraction in [('proto',190,35,.10),('archean',110,-23,.17),('nuna',-150,30,.24),('rodinia',55,-18,.28)]:
 manifest[name]=save(name,warp(base,dx,dy),fraction)
future=analyse(read('public/textures/future.jpg'),True)
manifest['future']=save('future',future)
manifest['future-late']=save('future-late',warp(future,150,-25))
# Modern appearance remains the original image, with only a field for morphing.
modern=analyse(earth)
save('modern',modern)
Image.open('public/textures/earth.jpg').save(OUT/'modern.jpg',quality=95)
open('app/surface-coverage.json','w').write(json.dumps(manifest,indent=2)+'\n')
print(f'Built {len(manifest)+1} textured surfaces and signed coastline fields.')
