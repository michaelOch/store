import React, { useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";
import logo from '../../utils/assets/logo.jpeg';
import Spinner from '../../components/Spinner/Spinner';

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import theme from '../../utils/theme';
import util from '../../utils/util';

import './LoginView.css';
import theme from '../../utils/theme';

function LoginView({ location, setUser }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [displayPassword, setDisplayPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const history = useHistory();

    const handleChange = (e) => {
        e.preventDefault();

        const { name, value } = e.target;

        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if(email !== "" && password !== "") {
            axios.post(`${apiBaseUrl}v1/user/login`, {
                email,
                password
            })
            .then(res => {
                sessionStorage.setItem('token', res.data.token);
                // sessionStorage.setItem('token', JSON.stringify(res.data.token));
                sessionStorage.setItem('user', JSON.stringify(res.data.user));
                setUser(res.data.user);
                setLoading(false);
                if (res.data.user.type === "admin") {
                    history.push("/dashboard");
                } else if (location.state) {
                    history.push(location.state.referrer);
                } else {
                    history.push('/');
                }
            })
            .catch(err => {
                setErr(err.response.data.msg);
                setLoading(false);
            })
        } else {
            setErr('You have empty fields...');
            setLoading(false);
        }
    }

    return (
        <main className="login-section">
            {
                loading ? 
                    <div className="d-flex justify-content-center align-items-center" style={{position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', width: '100vw', height: '100vh', backgroundColor: theme.colors.lighterDark, opacity: 0.5, zIndex: '1500'}}>
                        <Spinner />
                    </div>
                    : null
            }
            <header className="login-header">
                <nav className="navbar navbar-expand-lg fixed-top py-3">
                    <div className="container-fluid">
                        <div className="d-flex align-items-center">
                            <Link to='/'>
                                <div className="d-flex align-items-center header-middle_brand">
                                    <img src={logo} alt="logo" className="d-block mr-1 logo" />
                                    <h3 className="mb-0 brand">Cherrystore</h3>
                                </div>
                            </Link>
                        </div>
                        <div className="d-flex align-items-center ml-auto">
                            <Link to='/register'>
                                <span className="btn btn-dark">Register</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
            <section className="login-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4 offset-md-4">
                            <div className="d-flex justify-content-center align-items-center mb-5 mt-4">
                                <h2 className="">
                                    Sign in &nbsp;
                                    {/* <FontAwesomeIcon icon={faSignInAlt} color={theme.colors.dark} /> */}
                                </h2>
                            </div>
                            {
                                err ? 
                                    <div className="alert alert-danger">{err}</div>
                                    : null
                            }
                            <form className="w-100" onSubmit={handleSubmit} noValidate >
                                <div className="form-group mb-4">
                                    <input type="email" name="email" className="form-control form-control-lg" placeholder="Email" onChange={handleChange} noValidate />
                                </div>
                                <div className="input-group mb-3">
                                    <input type={ displayPassword ? 'text' : 'password' } name="password" className="form-control form-control-lg" placeholder="Password" onChange={handleChange} noValidate />
                                    <div className="input-group-append">
                                        <span className="input-group-text" onClick={() => setDisplayPassword(!displayPassword)}>
                                            { displayPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }
                                        </span>
                                    </div>
                                </div>
                                <p className="text-center">
                                    <button type="submit" className="btn btn-dark py-2 px-5 mt-4">LOGIN</button>
                                </p>
                                <p className="text-center mt-4 mb-0">
                                    <Link to='/recover-password'>
                                        Forgot your password?
                                    </Link>
                                </p>
                                <p className="text-center">
                                    Don't have an account? &nbsp;
                                    <Link to='/register'> 
                                        Get Started
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default LoginView;
