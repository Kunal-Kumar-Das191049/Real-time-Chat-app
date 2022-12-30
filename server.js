const express = require('express')
const app = express()
const http = require('http').createServer(app)
const PORT=process.env.PORT || 3000
http.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`)
})
app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


// socket
const users={};

const io = require('socket.io')(http)

io.on('connection', (socket) =>{
    console.log('Connected...')

//If any new user joins, let other users connected to the server know!
socket.on('new-user-joined', name =>{
    //console.log("New user", name);
     users[socket.id]=name;
     socket.broadcast.emit('user-joined', name);
 });

 //if someone sends a message, broadcast it to other people

 socket.on('send', message =>{
     socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
 });
  // If someone leaves the chat, let others know!

 socket.on('disconnect', message =>{
     socket.broadcast.emit('left', users[socket.id]);
     delete users[socket.id];
 });


    socket.on('message', (message) => {
        socket.broadcast.emit('message', message)
    })
})







   