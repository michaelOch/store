import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import DashLayout from '../../../layout/DashLayout/DashLayout';

import { faList, faUsers, faShoppingBasket, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from '../../../utils/theme';
import util from '../../../utils/util'

import './DashHomeView.css';

function DashHomeView({ user, setUser}) {

    const apiBaseUrl = util.apiBaseUrl;

    const [numberOfSubCategory, setNumberOfCategory] = useState();
    const [numberOfProducts, setNumberOfProducts] = useState();
    const [numberOfOrders, setNumberOfOrders] = useState();
    const [numberOfUsers, setNumberOfUsers] = useState();
    const [orders, setOrders] = useState();

    useEffect(() => {
        // Category
        axios.get(`${apiBaseUrl}v1/subcategory`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setNumberOfCategory(res.data.subcategory.length)
        })
        .catch(err => console.log(err))

        //  Products
        axios.get(`${apiBaseUrl}v1/product?sort=date&order=desc`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setNumberOfProducts(res.data.product.length)
        })
        .catch(err => console.log(err))

        //  Orders
        axios.get(`${apiBaseUrl}v1/order/admin`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setNumberOfOrders(res.data.order.length)
            setOrders(res.data.order.slice(0, 6));
        })
        .catch(err => console.log(err))

        axios.get(`${apiBaseUrl}v1/user/`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setNumberOfUsers(res.data.users.length)
        })
        .catch(err => console.log(err))
    }, [apiBaseUrl]);

    return (
        <DashLayout user={user} setUser={setUser} hideBackIcon={true}>
            <section className="dashboard-home">
                <div className="container-fluid">
                    <div className="row mt-3">
                        <div className="col-md-3 mt-2">
                            <Link to='/dashboard/subcategory'>
                                <div className="d-flex flex-column justify-content-center align-items-center border box rounded p-3">
                                    <FontAwesomeIcon icon={faList} size="2x" color={theme.colors.primary} />
                                    <h2 className="text-info mt-1">Sub Categories</h2>
                                    <h3 className="text-secondary">{numberOfSubCategory ? numberOfSubCategory : 0}</h3>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-3 mt-2">
                            <Link to='/dashboard/products'>
                                <div className="d-flex flex-column justify-content-center align-items-center border box rounded p-3">
                                    <FontAwesomeIcon icon={faShoppingBasket} size="2x" color={theme.colors.primary} />
                                    <h2 className="text-info mt-1">Products</h2>
                                    <h3 className="text-secondary">{numberOfProducts ? numberOfProducts : 0}</h3>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-3 mt-2">
                            <Link to='/dashboard/orders'>
                                <div className="d-flex flex-column justify-content-center align-items-center border box rounded p-3">
                                    <FontAwesomeIcon icon={faCartPlus} size="2x" color={theme.colors.primary} />
                                    <h2 className="text-info mt-1">Orders</h2>
                                    <h3 className="text-secondary">{numberOfOrders ? numberOfOrders : 0}</h3>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-3 mt-2">
                            <Link to='/dashboard/users'>
                                <div className="d-flex flex-column justify-content-center align-items-center border box rounded p-3">
                                    <FontAwesomeIcon icon={faUsers} size="2x" color={theme.colors.primary} />
                                    <h2 className="text-info mt-1">Users</h2>
                                    <h3 className="text-secondary">{numberOfUsers ? numberOfUsers : 0}</h3>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <section className="orders-container mt-5">
                        <h4 className="">Latest Orders</h4>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Transaction ID</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Address</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orders ? 
                                            orders.length > 0 ? 
                                                orders.map((order) => (
                                                    <tr key={order._id}>
                                                        <td className="p-2">{order.transactionId}</td>
                                                        <td className="p-2">{(new Date(order.date)).toLocaleString()}</td>
                                                        <td className="p-2">₦{order.amount}</td>
                                                        <td className="p-2">{order.address}</td>
                                                        <td className="p-2">{order.status}</td>
                                                    </tr>
                                                ))
                                                : null
                                            : null
                                    }
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </section>
        </DashLayout>
    )
}

export default DashHomeView;
