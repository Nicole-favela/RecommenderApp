
import './App.css';
import { useEffect, useState } from 'react';
import { BASE_URL } from './config/urls';
import Home from './pages/Home';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import { PrivateRoute } from './utils/PrivateRoute';

import {
  BrowserRouter as Router,
  Routes, 
  Route
} from "react-router-dom"



function App() {
  const [data, setData] = useState([])

 
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path='/' element={
            <PrivateRoute>
                <Home/>
            </PrivateRoute>
          } />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/login' element={<Login/>} />
        </Routes>

      </Router>

     
    </div>
  );
}

export default App;
