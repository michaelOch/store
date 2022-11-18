import React from 'react';
import PropTypes from 'prop-types';

import ProductItem from '../ProductItem/ProductItem';

function ProductContainer({ products, cart, addToCart, removeFromCart }) {
    return (
        <div className="product-container">
            <div className="row">
                {
                    products ? 
                        products.length > 0 ? 
                            products.map((product, i) => (
                                <div key={i + 1} className="col-md-3 mt-3">
                                    <div className="d-flex">
                                        <ProductItem product={product} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
                                    </div>
                                </div>
                            ))
                            : <div className="col-md-12 mt-3">
                                <div className="d-flex justify-content-center align-items-center">
                                    <h5 className="">No records found...</h5>
                                </div>
                            </div>
                        : <div className="col-md-12 mt-3">
                            <div className="d-flex justify-content-center align-items-center">
                                <h5 className="">No records found...</h5>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

ProductContainer.prototype = {
    products: PropTypes.array
}

export default ProductContainer;
