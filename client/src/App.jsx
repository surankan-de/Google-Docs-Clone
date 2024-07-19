import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TextEditor from './TextEditor'
import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Navigate
} from 'react-router-dom';
// import { Recoverable } from 'repl'
import {v4 as uuidV4} from 'uuid'  

// function

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        
        
        <Route path ='/documents/:id'element ={<TextEditor/>} />
        <Route exact path = "/"  element = {<Navigate to={`/documents/${uuidV4()}`} replace/>}/> 
        
        
        
      </Routes>
      
    </Router>
    
      
  );
}

export default App
