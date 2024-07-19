
const mongoose = require('mongoose')
const Document = require('./Document')
mongoose.connect('mongodb://localhost/google-doc-clone');

const DefaultValue = "";

const io = require("socket.io")(5174,{
    cors:{
        origin :"http://localhost:5173",
        methods : ['GET','POST']
    },
})


io.on("connection", socket => {
    socket.on('get-document',async documentID =>{
        const document = await findOrCreate(documentID);
        socket.join(documentID);
        socket.emit('load-document',document.data);
        socket.on('send-changes',(delta) =>{
            socket.broadcast.to(documentID).emit('receive-changes',delta);
        })
        socket.on('save-document',async data =>{
            await Document.findByIdAndUpdate(documentID,{data})
        })
    })
    
    console.log("connected")
    
})

async function findOrCreate(id)
{
    if(id==null)
    {
        return;
    }

    const document = await Document.findById(id);
    if(document) return document;
    return await Document.create({_id:id,data:DefaultValue});
}