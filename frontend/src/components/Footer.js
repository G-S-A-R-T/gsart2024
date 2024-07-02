import React from 'react';

const Footer = () => {
    return (
        <footer className="footer mt-5 py-3 bg-dark text-white text-decoration-none d-flex justify-content-evenly">
            <div className="container text-center">
            <p>Follow @gsart</p>
            </div>
            <div className="container text-center">
                <p className="mb-0 ">
                    <a href="/privacy-policy" className="text-white text-decoration-none">Privacy Policy</a> |
                    <a href="/terms-of-service" className="text-white text-decoration-none"> Terms of Service</a> |
                    <a href="/contact-us" className="text-white text-decoration-none"> Contact Us</a>
                </p>
            </div>
            <div className="container text-end">
            <div className='d-flex gap-1 justify-content-center'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-globe-americas mb-2 " viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
                </svg>
                <b className='mb-1'> GSART</b>
            </div>
            <p className="mb-1">© 2024 Geospatial Statistical Analyzing Research Tool (GSART)</p>
            </div>
        </footer>
    );
};

export default Footer;
