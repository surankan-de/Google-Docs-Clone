// import React from 'react'
import { useEffect,useCallback,useState} from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import "./styles.css"
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom'



const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];



export default function TextEditor() {
    const {id:documentID} = useParams();
    const [socket,setSocket] = useState(null);
    const [quill,setQuill] = useState(null);
    console.log(documentID);
    useEffect(() =>{
        const s =io("http://localhost:5174");
        setSocket(s);
        return ()=>{
            s.disconnect()
        }
    },[])
    useEffect(()=>{
        if(socket==null||quill==null)
        {
            return;
        }
        socket.once('load-document',document =>{
            quill.setContents(document)
            quill.enable();
        })
        socket.emit('get-document',documentID);
    },[socket,quill,documentID]);
    const wrapperRef = useCallback((wrapper) =>{
        if(wrapper==null) return
        wrapper.innerHTML = "";
        
        const editor = document.createElement("div")
        wrapper.append(editor);
        
        const q = new Quill (editor,{theme:"snow" , modules:{toolbar:toolbarOptions}});
        q.disable();
        q.setText('Loading..')
        setQuill(q);
    },[])
    useEffect(()=>{
        if(socket==null||quill==null)
        {
            return;
        }
        const interval = setInterval(() =>{
            socket.emit('save-document',quill.getContents());
        },1000)

        return () =>{
            clearInterval(interval);
        }
    },[socket,quill])
    useEffect(()=>{
        if(socket==null||quill==null)
        {
            return;
        }
        const handler = (delta)=>{
            
            quill.updateContents(delta);
        }
        socket.on('receive-changes',handler)

        return () =>{
            socket.off('receive-changes',handler);
        }
    },[socket,quill])

    useEffect(()=>{
        if(socket==null||quill==null)
        {
            return;
        }
        const handler = (delta,oldDelta,source)=>{
            if(source !=='user')
            {
                return;
            }
            socket.emit("send-changes",delta);
        }
        quill.on('text-change',handler)

        return () =>{
            quill.off('text-change',handler);
        }
    },[socket,quill])

    
    
    return ( <div  ref = {wrapperRef} className="container"></div>
  );
}
