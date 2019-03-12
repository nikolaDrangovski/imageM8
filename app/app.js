'use strict';
const fs = require('fs');
const { shell } = require('electron'); // deconstructing assignment
const { dialog } = require('electron').remote
const { remote } = require('electron');
const { app } = remote;
 

const basepath = app.getAppPath();
console.log(basepath)


const qualityVal = document.getElementById('quality');
const qualitySpan = document.getElementById('quality-span');
const widthField =  document.getElementById('width');
const heightField =  document.getElementById('height');
const type =  document.getElementById('type');
const forcePngField =  document.getElementById('forcePng');
let folderPath = null;
// set initial values  
qualitySpan.innerHTML  = 90;
qualityVal.value = 90;
widthField.disabled = true;
heightField.disabled = true;

document.getElementById("file").addEventListener("change", (event) => {
    
    const data = {
        width:widthField.value,
        height:heightField.value,
        type:type.value,
        quality:qualityVal.value
    };
    for(let i in event.target.files){
          comprssImage(event.target.files[i],data);
    }
}); 
document.getElementById('chooseStorageFolder').addEventListener('click', _ => {
    dialog.showOpenDialog({ properties: ['openDirectory','createDirectory'] }, (folder) => {
        
         folderPath = folder[0];
    })
  })

document.getElementById("quality").addEventListener("input", (event) => {
    console.log(forcePngField.checked)
    qualitySpan.innerHTML  = event.target.value;
}); 

var comprssImage = (file,data) => {
    const reader = new FileReader();
    console.log(file)
    reader.readAsDataURL(file);
    reader.onload = event => {

        
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            // const width = 600;
            const elem = document.createElement('canvas');
            let scaleFactor = 1;
            let ctx = elem.getContext('2d');
            let height = img.height;
            let width = img.width;
            // probably could be done with better logic
            switch(data.type) {
                case 'original':
                    width = img.width;
                    height = img.height;
                    elem.width = width;
                    elem.height = height;
                    ctx = elem.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    ctxToBlob(ctx,file,data.quality) 
                break;
                case 'custom':
                    width = data.width;
                    height = data.height;
                    elem.width = width;
                    elem.height = height;
                    ctx = elem.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    ctxToBlob(ctx,file,data.quality) 
                break;
                case 'height':
                    height = data.height;
                    scaleFactor = height / img.height;
                    elem.width = img.width * scaleFactor;
                    elem.height = height //img.height * scaleFactor;
                    ctx = elem.getContext('2d');
                    ctx.drawImage(img, 0, 0, img.width * scaleFactor, height);
                    ctxToBlob(ctx,file,data.quality) 
                break;
                case 'width':
                    width = data.width;
                    scaleFactor = width / img.width;
                    elem.width = width
                    elem.height =  img.height * scaleFactor;
                    ctx = elem.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
                    ctxToBlob(ctx,file,data.quality) 
                break;
            
                default:
                  // code block
            }
        },
            reader.onerror = error => console.log(error);
    };
}

var ctxToBlob = (ctx,file,quality) => {
    ctx.canvas.toBlob((blob) => {
        var ImageReader = new FileReader()
        ImageReader.onload = function(){
            var buffer = new Buffer.from(ImageReader.result); 
            //  file.type.split('/').pop()
            let originalFileName = file.path.split('/').pop();
            let originalFileExt = originalFileName.split('.').pop();
            let originalFilePathAndName = file.path.split('.').shift();
            let path =  originalFilePathAndName + "_imagem8" +'.'+ originalFileExt;
            if(folderPath != null && folderPath +'/'+ file.name != file.path){
                path = folderPath +'/'+ file.name;
            }
            fs.writeFile(path, buffer, {}, (err, res) => {
                if(err){
                   alert(err)
                    return
                }
                alert("saved")
               // shell.openItem(basepath);
            })
        }
        ImageReader.readAsArrayBuffer(blob);
       
        document.getElementById("file").value = "";
    }, 'image/jpeg', quality *  0.01);  // allow user to set quality
}
var aspectRatioChange = (e) => {
    type.blur();
    switch(e.target.value) {
        case 'original':
            widthField.disabled = true;
            heightField.disabled = true;
            restValues();
        break;
        case 'custom':
            widthField.disabled = false;
            heightField.disabled = false;
            restValues();
        
        break;
        case 'height':
            widthField.disabled = true;
            heightField.disabled = false;
            restValues();
           
        break;
        case 'width':
            widthField.disabled = false;
            heightField.disabled = true;
            restValues();
        // widthField.disabled == true ? widthField.disabled = false : widthField.disabled = true;
        break;

        default:
          // code block
      }

}
//reset form values
var restValues = () =>{
    widthField.value = null;
    heightField.value = null;
}
  /*
               const url = ctx.canvas.toDataURL('image/jpg', 0.8);
               const base64Data = url.replace(/^data:image\/png;base64,/, "");
               fs.writeFile('image.jpg', base64Data, 'base64', function (err) {
                    console.log(err);
               }); */

    