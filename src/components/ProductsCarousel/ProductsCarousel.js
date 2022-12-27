import React from 'react';
import PropTypes from 'prop-types';

import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from '../../utils/theme';

import './ProductsCarousel.css';

import ProductItem from '../ProductItem/ProductItem';

function ProductsCarousel({ title, products, user, cart, addToCart, removeFromCart }) {
    return (
        <div className="products-carousel">
            <h3 className="title">{title}</h3>
            <hr className="my-4" />
            <div id={`carousel-${title.slice(0, 2)}`} className="carousel slide" data-interval="false" data-ride="carousel">
                <div className="carousel-inner row w-100 mx-auto" role="listbox">
                    {
                        products.map((product, i) => (
                            i !== 0 ?
                                <div key={i + 1} className="">
                                    <ProductItem product={product} user={user} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
                                </div>
                            : <div key={i + 1} className=" active">
                                <ProductItem product={product} user={user} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
                            </div>
                        ))
                    }
                </div>
                {/* <a className="carousel-control-prev" href={`#carousel-${title.slice(0, 2)}`} role="button" data-slide="prev">
                    <FontAwesomeIcon 
                        icon={faAngleLeft} 
                        color={theme.colors.black}
                        className="carousel-control-prev-icon" 
                    />
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href={`#carousel-${title.slice(0, 2)}`} role="button" data-slide="next">
                    <FontAwesomeIcon 
                        icon={faAngleRight} 
                        color={theme.colors.black}
                        className="carousel-control-next-icon" 
                    />
                    <span className="sr-only">Next</span>
                </a> */}
            </div>
        </div>
    )
}

ProductsCarousel.prototype = {
    products: PropTypes.array,
    title: PropTypes.string
}

export default ProductsCarousel;
