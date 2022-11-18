import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Link } from "react-router-dom";
import DashLayout from '../../../layout/DashLayout/DashLayout';
import Pagination from '../../../components/Pagination/Pagination';
import Spinner from '../../../components/Spinner/Spinner';

import { faEye, faPencilAlt, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SubCategoryView.css';
import theme from '../../../utils/theme';
import util from '../../../utils/util'

function SubCategoryView({ user, setUser }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [subcategories, setSubcategories] = useState([]);
    const [subcategory, setSubcategory] = useState({});
    const [category, setCategory] = useState([]);
    const [categorySel, setCategorySel] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(15);

    //  Get Current Categories
    const indexOfLastProduct = currentPage * categoriesPerPage;
    const indexOfFirstProduct = indexOfLastProduct - categoriesPerPage;
    const currentCategories = subcategories.slice(indexOfFirstProduct, indexOfLastProduct);

    //  Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setLoading(true);

        //  Fetch Subcategories
        axios.get(`${apiBaseUrl}v1/subcategory`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            // console.log(res.data.subcategory);
            setSubcategories(res.data.subcategory)
            setLoading(false);
            setErrorMessage("");
        })
        .catch(err => {
            setErrorMessage(err?.response?.data?.msg || err);
            setLoading(false);
        })

        //  Fetch Category
        axios.get(`${apiBaseUrl}v1/category`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setCategory(res.data.category)
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
        axios.get(`${apiBaseUrl}v1/subcategory/${e.target[0].value}`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            if(res.data.subcategory.category) { 
                setCategorySel(res.data.subcategory.category.map(category => {
                    return {
                        id: category._id,
                        name: category.name
                    }
                }))
            }
            setSubcategory(res.data.subcategory)
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
        const category = categorySel.map(cat => cat.id);

        if (e.target[1].value && category.length > 0) {
            const newData = {
                name: e.target[1].value,
                description: e.target[2].value,
                category: category
            }
            
            axios({
                method: 'put',
                url: `${apiBaseUrl}v1/subcategory/admin/${e.target[0].value}`,
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
            setErrorMessage("Empty Field(s). Add name and category.");
        }
    }

    const handleAdd = (e) => {
        e.preventDefault();

        const category = categorySel.map(cat => cat.id);

        if (e.target[0].value && category.length > 0) {
            const formData = new FormData();
            formData.append('name', e.target[0].value);
            formData.append('description', e.target[1].value);
            formData.append('category', JSON.stringify(category));
            formData.append('subcategoryImage', e.target[2].files[0]);
            
            axios({
                method: 'post',
                url: `${apiBaseUrl}v1/subcategory/admin`,
                data: formData,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data' 
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
            setErrorMessage("Empty Field(s). Add name and category.");
        }
    }

    const handleDelete = (e) => {
        e.preventDefault();
        console.log('Delete')
        axios.delete(`${apiBaseUrl}v1/subcategory/admin/${e.target[0].value}`, {
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

    const uploadImage = (e) => {
        e.preventDefault();
        // console.log(e.target[0].value)
        // console.log(e.target[1])
        const formData = new FormData();
        if(e.target[1].files.length > 0) {
            formData.append('subcategoryImage', e.target[1].files[0]);
            axios({
                method: 'put',
                url: `${apiBaseUrl}v1/subcategory/admin/upload/${e.target[0].value}`,
                data: formData,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data' }
                })
                .then(res => {
                    // console.log(res);
                    setErrorMessage("");
                    setRefresh(!refresh);
                })
                .catch(err => setErrorMessage(err?.response?.data?.msg || err));
        } else {
            setErrorMessage("Add Image...");
        }
    }

    const handleSelect = (e) => {
        e.preventDefault();
        const newCategory = {
            id: e.target.id,
            name: e.target.textContent
        };

        if(!categorySel.some(value => value.id === newCategory.id)) {
            setCategorySel(prevState => [
                ...prevState,
                newCategory
            ]);
        }
    }

    const handleRemove = (e) => {
        e.preventDefault();
        e.nativeEvent.stopPropagation();
        const removeCategory = e.target.parentElement.parentElement.parentElement;
        const removeCategoryId = removeCategory.getAttribute('data-key');
        if(removeCategoryId){
            const newCategory = categorySel.filter((cat, i) => i !== removeCategoryId - 1);
            setCategorySel(newCategory);
        }
    }

    return (
        <DashLayout user={user} setUser={setUser} title={`Subcategory`}>
            <main className="dashboard-category">
                <section className="container-fluid">
                    <div className="p-3 table-wrapper">
                        <span className="d-inline-block mb-2 btn btn-sm btn-secondary" data-toggle="modal" data-target="#addModal" onClick={() => setCategorySel([])}>Add New Subcategory</span>
                        {
                            errorMessage && <div className='alert alert-danger my-2'>{errorMessage}</div>
                        }
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th colSpan="3"></th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Image</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ? 
                                            <tr>
                                                <td colSpan="7" className="border-0">
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
                                                    <td className="p-2">{cat.description}</td>
                                                    <td className="p-2">
                                                        { cat.category ? cat.category.name : null }
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="d-flex align-items-center">
                                                            {
                                                                cat?.image && <img src={`${apiBaseUrl}${cat.image}`} alt={cat.name} className="d-block mx-auto" />
                                                            }
                                                        </div>
                                                    </td>
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
                                totalNumber={subcategories.length} 
                                paginate={paginate}
                            />
                        </div>

                        {/* View Category Modal */}
                        <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="viewModalLabel">{loading2 ? null : subcategory.name}</h5>
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
                                            <div className="">
                                                {
                                                    subcategory?.image && <img src={subcategory ? subcategory.image ? `${apiBaseUrl}${category.image}` : null : null} alt="Men's Wealth" className=" d-block mx-auto" />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-8 mt-3">
                                            <div className="">
                                                <h5 className="font-weight-bold">Description</h5>
                                                <p className="">{subcategory.description}</p>
                                            </div>
                                            {
                                                subcategory.products ? <h5 className="font-weight-bold">Products</h5> : null
                                            }
                                            <ul className="list-group list-group-flush">
                                                {
                                                    subcategory.products ? 
                                                        subcategory.products.length > 0 ? 
                                                            subcategory.products.map(product => (
                                                                <li key={product._id} className="list-group-item">{product.name}</li>
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
                                            <div className="">
                                                {
                                                    errorMessage && <div className='alert alert-danger my-2'>{errorMessage}</div>
                                                }
                                                <form onSubmit={uploadImage} encType="multipart/form-data" noValidate>
                                                    <div className="form-group">
                                                        <input type="hidden" name="id" className="form-control" defaultValue={subcategory.id} required />
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <label className="">Update Image:</label>
                                                            <input type="file" name="subcategoryImage" className="form-control-file" />
                                                        </div>
                                                        <div className="col-md-4">
                                                            <button type="submit" className="btn btn-sm btn-primary float-right">Upload</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <hr />
                                            <form onSubmit={handleEdit} encType="multipart/form-data" noValidate>
                                                <div className="form-group">
                                                    <input type="hidden" name="id" className="form-control" defaultValue={subcategory.id} required />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" name="name" className="form-control" placeholder="Subcategory Name" defaultValue={subcategory.name} required />
                                                </div>
                                                <div className="form-group">
                                                    <textarea name="description" className="form-control" rows="3" placeholder="Description" defaultValue={subcategory.description}></textarea>
                                                </div>
                                                <div className="d-flex flex-wrap align-items-center">
                                                    {
                                                        categorySel.length > 0 ?
                                                            categorySel.map((cat, i) => (
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
                                                        Add Category
                                                    </button>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        {
                                                            category.length > 0 ? 
                                                                category.map(category => (
                                                                    <span 
                                                                        key={category._id} 
                                                                        id={category._id}
                                                                        className="dropdown-item" 
                                                                        onClick={handleSelect}
                                                                    >
                                                                        {category.name}
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
                                        <h5 className="modal-title" id="addModalLabel">Add Subcategory</h5>
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
                                                    <input type="text" name="name" className="form-control" placeholder="Subcategory Name *" required/>
                                                </div>
                                                <div className="form-group">
                                                    <textarea name="description" className="form-control" rows="3" placeholder="Description"></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label className="">Upload Image</label>
                                                    <input type="file" name="subcategoryImage" className="form-control-file" />
                                                </div>
                                                <div className="d-flex flex-wrap align-items-center">
                                                    {
                                                        categorySel.length > 0 ?
                                                            categorySel.map((cat, i) => (
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
                                                        Add Category
                                                    </button>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        {
                                                            category.length > 0 ? 
                                                                category.map(category => (
                                                                    <span 
                                                                        key={category._id} 
                                                                        id={category._id}
                                                                        className="dropdown-item" 
                                                                        onClick={handleSelect}
                                                                    >
                                                                        {category.name}
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

export default SubCategoryView;
