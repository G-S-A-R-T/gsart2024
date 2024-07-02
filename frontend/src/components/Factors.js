import React, { useContext, useEffect, useState } from 'react'
import factorContext from '../context/factors/factorContext';
import Factoritem from './Factoritem';
import AddFactor from './AddFactor';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';


const Factors = (props) => {
  const context = useContext(factorContext);
  let navigate = useNavigate();
  const { factors, getFactors, downloadFactorResults, exitFactor } = context;
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } 
    // eslint-disable-next-line
  }, []);



  const [displayData, setDisplayData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const handleDisplayData = async () => {
    // Set displayData to true when the button is clicked
    setDisplayData(true);
    setLoading(true);

    try {
      await getFactors();
    } catch (error) {
      console.error('Error fetching factors:', error);
      setErrorMessage('Error fetching factors. Please try again.');

    }
    setLoading(false);
  };
  const handleDownloadData = async () => {
    setLoading(true);
    try {

      await downloadFactorResults()
    } catch (error) {
      console.error('Error downloading data:', error);

    }
    setLoading(false);
  };


  const handleExit = async () => {
    props.showProgress(10)
    try {
      props.showProgress(30)
      await exitFactor();
      props.showProgress(70)
      sessionStorage.removeItem('session-token');
      navigate("/home")
    } catch (error) {
      console.error('Error occured:', error);
    }
    props.showProgress(100)

  };



  return (
    <>
      {/*  <!-- Modal --> */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              Are you sure you want to exit?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleExit} data-bs-dismiss="modal">Confirm</button>
            </div>
          </div>
        </div>
      </div>
      {/*  <!-- Modal --> */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary active mx-1" data-bs-toggle="modal" data-bs-target="#exampleModal">Exit</button>
      </div>

      <AddFactor showAlert={props.showAlert} showProgress={props.showProgress} />

      <div className="container">
        <h2>Factors</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <button onClick={handleDisplayData} className="btn btn-success active mx-1 mb-3">Display Data</button>
        <button onClick={handleDownloadData} disabled={factors.length === 0} className="btn btn-success active mx-1 mb-3">Download Data</button>
        {loading && <Spinner />}
        {!loading && displayData && (
          <>
            {factors.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>SL.NO</th>
                    <th>Data Layer</th>
                    <th>Class</th>
                    <th>Class Pixel</th>
                    <th>Total Class Pixel</th>
                    <th>% Class Pixel</th>
                    <th>Flood Pixel</th>
                    <th>Total Flood Pixel</th>
                    <th>% Flood Pixel</th>
                    <th>FR</th>
                    <th>Total FR</th>
                    <th>RF</th>
                    <th>RF(NON%)</th>
                    <th>RF(INT)</th>
                    <th>MIN RF</th>
                    <th>MAX RF</th>
                    <th>(MAX-MIN)RF</th>
                    <th>(MAX-MIN)MIN RF</th>
                    <th>PR</th>
                  </tr>
                </thead>
                <tbody>
                  {factors.map((factor, index) => (
                    <Factoritem key={Math.random()} factor={factor} index={index} />
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No data available.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Factors
