import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Link } from "react-router-dom";
import DashLayout from '../../../layout/DashLayout/DashLayout';
import Pagination from '../../../components/Pagination/Pagination';
import Spinner from '../../../components/Spinner/Spinner';

import { faEye, faPencilAlt, faTrash, faTimes} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './GroupView.css';
import theme from '../../../utils/theme';
import util from '../../../utils/util'

function CategoryView({ user, setUser }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [groups, setGroups] = useState([]);
    const [group, setGroup] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [groupPerPage] = useState(15);

    //  Get Current Categories
    const indexOfLastProduct = currentPage * groupPerPage;
    const indexOfFirstProduct = indexOfLastProduct - groupPerPage;
    const currentCategories = groups.slice(indexOfFirstProduct, indexOfLastProduct);

    //  Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setLoading(true);
        axios.get(`${apiBaseUrl}v1/group`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setGroups(res.data.groups)
            setLoading(false);
            setErrorMessage("");
        })
        .catch(err => {
            setErrorMessage(err?.response?.data?.msg || err);
            setLoading(false);
        })
    }, [refresh, apiBaseUrl]);

    const handleView = (e) => {
        e.preventDefault();
        setLoading2(true);
        axios.get(`${apiBaseUrl}v1/group/${e.target[0].value}`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setGroup(res.data.group);
            // setRefresh(!refresh);
            setLoading2(false);
            setErrorMessage("");
        })
        .catch(err => {
            setErrorMessage(err?.response?.data?.msg || err);
            setLoading2(false);
        })
    }

    const handleEdit = (e) => {
        e.preventDefault();

        if (e.target[1].value) {
            const newData = {
                name: e.target[1].value
            }
            
            axios({
                method: 'put',
                url: `${apiBaseUrl}v1/group/admin/${e.target[0].value}`,
                data: newData,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
                })
                .then(res => {
                    // console.log(res);
                    setErrorMessage("");
                    setRefresh(!refresh);
                    window.location.reload();
                })
                .catch(err => setErrorMessage(err?.response?.data?.msg || err));
        } else {
            setErrorMessage("Empty field.")
        }
    }

    const handleAdd = (e) => {
        e.preventDefault();
        
        if (e.target[0].value) {
            const newData = {
                name: e.target[0].value
            }
            // console.log(e.target[0].value)
            // console.log(newData)
            
            e.target[0].value = '';
            
            axios({
                method: 'post',
                url: `${apiBaseUrl}v1/group/admin`,
                data: newData,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
                })
                .then(res => {
                    // console.log(res)
                    setErrorMessage("");
                    setRefresh(!refresh);
                    window.location.reload();
                })
                .catch(err => setErrorMessage(err?.response?.data?.msg || err));
        } else {
            setErrorMessage("Empty field");
        }
    }

    const handleDelete = (e) => {
        e.preventDefault();
        axios.delete(`${apiBaseUrl}v1/group/admin/${e.target[0].value}`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setErrorMessage("");
            setRefresh(!refresh);
        })
        .catch(err => setErrorMessage(err?.response?.data?.msg || err))
    }

    return (
        <DashLayout user={user} setUser={setUser} title={`Group`}>
            <main className="dashboard-group">
                <section className="container-fluid">
                    <div className="p-3 table-wrapper">
                        <span className="d-inline-block mb-2 btn btn-sm btn-secondary" data-toggle="modal" data-target="#addModal">Add New Group</span>
                        {
                            errorMessage && <div className='alert alert-danger my-2'>{errorMessage}</div>
                        }
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th colSpan="3"></th>
                                        <th scope="col">Group Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ? 
                                            <tr>
                                                <td colSpan="4" className="border-0">
                                                    <Spinner />
                                                </td>
                                            </tr>
                                        :
                                        currentCategories ? currentCategories.length > 0 ?
                                            currentCategories.map((cat) => (
                                                <tr key={cat._id}>
                                                    <td className="p-2">
                                                        <div className="d-flex justify-content-center align-items-center icon" title="view" data-toggle="modal" data-target="#viewModal">
                                                            <form onSubmit={handleView} noValidate>
                                                                <input type="hidden" name="viewId" value={cat._id} />
                                                                <button type="submit" name="viewbtn" className="transparent-btn">
                                                                    <FontAwesomeIcon icon={faEye} color={theme.colors.dark} />
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="d-flex justify-content-center align-items-center icon" title="edit" data-toggle="modal" data-target="#editModal">
                                                            <form onSubmit={handleView} noValidate>
                                                                <input type="hidden" name="editId" value={cat._id} />
                                                                <button type="submit" name="editbtn" className="transparent-btn">
                                                                    <FontAwesomeIcon icon={faPencilAlt} color={theme.colors.dark} />
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="d-flex justify-content-center align-items-center icon" data-toggle="tooltip" title="delete">
                                                            <form onSubmit={handleDelete} noValidate>
                                                                <input type="hidden" name="deleteId" value={cat._id} />
                                                                <button type="submit" name="deletebtn" className="transparent-btn">
                                                                    <FontAwesomeIcon icon={faTrash} color={theme.colors.dark} />
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </td>
                                                    <td className="p-2">{cat.name}</td>
                                                </tr>
                                            )) : null
                                            : null
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex align-items-center justify-content-end">
                            <Pagination 
                                numberPerPage={groupPerPage} 
                                totalNumber={groups.length} 
                                paginate={paginate}
                            />
                        </div>

                        {/* View Category Modal */}
                        <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="viewModalLabel">{loading2 ? null : group.name}</h5>
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
                                        <div className="col-md-12 mt-3">
                                            {
                                                group.subcategory ? <h5 className="font-weight-bold">Groups</h5> : null
                                            }
                                            <ul className="list-group list-group-flush">
                                                {
                                                    group.subcategory ? 
                                                        group.subcategory.length > 0 ? 
                                                            group.subcategory.map(group => (
                                                                <li key={group._id} className="list-group-item">{group.name}</li>
                                                            ))
                                                            : <li className="list-group-item">None</li>
                                                        : null
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                }
                                <div className="modal-footer"></div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Category Modal */}
                        <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editModalLabel">Edit Group</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="">
                                            {
                                                errorMessage && <div className='alert alert-danger my-2'>{errorMessage}</div>
                                            }
                                            <form onSubmit={handleEdit} encType="multipart/form-data" noValidate>
                                                <div className="form-group">
                                                    <input type="hidden" name="id" className="form-control" defaultValue={group.id} required />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" name="name" className="form-control" placeholder="Group Name" defaultValue={group.name} required />
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-sm btn-secondary" data-dismiss="modal">Cancel</button>
                                                    <button type="submit" className="btn btn-sm btn-primary">Save changes</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Add Category Modal */}
                        {
                            groups.length < 5 ? 
                                <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="addModalLabel">Add Group</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="">
                                                {
                                                    errorMessage && <div className='alert alert-danger my-2'>{errorMessage}</div>
                                                }
                                                <form onSubmit={handleAdd} encType="multipart/form-data" noValidate >
                                                    <div className="form-group">
                                                        <input type="text" name="name" className="form-control" placeholder="Group Name" required/>
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
                            : <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="addModalLabel">Alert</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="">
                                                <h5>Group Number Exceeded</h5>
                                                <p>The number of groups must not exceed 5!</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </section>
            </main>
        </DashLayout>
    )
}

export default CategoryView;
