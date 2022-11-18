import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Link } from "react-router-dom";
import DashLayout from '../../../layout/DashLayout/DashLayout';
import Pagination from '../../../components/Pagination/Pagination';
import Spinner from '../../../components/Spinner/Spinner';

import { faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './UsersView.css';
import theme from '../../../utils/theme';
import util from '../../../utils/util'
import { faUser } from '@fortawesome/free-regular-svg-icons';

const emailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

const formValid = (formErrors, ...rest) => {
    let valid = true;

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

function UsersView({ user, setUser }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [users, setusers] = useState([]);
    const [curUser, setCurUser] = useState();
    // const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(15);

    //  Get Current Users
    const indexOfLastProduct = currentPage * usersPerPage;
    const indexOfFirstProduct = indexOfLastProduct - usersPerPage;
    const currentUsers = users.slice(indexOfFirstProduct, indexOfLastProduct);

    //  Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setLoading(true);
        axios.get(`${apiBaseUrl}v1/user/`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setusers(res.data.users)
            setLoading(false);
        })
        .catch(err => {
            console.log(err)
            setLoading(false);
        })
    }, [apiBaseUrl]);

    const handleView = (e) => {
        e.preventDefault();
        setLoading2(true);
        axios.get(`${apiBaseUrl}v1/user/admin/${e.target[0].value}`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setCurUser(res.data.user)
            setLoading2(false);
        })
        .catch(err => {
            console.log(err)
            setLoading2(false);
        })
    }

    //  For Adding an Admin User
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [err, setErr] = useState("");

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

        if (name === "name") {
            setFormErrors(formError);
            setName(value);
        } else if (name === "email") {
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
        const type = e.target[0].value;

        if(formValid(formErrors, name, email, password)) {
            setErr('');
            axios.post(`${apiBaseUrl}v1/user/admin/register`, {
                name,
                email,
                password,
                type
            })
            .then(data => console.log(data))
            .catch(err => console.log(err))
        } else {
            setErr('There is an empty field or invalid input');
            console.error('FORM INVALID - DISPLAY ERROR MESSAGE');
        }
    }

    // const handleDelete = (e) => {
    //     e.preventDefault();
    //     axios.delete(`${apiBaseUrl}v1/user/admin/${e.target[0].value}`, {
    //         headers: {
    //             'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    //         }
    //     })
    //     .then(res => {
    //         setRefresh(!refresh);
    //     })
    //     .catch(err => console.log(err))
    // }

    return (
        <DashLayout user={user} setUser={setUser} title={`Users`}>
            <main className="dashboard-users">
                <section className="container-fluid">
                    <div className="p-3 table-wrapper">
                        <span className="d-inline-block mb-2 btn btn-sm btn-secondary" data-toggle="modal" data-target="#addModal">Add Admin</span>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th colSpan="1"></th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Date Registered</th>
                                        <th scope="col">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ? 
                                            <tr>
                                                <td colSpan="5" className="border-0">
                                                    <Spinner />
                                                </td>
                                            </tr>
                                        :
                                        currentUsers.map((user) => {
                                            const date = new Date(user.date)
                                            return (<tr key={user._id}>
                                                <td className="p-2">
                                                    <div className="d-flex justify-content-center align-items-center icon" title="view" data-toggle="modal" data-target="#viewModal">
                                                        <form onSubmit={handleView} noValidate>
                                                            <input type="hidden" name="viewId" value={user._id} />
                                                            <button type="submit" name="viewbtn" className="transparent-btn">
                                                                <FontAwesomeIcon icon={faEye} color={theme.colors.dark} />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                                {/* <td className="p-2">
                                                    <div className="d-flex justify-content-center align-items-center icon" data-toggle="tooltip" title="delete">
                                                        <form onSubmit={handleDelete} noValidate>
                                                            <input type="hidden" name="deleteId" value={user._id} />
                                                            <button type="submit" name="deletebtn" className="transparent-btn">
                                                                <FontAwesomeIcon icon={faTrash} color={theme.colors.dark} />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td> */}
                                                <td className="p-2">{user.name}</td>
                                                <td className="p-2">{user.email}</td>
                                                <td className="p-2">{date.toLocaleString()}</td>
                                                <td className="p-2">{user.type}</td>
                                            </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex align-items-center justify-content-end">
                            <Pagination 
                                numberPerPage={usersPerPage} 
                                totalNumber={users.length} 
                                paginate={paginate}
                            />
                        </div>
                    </div>

                    {/* View User Modal */}
                    <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="viewModalLabel">{curUser ? curUser.name : null}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            {
                                loading2 ? 
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Spinner />
                                    </div>
                                :
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-4 mt-3">
                                        <div className="d-flex justify-content-center align-items-center p-4">
                                            <FontAwesomeIcon icon={faUser} size="6x" />
                                        </div>
                                    </div>
                                    <div className="col-md-8 mt-3">
                                        <div className="">
                                            <p className="">
                                                <span className="font-weight-bold">Name: </span>{curUser ? curUser.name : null}
                                            </p>
                                            <p className="">
                                                <span className="font-weight-bold">Email: </span>{curUser ? curUser.email : null}
                                            </p>
                                            <hr />
                                            <p className="">
                                                <span className="font-weight-bold">Mobile: </span>{curUser ? curUser.mobile: null}
                                            </p>
                                            <p className="">
                                                <span className="font-weight-bold">Alternative Mobile: </span>{curUser ? curUser.altMobile: null}
                                            </p>
                                            <hr />
                                            <p className="">
                                                <span className="font-weight-bold">Address: </span>{curUser ? curUser.address : null}
                                            </p>
                                            <hr />
                                            <p className="">
                                                <span className="font-weight-bold">User Since: </span>{curUser ? (new Date(curUser.date)).toLocaleString() : null}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                            <div className="modal-footer"></div>
                            </div>
                        </div>
                    </div>
                    {/* Add User Modal */}
                    <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="addModalLabel">Add Admin User</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="">
                                        <span className="d-block mb-2 text-center text-danger">{err}</span>
                                        <form onSubmit={handleSubmit} noValidate>
                                            <div className="form-group">
                                                <input type="hidden" name="type" className="form-control" value="admin" />
                                            </div>
                                            <div className="form-group">
                                                <input type="text" name="name" className="form-control" placeholder="Name" value={name} onChange={handleChange} noValidate />
                                            </div>
                                            <div className="form-group">
                                                <input type="email" name="email" className="form-control" placeholder="Email" value={email} onChange={handleChange} noValidate />
                                                {formErrors.email.length > 0 && (
                                                    <span className="text-danger">{formErrors.email}</span>
                                                )}
                                            </div>
                                            <div className="form-group">
                                                <input type="password" name="password" className="form-control" placeholder="Password" value={password} onChange={handleChange} noValidate />
                                                {formErrors.password.length > 0 && (
                                                    <span className="text-danger">{formErrors.password}</span>
                                                )}
                                            </div>
                                            <div className="form-group">
                                                <input type="password" name="confirmPassword" className="form-control" placeholder="Confirm Password" value={confirmPassword} onChange={handleChange} noValidate />
                                                {formErrors.confirmPassword.length > 0 && (
                                                    <span className="text-danger">{formErrors.confirmPassword}</span>
                                                )}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </DashLayout>
    )
}

export default UsersView;
