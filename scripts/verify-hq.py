"""Validate texture resolution, motion coverage and nonempty moving coastlines."""
from pathlib import Path
import numpy as np
import cv2
from PIL import Image
root=Path('public/textures')
for p in (root/'surface').glob('*.jpg'):
 q=root/'hq'/p.name
 im=Image.open(q)
 assert im.size == ((8192,4096) if p.stem=='modern' else (4096,2048)), (q,im.size)
assert Image.open(root/'hq/night-2016.jpg').size==(8192,4096)
assert Image.open(root/'hq/modern-height.jpg').size==(4096,2048)
w,h=512,256
y,x=np.mgrid[:h,:w].astype('float32')
minimum=1
for p in (root/'motion').glob('*.png'):
 ka,kb=p.stem.split('_')
 f=(np.array(Image.open(p)).astype('float32')-128)/127*np.array([128,64,128,64],dtype='float32')
 a=np.array(Image.open(root/'surface'/(ka+'-field.png')).resize((w,h),Image.Resampling.BILINEAR))[:,:,0]/255
 b=np.array(Image.open(root/'surface'/(kb+'-field.png')).resize((w,h),Image.Resampling.BILINEAR))[:,:,0]/255
 for t in [0,.25,.5,.75,1]:
  ax,ay=x.copy(),y.copy();bx,by=x.copy(),y.copy()
  for _ in range(3):
   af=cv2.remap(f[:,:,:2],ax,ay,cv2.INTER_LINEAR,borderMode=cv2.BORDER_WRAP)
   bf=cv2.remap(f[:,:,2:],bx,by,cv2.INTER_LINEAR,borderMode=cv2.BORDER_WRAP)
   ax=(x-af[:,:,0]*t)%w;ay=np.clip(y-af[:,:,1]*t,0,h-1)
   bx=(x-bf[:,:,0]*(1-t))%w;by=np.clip(y-bf[:,:,1]*(1-t),0,h-1)
  coast=(1-t)*cv2.remap(a,ax,ay,cv2.INTER_LINEAR,borderMode=cv2.BORDER_WRAP)+t*cv2.remap(b,bx,by,cv2.INTER_LINEAR,borderMode=cv2.BORDER_WRAP)
  fraction=np.mean(coast>.5)
  minimum=min(minimum,fraction)
  assert .015<fraction<.98,(p,t,fraction)
print('Verified 4K/8K textures and all registered transitions: minimum land coverage',round(minimum,3))
