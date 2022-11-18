import React, { useState, useEffect } from 'react';
// import { Link } from "react-router-dom";
import AppLayout from '../../layout/AppLayout/AppLayout';

// import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './HomeView.css';
import ProductsCarousel from '../../components/ProductsCarousel/ProductsCarousel';

// import dealsSticker from '../../utils/assets/deals-sticker.jpg';
import banner1 from '../../utils/assets/banner-1.jpg';
import banner2 from '../../utils/assets/banner-2.jpg';
import banner3 from '../../utils/assets/banner-3.jpg';

function HomeView({ user, setUser, products, categories, cart, addToCart, removeFromCart }) {

    const [newProducts, setNewProducts] = useState([]);
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [drinkProducts, setDrinkProducts] = useState([]);

    useEffect(() => {
        const nProducts = products.filter((item, i) => i < 20);
        const tProducts = products.filter(item => Boolean(item.trending) === true);
        const dProducts = []; 
        products.forEach(item => {
            const isDrink = item.subcategory.some(category => category.name.toLowerCase().includes('drink'));
            // console.log(1, isDrink);
            if (isDrink) {
                dProducts.push(item);
            }
        });
        setNewProducts(nProducts);
        setTrendingProducts(tProducts);
        setDrinkProducts(dProducts);
    }, [products]);

    return (
        <AppLayout user={user} setUser={setUser} products={products} categories={categories} cart={cart}>
            <main className="container-fluid home-section">
                <div id="carouselExampleSlidesOnly" className="carousel slide" data-ride="carousel">
                    <div className="row">
                        <div className="carousel-inner mb-3">
                            <div className="carousel-item active">
                                <div className="d-flex justify-content-end align-items-center border rounded slide-content" style={{backgroundImage: `url(${banner3})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom', backgroundSize: 'cover'}} >
                                    <div className="d-flex align-items-center justify-content-center slide-content-caption p-3">
                                        {/* <h1 className="text-center font-weight-bold">Welcome to Wellocity Pharmacy</h1> */}
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="d-flex justify-content-end align-items-center border rounded slide-content" style={{backgroundImage: `url(${banner1})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover'}} >
                                    <div className="d-flex align-items-center justify-content-center slide-content-caption p-3">
                                        {/* <h1 className="text-center font-weight-bold">Can't get out to bring your medicine? Let us bring it for you</h1> */}
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <div className="d-flex justify-content-end align-items-center border rounded slide-content" style={{backgroundImage: `url(${banner2})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover'}} >
                                    <div className="d-flex align-items-center justify-content-center slide-content-caption p-3">
                                        {/* <h1 className="text-center font-weight-bold">Have your medicine delivered to your door step</h1> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container my-4">

                    {/* New Product Section */}
                    <section className="new-product-section mt-0 p-4">
                        <div className="">
                            <ProductsCarousel title="What's New" products={newProducts} user={user} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
                        </div>
                    </section>

                    {/* Deals Section */}
                    <section className="deal-section mt-4 p-4">
                        <div className="row">
                            {/* <div className="col-md-4 mt-3">
                                <div className="d-flex justify-content-center align-items-center">
                                    <img src={dealsSticker} alt="deals sticker" className="d-block w-100 avatar" />
                                </div>
                            </div> */}
                            <div className="col-md-12 mt-3">
                                <div className="">
                                    <ProductsCarousel title="Drinks" products={drinkProducts} user={user} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Trending Section */}
                    <section className="trend-section mt-4 p-4">
                        <div className="">
                            <ProductsCarousel title="Trending" products={trendingProducts} user={user} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
                        </div>
                    </section>

                    {/* Best Product Section */}
                    {/* <section className="best-product-section mt-4">
                        <div className="row">
                            <div className="col-md-6 mt-3">
                                <div className="position-relative">
                                    <img src={sexualWellness} alt="sexual wellness" className="d-block w-100" />
                                    <div className="d-flex flex-column justify-content-center align-items-end p-5 section-caption w-100">
                                        <Link to='/shop'>
                                            <span className="btn btn-secondary">Best Products</span>
                                        </Link>
                                        <h2 className="mt-3 mb-0 best-product-caption">SEXUAL</h2>
                                        <h2 className="best-product-caption">WELLNESS</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mt-3">
                                <div className="position-relative">
                                    <img src={littleAngel} alt="little angel" className="d-block w-100" />
                                    <div className="d-flex flex-column justify-content-center align-items-end p-5 section-caption w-100">
                                        <Link to='/shop'>
                                            <span className="btn btn-secondary">Best Products</span>
                                        </Link>
                                        <h2 className="mt-3 mb-0 best-product-caption">LITTLE</h2>
                                        <h2 className="best-product-caption">ANGELS</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section> */}
                </div>
            </main>
        </AppLayout>
    )
}

export default HomeView;
