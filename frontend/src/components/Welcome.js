import React from 'react'
import { Link } from "react-router-dom";

const Welcome = () => {
    const scrollToModule = () => {
        document.getElementById('module').scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <>
            <section className="mb-5 min-vh-100" >
                <div className="row text-center">
                    <div className="col-md-12">
                        <div className="logo mb-5 ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-globe-americas" viewBox="0 0 16 16">
                                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
                            </svg>
                        </div>
                        <h1>Geospatial Statistical Analyzing Research Tool (GSART)</h1>
                        <p className="lead fw-medium">Welcome to the GSART application. Start analyzing your geospatial data now!</p>
                        <button className="btn btn-lg btn-dark rounded-pill" onClick={scrollToModule}>Explore Now</button>
                    </div>

                </div>
            </section>
            <section className="mb-5 min-vh-100" id="module">
                <div className="row text-center">
                    <div className="col-md-12">
                        <h2>Frequency Ratio</h2>
                        <hr></hr>
                        <div>
            <p>
                The FR method assesses the spatial relationship between a dependent variable (e.g., landslide occurrence) and independent variables (e.g., slope, elevation, soil type). Calculation for each class (category) of an independent variable:
            </p>
            <p>
                <strong>FR(Class i) = Total Area of Class i / Area of Class i with the phenomenon</strong>
            </p>
            <p>Interpretation:</p>
            <ul className="list-unstyled">
                <li>FR &gt; 1: Positive correlation (higher probability of the phenomenon)</li>
                <li>FR &lt; 1: Negative correlation (lower probability)</li>
                <li>FR ≈ 1: Weak or no relationship</li>
            </ul>
        </div>
                        <Link className="btn btn-dark rounded-pill" to="/home">Calculate Frequency Ratio</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Welcome
