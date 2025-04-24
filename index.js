const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.PORT || 8080;
const authRouter = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
dbConnect();

// middleware => bodyparse using
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get("/", (req, res) =>{
    res.send("Hello Puja!");
});

// Router
app.use('/api/user', authRouter);

//always sned middleware after all the routes
app.use(notFound);
app.use(errorHandler);

//server 
app.listen(port, (err) =>{
    if(err){
        console.log("error while connected to the server");  
    }
    console.log(`server is running at the http://localhost:${port}`);
    
})