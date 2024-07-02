import React,{useEffect} from 'react'
import Factors from './Factors'
import { useNavigate } from 'react-router-dom';


const Main = (props) => {
    const { showAlert,showProgress } = props
    let navigate = useNavigate();
 
    useEffect(() => {
      if (!sessionStorage.getItem('session-token')) {
        navigate('/home');
      }
      // eslint-disable-next-line
    }, []);
  return (
    <div>
       <Factors showAlert={showAlert} showProgress={showProgress}/>
    </div>
  )
}

export default Main
