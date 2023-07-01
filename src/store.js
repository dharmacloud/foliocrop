// E:\yongle-bei-3400\金剛經\11796711_38
import {writable ,get} from 'svelte/store';

export const images=writable([]);
export const frames=writable([]);
export const nimage=writable(0);
export const ratio=writable(1);  // width / naturalWidth
export const totalframe=writable(0);
export const dirty=writable(false);
export const pageframe=writable(3);
export const selectedframe=writable(0);
export const fileprefix=writable('');
export const framefile=writable(null);//editing framefile
export const verticalstrip=writable(5);
export const horizontalstrip=writable(17);
export const nanzang=writable(true);

export let defaultframe;

export const setTemplate=(name)=>{
    if (name=='beizang') { //山東圖書館 北藏
        defaultframe=function(idx){return [ 1030*(2-idx)+186,139,964,2120]};
        pageframe.set(3);
        verticalstrip.set(5);
    } else if (name=='longzang') {//欽定龍藏
        verticalstrip.set(5);
        pageframe.set(2);
        defaultframe=function(idx){return [ 385*(1-idx)+18,148,364,810]};
    } else if (name=='nanzang') {//山東圖書館南藏
        verticalstrip.set(6);
        pageframe.set(3);
        defaultframe=function(idx){return [ 880*(2-idx)+220,170,790,1822]};
    }
}

export const caltotalframe=()=>{
    const imgs=get(images);
    let out=0;
    for (let i=0;i<imgs.length;i++) {
        out+= imgs[i].frames?.length||0
    }
    return out;
}

export const resizeframe=(frame,ratio)=>{
    const [x,y,w,h]=frame;
    return [x*ratio,y*ratio,w*ratio,h*ratio];
}
export const selectimage=(n)=>{
    const imgs=get(images);
    const nimg=get(nimage);
    const frms=get(frames);
    const r=get(ratio);

    if (imgs?.length && imgs[nimg]) {
        imgs[nimg].frames=frms.map( f=>resizeframe(f,1/r) ) ;
        dirty.set(true);
    }
    totalframe.set( caltotalframe())
    nimage.set(n);
    if (get(totalframe)) selectedframe.set(0);
}
export const genjson=()=>{
    const imgs=get(images);
    const out=[];
    for (let i=0;i<imgs.length;i++) {
        const frames=[];
        for (let j=0;j<imgs[i].frames?.length||0;j++) {
            const [x,y,w,h]=imgs[i].frames[j];
            frames.push([Math.round(x),Math.round(y),Math.round(w),Math.round(h)]);
        }
        out.push(  '{"name":"'+imgs[i].name+'","frames":'+JSON.stringify(frames)+"}" );
    }
    return '['+out.join(',\n')+']';
}