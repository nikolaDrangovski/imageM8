'use strict';
var fs = require('fs');
const {shell} = require('electron') // deconstructing assignment

const qualityVal = document.getElementById('quality');
const qualitySpan = document.getElementById('quality-span');
const widthField =  document.getElementById('width');
const heightField =  document.getElementById('height');
const type =  document.getElementById('type');
// set initial values  
qualitySpan.innerHTML  = 90;
qualityVal.value = 90;
widthField.disabled = true;
heightField.disabled = true;

document.getElementById("file").addEventListener("change", (event) => {
    const data = {width:widthField.value,height:heightField.value,type:type.value,quality:qualityVal.value};
    for(let i in event.target.files){
          comprssImage(event.target.files[i],data);
    }
}); 

document.getElementById("quality").addEventListener("input", (event) => {
    qualitySpan.innerHTML  = event.target.value;
}); 

var comprssImage = (file,data) => {
    const reader = new FileReader();
    console.log(file)
    reader.readAsDataURL(file);
    reader.onload = event => {

        const imageName = file.name;
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
                    ctxToBlob(ctx,imageName,data.quality) 
                break;
                case 'custom':
                    width = data.width;
                    height = data.height;
                    elem.width = width;
                    elem.height = height;
                    ctx = elem.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    ctxToBlob(ctx,imageName,data.quality) 
                break;
                case 'height':
                    height = data.height;
                    scaleFactor = height / img.height;
                    elem.width = img.width * scaleFactor;
                    elem.height = height //img.height * scaleFactor;
                    ctx = elem.getContext('2d');
                    ctx.drawImage(img, 0, 0, img.width * scaleFactor, height);
                    ctxToBlob(ctx,imageName,data.quality) 
                break;
                case 'width':
                    width = data.width;
                    scaleFactor = width / img.width;
                    elem.width = width
                    elem.height =  img.height * scaleFactor;
                    ctx = elem.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);
                    ctxToBlob(ctx,imageName,data.quality) 
                break;
            
                default:
                  // code block
            }
        },
            reader.onerror = error => console.log(error);
    };
}

var ctxToBlob = (ctx,imageName,quality) => {
    ctx.canvas.toBlob((blob) => {
        var ImageReader = new FileReader()
        ImageReader.onload = function(){
            var buffer = new Buffer.from(ImageReader.result)
            fs.writeFile(imageName.split('.').slice(0, -1).join('.')+'.jpg', buffer, {}, (err, res) => {
                if(err){
                    console.error(err)
                    return
                }
                console.log('saved')
            })
        }
        ImageReader.readAsArrayBuffer(blob);
        shell.openItem('/Users/burial/Work/imageM8/imageM8');
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

           