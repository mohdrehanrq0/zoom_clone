const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const Server = require('http').Server(app);
const io = require('socket.io')(Server);
//peer js (WEBRTC)
const { ExpressPeerServer } = require('peer');
const peerServe = ExpressPeerServer(Server, { debug: true });

app.use('/peerjs', peerServe);
//initializing dotenv file path
dotenv.config({path: './config.env'});
const PORT = process.env.PORT || 8080;

//initializing body-parser to parse request  
app.use(bodyparser.urlencoded({extended: true}));

//initializing ejs engine
app.set('view engine','ejs');

//defining path to the assets
app.use('/js',express.static(path.resolve(__dirname, 'assets/js')));
app.use('/css',express.static(path.resolve(__dirname, 'assets/css')));

//using morgan 
app.use(morgan('tiny'));



//initializing Routes
app.use('/',require('./Server/routes/router'));

//initializing socket.io
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);

        socket.on('message', (message) => {
            io.to(roomId).emit('createMessage', message);
        })


        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
          })
        
        // console.log("Joined Room");
    })
})


Server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});