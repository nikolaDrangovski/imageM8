'use strict';
var fs = require('fs');
const {dialog} = require('electron').remote;
document.getElementById("file").addEventListener("change", function (event) {
	comprssImage(event);
}); 

var comprssImage = (e) => {
    const width = 800;  // default val maintain aspect ratio? 
    const height = 450;  // def val, allow user to loc or unlock ratio and setup values
    const imageName = e.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]); 
    
    reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
                const elem = document.createElement('canvas');
                elem.width = width;
                elem.height = height;
                const ctx = elem.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

               /*
               const url = ctx.canvas.toDataURL('image/jpg', 0.8);
               const base64Data = url.replace(/^data:image\/png;base64,/, "");
               fs.writeFile('image.jpg', base64Data, 'base64', function (err) {
                    console.log(err);
               }); */

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
                    ImageReader.readAsArrayBuffer(blob)
                }, 'image/jpeg', 0.5);  // allow user to set quality
            },
            reader.onerror = error => console.log(error);
    };
}
