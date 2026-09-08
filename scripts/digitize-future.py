"""Digitize the published Fig. 1e coastline (Farnsworth et al. 2023, CC BY 4.0).
No plate positions are invented. Colours are illustrative, not biome forecasts.
Input: original 2034x2698 figure, coordinates measured in a 1375x1824 preview.
"""
from PIL import Image
import numpy as np
from scipy import ndimage as ndi
im=Image.open('/private/tmp/future-figure.png').convert('RGB')
sx,sy=im.width/1375,im.height/1824
box=tuple(round(v*(sx if i%2==0 else sy)) for i,v in enumerate((89,1389,601,1738)))
a=np.array(im.crop(box));h,w=a.shape[:2]
# Isolate the plotted coastline and green habitable areas; exclude the caption.
region=a[:round(h*.84)]
dark=np.max(region,axis=2)<155
green=(region[:,:,1]>90)&(region[:,:,1]>region[:,:,0]*1.25)&(region[:,:,1]>region[:,:,2]*1.15)
barrier=ndi.binary_closing(dark|green,iterations=2)
# Fill enclosed coastlines and include the green northern/southern land.
land=ndi.binary_fill_holes(barrier)
labels,n=ndi.label(land)
sizes=np.bincount(labels.ravel());sizes[0]=0
keep=np.flatnonzero(sizes>40)
land=np.isin(labels,keep)
# Remove frame fragments connected to the image boundaries.
for label in np.unique(np.r_[labels[0],labels[-1],labels[:,0],labels[:,-1]]):
 if label and sizes[label]<1000:land[labels==label]=False
mask=np.zeros((h,w),bool);mask[:region.shape[0]]=land
# Smooth only pixel-scale defects from printed line art.
mask=ndi.binary_opening(mask,iterations=1)
canvas=np.zeros((h,w,3),np.uint8);canvas[:]=[21,53,79];canvas[mask]=[153,139,104]
coast=ndi.binary_dilation(mask,iterations=2)&~mask;canvas[coast]=[62,110,121]
Image.fromarray(canvas).resize((1536,768),Image.Resampling.LANCZOS).save('public/textures/future.jpg',quality=90)
Image.fromarray((mask*255).astype('uint8')).save('/private/tmp/future-mask.png')
print('Digitized coastline; land pixel fraction',float(mask.mean()))
