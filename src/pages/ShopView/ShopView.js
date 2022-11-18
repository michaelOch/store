import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
// import queryString from 'query-string';
// import { Link } from "react-router-dom";
import AppLayout from '../../layout/AppLayout/AppLayout';
import Pagination from '../../components/Pagination/Pagination';
import Spinner from '../../components/Spinner/Spinner';
import util from '../../utils/util';

import './ShopView.css';
import deliveries2 from '../../utils/assets/deliveries-2.gif';
import chatUs from '../../utils/assets/chat-us.gif';

import ProductContainer from '../../components/ProductContainer/ProductContainer';

function ShopView({ location, match, user, setUser, products, categories, cart, addToCart, removeFromCart }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [isLoading, setIsLoading] = useState(true);
    const [productsDup, setProductsDup] = useState(products);
    const [displayedProducts, setDisplayedProducts] = useState(productsDup);
    const [sortType, setSortType] = useState();
    // const { sort, order } = queryString.parse(location.search);
    // console.log(match.params.category)
    // console.log(categories)
    // console.log(match.params)
    // console.log(categories)
    const cat = match.params.category ? 
                    categories.length > 0 ? 
                        categories.filter(caty => caty.name === match.params.category).length > 0 ? 
                            categories.filter(caty => caty.name === match.params.category)[0]._id 
                            : null
                        : null
                    : null;

    useEffect(() => {
        setIsLoading(true);
        // console.log('cat', cat);
        // console.log('param', match.params.category);
        if (cat) {
            // console.log('In subcategory')
            axios.get(`${apiBaseUrl}v1/subcategory/${cat}/products`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            })
            .then(res => {
                // console.log(res.data.products);
                setProductsDup(res.data.products);
                setDisplayedProducts(productsDup);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
        } else {
            // console.log('In products')
            axios.get(`${apiBaseUrl}v1/product`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            })
            .then(res => {
                // console.log(res.data.product);
                setProductsDup(res.data.product);
                setDisplayedProducts(productsDup);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
        }
    }, [cat, apiBaseUrl])

    useEffect(() => {
        const sortItem = (type) => {
            // console.log(sortType)
            let curProd;
            switch (type) {
                case 'latest':
                    curProd = [...productsDup].sort((a, b) => (new Date(b.date)) -  (new Date(a.date)));
                    setDisplayedProducts(curProd);
                    break;
                case 'price asc':
                    curProd = [...productsDup].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                    setDisplayedProducts(curProd);
                    break;
                case 'price desc':
                    curProd = [...productsDup].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                    setDisplayedProducts(curProd);
                    break;
                default:
                    curProd = productsDup;
                    setDisplayedProducts(curProd);
                    break;
            }
        }

        sortItem(sortType)
    }, [sortType, productsDup]);

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(15);

    //  Get Current Products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = displayedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    //  Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <AppLayout user={user} setUser={setUser} products={products} categories={categories} cart={cart}>
            <main className="shop-section pt-3 pb-5">
                <div className="container">
                    <section className="row">
                        <section className="col-md-12 mt-3 shop-content">
                            <div className="d-flex flex-column">
                                <div className="d-flex align-items-center">
                                    {/* <h4 className="">Shop</h4> */}
                                    <p><Link to='/'>Home </Link>/ Shop{cat ? ` / ${match.params.category}` : null}</p>
                                    
                                </div>
                                <p className="mt-4">
                                    Explore a growing inventory of our food store available for online purchase from our licensed store therefore guaranteeing quality
                                </p>
                                <div className="d-flex align-items-center justify-content-end">
                                </div>
                                <section className="product-catalog my-4">
                                    {
                                        isLoading ? 
                                            <Spinner />
                                            :
                                            <ProductContainer products={currentProducts} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
                                    }
                                </section>
                                <section className="pagination-container">
                                    <div className="d-flex align-items-center justify-content-start">
                                        <Pagination 
                                            numberPerPage={productsPerPage} 
                                            totalNumber={products.length} 
                                            paginate={paginate}
                                        />
                                    </div>
                                </section>
                            </div>
                        </section>
                        {/* <section className="col-md-3 mt-3 advert">
                            <div className="">
                                <img src={deliveries2} alt="delivery speed" className="d-block w-100"/>
                            </div>
                            <div className="mt-3">
                                <img src={chatUs} alt="delivery speed" className="d-block w-100"/>
                            </div>
                        </section> */}
                    </section>
                </div>
            </main>
        </AppLayout>
    )
}

export default ShopView;
