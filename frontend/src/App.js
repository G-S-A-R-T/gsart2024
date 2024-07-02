import './App.css';
import * as React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Home from './components/Home';
import Navbar from './components/Navbar';
import FactorState from './context/factors/FactorState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';
import Main from './components/Main';
import LoadingBar from 'react-top-loading-bar'
import Welcome from './components/Welcome';
import Footer from './components/Footer';





function App() {
  const [alert, setAlert] = useState(null);
  const [progress, setProgress] = useState(0)


  const showProgress=(progress)=>{
    setProgress(progress)
  }
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 1500)
  }
  return (
    <>
      <FactorState>
        <Router>
          <Navbar />
          <LoadingBar
            color='#f11946'
            progress={progress}
          />
          <Alert alert={alert} />
          <div className='container' style={{minHeight: '600px'}}>
            <Routes>
              <Route path="/" element={<Welcome showProgress={showProgress}/>} />
              <Route path="/home" element={<Home showAlert={showAlert} showProgress={showProgress}/>} />
              <Route path="/main" element={<Main showAlert={showAlert} showProgress={showProgress}/>} />
              <Route exact path='/login' element={<Login showAlert={showAlert} showProgress={showProgress}/>} />
              <Route exact path='/signup' element={<Signup showAlert={showAlert} showProgress={showProgress}/>} />
            </Routes>
          </div>
          <Footer/>
        </Router>
      </FactorState>
    </>
  );
}

export default App;
