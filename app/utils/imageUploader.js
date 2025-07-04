"use strict"
const multer = require("multer")
const path =require("path")

//multer config
module.exports = multer({
    storage:multer.diskStorage({}),
    fileFilter:(req,file,cb)=>{
    let ext = path.extname(file.originalname);

    if(ext !==".jpg" && ext !==".jpeg" && ext !==".png" && ext !==".PNG" && ext !==".JPEG" && ext !==".JPG" && ext !==".jfif"){
        cb(new Error("File type is not supported"),false);
        return;
    }
    cb(null,true)

},
});