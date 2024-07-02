import React from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {

  let location = useLocation();
  let nagivate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    nagivate("/login")
  }

  const isMainRoute = location.pathname === '/main';

  return (
    <>
      {!isMainRoute && (
        <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top" data-bs-theme="dark">
          <div className="container-fluid">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="mx-2" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
            </svg>
            <Link className="navbar-brand" to="/">GSART</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                </li>

                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/home" ? "active" : ""}`} aria-current="page" to="/home">Frequency Ratio</Link>
                </li>
              </ul>
              {!localStorage.getItem('token') ? <form className="d-flex" >
                <Link className="btn btn-primary active  mx-1" role="button" to="/login">Login</Link>
                <Link className="btn btn-primary active  mx-1" role="button" to="/signup">Signup</Link>
              </form> : <button onClick={handleLogout} className='btn btn-primary active '>Logout</button>}

            </div>
          </div>
        </nav>
      )}
    </>
  )
}

export default Navbar
