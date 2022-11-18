import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Link } from "react-router-dom";
import DashLayout from '../../../layout/DashLayout/DashLayout';
import Pagination from '../../../components/Pagination/Pagination';
import Spinner from '../../../components/Spinner/Spinner';

import { faEye, faPencilAlt, faTrash, faTimes} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CategoryView.css';
import theme from '../../../utils/theme';
import util from '../../../utils/util'

function CategoryView({ user, setUser }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState([]);
    const [groups, setGroups] = useState([]);
    const [groupSelection, setGroupSelection] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(15);

    //  Get Current Categories
    const indexOfLastProduct = currentPage * categoriesPerPage;
    const indexOfFirstProduct = indexOfLastProduct - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstProduct, indexOfLastProduct);

    //  Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setLoading(true);
        axios.get(`${apiBaseUrl}v1/category`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setCategories(res.data.category);
            setLoading(false);
            setErrorMessage("");
        })
        .catch(err => {
            setErrorMessage(err?.response?.data?.msg || err);
            setLoading(false);
        })

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
        axios.get(`${apiBaseUrl}v1/category/${e.target[0].value}`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setCategory(res.data.category);
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

        if (e.target[1].value && groups.length > 0) {
            const newData = {
                name: e.target[1].value,
                groups: JSON.stringify(groups)
            }
            
            axios({
                method: 'put',
                url: `${apiBaseUrl}v1/category/admin/${e.target[0].value}`,
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
            setErrorMessage("Empty field(s). Add name and/or group.");
        }
    }

    const handleAdd = (e) => {
        e.preventDefault();

        const groups = groupSelection.map(group => group.id);

        if (e.target[0].value && groups.length > 0) {
            const newData = {
                name: e.target[0].value,
                groups: JSON.stringify(groups)
            }
            
            e.target[0].value = '';
            
            axios({
                method: 'post',
                url: `${apiBaseUrl}v1/category/admin`,
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
            setErrorMessage("Empty field(s). Add name and/or group.");
        }
    }

    const handleDelete = (e) => {
        e.preventDefault();
        axios.delete(`${apiBaseUrl}v1/category/admin/${e.target[0].value}`, {
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

    const handleSelect = (e) => {
        e.preventDefault();
        const newGroup = {
            id: e.target.id,
            name: e.target.textContent
        };

        if(!groupSelection.some(value => value.id === newGroup.id)) {
            setGroupSelection(prevState => [
                ...prevState,
                newGroup
            ]);
        }
    }

    const handleRemove = (e) => {
        e.preventDefault();
        e.nativeEvent.stopPropagation();
        const removeCategory = e.target.parentElement.parentElement.parentElement;
        const removeCategoryId = removeCategory.getAttribute('data-key');
        if(removeCategoryId){
            const newGroup = groupSelection.filter((cat, i) => i !== removeCategoryId - 1);
            setGroupSelection(newGroup);
        }
    }


    return (
        <DashLayout user={user} setUser={setUser} title={`Category`}>
            <main className="dashboard-category">
                <section className="container-fluid">
                    <div className="p-3 table-wrapper">
                        <span className="d-inline-block mb-2 btn btn-sm btn-secondary" data-toggle="modal" data-target="#addModal">Add New Category</span>
                        {
                            errorMessage && <div className='alert alert-danger my-2'>{errorMessage}</div>
                        }
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th colSpan="3"></th>
                                        <th scope="col">Category Name</th>
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
                                numberPerPage={categoriesPerPage} 
                                totalNumber={categories.length} 
                                paginate={paginate}
                            />
                        </div>

                        {/* View Category Modal */}
                        <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="viewModalLabel">{loading2 ? null : category.name}</h5>
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
                                                category.subcategory ? <h5 className="font-weight-bold">Categories</h5> : null
                                            }
                                            <ul className="list-group list-group-flush">
                                                {
                                                    category.subcategory ? 
                                                        category.subcategory.length > 0 ? 
                                                            category.subcategory.map(category => (
                                                                <li key={category._id} className="list-group-item">{category.name}</li>
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
                                        <h5 className="modal-title" id="editModalLabel">Edit Category</h5>
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
                                                    <input type="hidden" name="id" className="form-control" defaultValue={category.id} required />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" name="name" className="form-control" placeholder="Category Name" defaultValue={category.name} required />
                                                </div>
                                                <div className="d-flex flex-wrap align-items-center">
                                                    {
                                                        !!groupSelection && groupSelection.length > 0 ?
                                                            groupSelection.map((cat, i) => (
                                                                <span key={i + 1} data-key={i + 1} className="d-inline-block category-badge mr-2 my-1">
                                                                    {cat.name} &nbsp;
                                                                    <span className="p-1">
                                                                        <FontAwesomeIcon icon={faTimes} onClick={handleRemove} />
                                                                    </span>
                                                                </span>
                                                            ))
                                                            : null
                                                    }
                                                </div>
                                                <div className="dropdown mb-3">
                                                    <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Update Group
                                                    </button>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        {
                                                            groups.length > 0 ? 
                                                                groups.map(group => (
                                                                    <span 
                                                                        key={group._id} 
                                                                        id={group._id}
                                                                        className="dropdown-item" 
                                                                        onClick={handleSelect}
                                                                    >
                                                                        {group.name}
                                                                    </span>
                                                                ))
                                                                : null
                                                        }
                                                    </div>
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
                        <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="addModalLabel">Add Category</h5>
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
                                                    <input type="text" name="name" className="form-control" placeholder="Category Name" required/>
                                                </div>
                                                <div className="d-flex flex-wrap align-items-center">
                                                    {
                                                        !!groupSelection && groupSelection.length > 0 ?
                                                            groupSelection.map((cat, i) => (
                                                                <span key={i + 1} data-key={i + 1} className="d-inline-block category-badge mr-2 my-1">
                                                                    {cat.name} &nbsp;
                                                                    <span className="p-1">
                                                                        <FontAwesomeIcon icon={faTimes} onClick={handleRemove} />
                                                                    </span>
                                                                </span>
                                                            ))
                                                            : null
                                                    }
                                                </div>
                                                <div className="dropdown mb-3">
                                                    <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        Add Group
                                                    </button>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        {
                                                            groups.length > 0 ? 
                                                                groups.map(group => (
                                                                    <span 
                                                                        key={group._id} 
                                                                        id={group._id}
                                                                        className="dropdown-item" 
                                                                        onClick={handleSelect}
                                                                    >
                                                                        {group.name}
                                                                    </span>
                                                                ))
                                                                : null
                                                        }
                                                    </div>
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
                    </div>
                </section>
            </main>
        </DashLayout>
    )
}

export default CategoryView;
