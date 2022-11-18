import React, { useState, useEffect } from 'react';
import { Link, useHistory, withRouter } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Spinner from '../../components/Spinner/Spinner';

import './ReceiptView.css';
import logo from '../../utils/assets/logo.jpeg';

function ReceiptView({ location, user, setUser }) {

    // const { transactionId, amount, products, address, date } = location.state.order;
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const history = useHistory();

    useEffect(() => {
        if (location.state === undefined) {
            history.push('/cart');
        } else {
            setData(location.state.order);
            setIsLoading(false);
        }
    }, [location, history]);

    return (
        <ErrorBoundary>
            {
                isLoading ? 
                    (
                        <div className="w-100 d-flex flex-column justify-content-center align-items-center" style={{opacity: '0.5', height: '100vh'}}>
                            <Spinner />
                        </div>
                    )
                    : (
                    <main className="payment-section">
                        <header className="payment-header">
                            <nav className="navbar navbar-expand-lg fixed-top py-3">
                                <div className="container-fluid">
                                    <div className="d-flex align-items-center">
                                        <Link to='/'>
                                            <div className="d-flex align-items-center">
                                                <img src={logo} alt="logo" className="d-block mr-1 logo" />
                                                <h3 className="mb-0 brand">Cherry's Store</h3>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </nav>
                        </header>
                        <section className="payment-content">
                            <div className="container">
                                <section className="row">
                                    <section className="col-md-8 offset-md-2 mt-3 payment-container">
                                        <div className="d-flex flex-column">
                                            <article className="card card-body shadow">
                                                <section className="d-flex align-items-center justify-content-between">
                                                    <h6 className="mb-0 mr-2">Order Summary</h6>
                                                    <h6 className="mb-0 font-weight-bold">{data ? data.transactionId : null}</h6>
                                                </section>
                                                <hr />
                                                <div className="card card-body">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <h5 className="mb-0">Total: </h5>
                                                        <h5 className="mb-0">&pound;{data ? parseFloat(data.amount).toFixed(2) : null}</h5>
                                                    </div>
                                                </div>
                                            </article>
                                            <article className="card card-body shadow mt-4">
                                                <section className="d-flex align-items-center justify-content-between">
                                                    <h6 className="mr-2">Products</h6>
                                                    <h6 className="">{data ? (new Date(data.date)).toLocaleString() : null}</h6>
                                                </section>
                                                <ul className="list-group list-group-flush">
                                                    {
                                                        data ? 
                                                            data.products.length > 0 ? 
                                                                data.products.map((product, i) => (
                                                                    <li key={i + 1} className="list-group-item">{`${product.name} (${product.quantity})`}</li>
                                                                ))
                                                                : null
                                                            : null
                                                    }
                                                </ul>
                                                <section className="d-flex align-items-center justify-content-between">
                                                    <h6 className="mt-3 mr-2">Address</h6>
                                                </section>
                                                <p className="">{data ? data.recipient.address : null}</p>
                                                <Link to="/">
                                                    <span className="btn btn-block btn-dark">Continue Shopping</span>
                                                </Link>
                                            </article>
                                        </div>
                                    </section>
                                </section>
                            </div>
                        </section>
                    </main>
                    )
            }
        </ErrorBoundary>
    )
}

export default withRouter(ReceiptView);
