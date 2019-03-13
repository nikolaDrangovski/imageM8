const fs = require('fs');
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

exports.compressImageModule = (file,data) => {
  // read the file 
  let reader = new FileReader();
  reader.readAsDataURL(file);
  // maybe chek if file is image ? before continue
  reader.onload = event => {
    imageLoad(event.target.result).then(img => {
      
      const elem = new OffscreenCanvas(10, 10);
      let scaleFactor = 1;
      let ctx = elem.getContext("2d");
      let height = img.height;
      let width = img.width;
      
      switch (data.ratioType) {
        case 'original':
          width = img.width *= 0.7;
          height = img.height *= 0.7;
          elem.width = width;
          elem.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          console.log(file)
          compressAndWrite(ctx, file.type, file.name, file.lastModified, data.quality);
          break;
        case 'custom':
          width = data.width;
          height = data.height;
          elem.width = width;
          elem.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          compressAndWrite(ctx, file.type, file.name, file.lastModified, data.quality)
          break;
        case 'height':
          height = data.height;
          scaleFactor = height / img.height;
          elem.width = img.width * scaleFactor;
          elem.height = height
          ctx.drawImage(img, 0, 0, img.width * scaleFactor, height);
          compressAndWrite(ctx, file.type, file.name, file.lastModified, data.quality)
          break;
        case 'width':
          width = data.width;
          scaleFactor = width / img.width;
          elem.width = width
          elem.height = img.height * scaleFactor;
          ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
          compressAndWrite(ctx, file.type, file.name, file.lastModified, data.quality)
          break;

        default:
          ctx.drawImage(img, 0, 0, img.width, img.height);
          compressAndWrite(ctx, file.type, file.name, file.lastModified, data.quality)
        // code block
      }
      reader.onerror = error => alert(error);
    })
  }
}

async function compressAndWrite(ctx, fileType, fileName, fileLastModified, quality = 1) {
  console.log("ctx => " + ctx)
  console.log("fileType => " + fileType)
  console.log("fileName => " + fileName)
  console.log("fileLastModified => " + fileLastModified)
  console.log("quality => " + quality)
  let compressedFile
  compressedFile = await ctx.canvas.convertToBlob({ type: fileType, quality });
  compressedFile.name = fileName;
  compressedFile.lastModified = fileLastModified;
  console.log(compressedFile)
  var ImageReader = new FileReader();
  ImageReader.onload = function () {
    var buffer = new Buffer.from(ImageReader.result);
    fs.writeFile('/Users/burial/Downloads/imasdasdasdasdas.png', buffer, {}, (err, res) => {
      if (err) {
        console.log(err)
        return
      }
    })
  }
  ImageReader.readAsArrayBuffer(compressedFile);

  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL(compressedFile);

  //  const url = ctx.canvas.toDataURL('image/png', 0.8);

  /*
    const base64Data = imageUrl.replace(/^data:image\/png;base64,/, "");
               fs.writeFile('image.png', base64Data, 'base64', function (err) {
                    console.log(err);
               });


  fs.writeFile('/Users/burial/Downloads/imasdasdasdasdas.png', data, {}, (err, res) => {
    if(err){
       console.log(err)
        return
    }
})
*/
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

