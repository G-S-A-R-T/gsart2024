import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';



const Home = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
    // eslint-disable-next-line
  }, []);

  const handleCreateSession = async () => {
    props.showProgress(10)
    try {
      const response = await fetch(`http://localhost:5000/api/factor/createSession`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      props.showProgress(30)
      const json = await response.json()
      props.showProgress(70)
      if (json.success) {
        //save the session token and redirect
        sessionStorage.setItem('session-token', json.sessiontoken)
        navigate("/main")

      }
    } catch (error) {
      console.error('Error starting session:', error);
      props.showAlert("Failed to create data session! Please, try again.", "danger")
    }
    props.showProgress(100)
  };


  return (
    <>
      <div className="cover-container d-flex w-50 h-100 p-3 mx-auto flex-column text-center">

        <main className="px-3 mb-3">
          <div className="logo mb-5 ">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-globe-americas" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
            </svg>
          </div>
          <h1>Geospatial Statistical Analyzing Research Tool (GSART)</h1>
          <p className="lead fw-medium">Frequency Ratio </p>
        </main>
        <button onClick={handleCreateSession} className="btn btn-secondary fw-semibold py-2">Start Data Session</button>
      </div>
    </>
  )
}

export default Home
