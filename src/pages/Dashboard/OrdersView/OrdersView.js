import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Link } from "react-router-dom";
import DashLayout from '../../../layout/DashLayout/DashLayout';
import Pagination from '../../../components/Pagination/Pagination';
import Spinner from '../../../components/Spinner/Spinner';

import { faEye, faTimes, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './OrdersView.css';
import theme from '../../../utils/theme';
import util from '../../../utils/util'

function OrdersView({ user, setUser} ) {

    const apiBaseUrl = util.apiBaseUrl;

    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(20);

    //  Get Current Orders
    const indexOfLastProduct = currentPage * ordersPerPage;
    const indexOfFirstProduct = indexOfLastProduct - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstProduct, indexOfLastProduct);

    //  Change Page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setLoading(true);
        axios.get(`${apiBaseUrl}v1/order/admin`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setOrders(res.data.order)
            setLoading(false);
        })
        .catch(err => {
            console.log(err)
            setLoading(false);
        })
    }, [refresh, apiBaseUrl]);

    const handleView = (e) => {
        e.preventDefault();
        setLoading2(true);
        axios.get(`${apiBaseUrl}v1/order/admin/${e.target[0].value}`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            setOrder(res.data.order)
            setLoading2(false);
        })
        .catch(err => {
            console.log(err)
            setLoading2(false);
        })
    }

    const handleSelect = (e) => {
        e.preventDefault();
        const newStatus = {status: e.target.textContent};
        // console.log(newStatus, e.target.id)
        axios({
            method: 'put',
            url: `${apiBaseUrl}v1/order/admin/${e.target.id}`,
            data: newStatus,
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
            })
            .then(res => {
                // console.log(res);
                setRefresh(!refresh);
            })
            .catch(err => console.log(err));
    }

    return (
        <DashLayout user={user} setUser={setUser} title={`Orders`}>
            <main className="dashboard-orders">
                <section className="container-fluid">
                    <div className="p-3 table-wrapper">
                        <div className="">
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link tab-header active" data-toggle="tab" href="#new-order" role="tab" aria-controls="home" aria-selected="true">New</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link tab-header" data-toggle="tab" href="#confirmed-order" role="tab" aria-controls="profile" aria-selected="false">Comfirmed</a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a className="nav-link tab-header" data-toggle="tab" href="#delivered-order" role="tab" aria-controls="contact" aria-selected="false">Delivered</a>
                                </li>
                            </ul>
                            <div className="tab-content p-4" id="myTabContent">
                                <div className="tab-pane fade show active" id="new-order" role="tabpanel" aria-labelledby="new-order-tab">
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th colSpan="1"></th>
                                                    <th scope="col">Transaction ID</th>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Address</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Action</th>
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
                                                    currentOrders ? currentOrders.length > 0 ?
                                                        currentOrders.map((order) => {
                                                            if(order.status.toLowerCase() === 'new') { 
                                                                const date = new Date(order.date)
                                                                return (<tr key={order._id}>
                                                                    <td className="p-2">
                                                                        <div className="d-flex justify-content-center align-items-center icon" title="view" data-toggle="modal" data-target="#viewModal">
                                                                            <form onSubmit={handleView} noValidate>
                                                                                <input type="hidden" name="viewId" value={order._id} />
                                                                                <button type="submit" name="viewbtn" className="transparent-btn">
                                                                                    <FontAwesomeIcon icon={faEye} color={theme.colors.dark} />
                                                                                </button>
                                                                            </form>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-2">{order.transactionId}</td>
                                                                    <td className="p-2">{date.toLocaleString()}</td>
                                                                    <td className="p-2">&pound;{order.amount}</td>
                                                                    <td className="p-2">{order.address}</td>
                                                                    <td className="p-2">{order.status}</td>
                                                                    <td className="p-2">
                                                                        <div className="dropdown mb-3">
                                                                            <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                Status
                                                                            </button>
                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                <span className="dropdown-item" id={order._id} onClick={handleSelect}>Confirmed</span>
                                                                                <span className="dropdown-item" id={order._id} onClick={handleSelect}>Delivered</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                )
                                                            }
                                                            return null;
                                                        }) : null
                                                        : null
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="confirmed-order" role="tabpanel" aria-labelledby="confirmed-order-tab">
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th colSpan="1"></th>
                                                    <th scope="col">Transaction ID</th>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Address</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Action</th>
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
                                                    currentOrders ? currentOrders.length > 0 ?
                                                        currentOrders.map((order) => {
                                                            if(order.status.toLowerCase() === 'confirmed') { 
                                                                const date = new Date(order.date)
                                                                return (<tr key={order._id}>
                                                                    <td className="p-2">
                                                                        <div className="d-flex justify-content-center align-items-center icon" title="view" data-toggle="modal" data-target="#viewModal">
                                                                            <form onSubmit={handleView} noValidate>
                                                                                <input type="hidden" name="viewId" value={order._id} />
                                                                                <button type="submit" name="viewbtn" className="transparent-btn">
                                                                                    <FontAwesomeIcon icon={faEye} color={theme.colors.dark} />
                                                                                </button>
                                                                            </form>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-2">{order.transactionId}</td>
                                                                    <td className="p-2">{date.toLocaleString()}</td>
                                                                    <td className="p-2">&pound;{order.amount}</td>
                                                                    <td className="p-2">{order.address}</td>
                                                                    <td className="p-2">{order.status}</td>
                                                                    <td className="p-2">
                                                                        <div className="dropdown mb-3">
                                                                            <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                Status
                                                                            </button>
                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                <span className="dropdown-item" id={order._id} onClick={handleSelect}>New</span>
                                                                                <span className="dropdown-item" id={order._id} onClick={handleSelect}>Delivered</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                )
                                                            }
                                                            return null;
                                                        }) : null
                                                        : null
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="tab-pane fade" id="delivered-order" role="tabpanel" aria-labelledby="delivered-order-tab">
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th colSpan="1"></th>
                                                    <th scope="col">Transaction ID</th>
                                                    <th scope="col">Date</th>
                                                    <th scope="col">Amount</th>
                                                    <th scope="col">Address</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Action</th>
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
                                                    currentOrders ? currentOrders.length > 0 ?
                                                        currentOrders.map((order) => {
                                                            if(order.status.toLowerCase() === 'delivered') { 
                                                                const date = new Date(order.date)
                                                                return (<tr key={order._id}>
                                                                    <td className="p-2">
                                                                        <div className="d-flex justify-content-center align-items-center icon" title="view" data-toggle="modal" data-target="#viewModal">
                                                                            <form onSubmit={handleView} noValidate>
                                                                                <input type="hidden" name="viewId" value={order._id} />
                                                                                <button type="submit" name="viewbtn" className="transparent-btn">
                                                                                    <FontAwesomeIcon icon={faEye} color={theme.colors.dark} />
                                                                                </button>
                                                                            </form>
                                                                        </div>
                                                                    </td>
                                                                    <td className="p-2">{order.transactionId}</td>
                                                                    <td className="p-2">{date.toLocaleString()}</td>
                                                                    <td className="p-2">&pound;{order.amount}</td>
                                                                    <td className="p-2">{order.address}</td>
                                                                    <td className="p-2">{order.status}</td>
                                                                    <td className="p-2">
                                                                        <div className="dropdown mb-3">
                                                                            <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                Status
                                                                            </button>
                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                <span className="dropdown-item" id={order._id} onClick={handleSelect}>New</span>
                                                                                <span className="dropdown-item" id={order._id} onClick={handleSelect}>Confirmed</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                )
                                                            }
                                                            return null;
                                                        }) : null
                                                        : null
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* View Order Modal */}
                            <div className="modal fade" id="viewModal" tabIndex="-1" aria-labelledby="viewModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered modal-lg">
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="viewModalLabel">Order Details</h5>
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
                                                <div className="d-flex justify-content-center align-items-center border h-100 p-5">
                                                    <FontAwesomeIcon icon={faShoppingBasket} size="6x" />
                                                </div>
                                            </div>
                                            <div className="col-md-8 mt-3">
                                                <div className="">
                                                    <h5 className="mb-4">Transaction ID: {order.transactionId}</h5>
                                                    <hr />
                                                    <p className="">
                                                        <span className="font-weight-bold">Date: </span>{(new Date(order.date)).toLocaleString()}
                                                    </p>
                                                    <p className="">
                                                        <span className="font-weight-bold">Products: </span>{
                                                            order.products ? 
                                                                order.products.length > 0 ? 
                                                                    order.products.map(item => `${item.name} (${item.quantity} ${item.prescription ? '- with prescription' : ''}), `)
                                                                    : null
                                                                : null
                                                        }
                                                    </p>
                                                    <p className="">
                                                        <span className="font-weight-bold">Amount: </span>{order.amount}
                                                    </p>
                                                    <p className="">
                                                        <span className="font-weight-bold">Ordered By: </span>{order.user ? order.user.name : null}
                                                    </p>
                                                    <p className="">
                                                        <span className="font-weight-bold">Email: </span>{order.user ? order.user.email : null}
                                                    </p>
                                                    <p className="">
                                                        <span className="font-weight-bold">Mobile: </span>{order.user ? order.user.mobile : null}
                                                    </p>
                                                    <hr/>
                                                    <h4>Recipient</h4>
                                                    <p className="">
                                                        <span className="font-weight-bold">Name: </span>{order.recipient ? `${order.recipient.firstName} ${order.recipient.lastName}` : null}
                                                    </p>
                                                    <p className="">
                                                        <span className="font-weight-bold">Email: </span>{order.recipient ? order.recipient.email : null}
                                                    </p>
                                                    <p className="">
                                                        <span className="font-weight-bold">Mobile: </span>{order.recipient ? order.recipient.mobile : null}
                                                    </p>
                                                    <p className="">
                                                        <span className="font-weight-bold">Alternative Mobile: </span>{order.recipient ? order.recipient.altMobile : null}
                                                    </p>
                                                    <p className="">
                                                        <span className="font-weight-bold">Address: </span>{order.recipient ? order.recipient.address : null}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    <div className="modal-footer"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-end">
                            <Pagination 
                                numberPerPage={ordersPerPage} 
                                totalNumber={orders.length} 
                                paginate={paginate}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </DashLayout>
    )
}

export default OrdersView;
