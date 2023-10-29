import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Link } from "react-router-dom";
import DashLayout from '../../../layout/DashLayout/DashLayout';
import Pagination from '../../../components/Pagination/Pagination';
import Spinner from '../../../components/Spinner/Spinner';

import { faEye, faPencilAlt, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ProductsView.css';
import theme from '../../../utils/theme';
import util from '../../../utils/util'

function ProductsView({ user, setUser }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState([]);
    const [images, setImages] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(20);

    const [productName, setproductName] = useState("")
    const [size, setSize] = useState("")
    const [price, setPrice] = useState("")
    const [sku, setSku] = useState("")
    const [description, setDescription] = useState("")
    const [quantity, setQuantity] = useState(10)
    const [weight, setWeight] = useState("kg")
    const [weightValue, setWeightValue] = useState(1)
    const [sizing, setSizing] = useState([])
    const [trending, setTrending] = useState(false)
    const [selectedItem, selectItem] = useState({});

    //  Get Current Products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    //  Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setLoading(true);
        //  Fetch Products
        axios.get(`${apiBaseUrl}v1/product?sort=date&order=desc`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setProducts(res.data.product)
            setLoading(false);
            setErrorMessage("");
        })
        .catch(err => {
            setErrorMessage(err?.response?.data?.msg || 'Something went wrong! Check your Internet connection and try again.');
            setLoading(false);
        })

        //  Fetch Subategories
        axios.get(`${apiBaseUrl}v1/subcategory`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setCategories(res.data.subcategory)
            setLoading(false);
            setErrorMessage("");
        })
        .catch(err => {
            setErrorMessage(err?.response?.data?.msg || 'Something went wrong! Check your Internet connection and try again.');
            setLoading(false);
        })
    }, [refresh, apiBaseUrl]);

    const handleView = (e) => {
        e.preventDefault();
        setLoading2(true);
        axios.get(`${apiBaseUrl}v1/product/${e.target[0].value}`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            if(res.data?.product?.subcategory) { 
                setCategorySelected(res.data.product.subcategory.map(category => {
                    return {
                        id: category._id,
                        name: category.name
                    }
                }))
            }
            setProduct(res.data.product);
            setLoading2(false);
            setErrorMessage("");
        })
        .catch(err => {
            setErrorMessage(err?.response?.data?.msg || "Something went wrong! Check your Internet connection and try again.");
            setLoading2(false);
        })
    }

    const handleEdit = (e) => {
        e.preventDefault();
        const category = categorySelected.map(cat => cat.id);

        const newData = {
            name: e.target[1].value,
            sku: e.target[2].value,
            description: e.target[4].value,
            price: e.target[5].value,
            quantity: e.target[6].value,
            trending: e.target[7].checked,
            subcategory: category
        }

        // console.log(e.target[7])
        
        axios({
            method: 'put',
            url: `${apiBaseUrl}v1/product/admin/${e.target[0].value}`,
            data: newData,
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
            })
            .then(res => {
                setErrorMessage("");
                setRefresh(!refresh);
                window.location.reload();
            })
            .catch(err => setErrorMessage(err?.response?.data?.msg || "Something went wrong! Check your Internet connection and try again."));
    }

    const handleAdd = (e) => {
        e.preventDefault();
        const category = categorySelected.map(cat => cat.id);

        const productSizing = sizing.length > 0 ? sizing : [{
            size: size,
            price: price,
            quantity: quantity,
            weight: weight,
            weightValue: weightValue
        }]

        // console.log("Looking for Images: ", images)

        const formData = new FormData();

        let productImage = [];
        images.forEach((file, i) => {
            formData.append("productImage", file)
        })

        // console.log('product name: ', productName)
        // console.log('product price: ', price)
        // console.log('product weight: ', weight)
        // console.log('product weightValue: ', weightValue)
        // console.log('product size: ', productSizing)

        if (productName !== "" && category.length > 0) {
            formData.append('name', productName);
            formData.append('sku', sku);
            formData.append('description', description);
            formData.append('sizing', JSON.stringify(productSizing));
            formData.append('subcategory', JSON.stringify(category));
            // formData.append('productImage', JSON.stringify(images));
            formData.append('trending', trending);

            setproductName("")
            setDescription("")
            setSku("")
            setTrending(false)

            e.target[6].value = '';
            
            axios({
                method: 'post',
                url: `${apiBaseUrl}v1/product/admin`,
                data: formData,
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data' }
                })
                .then(res => {
                    setErrorMessage("");
                    // console.log(res);
                    setRefresh(!refresh);
                    window.location.reload();
                })
                .catch(err => setErrorMessage(err?.response?.data?.msg || "Something went wrong! Check your Internet connection and try again."));
        } else {
            setErrorMessage("Empty Field(s). Add product name and category.");
        }
    }

    const handleDelete = (e) => {
        e.preventDefault();
        axios.delete(`${apiBaseUrl}v1/product/admin/${e.target[0].value}`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setErrorMessage("");
            setRefresh(!refresh);
        })
        .catch(err => setErrorMessage(err?.response?.data?.msg || "Something went wrong! Check your Internet connection and try again."))
    }

    const handleSelect = (e) => {
        e.preventDefault();
        const newCategory = {
            id: e.target.id,
            name: e.target.textContent
        };

        if(!categorySelected.some(value => value.id === newCategory.id)) {
            setCategorySelected(prevState => [
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
            const newCategory = categorySelected.filter((cat, i) => i !== removeCategoryId - 1);
            setCategorySelected(newCategory);
        }
    }

    const uploadImage = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if(e.target[1].files.length > 0) {
            formData.append('productImage', e.target[1].files[0]);
            formData.append('productImage', e.target[1].files[1]);
            formData.append('productImage', e.target[1].files[2]);
            axios({
                method: 'put',
                url: `${apiBaseUrl}v1/product/admin/upload/${e.target[0].value}`,
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
            setErrorMessage("Empty Field(s). Add an Image.");
        }
    }

    const addSizing = () => {
        // alert("clicked")
        if ((!!size || !!weight) && !!weight && !!price && !!weightValue) {
            sizing.push({
                size: size,
                price: price,
                quantity: quantity,
                weight: weight,
                weightValue: weightValue
            })

            setSize("")
            setPrice("")
            setQuantity(1)
            // setWeight("")
            setWeightValue(1)
        } else {
            alert("Kindly add all required options to proceed.")
        }

        // console.log(sizing);
    }

    const changeDescription = (e) => {
        setDescription(e.target.value)
    }

    const changeName = (e) => {
        setproductName(e.target.value)
    }

    const changeSku = (e) => {
        setSku(e.target.value)
    }

    const changeSize = (e) => {
        setSize(e.target.value)
    }

    const changePrice = (e) => {
        setPrice(e.target.value)
    }

    const changeQuantity = (e) => {
        setQuantity(e.target.value)
    }

    const changeWeight = (e) => {
        setWeight(e.target.value)
    }

    const changeWeightValue = (e) => {
        setWeightValue(e.target.value)
    }

    const changeTrending = (status) => {
        setTrending(status)
    }

    const removeSizing = (id) => {
        const newSizing = sizing.filter((cat, i) => {
            return i !== id ? true : false;
        })
        setSizing(newSizing);
    }

    const changeSizingSelection = (item, index, productIndex) => {
        selectItem({
            productIndex: productIndex,
            itemIndex: index
        })
    }

    const changeImage = (e) => {
        const images = Array.from(e.target.files)
        console.log("CHange IMage: ", images)
        setImages(images)
    }

    return (
        <DashLayout user={user} setUser={setUser} title={`Products`}>
            <main className="dashboard-products">
                <section className="container-fluid">
                    <div className="p-3 table-wrapper">
                        <span className="d-inline-block mb-2 btn btn-sm btn-secondary" data-toggle="modal" data-target="#addModal" onClick={() => setCategorySelected([])}>Add New Product</span>
                        {
                            errorMessage && <div className='alert alert-danger my-2'>{errorMessage}</div>
                        }
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th colSpan="3"></th>
                                        <th scope="col">Product Name</th>
                                        <th scope="col">SKU</th>
                                        <th scope="col">Description</th>
                                        <th scope="col">Size</th>
                                        <th scope="col">Weight</th>
                                        <th scope="col">Price (&pound;)</th>
                                        <th scope="col">Quantity</th>
                                        <th colSpan="3">Image</th>
                                        <th scope="col">Trend?</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ? 
                                            <tr>
                                                <td colSpan="14" className="border-0">
                                                    <Spinner />
                                                </td>
                                            </tr>
                                        :
                                        currentProducts ? currentProducts.length > 0 ?
                                            currentProducts.map((product, index) => (
                                                <tr key={product._id}>
                                                    <td className="p-2">
                                                        <div className="d-flex justify-content-center align-items-center icon" title="view" data-toggle="modal" data-target="#viewModal">
                                                            <form onSubmit={handleView} noValidate>
                                                                <input type="hidden" name="viewId" value={product._id} />
                                                                <button type="submit" name="viewbtn" className="transparent-btn">
                                                                    <FontAwesomeIcon icon={faEye} color={theme.colors.dark} />
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="d-flex justify-content-center align-items-center icon" title="edit" data-toggle="modal" data-target="#editModal">
                                                            <form onSubmit={handleView} noValidate>
                                                                <input type="hidden" name="editId" value={product._id} />
                                                                <button type="submit" name="editbtn" className="transparent-btn">
                                                                    <FontAwesomeIcon icon={faPencilAlt} color={theme.colors.dark} />
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="d-flex justify-content-center align-items-center icon" title="delete">
                                                            <form onSubmit={handleDelete} noValidate>
                                                                <input type="hidden" name="deleteId" value={product._id} />
                                                                <button type="submit" name="deletebtn" className="transparent-btn">
                                                                    <FontAwesomeIcon icon={faTrash} color={theme.colors.dark} />
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </td>
                                                    <td className="p-2">{product?.name}</td>
                                                    <td className="p-2">{product?.sku}</td>
                                                    <td className="p-2">{product?.description}</td>
                                                    <td className="p-2">
                                                        <select>
                                                        {
                                                            product?.sizing.map((sizing, i) => <option key={i + 1} onClick={() => changeSizingSelection(sizing, i, index)}>{sizing?.size}</option>)
                                                        }
                                                        </select>

                                                    </td>
                                                    <td className="p-2">
                                                        {
                                                            (selectedItem.productIndex === index) ?
                                                                !!product?.sizing && product?.sizing[selectedItem.itemIndex]?.weight :
                                                                product?.sizing[0]?.weight
                                                            
                                                        }    
                                                    </td>
                                                    <td className="p-2">
                                                        &pound;
                                                        {
                                                            (selectedItem.productIndex === index) ?
                                                                product?.sizing[selectedItem.itemIndex]?.price :
                                                                product?.sizing[0]?.price
                                                            
                                                        }
                                                        
                                                    </td>
                                                    <td className="p-2">
                                                        {
                                                            (selectedItem.productIndex === index) ?
                                                                product?.sizing[selectedItem.itemIndex]?.quantity :
                                                                product?.sizing[0]?.quantity
                                                            
                                                        }
                                                    </td>
                                                    <td colSpan="3" className="p-2">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <img src={`${product?.image[0]?.url}`} alt={product.name} className="d-block mx-auto" />
                                                            {/* {
                                                                product.image ? 
                                                                    product.image.length > 0 ? 
                                                                        product.image.map((prod, i) => (
                                                                            <img key={i + 1} src={`${apiBaseUrl}${prod}`} alt={product.name} className="d-block mx-auto" />
                                                                        ))
                                                                        : null
                                                                    : null
                                                            } */}
                                                        </div>
                                                    </td>
                                                    <td className="p-2">{product?.trending ? 'YES' : 'NO'}</td>
                                                </tr>
                                            )) : null
                                            : null
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex align-items-center justify-content-end">
                            <Pagination 
                                numberPerPage={productsPerPage} 
                                totalNumber={products.length} 
                                paginate={paginate}
                            />
                        </div>

                        {/* View Category Modal */}
                        <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="viewModalLabel">{loading2 ? null : product.name}</h5>
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
                                        <div className="col-md-4">
                                            <div className="">
                                                {
                                                    product.image ? 
                                                        product.image.length > 0 ?       
                                                            <img src={`${product.image[0]?.url}`} alt="product" className="d-block mx-auto" />
                                                            : null
                                                        : null
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="">
                                                <h4 className="my-3 product-amount">${product?.sizing && product?.sizing[0]?.price}</h4>
                                                <p className="">
                                                    <span className="font-weight-bold">Categories: </span>
                                                    {
                                                        product.subcategory ? 
                                                            product.subcategory.length > 0 ?
                                                                product.subcategory.map((cat, i) => (
                                                                    <span key={i + 1} className="">{cat.name}, &nbsp;</span>
                                                                ))
                                                                : null
                                                            : null
                                                    }
                                                </p>
                                                <p className="">
                                                    <span className="font-weight-bold">SKU: </span>{product?.sku}
                                                </p>
                                                <p className="">
                                                    <span className="font-weight-bold">Quantity: </span>{product?.sizing && product?.sizing[0]?.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-md-12 mt-3">
                                            <p className="">
                                                <span className="font-weight-bold">Description: </span>{product.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                }
                                <div className="modal-footer"></div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Product Modal */}
                        <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="editModalLabel">Edit Product</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="">
                                            {
                                                errorMessage && <div className='alert alert-danger my-2'>{errorMessage}</div>
                                            }
                                            <div className="">
                                                <form onSubmit={uploadImage} encType="multipart/form-data" noValidate>
                                                    <div className="form-group">
                                                        <input type="hidden" name="id" className="form-control" defaultValue={product._id} required />
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            <label className="">Update Image:</label>
                                                            <input type="file" name="productImage" onChange={changeImage} className="form-control-file" multiple />
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
                                                        <input type="hidden" name="id" className="form-control" defaultValue={product._id} required />
                                                    </div>
                                                <div className="form-group">
                                                    <input type="text" name="name" className="form-control" placeholder="Product Name" defaultValue={product.name}/>
                                                </div>
                                                <div className="form-row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <input type="text" name="sku" className="form-control" placeholder="SKU" defaultValue={product.sku}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-wrap align-items-center">
                                                    {
                                                        categorySelected.length > 0 ?
                                                            categorySelected.map((cat, i) => (
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
                                                                categories.length > 0 ? 
                                                                    categories.map(category => (
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
                                                <div className="form-group">
                                                    <textarea name="description" className="form-control" rows="3" placeholder="Description" defaultValue={product.description}></textarea>
                                                </div>
                                                <div className="form-row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <input type="text" name="price" className="form-control" placeholder="Price" defaultValue={product.price}/>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <input type="text" name="quantity" className="form-control" placeholder="Quantity" defaultValue={product.quantity}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" name="trending" className="form-check-input" defaultChecked={product.trending} />
                                                    <label className="form-check-label">Trending Product?</label>
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

                        {/* Add Product Modal */}
                        <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="addModalLabel">Add Product</h5>
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
                                                    <input type="text" name="name" onChange={changeName} value={productName} className="form-control" placeholder="Product Name (required)" required/>
                                                </div>
                                                <div className="form-row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <input type="text" name="sku" onChange={changeSku} value={sku} className="form-control" placeholder="SKU"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-wrap align-items-center">
                                                    {
                                                        categorySelected.length > 0 ?
                                                            categorySelected.map((cat, i) => (
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
                                                            categories.length > 0 ? 
                                                                categories.map(category => (
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

                                                <div className="d-flex flex-wrap align-items-center mb-2">
                                                    {
                                                        sizing.length > 0 ?
                                                            sizing.map((s, i) => (
                                                                <div key={i} className="d-block category-badge mr-2 my-1">
                                                                    {`Size: ${s.size}, Weight: ${s.weightValue}${s.weight}, Price: ${s.price} pound, Qty: ${s.quantity} `}
                                                                    <span className="p-1">
                                                                        <FontAwesomeIcon icon={faTimes} color="red" onClick={() => removeSizing(i)} />
                                                                    </span>
                                                                </div>
                                                            ))
                                                            : null
                                                    }
                                                </div>
                                                <div className="form-row">
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label>Custom Size
                                                                <input type="text" name="size" onChange={changeSize} value={size} className="form-control" placeholder="Size"/>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label>Weight*
                                                                <select onChange={changeWeight} className="form-control" defaultValue={"kg"} required>
                                                                    <option value={"kg"}>Kilogram (Kg)</option>
                                                                    <option value={"g"}>Gram (g)</option>
                                                                    <option value={"l"}>Litre (l)</option>
                                                                </select>
                                                            </label>
                                                            {!!weight &&
                                                                <label>Weight Value*
                                                                    <input type="number" min="1" name="weightValue" onChange={changeWeightValue} value={weightValue} placeholder="weightValue" required style={{maxWidth: 100}}/>
                                                                </label>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label>Price*
                                                                <input type="number" name="price" onChange={changePrice} value={price} className="form-control" placeholder="Price (required)" required/>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="form-group">
                                                            <label>Quantity*
                                                                <input type="number" min="1" name="quantity" onChange={changeQuantity} value={quantity} className="form-control" placeholder="Quantity (required)" required/>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {!!size && !!weight && !!price && !!weightValue &&
                                                        <span className="btn btn-xs btn-secondary ml-4" onClick={() => addSizing()}>Click to add another</span>
                                                    }
                                                </div>
                                                
                                                <div className="form-group">
                                                    <textarea className="form-control" name="description" onChange={changeDescription} value={description}  rows="3" placeholder="Description"></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label className="">Upload Image</label>
                                                    <input type="file" name="productImage" onChange={changeImage} className="form-control-file" multiple />
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" name="trending" onChange={() => changeTrending(!trending)} value={trending} className="form-check-input" />
                                                    <label className="form-check-label">Trending Product?</label>
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

export default ProductsView;
