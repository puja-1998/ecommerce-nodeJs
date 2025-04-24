const express = require('express');
const app = express();
const dotenv = require('dotenv').config();

const port = process.env.PORT || 8080;

app.get("/", (req, res) =>{
    res.send("Hello Puja!");
});

app.listen(port, (err) =>{
    if(err){
        console.log("error while connected to the server");  
    }
    console.log(`server is running at the http://localhost:${port}`);
    
})