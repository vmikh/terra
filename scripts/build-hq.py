"""Deterministic HQ terrain and bidirectional coastline registration.
Relief is illustrative, not geological elevation data. Original coast fields remain
unaltered. OpenCV DIS registers adjacent maps; it is not a plate-motion model.
Requires Pillow, scipy, numpy, opencv-python-headless in an offline build venv.
"""
from pathlib import Path
import argparse
import json
import numpy as np
import cv2
from PIL import Image
from scipy import ndimage as ndi
ROOT=Path('public/textures/surface'); OUT=Path('public/textures/hq');OUT.mkdir(exist_ok=True)
FLOW=Path('public/textures/motion');FLOW.mkdir(exist_ok=True)
W,H=4096,2048
rng=np.random.default_rng(42)
terrain=np.zeros((H,W),np.float32)
for size,amplitude in [(16,.30),(48,.23),(128,.17),(384,.12),(1024,.07),(2048,.035)]:
 grid=rng.random((max(2,size//2),size),dtype=np.float32)
 layer=cv2.resize(grid,(W,H),interpolation=cv2.INTER_CUBIC)
 terrain+=amplitude*(1-np.abs(layer*2-1))
terrain=np.clip(terrain,0,1)
# Fine ridges produce shading and a shared bump map without inventing coasts.
gy,gx=np.gradient(terrain)
shade=np.clip(1+(gx-gy)*6,.65,1.3)
Image.fromarray((terrain*255).astype('uint8')).save(OUT/'relief.jpg',quality=96)
for p in sorted(ROOT.glob('*.jpg')):
 if p.stem=='modern':continue
 a=np.array(Image.open(p).resize((W,H),Image.Resampling.LANCZOS),dtype=np.float32)/255
 f=np.array(Image.open(ROOT/(p.stem+'-field.png')).resize((W,H),Image.Resampling.BILINEAR),dtype=np.float32)/255
 land=np.clip((f[:,:,0]-.496)/.008,0,1)
 # Sharpen geological tone transitions, add multiscale terrain; keep ocean smooth.
 base=cv2.GaussianBlur(a,(0,0),1.2)
 a=np.clip(a+(a-base)*.7,0,1)
 a*=1+land[:,:,None]*((shade-1)*.7+(terrain-.55)*.20)[:,:,None]
 Image.fromarray((np.clip(a,0,1)*255).astype('uint8')).save(OUT/p.name,quality=94,subsampling=0)
 print('HQ',p.stem,flush=True)
# Fields use pixel coordinate y down. Shader decoder flips y for UV convention.
ages=sorted([a for a in json.load(open('app/paleo-ages.json')) if a not in [0,1]],reverse=True)
keys=['proto','archean','nuna','rodinia']+[str(a) for a in ages]+['modern','1','modern','future','future-late']
w,h=512,256
engine=cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
engine.setFinestScale(0)
for ka,kb in dict.fromkeys(zip(keys,keys[1:])):
 def field(k):
  im=Image.open(ROOT/(k+'-field.png')).resize((w,h),Image.Resampling.BILINEAR)
  a=np.array(im)[:,:,0]
  # Pad longitude for a continuous dateline.
  return np.ascontiguousarray(np.tile(a,(1,3)))
 a,b=field(ka),field(kb)
 f=engine.calc(a,b,None)[:,w:2*w].copy()
 g=engine.calc(b,a,None)[:,w:2*w].copy()
 packed=np.concatenate([f,g],axis=2)
 # Encode ±128px x / ±64px y with symmetric zero at byte128.
 packed=128+packed*np.array([127/128,127/64,127/128,127/64])
 Image.fromarray(np.clip(np.rint(packed),0,255).astype('uint8'),'RGBA').save(FLOW/(ka+'_'+kb+'.png'))
 print('Motion',ka,kb,flush=True)

parser=argparse.ArgumentParser()
parser.add_argument('--nasa-source-dir',type=Path)
args=parser.parse_args()
if args.nasa_source_dir:
 Image.MAX_IMAGE_PIXELS=300000000
 for source,name,size in [('day-21600.jpg','modern.jpg',(8192,4096)),('elevation-21600.jpg','modern-height.jpg',(4096,2048)),('night-2016-13500-gray.jpg','night-2016.jpg',(8192,4096))]:
  Image.open(args.nasa_source_dir/source).resize(size,Image.Resampling.LANCZOS).save(OUT/name,quality=95,subsampling=0)
