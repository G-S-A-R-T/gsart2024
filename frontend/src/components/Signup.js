import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        props.showProgress(10)
        e.preventDefault();
        const { name, email, password } = credentials;
        try {
            const response = await fetch(`http://localhost:5000/api/user/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });
            props.showProgress(30)
            const json = await response.json()
            props.showProgress(70)
            if (json.success) {
                //save the auth token and redirect
                localStorage.setItem('token', json.authtoken)
                navigate("/login")
                props.showAlert("Account Created Successfully", "success")

            } else {
                props.showAlert("Invalid Credentials", "danger")
            }
        } catch (error) {
            console.error('Error starting session:', error);
            props.showAlert("Failed to sign up! Please, try again.", "danger")
        }
        props.showProgress(100)
    }


    const onChange = (e) => {

        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }





    return (
        <div className="container">
            <main className="form-signin w-50 m-auto mt-5">
                <form onSubmit={handleSubmit}>
                    <div className='d-flex gap-3 mb-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-globe-americas mb-2" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
                        </svg>
                        <h2 className='mb-3'>Create an account to use GSART</h2>
                    </div>
                    <div className="mb-3 form-floating">
                        <input type="text" placeholder='name' className="form-control" id="name" name="name" value={credentials.name} onChange={onChange} aria-describedby="emailHelp" />
                        <label htmlFor="name" className="form-label">Enter your name</label>
                    </div>
                    <div className="mb-3 form-floating">
                        <input type="email" placeholder='email' className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />
                        <label htmlFor="email" className="form-label">Email address</label>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3 form-floating">
                        <input type="password" placeholder='password' className="form-control" id="password" name="password" value={credentials.password} onChange={onChange} minLength={5} required />
                        <label htmlFor="password" className="form-label">Password</label>
                    </div>
                    <div className="mb-5 form-floating">
                        <input type="password" placeholder='confirm password' className="form-control" id="cpassword" name="cpassword" value={credentials.cpassword} onChange={onChange} minLength={5} required />
                        <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    </div>

                    <button type="submit" className="btn btn-secondary w-100 py-2 fw-semibold" >Sign up</button>
                </form>
            </main>

        </div>
    )
}

export default Signup
