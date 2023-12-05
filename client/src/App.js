
import './App.css';
import { useEffect, useState } from 'react';
import { BASE_URL } from './config/urls';
import Home from './pages/Home';
import {
  BrowserRouter as Router,
  Routes, 
  Route
} from "react-router-dom"



function App() {
  const [data, setData] = useState([])

  //used to test getting data from backend
  useEffect(()=>{
    fetch(`${BASE_URL}/testinfo`).then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )

  },[])
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path='/testinfo' element={<Home/>} />
        </Routes>

      </Router>

     
    </div>
  );
}

export default App;
