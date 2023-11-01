'use strict';

const express = require("express");
const app = express();
const path = require('path');
const url = require('url');
const router = express.Router();

app.get("/eventSteamView", async (req, res) => { //form creator
    app.set('view engine', 'pug');

    console.log("Eazy");
    res.render('mainView', { 
      title: 'Eka tieto', 
      info2:"Toinen tieto",
    });
})
app.get("/api", async (req, res) => { //REST API
  let dataMod = []
  dataMod[clientIndex] = { hello:"hello" }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dataMod, null, 3));
});

//add the router
const portToUse = 3000; 
app.use('/api', router); 

app.listen(process.env.port || portToUse, () => {
  console.clear();
  console.log("Application started and Listening on port " + portToUse);
  console.log("http://localhost:" + portToUse);
});