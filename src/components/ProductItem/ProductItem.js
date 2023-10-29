import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import util from '../../utils/util';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from '../../utils/theme';

import './ProductItem.css';

import prescriptionTag from '../../utils/assets/prescription_image.png';

function ProductItem({ product, user, cart, addToCart, removeFromCart }) {

    const apiBaseUrl = util.apiBaseUrl;
    const [selectedItem, selectItem] = useState({});


    const changeSizingSelection = (index) => {
        // console.log(index);
        selectItem({
            itemIndex: index
        })
    }
    
    return (
        <div className="d-flex flex-column mx-auto product-item">
            <div className={product.status == 'new' ? "product-status status-new" : "product-status status-sold"}>
                {product.status}
            </div>
            <div className="position-relative basket-container mb-2">
                <Link className="position-relative avatar-container" 
                    to={{
                        pathname: `/product/${product.name}`,
                        state: {product: product}
                    }}>
                    {
                        product.image[0] !== undefined ? 
                            <img src={`${product.image[0]?.url}`} alt="product avatar" className="d-block w-100" />
                            : <FontAwesomeIcon icon={faBan} color={theme.colors.lighterDark} size="2x" style={{marginTop: '30px'}} 
                        />
                    }
                </Link>
                {
                    cart && cart.length > 0 && cart.some(value => value._id === product._id) ? 
                        <Link to={`/cart`}>
                            <div className="add-to-basket" >GO TO CART</div>
                        </Link>
                        :
                        <div className="add-to-basket" onClick={() => addToCart(product, selectedItem.itemIndex)} >ADD TO BASKET</div>
                }
            </div>

            <span className="product-title">{product?.name} {product?.sizing?.length <= 1 && `(${product?.sizing[0]?.size})`}</span>
            <div className="product-size">
                {product?.sizing?.length > 1 &&
                    <select onChange={(e) => changeSizingSelection(e.target.selectedIndex)}>
                        {product?.sizing.map((sizing, i) => 
                            <option key={i + 1} onClick={() => changeSizingSelection(i)}>{sizing?.size}</option>) }</select>
                }
            </div>
            <p className="product-price">&pound;
            {
                (!!selectedItem.itemIndex) ?
                    product?.sizing[selectedItem.itemIndex]?.price :
                    product?.sizing[0]?.price
                                                            
            }</p>
            {/* <span>
                {
                    cart ? 
                        cart.length > 0 ? 
                            cart.some(value => value._id === product._id) ? 
                                <span className="btn btn-sm btn-primary" onClick={() => removeFromCart(product)}>Remove from cart</span>
                                : <span className="btn btn-sm btn-dark" onClick={() => addToCart(product, selectedItem.itemIndex)}>Add to Cart</span>
                            : <span className="btn btn-sm btn-dark" onClick={() => addToCart(product, selectedItem.itemIndex)}>Add to Cart</span>
                        : <span className="btn btn-sm btn-dark" onClick={() => addToCart(product, selectedItem.itemIndex)}>Add to Cart</span>
                }
            </span> */}
        </div>
    )
}

ProductItem.prototype = {
    product: PropTypes.object
}

export default ProductItem;
