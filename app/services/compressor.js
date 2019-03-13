exports.getBase64 = (file) => {
  let readers = new FileReader();
  readers.readAsDataURL(file);
  readers.onload = event => {
    imageLoad(event.target.result).then(res => {
      console.log("loaded async image")
      console.log(res)
    })

    //   var base64Data = event.target.result.replace(/^data:image\/png;base64,/, "");
    //    console.log(base64Data)
  }
}
let imageLoad = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

exports.compressImageModule = (file) => {
  // read the file 
  let readers = new FileReader();
  readers.readAsDataURL(file);
  // maybe chek if file is image ? before continue
  readers.onload = event => {
    imageLoad(event.target.result).then(img => {
      const elem = new OffscreenCanvas(256, 256);
            let scaleFactor = 1;
            let ctx = elem.getContext("2d");
            let height = img.height;
            let width = img.width;
      /*
      const elem = document.createElement('canvas');
      let scaleFactor = 1;
      let ctx = elem.getContext('2d');
      let height = img.height;
      let width = img.width;
      */
      let data = {};
      data.ratioType = 'original'
      switch(data.ratioType) {
        case 'original':
            width = img.width;
            height = img.height;
            elem.width = width;
            elem.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            canvasToFile(ctx,file.type,file.name,file.lastModified,data.quality) 
        break;
        case 'custom':
            width = data.width;
            height = data.height;
            elem.width = width;
            elem.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            canvasToFile(ctx,file.type,file.name,file.lastModified,data.quality) 
        break;
        case 'height':
            height = data.height;
            scaleFactor = height / img.height;
            elem.width = img.width * scaleFactor;
            elem.height = height
            ctx.drawImage(img, 0, 0, img.width * scaleFactor, height);
            canvasToFile(ctx,file.type,file.name,file.lastModified,data.quality) 
        break;
        case 'width':
            width = data.width;
            scaleFactor = width / img.width;
            elem.width = width
            elem.height =  img.height * scaleFactor;
            ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
            canvasToFile(ctx,file.type,file.name,file.lastModified,data.quality) 
        break;
    
        default:
            ctx.drawImage(img, 0, 0,img.width, img.height);
            canvasToFile(ctx,file.type,file.name,file.lastModified,data.quality) 
          // code block
    }
    })
  }
}

 async function canvasToFile (ctx, fileType, fileName, fileLastModified, quality = 1) {
   
  let compressedFile
  compressedFile = await ctx.canvas.convertToBlob({ type: fileType, quality });
  compressedFile.name = fileName;
  compressedFile.lastModified = fileLastModified;
  console.log(compressedFile)
  return compressedFile

  /*
  let compressedFile
  if (typeof OffscreenCanvas === 'function' && canvas instanceof OffscreenCanvas) {
    compressedFile = await canvas.convertToBlob({ type: fileType, quality })
    compressedFile.name = fileName
    compressedFile.lastModified = fileLastModified
  } else {
    const dataUrl = canvas.toDataURL(fileType, quality)
    compressedFile = await getFilefromDataUrl(dataUrl, fileName, fileLastModified)
  }
  return compressedFile
  */
}

