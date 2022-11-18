import React from 'react';
import axios from 'axios';
import AppLayout from '../../layout/AppLayout/AppLayout';

import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from '../../utils/theme';
import util from '../../utils/util';

import './ProfileView.css';

function ProfileView({ user, setUser, products, categories, cart}) {

    const apiBaseUrl = util.apiBaseUrl;

    const handleUpdate = (e) => {
        e.preventDefault();

        const newData = {
            mobile: e.target[1].value,
            altMobile: e.target[2].value,
            address: e.target[3].value
        }
        
        axios({
            method: 'put',
            url: `${apiBaseUrl}v1/user/${e.target[0].value}`,
            data: newData,
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
            })
            .then(res => {
                // console.log(res);
                console.log(res.data)
                sessionStorage.setItem('user', JSON.stringify(res.data));
                setUser(res.data);
                window.location.reload();
            })
            .catch(err => console.log(err));
    }

    return (
        <AppLayout user={user} setUser={setUser} products={products} categories={categories} cart={cart}>
            <main className="profile-section py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="d-flex justify-content-center align-items-center p-5 border rounded profile-avatar-container">
                                <FontAwesomeIcon icon={faUser} size="6x" style={{color: `${theme.colors.lighterDark}`}} />
                            </div>
                        </div>
                        <div className="col-md-8">
                            <div className="border rounded p-5">
                                <div className="d-flex justify-content-between align-items-center mb-4" data-toggle="modal" data-target="#updateModal" style={{cursor: 'pointer'}}>
                                    <h4 className="font-weight-bold">Personal Information</h4>
                                    <FontAwesomeIcon icon={faPencilAlt} style={{color: `${theme.colors.dark}`}} />
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <p className="font-weight-bold mr-1 tag">Name:</p>
                                    <p className="">{user ? user.name : null}</p>
                                </div>
                                <hr />
                                <div className="d-flex align-items-center justify-content-between">
                                    <p className="font-weight-bold mr-1 tag">Email:</p>
                                    <p className="">{user ? user.email : null}</p>
                                </div>
                                <hr />
                                <div className="d-flex align-items-center justify-content-between">
                                    <p className="font-weight-bold mr-1 tag">Mobile:</p>
                                    <p className="">{user ? user.mobile: null}</p>
                                </div>
                                <hr />
                                <div className="d-flex align-items-center justify-content-between">
                                    <p className="font-weight-bold mr-1 tag">Alternative Mobile:</p>
                                    <p className="">{user ? user.altMobile: null}</p>
                                </div>
                                <hr />
                                <div className="d-flex align-items-center justify-content-between">
                                    <p className="font-weight-bold mr-1 tag">Address:</p>
                                    <p className="">{user ? user.address : null}</p>
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update User Profile Modal */}
                <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="addModalLabel">Update Profile Data</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="">
                                    <form onSubmit={handleUpdate} noValidate>
                                        <div className="form-group">
                                            <input type="hidden" name="id" className="form-control" defaultValue={user._id} />
                                        </div>
                                        <div className="form-group">
                                            <label className="">Mobile:</label>
                                            <input type="text" name="mobile" className="form-control" placeholder="Mobile" defaultValue={user.mobile} noValidate />
                                        </div>
                                        <div className="form-group">
                                            <label className="">Alternative Mobile:</label>
                                            <input type="text" name="altMobile" className="form-control" placeholder="Alternative Mobile" defaultValue={user.altMobile} noValidate />
                                        </div>
                                        <div className="form-group">
                                            <label className="">Address:</label>
                                            <textarea name="address" className="form-control" rows="4" placeholder="Address" defaultValue={user.address}></textarea>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-sm btn-secondary" data-dismiss="modal">Cancel</button>
                                            <button type="submit" className="btn btn-sm btn-primary">Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </AppLayout>
    )
}

export default ProfileView;
