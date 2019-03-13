'use strict';
const fs = require('fs');
const { shell } = require('electron'); // deconstructing assignment
const { dialog } = require('electron').remote
const { remote } = require('electron');

var { compressImageModule } = require('./app/services/compressor.js');

const qualityVal = document.getElementById('quality');
const qualitySpan = document.getElementById('quality-span');
const widthField =  document.getElementById('width');
const heightField =  document.getElementById('height');
const exportFolder =  document.getElementById('exportFolder');
const ratioType =  document.getElementById('ratioType');
const forceJpgField =  document.getElementById('forceJpg');
let customFolderPath = null;
// set initial values  
qualitySpan.innerHTML  = 90;
qualityVal.value = 90;
widthField.disabled = true;
heightField.disabled = true;
document.getElementById("file").addEventListener("click", () => {
    document.getElementById("file").value = '';
});
document.getElementById("file").addEventListener("input", (event) => {
 
    const data = {
        width:widthField.value,
        height:heightField.value,
        ratioType:ratioType.value,
        quality:qualityVal.value,
        customFolderPath:customFolderPath,
        forceJpg:forceJpgField.value
    };
    for(let i in event.target.files){
        compressImageModule(event.target.files[i],data)
    }
}); 
document.getElementById('chooseStorageFolder').addEventListener('click', _ => {
    dialog.showOpenDialog({ properties: ['openDirectory','createDirectory'] }, (folder) => {
        customFolderPath = folder[0];
        exportFolder.innerHTML = folder[0];
    })
  })

document.getElementById("quality").addEventListener("input", (event) => {
    qualitySpan.innerHTML  = event.target.value;
}); 

var aspectRatioChange = (e) => {
    ratioType.blur();
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
               }); 
                 var ctxToBlob = (ctx,file,quality) => {
                 ctx.canvas.toBlob((blob) => {
                 var ImageReader = new FileReader()
            ImageReader.onload = function(){
            var buffer = new Buffer.from(ImageReader.result); 
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
              shell.openItem(path.substring(0, path.lastIndexOf("/") + 1));
            })
        }
        ImageReader.readAsArrayBuffer(blob);
       
        
    }, 'image/png', quality *  0.01);   
}
*/