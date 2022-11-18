import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logo from '../../utils/assets/logo.jpeg';
import axios from 'axios';

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import theme from '../../utils/theme';
import util from '../../utils/util';

import './RegisterView.css';

const emailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

const formValid = (formErrors, ...rest) => {
    let valid = true;
    // console.log(rest)

    //  Validate form errors being empty
    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    //  Validate the form was filled out
    Object.values(rest).forEach(val => {
        val === "" && (valid = false);
    });

    return valid;
}

let userPassword = "";

function RegisterView({ setUser }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [displayPassword, setDisplayPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [err, setErr] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        e.preventDefault();

        const { name, value } = e.target;
        let formError = formErrors;

        switch(name) {
            case "email":
                formError.email = emailRegex.test(value) ? "" : 'invalid email address';
                break;
            case "password":
                formError.password = value.length < 8 ? 'minimum 8 characters required' : "";
                userPassword = value;
                break;
            case "confirmPassword":
                formError.confirmPassword = value !== userPassword ? 'the passwords do not match' : "";
                break;
            default:
                break;
        }

        if (name === "firstName") {
            setFormErrors(formError);
            setFirstName(value);
        } else if (name === "lastName") {
            setFormErrors(formError);
            setLastName(value);
        }else if (name === "email") {
            setFormErrors(formError);
            setEmail(value);
        } else if (name === "password") {
            setFormErrors(formError);
            setPassword(value);
        } else if (name === "confirmPassword") {
            setFormErrors(formError);
            setConfirmPassword(value);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(formValid(formErrors, firstName, lastName, email, password)) {
            setErr('');
            axios.post(`${apiBaseUrl}v1/user/register`, {
                firstName,
                lastName,
                email,
                password,
                type: 'user'
            })
            .then(res => {
                // sessionStorage.setItem('token', res.data.token);
                // sessionStorage.setItem('user', JSON.stringify(res.data.user));
                // setUser(res.data.user);
                // history.push("/");
                setSuccess(res.data.msg);
            })
            .catch(err => setErr('Account with this email already exists'))
        } else {
            setErr('There is an empty field or invalid input');
            // console.error('FORM INVALID - DISPLAY ERROR MESSAGE');
        }
    }

    return (
        <main className="register-section">
            <header className="register-header">
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
                            <Link to='/login'>
                                <span className="btn btn-dark">Sign In</span>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
            <section className="register-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-4 offset-md-4">
                            <div className="d-flex justify-content-center align-items-center mb-4 mt-5">
                                <h2 className="">
                                    Sign up &nbsp;
                                    {/* <FontAwesomeIcon icon={faUserPlus} color={theme.colors.dark} /> */}
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
                                    <input type="text" name="firstName" className="form-control form-control-lg" placeholder="First name" value={firstName} onChange={handleChange} noValidate />
                                </div>
                                <div className="form-group mb-4">
                                    <input type="text" name="lastName" className="form-control form-control-lg" placeholder="Last name" value={lastName} onChange={handleChange} noValidate />
                                </div>
                                <div className="form-group mb-4">
                                    <input type="email" name="email" className="form-control form-control-lg" placeholder="Email" value={email} onChange={handleChange} noValidate />
                                    {formErrors.email.length > 0 && (
                                        <span className="text-danger">{formErrors.email}</span>
                                    )}
                                </div>
                                <div className="input-group">
                                    <input type={ displayPassword ? 'text' : 'password' } name="password" className="form-control form-control-lg" placeholder="Password" onChange={handleChange} noValidate />
                                    <div className="input-group-append">
                                        <span className="input-group-text" onClick={() => setDisplayPassword(!displayPassword)}>
                                            { displayPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }
                                        </span>
                                    </div>
                                </div>
                                {formErrors.password.length > 0 && (
                                    <span className="text-danger">{formErrors.password}</span>
                                )}
                                <div className="form-group my-4">
                                    <input type="password" name="confirmPassword" className="form-control form-control-lg" placeholder="Confirm password" value={confirmPassword} onChange={handleChange} noValidate />
                                    {formErrors.confirmPassword.length > 0 && (
                                        <span className="text-danger">{formErrors.confirmPassword}</span>
                                    )}
                                </div>
                                <p className="text-center">
                                    <button type="submit" className="btn btn-dark py-2 px-5 mt-4">Register</button>
                                </p>
                                <p className="text-center">
                                    Already have an account? &nbsp;
                                    <Link to='/login'> 
                                        Login
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

export default RegisterView;
