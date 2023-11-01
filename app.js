'use strict';

const express = require("express");
const   app = express(), 
        bodyParser = require('body-parser');

const path = require('path');
const url = require('url');
const router = express.Router();

const fileTools = require('./helps/fileTools.js');

app.use(bodyParser.json());
const randLocation = Math.floor(Math.random() * (1000000000000 - 100000) + 100000)
                                                                    //https://expressjs.com/en/starter/static-files.html
app.use('/static' + randLocation, express.static(path.join(__dirname, 'client')))  //creates "virtual" directory static
                                                                    //and tell where the files are
                                                                    //eli client uploads muuttuu käyttäjän silmään
                                                                    //./client/uploads -> ./static327362/uploads

app.get("/mainView", async (req, res) => { //form creator
    app.set('view engine', 'pug');

    console.log("Eazy");
    res.render('mainView', { 
      title: 'Eka tieto', 
      randLocation:randLocation,
    });
})

//fileupload 
app.put('/uploadFile', fileTools.upload.single('upload-file'), async function (req, res, next) {
    console.log("File upload started")
    const dataMod = [{
        msg:"File upload complete: " + req.file.originalname,
        file:req.file,
        randLocation: randLocation
    }]
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(dataMod));
    console.log("File upload complete", req.file.originalname) 
});
app.post('/convertFile', async (req, res) => {
    console.log("File convert started")
    const dataMod = [{
        msg:"File convert complete",
    }]
    dataMod.push( await fileTools.convert("original_temp.jpg") )
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(dataMod));
    console.log("File convert ended")  
})

//REST API
app.get("/api", async (req, res) => { 
    let dataMod = []
    dataMod[0] = { hello:"hello" }
  
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(dataMod, null, 3));
});

//filesystem REST
app.post("/fileSystem", async (req, res) => { //read
    let dataMod = await fileTools.readFile("testdata");  
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(dataMod));
});
app.put("/fileSystem", async (req, res) => { //write
    res.setHeader('Content-Type', 'application/json');
    const dataToAdd = {msg:req.body.msg}
    const dataMod = [{
        msg:"putista moi",
        body:req.body
    }]
    const d = await fileTools.writeFile("testdata","append",dataToAdd)
    dataMod.push(d)
    
    res.end(JSON.stringify(dataMod));
});

//add the router
const portToUse = 3000; 
app.use('/mainView', router); 

app.listen(process.env.port || portToUse, () => {
  console.clear();
  console.log("Application started and Listening on port " + portToUse);
  console.log("http://localhost:" + portToUse + "/mainView");
});