import React from 'react';
import { Link, useHistory } from "react-router-dom";
import AppLayout from '../../layout/AppLayout/AppLayout';
import util from '../../utils/util';
import Cookies from 'js-cookie';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from '../../utils/theme';

import './CartView.css';

function CartView({ user, setUser, products, categories, cart, setCart, addToCart, removeFromCart }) {

    const apiBaseUrl = util.apiBaseUrl;

    const history = useHistory();

    const incrementQty = (id) => {
        const newCart = cart.map(value => {
            if (value._id === id) {
                value.quantity = parseInt(value.quantity) + 1;
                value.subTotal = parseInt(value.quantity) * parseFloat(value.price);
                return value;
            }

            return value;
        })

        Cookies.set('cart', JSON.stringify(newCart), { expires: 30 });
        setCart(newCart);

    }

    const decrementQty = (id) => {
        const newCart = cart.map(value => {
            if (value._id === id) {
                if (parseInt(value.quantity) > 1) {
                    value.quantity = parseInt(value.quantity) - 1;
                }
                value.subTotal = parseInt(value.quantity) * parseFloat(value.price);
                return value;
            }

            return value;
        })

        Cookies.set('cart', JSON.stringify(newCart), { expires: 30 });
        setCart(newCart);
    }

    const proceedToCheckout = () => {
        history.push({
            pathname: '/checkout',
            state: true
        });
    }

    return (
        <AppLayout user={user} setUser={setUser} products={products} categories={categories} cart={cart}>
            <main className="cart-section pt-3 pb-5">
                <div className="container"> 
                    <section className="row">
                        <section className="col-md-12 mt-3 cart-content">
                            <div className="d-flex flex-column">
                                <div className="d-flex align-items-center">
                                    <h4 className="">Cart</h4>
                                </div>
                                <article className="border p-4 mt-4 cart-container">
                                    <div className="d-flex justify-content-between align-items-center coupon-container">
                                        
                                        <div className="">
                                            <Link to='/shop'>
                                                <span className="btn btn-sm btn-dark">Continue Shopping</span>
                                            </Link>
                                        </div>
                                        <div className="">
                                            <Link to={'/checkout'}>
                                                {
                                                    cart ? cart.length > 0 ? 
                                                        <button type="submit" className="d-inline-block btn btn-sm btn-primary" >Proceed To Checkout</button>
                                                        : <button className="d-inline-block btn btn-sm btn-primary" disabled >Proceed To Checkout</button>
                                                    : <button className="d-inline-block btn btn-sm btn-primary" disabled >Proceed To Checkout</button>
                                                }
                                            </Link>
                                        </div>
                                    </div>
                                
                                    <div className="table-responsive">
                                        <table className="table table-striped table-cart">
                                            <thead>
                                                <tr>
                                                    <th scope="col"></th>
                                                    <th scope="col"></th>
                                                    <th scope="col">Product</th>
                                                    <th scope="col">Unit Price</th>
                                                    <th scope="col">Quantity</th>
                                                    <th scope="col">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    cart ? 
                                                        cart.length > 0 ? 
                                                            cart.map(item => (
                                                                <tr key={item._id}>
                                                                    <td className="font-weight-bold">
                                                                        <div className="d-flex justify-content-center align-items-center" style={{cursor: 'pointer'}} onClick={() => removeFromCart(item)}>
                                                                            <FontAwesomeIcon icon={faTrash} color={theme.colors.dark} />
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="">
                                                                            <Link to={`/product/${item._id}`}>
                                                                                {/* <img src={`${apiBaseUrl}${item.image[0]}`} alt={item.name} className="mx-auto product-avatar" /> */}
                                                                            </Link>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex justify-content-between">
                                                                            <span className="font-weight-bold mr-3 content-label">Product:</span>
                                                                            <Link to={{
                                                                                pathname: `/product/${item.name}`,
                                                                                state: {product: item}
                                                                            }}>
                                                                                {item.name}
                                                                            </Link>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex justify-content-between">
                                                                            <span className="font-weight-bold mr-3 content-label">Price:</span>
                                                                            <span className="product-amount">&pound;{parseFloat(item.price).toFixed(2)}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="d-flex">
                                                                            <span className="font-weight-bold mr-3 content-label">Quantity:</span>
                                                                            {/* <input type="number" className="form-control" placeholder="1" /> */}
                                                                            <button className="btn btn-sm btn-dark py-1 px-2" onClick={() => decrementQty(item._id)}>-</button>
                                                                            <span className="font-weight-bold mx-2">{item.quantity ? item.quantity : 1}</span>
                                                                            <button className="btn btn-sm btn-dark py-1 px-2" onClick={() => incrementQty(item._id)}>+</button>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="">
                                                                            <span className="font-weight-bold mr-2 content-label">Subtotal:</span>
                                                                            <span className="product-amount">&pound;{item.subTotal ? parseFloat(item.subTotal).toFixed(2) : parseFloat(item.price).toFixed(2)}</span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                            : null
                                                        : null
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </article>
                            </div>
                        </section>
                        <section className="col-md-3 mt-3 advert">
                            {/* <div className="">
                                <img src={deliveries2} alt="delivery speed" className="d-block w-100"/>
                            </div>
                            <div className="mt-3">
                                <img src={chatUs} alt="delivery speed" className="d-block w-100"/>
                            </div> */}
                        </section>
                    </section>
                </div>
            </main>
        </AppLayout>
    )
}

export default CartView;
