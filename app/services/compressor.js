const fs = require('fs');
const os = require('os');
const platform = os.platform();
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
          
          if(file.type = 'image/png'){
            width = img.width *= quality ;
            height = img.height *= quality;
          }
          elem.width = width;
          elem.height = height;
          ctx.drawImage(img, 0, 0, width, height);
           
          compressAndWrite(ctx, file,data)
          break;
        /* case 'custom':
          if(data.width != '' && data.height  != ''){
            width = data.width;
            height = data.height;
            elem.width = width;
            elem.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            compressAndWrite(ctx, file,data)
          }else {
             new Notification('Missing values', {
              body: 'Please enter width and height'
            });
          }
          break; */
        case 'height':
          if(data.height  != ''){
            height = data.height;
            scaleFactor = height / img.height;
            elem.width = img.width * scaleFactor;
            elem.height = height
            ctx.drawImage(img, 0, 0, img.width * scaleFactor, height);
            compressAndWrite(ctx, file,data)
          }else {
            new Notification('Missing values', {
              body: 'Please enter height'
            });
        }
          break;
        case 'width':
          if(data.width  != ''){
            width = data.width;
            scaleFactor = width / img.width;
            elem.width = width
            elem.height = img.height * scaleFactor;
            ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
            compressAndWrite(ctx, file,data)
          }else {
            new Notification('Missing values', {
              body: 'Please enter width'
            });
        }
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
  console.log(data)
  let force = data.forceJpg;
  let compressionType = file.type
  let path = data.customFolderPath;
  // if force png to jpg
  if(force == true){
    compressionType = 'image/jpeg'
  }
  let compressedFile
  compressedFile = await ctx.canvas.convertToBlob({ type: compressionType, quality});
  compressedFile.name = file.name;
  let fileName = file.name.split('.').slice(0, -1).join('_');
  let fileOriginalExtension = force == true ? 'jpg' : file.name.split('.').pop();
  // check if file is in same directory 
  if(path == null){
    // chek if we are dealing with windows
    if(platform == 'win32'){  
      file.path = file.path.replace(/^\*[\\\/]/, '\\');
    }
     
    
    
    compressedFile.name = fileName; 
    path = platform == 'win32' ? file.path.substr(0, file.path.lastIndexOf('\\')) + '\\' + fileName + '_image-m8.' + fileOriginalExtension : file.path.substr(0, file.path.lastIndexOf('/')) + '/' + fileName + '_image-m8.' + fileOriginalExtension;
  }else {
    
    // if windwos change forward to backslash
    path = platform == 'win32' ? path + '\\' +  fileName + '.' + fileOriginalExtension : path + '/' + fileName + '.' + fileOriginalExtension;
  }
  var ImageReader = new FileReader();
  ImageReader.onload = function () {
    var buffer = new Buffer.from(ImageReader.result);
    fs.writeFile(path, buffer, {}, (err, res) => {
      if (err) {
       alert(err)
        return
      }
      
      /* new Notification('Compression done', {
        body: path
      }); */
 
    })
  }
  ImageReader.readAsArrayBuffer(compressedFile);
}

