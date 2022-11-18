import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Link } from "react-router-dom";
import AppLayout from '../../layout/AppLayout/AppLayout';
import Spinner from '../../components/Spinner/Spinner';
import util from '../../utils/util';
import Cookies from 'js-cookie';

import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from '../../utils/theme';

import prescriptionTag from '../../utils/assets/prescription_image.png';

import './ProductView.css';

function ProductView({ match, user, setUser, products, categories, cart, addToCart, setCart, removeFromCart, location }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [isLoading, setIsLoading] = useState(false);
    // const [product, setProduct] = useState([]);
    const [selectedItem, selectItem] = useState({});
    const [selectedProduct, setSelectedProduct] = useState();
    const [refresh, setRefresh] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0);

    const [curProduct, setCurProduct] = useState();


    // const curProduct = match.params.product;
    // console.log(match.params)
    // const curProduct = match.params.product ? 
    //                 products.length > 0 ? 
    //                     products.filter(product => !!selectedProduct && selectedProduct.name === match.params.product)[0]._id 
    //                     : null
    //                 : null;

    const {product} = location.state

    useEffect(() => {
        if (refreshCount < 2 ) {
            product.quantity = 1;
            product.price = product.sizing[0].price;
            setSelectedProduct(product)
            setRefresh(!refresh)
            setRefreshCount(refreshCount + 1)
        }
    }, [product, refresh]);

   
    useEffect(() => {
        // alert(refreshCount)
        // alert(JSON.stringify("selectedProduct"))

        setSelectedProduct(selectedProduct)
    }, [selectedProduct]);

    useEffect(() => {
        if (selectedProduct) {
            // console.log(selectedProduct)
            if (selectedProduct.sizing.length > 0) {
                setCurProduct(selectedProduct.sizing[0])
            } else {
                setCurProduct(selectedProduct)
            }
        }
    }, [selectedProduct])


    // (!!selectedItem.itemIndex) ?
    //   !!selectedProduct && selectedProduct.sizing[selectedItem.itemIndex].price : !!selectedProduct && selectedProduct.sizing[0].price
    

    // useEffect(() => {
    //     //  Fetch Product
    //     axios.get(`${apiBaseUrl}v1/product/${curProduct}`)
    //     .then(res => {
    //         console.log(res.data)
    //         setProduct(res.data.product);
    //         setIsLoading(false);
    //     })
    //     .catch(err => console.log(err))
    // }, [apiBaseUrl, curProduct]);

    const incrementQty = (id) => {
        const duplicate = selectedProduct;
        duplicate.quantity++;
        duplicate.subTotal = parseInt(duplicate.quantity) * parseFloat(duplicate.price);
        // alert(JSON.stringify(selectedProduct));
        setSelectedProduct(duplicate);
    }

    const decrementQty = (id) => {
        selectedProduct.quantity--;
        if (selectedProduct.quantity < 0) selectedProduct.quantity = 0;
        selectedProduct.subTotal = parseInt(selectedProduct.quantity) * parseFloat(selectedProduct.price);
        setSelectedProduct(selectedProduct)
    }

    const changeSizingSelection = (index) => {
        // console.log('Change sizing')
        const item = selectedProduct.sizing.filter((curItem, i) => i === index);
        // console.log(item)
        setCurProduct(item[0]);
        selectItem({
            itemIndex: index
        })
    }

    return (
        <AppLayout user={user} setUser={setUser} products={products} categories={categories} cart={cart}>
            <main className="single-product-section py-5">
                <div className="container">
                    <section className="">
                        {
                            isLoading ? 
                                <Spinner />
                                : 
                                 <section>   
                                    <div className="row">
                                        <div className="col-md-6 mt-3">
                                            <div className="position-relative avatar-container">
                                                {
                                                    !!selectedProduct && selectedProduct.image[0] !== undefined ? 
                                                        <img src={`${apiBaseUrl}${selectedProduct.image ? selectedProduct.image[0] : null}`} alt="product" className="d-block" />
                                                        : <FontAwesomeIcon icon={faBan} color={theme.colors.lighterDark} size="3x" style={{marginTop: '80px'}} />
                                                }
                                            </div>
                                        </div>
                                        <div className="col-md-5 mt-3">
                                            <div className="d-flex align-items-center product-header">
                                                {/* <h5 className="">{!!selectedProduct && selectedProduct.name}</h5> */}
                                                <p className="ml-auto">Shop / {!!selectedProduct && selectedProduct.name}</p>
                                            </div>
                                            <div className="">
                                                <h2 className="product-title"><b>{!!selectedProduct && selectedProduct.name} {!!selectedProduct && selectedProduct.sizing.length <= 1 && `(${selectedProduct.sizing[0].size})`}</b></h2>
                                                {!!selectedProduct && selectedProduct.sku && <p className=""><span className="bullet-caption">SKU: </span>{selectedProduct.sku}</p>}
                                                {/* <h3 className="my-3 product-amount">&pound;{!!selectedProduct && selectedProduct.price}</h3> */}
                                                <h3 className="my-3 product-amount">
                                                    &pound;
                                                    {
                                                        curProduct ? 
                                                            curProduct.sizing ? 
                                                                curProduct.sizing.length > 0 ? 
                                                                    curProduct.sizing.price
                                                                    : null
                                                                : curProduct.price
                                                            : null
                                                    }
                                                </h3>
                                                <div>
                                                    {!!selectedProduct && selectedProduct.sizing.length > 1 &&
                                                        <select onChange={(e) => changeSizingSelection(e.target.selectedIndex)}>
                                                            {selectedProduct.sizing.map((sizing, i) => 
                                                                <option key={i + 1} onClick={() => changeSizingSelection(i)}>{sizing.size}</option>) }</select>
                                                    }
                                                </div>
                                                <div className="d-flex mt-3">
                                                    <button 
                                                        className="btn btn-sm btn-dark py-1 px-2" 
                                                        onClick={() => setSelectedProduct({
                                                            ...selectedProduct,
                                                            quantity: (selectedProduct.quantity < 2) ? 1 : selectedProduct.quantity - 1,
                                                            subTotal: parseInt(selectedProduct.quantity - 1) * parseFloat(selectedProduct.price)
                                                        })}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="font-weight-bold mx-2">
                                                        {!!selectedProduct && selectedProduct.quantity ? selectedProduct.quantity : 0}</span>
                                                    <button 
                                                        className="btn btn-sm btn-dark py-1 px-2" 
                                                        onClick={() => setSelectedProduct({
                                                            ...selectedProduct,
                                                            quantity: selectedProduct.quantity + 1,
                                                            subTotal: parseInt(selectedProduct.quantity + 1) * parseFloat(selectedProduct.price)
                                                        })}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <br/>
                                                <div className="d-flex align-items-center mb-3 product-links-wrapper">
                                                {
                                                    cart ? 
                                                        cart.length > 0 ? 
                                                            cart.some(value => value._id === (!!selectedProduct && selectedProduct._id)) ? 
                                                                <span className="btn btn-sm btn-secondary" onClick={() => removeFromCart(product, selectedItem.itemIndex)}>Remove from cart</span>
                                                                : <span className="btn btn-sm btn-primary" onClick={() => addToCart(selectedProduct, selectedItem.itemIndex)}>Add to Cart</span>
                                                            : <span className="btn btn-sm btn-primary" onClick={() => addToCart(selectedProduct, selectedItem.itemIndex)}>Add to Cart</span>
                                                        : <span className="btn btn-sm btn-primary" onClick={() => addToCart(selectedProduct, selectedItem.itemIndex)}>Add to Cart</span>
                                                }
                                                </div>
                                                <p className="">
                                                    <span className="bullet-caption">Categories: </span>
                                                    {
                                                        !!selectedProduct && selectedProduct.subcategory ? 
                                                            selectedProduct.subcategory.map(cat => `${cat.name}, `)
                                                            : null
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <section className="mt-5">
                                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                                        <li className="nav-item">
                                            <a className="nav-link tab-header active" href="#info" data-toggle="tab" role="tab" aria-controls="info" aria-selected="true">PRODUCT INFORMATION</a>
                                        </li>
                                    </ul>
                                    <div className="tab-content p-4" id="myTabContent">
                                        <div className="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
                                            <h5 className="mb-4">DESCRIPTION</h5>
                                            <p className="mb-4">{!!selectedProduct && selectedProduct.description}</p>
                                        </div>
                                    </div>
                                </section>
                            </section>
                        }
                    </section>
                </div>
            </main>
        </AppLayout>
    )
}

export default ProductView;
