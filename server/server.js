const io = require("socket.io")(5174,{
    cors:{
        origin :"http://localhost:5173",
        methods : ['GET','POST']
    },
})


io.on("connection", socket => {
    socket.on('send-changes',(delta) =>{
        socket.broadcast.emit('receive-changes',delta);
    })
    console.log("connected")

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
})