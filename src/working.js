import {dirty,fileprefix,nimage,setTemplate,images,genjson,selectimage,framefile,caltotalframe,totalframe} from './store.js'
const {ZipReader,BlobReader} = zip;//need https://gildas-lormeau.github.io/zip.js/demos/lib/zip.min.js 
import {createBrowserDownload,verifyPermission} from 'ptk/platform/chromefs.ts'
import {get} from 'svelte/store'
const zipOpts = {
    types: [{ description: "Images Zip/PDF", accept: {"zip/*": [".zip",".pdf"]  }}],
    excludeAcceptAllOption: true,  multiple: false,
  };
  const jsonOpts = {
    types: [{ description: "json", accept: {"json/*": [".json"]  }}],
    excludeAcceptAllOption: true,  multiple: false,
  };

export const getFolder=async ()=> {
    const dirHandle = await window.showDirectoryPicker();
    const out=[];
    setTemplate('shandong');
    for await (const entry of dirHandle.values()) {
      if (entry.kind=='file' &&(entry.name.endsWith('.png')|| entry.name.endsWith('.jpg'))) {
          out.push({entry, name:entry.name,frames: out.length?null:[] }); // set first image has no frame
      }
    }
    out.sort(sortfilename );
    if (out.length>2) out[out.length-1].frames=[];//by default last page has no frame
    nimage.set(0);
    images.set(out);
    fileprefix.set(dirHandle.name);
  }
const sortfilename=(a,b)=>{
    if (parseInt(a)&& parseInt(b)) {
        return parseInt(a) -  parseInt(b);
    } else {
        return a.name>b.name?1:-1;
    }
}
async function openZip(file){
    const zip= new ZipReader(new BlobReader(file));
    const entries=await zip.getEntries();
    const out=[];
    framefile.set(null);
    setTemplate('shandong'); //todo , detect image type
    entries.forEach( entry =>{    
        if (entry.filename.endsWith('.jpg')) {
            let at=entry.filename.lastIndexOf('/');
            if (at==-1) at=entry.filename.lastIndexOf('\\');
            out.push({name:entry.filename.slice(at+1), entry, zip, frames: out.length?null:[]});
        }
    })
    out.sort(sortfilename );
    if (out.length>2) out[out.length-1].frames=[];//by default last page has no frame
    return out;
}
let pdf;

async function openPDF(file){
    setTemplate('qindinglongcang');
    const arraybuffer =await file.arrayBuffer();
    // const fileReader = new FileReader();  
    // const arraybuffer=await fileReader.readAsArrayBuffer(file);
    const typedarray = new Uint8Array(arraybuffer);
    pdf = await pdfjsLib.getDocument(typedarray).promise;
    const out=[];
    for (let i=1;i<=pdf.numPages;i++) {
        out.push({name:i , pdf, page:i, frames: out.length?null:[]});
    }
    if (out.length>2) out[out.length-1].frames=[];//by default last page has no frame
    
    return out;
}
export const openWorkingFile=async (file)=>{
    let out=[];
    const filename=file.name.toLowerCase();
    if (filename.endsWith(".zip")) out=await openZip(file);
    else if (filename.endsWith(".pdf")) out=await openPDF(file);
    else return '';

    nimage.set(0);
    images.set(out);
    fileprefix.set(filename.replace(/\.[a-z]+$/,''));
    return filename;
}
let filename='';
export const openImageFiles=async()=>{
    const filehandles = await window.showOpenFilePicker(zipOpts);
    const file =await filehandles[0].getFile();
    filename=openWorkingFile(file);
}
export const loadfile=async (file)=>{
    const imgs=get(images);
    const json=JSON.parse(await file.text());
    for (let i=0;i<imgs.length;i++) {
        imgs[i].frames= json[i].frames;
        imgs[i].rotate=json[i].rotate||0;
        imgs[i].mark=json[i].mark||0;
        imgs[i].note=json[i].note||''
    }
    images.set(imgs);
    totalframe.set( caltotalframe())
    
    return json;
}
export const load=async ()=>{
    const imgs=get(images);
    if (!imgs.length) {
        alert("need images");
        return;
    }
    const filehandles = await window.showOpenFilePicker({...jsonOpts});
    const file =await filehandles[0].getFile();
    framefile.set(filehandles[0]);

    const json=await loadfile(file);
    if (json.length!==imgs.length || (filehandles.length>1&& filehandles[0].name.replace('.json','')!==get(fileprefix))) {
        json.length=0;
        alert("zip json filename mismatch");
        return;
    }   
}

export const save=async ()=>{
    selectimage(0);//make sure all frame is saved
    const data=genjson();
    const file=get(framefile);
    if (file) {
        const ok=await verifyPermission(file, true);
        if (ok) {
            const writable = await file.createWritable();
            await writable.write(data);
            await writable.close();
            dirty.set(false);
        }
    } else {
        dirty.set(false);
        const outfn=get(fileprefix)+'.json';
        createBrowserDownload(outfn,data);
    }
}
