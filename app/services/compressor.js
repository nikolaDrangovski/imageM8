const fs = require('fs');

let imageLoad = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

exports.compressImageModule = (file,data) => {
  // set destination for custom folder path if any

  let quality = data.quality * 0.01;
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
          width = img.width;
          height = img.height;
          console.log(quality)
          if(file.type = 'image/png'){
            width = img.width *= quality ;
            height = img.height *= quality;
          }
          elem.width = width;
          elem.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          console.log(file)
          compressAndWrite(ctx, file,data)
          break;
        case 'custom':
          width = data.width;
          height = data.height;
          elem.width = width;
          elem.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          compressAndWrite(ctx, file,data)
          break;
        case 'height':
          height = data.height;
          scaleFactor = height / img.height;
          elem.width = img.width * scaleFactor;
          elem.height = height
          ctx.drawImage(img, 0, 0, img.width * scaleFactor, height);
          compressAndWrite(ctx, file,data)
          break;
        case 'width':
          width = data.width;
          scaleFactor = width / img.width;
          elem.width = width
          elem.height = img.height * scaleFactor;
          ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
          compressAndWrite(ctx, file,data)
          break;

        default:
          ctx.drawImage(img, 0, 0, img.width, img.height);
          compressAndWrite(ctx, file,data)
        // code block
      }
      reader.onerror = error => alert(error);
    }, (err) => { console.log(err)})
  }
}

async function compressAndWrite(ctx, file,data ) {
  let force = data.forceJpg;
  let compressionType = file.type
  let path = data.customFolderPath;
  // if force png to jpg
  if(force == true){
    compressionType = 'image/jpeg'
  }
  console.log(force)
  let compressedFile
  compressedFile = await ctx.canvas.convertToBlob({ type: compressionType, quality});
  compressedFile.name = file.name;
  // check if file is in same directory 
  if(path == null){
    let fileOriginalExtension = force == true ? 'jpg' : file.name.split('.').pop()
   // widthField.disabled == true ? widthField.disabled = false : widthField.disabled = true;
  //  const fileOriginalExtension = file.name.split('.').pop();
    const fileName = file.name.split('.').slice(0, -1).join('_');
    compressedFile.name = fileName; 
    path = file.path.substr(0, file.path.lastIndexOf('/')) + '/' + fileName + '_image-m8.' + fileOriginalExtension;
  }else {
    path += "/" + file.name
  }
  var ImageReader = new FileReader();
  ImageReader.onload = function () {
    var buffer = new Buffer.from(ImageReader.result);
    fs.writeFile(path, buffer, {}, (err, res) => {
      if (err) {
        console.log(err)
        return
      }
      shell.openItem(path.substring(0, path.lastIndexOf("/") + 1));
    })
  }
  ImageReader.readAsArrayBuffer(compressedFile);

  
  //  const url = ctx.canvas.toDataURL('image/png', 0.8);

  /*
  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL(compressedFile);


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
 return compressedFile
*/
 /*
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
*/

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

