import React, { useState } from 'react';
import axios from'axios';
import logo from '../../utils/assets/logo.jpeg';
import util from '../../utils/util';

import './RecoverPasswordView.css';

function RecoverPasswordView() {

    const apiBaseUrl = util.apiBaseUrl;

    const [err, setErr] = useState();
    const [success, setSuccess] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const newData = {
            email: e.target[0].value
        }
    
        axios({
            method: 'post',
            url: `${apiBaseUrl}v1/user/forgotpassword`,
            data: newData
            })
            .then(res => {
                setErr('');
                setSuccess(res.data.msg);
            })
            .catch(err => {
                setSuccess('');
                setErr(err.response.data.msg);
            });
    }
    return (
        <main className="recover-password">
            <header className="recover-password-header">
                <nav className="navbar navbar-expand-lg fixed-top py-3">
                    <div className="container-fluid">
                        <div className="d-flex align-items-center">
                            <img src={logo} alt="logo" className="d-block mr-1 logo" />
                            <h2 className="mb-0">Wellocity</h2>
                        </div>
                    </div>
                </nav>
            </header>
            <section className="d-flex align-items-center recover-password-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <div className="d-flex justify-content-center align-items-center mb-5">
                                <h2 className="">
                                    Recover Password
                                </h2>
                            </div>
                            {
                                success ? 
                                    <div className="alert alert-success">{success}</div>
                                    : null
                            }
                            {
                                err ? 
                                    <div className="alert alert-danger">{err}</div>
                                    : null
                            }
                            <form className="w-100" onSubmit={handleSubmit} noValidate>
                                <div className="form-group mb-4">
                                    <input type="email" name="email" className="form-control form-control-lg" placeholder="Email" noValidate />
                                </div>
                                <p className="text-center">
                                    <button type="submit" className="btn btn-primary py-2 px-5 mt-4">Submit</button>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default RecoverPasswordView;
