import React, { useState, useEffect } from 'react';
import axios from'axios';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../utils/assets/logo.jpeg';
import util from '../../utils/util';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Spinner from '../../components/Spinner/Spinner';

import './ResetPasswordView.css';

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ResetPasswordView({ match }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [displayPassword, setDisplayPassword] = useState(false);
    const [err, setErr] = useState();
    const [success, setSuccess] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const history = useHistory();

    useEffect(() => {
        if (match.params.resetLink === undefined) {
            history.push('/');
        } else {
            setIsLoading(false);
        }
    }, [history, match]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (e.target[0].value === e.target[1].value) {
            const newData = {
                resetLink: match.params.resetLink,
                newPassword: e.target[0].value
            }
        
            axios({
                method: 'put',
                url: `${apiBaseUrl}v1/user/resetpassword`,
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
        } else {
            setSuccess('');
            setErr("Invalid inputs or passwords don't match");
        }
    }
    return (
        <ErrorBoundary>
            {
                isLoading ? 
                    (
                        <div className="w-100 d-flex flex-column justify-content-center align-items-center" style={{opacity: '0.5', height: '100vh'}}>
                            <Spinner />
                        </div>
                    )
                    : (
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
                                                    Reset Password
                                                </h2>
                                            </div>
                                            {
                                                success ? 
                                                    <div className="alert alert-success">{success}<Link to='/login'>...Proceed to Login</Link></div>
                                                    : null
                                            }
                                            {
                                                err ? 
                                                    <div className="alert alert-danger">{err}</div>
                                                    : null
                                            }
                                            <form className="w-100" onSubmit={handleSubmit} noValidate>
                                                <div className="input-group mb-3">
                                                    <input type={ displayPassword ? 'text' : 'password' } name="password" className="form-control form-control-lg" placeholder="New Password" noValidate />
                                                    <div className="input-group-append">
                                                        <span className="input-group-text" onClick={() => setDisplayPassword(!displayPassword)}>
                                                            { displayPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="input-group">
                                                    <input type="password" name="confirmPassword" className="form-control form-control-lg" placeholder="Confirm Password" noValidate />
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
        </ErrorBoundary>
    )
}

export default ResetPasswordView;
