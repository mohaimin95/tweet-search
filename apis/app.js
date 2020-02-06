require("dotenv").config();
const express = require("express");
const socketIO = require("socket.io");
const app = express();
const http = require("http");
const cors = require("cors");
app.use(cors({
    origin: ['https://localhost:2000','http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE']
  
  }));
//routes
app.get("/",(req,res)=>{
    res.send({status:"Running !"});
});

//controllers


let server = app.listen(process.env.PORT,(err)=>{
    if(err) {
        throw err;
    } else {
        console.log("Server running in PORT %s",process.env.PORT);
        
    }
});
const io = socketIO(server);
process.io = io;
io.on('connection',(socket)=>{
    console.log("Connected !");
    
    socket.on('disconnect',()=>{
        console.log("Disconnected !");
        
    })
    process.socket = socket;
});

const twitterApi = require("./app/routes/twitter-api");
app.use('/api/twitter-api',twitterApi)