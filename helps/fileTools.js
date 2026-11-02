const fs = require("fs");
const path = require('path');
const multer  = require('multer')
const sharp = require('sharp');

let fileNameOriginal;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = './client/uploads';
        
        // Empty the uploads folder before new down load
        try {
            if (fs.existsSync(uploadDir)) {
                const files = fs.readdirSync(uploadDir);
                for (const f of files) {
                    fs.unlinkSync(path.join(uploadDir, f));
                }
                console.log("Uploads folder emptied");
            }
        } catch (err) {
            console.error("Error while emptying the folder:", err);
        }

        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        //create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        fileNameOriginal = `original_temp_${uniqueSuffix}.jpg`;
        cb(null, fileNameOriginal)
    }
})
var upload = multer({ storage: storage })

/* 14mb img +  buffer filled memory? */
const convert = async () => {
    let res = [];
    const filePath = "./client/uploads/" + fileNameOriginal;

    const webpInfo = await sharp(filePath)
        .webp({ quality: 80 })
        .toFile("./client/uploads/output.webp");
    console.log(webpInfo);
    res.push(webpInfo);

    const avifInfo = await sharp(filePath)
        .toFormat('heif', { quality: 30, compression: 'av1' })
        .toFile("./client/uploads/output.avif");
    console.log(avifInfo);
    res.push(avifInfo);

    return res;
}

//fileread
const readFile = async (fileName) => { 
    try {
        const data = await fs.readFileSync(fileName, 'utf8');
        return data
    } catch (error) {
        return {error:error}
    }
}

const writeFile = async (fileName,dataContents) => {
    let res = {}
    try {
        await fs.writeFileSync(fileName, JSON.stringify(dataContents));
        res = {success:true, fileContents:dataContents}
    } catch (error) {
        res = {error:error}
        console.log(error)
    }
    return res;
}

const writeToFile = async (fileName, procedure = "append", what ) => { 
    console.log("wraitti");
    let res = {}
    
    const _dataContents = await readFile(fileName)
    
    if(!_dataContents.error){
        let dataContents = JSON.parse(_dataContents)
        console.log("kontsa enne", dataContents);

        if(procedure === "overwrite"){
            dataContents = what
            console.log("kontsa enne2", dataContents);
        }else{ //append
            dataContents.push( what )
            console.log("kontsa enne3", dataContents);
        }
        
        res = await writeFile(fileName,dataContents)
    }else{
        res.error = "Read failed"
        res.errReason = _dataContents.error.code
    }
    return res
}
const fileContentsToHTML = (data) => {
    const _messages = data.split("\n")
    const messages = _messages.map(
        (onemsg,i) => "<p class='row-"+i+"'>" + onemsg + "</p>"
    ) 
    return messages.join('');    
}
/*WATCHFILE toiminnot */
const fileWatch = (fileName) => fs.watchFile(fileName,
   
    // The options parameter is used to 
    //modify the behaviour of the method
    {
      // Specify the use of big integers
      // in the Stats object 
      bigint: false,
    
      // Specify if the process should 
      // continue as long as file is
      // watched
      persistent: true,
    
      // Specify the interval between
      // each poll the file
      interval: 1000,
    },
    (curr, prev) => {
        console.log("\nThe file was edited");
    
        // Show the time when the file was modified
        // console.log("Previous Modified Time", prev.mtime);
        // console.log("Current Modified Time", curr.mtime);
    
        // console.log(
        //     "The contents of the current file are:",
        //     fs.readFileSync(fileName, "utf8")
        // );
        notifyUser(fs.readFileSync(fileName, "utf8"),true);
    }
);

module.exports = {
    writeFile: (file,procedure,what) => writeToFile("./data/" + file + ".json",procedure,what),
    readFile: (file) => readFile("./data/" + file + ".json"),
    fileContentsToHTML: (file) => fileContentsToHTML(file),
    upload:upload,
    convert:convert,
    fileNameOriginal: () => {return fileNameOriginal}
}