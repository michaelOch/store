import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory, withRouter } from "react-router-dom";
import Spinner from '../../components/Spinner/Spinner';
import util from '../../utils/util';
import Cookies from 'js-cookie';
import AppLayout from '../../layout/AppLayout/AppLayout';
// import { loadStripe } from "@stripe/stripe-js";

import './CheckoutView.css';
// import logo from '../../utils/assets/logo.jpeg';


// const stripePromise = loadStripe("pk_test_51IEpG6LPBlahm7Q4CiGS3gnkDkcpgLWLM2rOXi2RpzhM196bahABxLfF0ou5A3uy4kHYVy0BfJSWeg6eH5uuzuna00LMWNjcGU");

function CheckoutView({location, user}) {

    const apiBaseUrl = util.apiBaseUrl;

    const [overallSubTotal, setOverallSubTotal] = useState();
    const [zone, setZone] = useState("zoneA");
    const [shippingCost, setShippingCost] = useState(0);
    const [shippingDay, setshippingDay] = useState("nextWorkingDay");
    const [paymentProcessor, setPaymentProcessor] = useState("stripe");
    const [paymentCost, setPaymentCost] = useState(0);
    const [total, setTotal] = useState();
    const [mobile, setMobile] = useState(!!user ? user.mobile : "");
    const [email, setEmail] = useState(!!user ? user.email : "");
    const [city, setCity] = useState(!!user ? user.city : "");
    const [state, setState] = useState(!!user ? user.state : "");
    const [street, setStreet] = useState(!!user ? user.street : "");
    const [zipCode, setZipCode] = useState(!!user ? user.zipCode : "");
    const [firstName, setFirstName] = useState(!!user ? user.firstName : "");
    const [lastName, setLastName] = useState(!!user ? user.lastName : "");
    const [additionalInfo, setAdditionalInfo] = useState();
    const [password, setPassword] = useState();
    const [kg, setKg] = useState(0);

    const [isNewDelivery, setUpNewDelivery] = useState(false);
    const [isNewAccount, createNewAccount] = useState(false);

    const [recipientFirstName, setRecipientFirstName] = useState();
    const [recipientLastName, setRecipientLastName] = useState();
    const [recipientMobile, setRecipientMobile] = useState();
    const [recipientEmail, setRecipientEmail] = useState();
    const [recipientStreet, setRecipientStreet] = useState();
    const [recipientCity, setRecipientCity] = useState();
    const [recipientState, setRecipientState] = useState();
    const [recipientZipCode, setRecipientZipCode] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [cart] = useState(JSON.parse(Cookies.get('cart')));
    const [message, setMessage] = useState("");

    const history = useHistory();


    useEffect(() => {

        if (location === undefined) {
            history.push('/cart');
        } else {
            let sTotal = 0;
            if (cart.length > 0) {
                cart.forEach(value => {
                    sTotal += parseFloat(value.subTotal);
                    
                })
            }

            setOverallSubTotal(sTotal);
            setTotal(overallSubTotal + shippingCost);
            setIsLoading(false);
        }

        getShippingCost(zone, shippingDay)
        getPaymentCost(paymentProcessor, total)

        // console.log("Checkout: ", cart)

    }, [user, cart, overallSubTotal, shippingCost, location, history])

    useEffect(() => {

        
        // Check to see if this is a redirect back from Checkout
    
        const query = new URLSearchParams(window.location.search);
    
        if (query.get("success")) {
    
          setMessage("Order placed! You will receive an email confirmation.");
    
        }
    
        if (query.get("canceled")) {
    
          setMessage(
    
            "Order canceled -- continue to shop around and checkout when you're ready."
    
          );
    
        }
    
      }, []);

    useEffect(() => {
        let totalKg = 0;
        if (cart) {
            if  (cart.length > 0) {
                cart.forEach(curCart => {
                    if (curCart.sizing.length > 0) {
                        const size = curCart.sizing.filter(value => value.price === curCart.price);
                        const weightValue = size[0].weightValue ? size[0].weightValue : 0;
                        const weightUnit = size[0].weight;

                        if (weightUnit.toLowerCase() === 'kg') {

                            totalKg += (weightValue * curCart.quantity);

                        } else if (weightUnit.toLowerCase() === 'g') {

                            totalKg += ((weightValue / 1000) * curCart.quantity);

                        } else if (weightUnit.toLowerCase() === 'l') {

                            totalKg += (weightValue * curCart.quantity);

                        }
                    }
                })

                setKg(totalKg);
            }
        }
    }, [cart])

    const getShippingCost = (zone, shippingDay) => {
        axios({
            method: 'post',
            url: `${apiBaseUrl}v1/product/shipping/cost`,
            data: {
                zone: zone,
                shippingDay: shippingDay,
                kg: kg
            }
        })
        .then(res => {
            // console.log("res.data: ", res.data)
            if(!!res.data.status) {
                setShippingCost(parseFloat(res.data.cost));
            }
        })
        .catch(err => console.error(err));
    }

    const getPaymentCost = (processor, cost) => {
        axios({
            method: 'post',
            url: `${apiBaseUrl}v1/product/payment/cost`,
            data: {
                cost: cost,
                processor: processor
            }
        })
        .then(res => {
            if(!!res.data.status) {
                setPaymentCost(parseFloat(res.data.cost));
            }
        })
        .catch(err => console.error(err));
    }

    const onChangeShipping = (e) => {
        const zone = e.target.value;
        setZone(zone)
        getShippingCost(zone, shippingDay)
        getPaymentCost(paymentProcessor, total)

    }

    const onChangeShippingDay = (e) => {
        const shippingDay = e.target.value;
        setshippingDay(shippingDay);
        getShippingCost(zone, shippingDay)
        getPaymentCost(paymentProcessor, total)

    }

    const onChangePayment = (e) => {
        const payment = e.target.value;
        setPaymentProcessor(payment);
        getPaymentCost(payment, total)
    }

    const triggerPassword = () => {
        createNewAccount(!isNewAccount)
    }

    const triggerNewDelivery = () => {
        setUpNewDelivery(!isNewDelivery)
    }

    const submitOrder = async () => {

        const orderDetail = {
            amount: total * 100,
            products: cart,
            additionalInfo: additionalInfo,
            isNewDelivery: isNewDelivery,
            email: email
        }

        const userDetail = {
            userID: !!user ? user._ID : null,
            isNewAccount: isNewAccount,
            email: email,
            mobile: mobile,
            city: city,
            street: street,
            state: state,
            zipCode: zipCode,
            firstName: firstName,
            lastName: lastName,
            password: password
        }

        const recipientDetail = {
            email: recipientEmail,
            mobile: recipientMobile,
            city: recipientCity,
            street: recipientStreet,
            state: recipientState,
            zipCode: recipientZipCode,
            firstName: recipientFirstName,
            lastName: recipientLastName,
        }

        // getPaymentProcessor(userDetail, recipientDetail, orderDetail)

    }

    const getPaymentProcessor = async (userDetail, recipientDetail, orderDetail) => {

        switch (paymentProcessor) {
            case "stripe":
                await getPaymentIntent(userDetail, recipientDetail, orderDetail)
                break;
            case "flutterwave":
                await linkPaymentProcessor(userDetail, recipientDetail, orderDetail)
                break;
            case "paypal":
                await linkPaymentProcessor(userDetail, recipientDetail, orderDetail)
                break;
            default:
                break;
        }
    }

    const linkPaymentProcessor = (userDetail, recipientDetail, orderDetail) => {

    }

    const proceedToPay = async (clientSecret, order) => {
        history.push({
            pathname: '/pay',
            state: {
                secret: clientSecret,
                order: order
            }
        });
    }

    const getPaymentIntent = async (userDetail, recipientDetail, orderDetail) => {
        const response = await axios.post(`${apiBaseUrl}v1/payment/create-payment-intent`, orderDetail);    
        var clientSecret = await response.data.client_secret;

        await proceedToPay(clientSecret, {userDetail, recipientDetail, orderDetail})
    }


    return (
        <AppLayout user={user} cart={cart}>
            {
                isLoading ? 
                    (
                        <div className="w-100 d-flex flex-column justify-content-center align-items-center" style={{opacity: '0.5', height: '100vh'}}>
                            <Spinner />
                        </div>
                    )
                    : 
                    (
                    <main className="checkout-section">
                        <section className="checkout-content">
                            <div className="container mt-3">
                                <div className="d-flex align-items-center mb-3">
                                    <Link to='/cart'>
                                        <button type="button" className="btn btn-block btn-primary btn-sm">&larr; Back to Cart</button>
                                    </Link>
                                </div>
                                <div className="d-flex align-items-center">
                                    <h4 className="mb-0"> Checkout</h4>
                                </div>
                                <section className="row">
                                    <section className="col-md-6">
                                        <div className="d-flex flex-column">
                                            <article className="border rounded p-4 mt-3 checkout-container">
                                                <section className="address-details">
                                                    <h5 className="">Billing Details</h5>
                                                    <hr />
                                                    <div className="">
                                                        <h6 className="font-weight-bold mb-2">Personal {user ? user.name.toUpperCase(): null}</h6>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="phone" className="form-control" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="email" className="form-control" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                                        </div>
                                                        <h6 className="font-weight-bold mb-2 mt-3">Billing Address </h6>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" placeholder="House number and Street name" value={street} onChange={(e) => setStreet(e.target.value)} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" placeholder="Town/City" value={city} onChange={(e) => setCity(e.target.value)} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" placeholder="State/Region" value={state} onChange={(e) => setState(e.target.value)} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <input type="text" className="form-control" placeholder="Zip/Postal code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
                                                        </div>
                                                        {!user &&
                                                            <label>Create my account <input type="checkbox" checked={isNewAccount} onChange={() => triggerPassword()} /></label>
                                                        }
                                                        {!!isNewAccount &&
                                                            <div className="form-group">
                                                                <input type="password" className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} required={!!isNewAccount ? true : false} />
                                                            </div>
                                                        }
                                                        <br/>
                                                        <label>Use a different delivery address <input type="checkbox" checked={isNewDelivery} onChange={() => triggerNewDelivery()} /></label>
                                                    </div>
                                                </section>
                                                {!!isNewDelivery &&
                                                <>
                                                    <hr />
                                                    <section className="address-details">
                                                        <h5 className="">Delivery Details</h5>
                                                        <hr />
                                                        <div className="">
                                                            <h6 className="font-weight-bold mb-2">Recipient</h6>
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" placeholder="First Name" value={recipientFirstName} onChange={(e) => setRecipientFirstName(e.target.value)} />
                                                            </div>
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" placeholder="Last Name" value={recipientLastName} onChange={(e) => setRecipientLastName(e.target.value)} />
                                                            </div>
                                                            <div className="form-group">
                                                                <input type="phone" className="form-control" placeholder="Mobile Number" value={recipientMobile} onChange={(e) => setRecipientMobile(e.target.value)} />
                                                            </div>
                                                            <div className="form-group">
                                                                <input type="email" className="form-control" placeholder="Email Address" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} />
                                                            </div>
                                                            <h6 className="font-weight-bold mb-2 mt-3">Street address </h6>
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" placeholder="House number and Street name"  value={recipientStreet} onChange={(e) => setRecipientStreet(e.target.value)} />
                                                            </div>
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" placeholder="Town/City" value={recipientCity} onChange={(e) => setRecipientCity(e.target.value)} />
                                                            </div>
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" placeholder="State/Region" value={recipientState} onChange={(e) => setRecipientState(e.target.value)} />
                                                            </div>
                                                            <div className="form-group">
                                                                <input type="text" className="form-control" placeholder="Zip/Postal code" value={recipientZipCode} onChange={(e) => setRecipientZipCode(e.target.value)} />
                                                            </div>
                                                            <div className="form-group">
                                                                <textarea className="form-control" rows="5" placeholder="Additional Information" value={additionalInfo} onChange={(e) => setAdditionalInfo(e)}></textarea>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </>
                                                }
                                                
                                            </article>
                                        </div>
                                    </section>
                                    <section className="col-md-3 cart-totals">
                                        <table className="table table-bordered mt-3">
                                            <tbody>
                                                <tr style={{backgroundColor: '#ededed'}}><td>Shipping Region and Time</td></tr>
                                                <tr>
                                                    <td>
                                                        <div className="form-check mb-3">
                                                            <label className="form-check-label">
                                                                <input className="form-check-input" type="radio" name="zones" value="zoneA" onChange={(e) => onChangeShipping(e)} defaultChecked />
                                                            England &amp; Wales</label>
                                                        </div>
                                                        <div className="form-check mb-3">
                                                            <label className="form-check-label">
                                                                <input className="form-check-input" type="radio" name="zones" value="zoneB" onChange={(e) => onChangeShipping(e)} />
                                                                Lower Scotland</label>
                                                        </div>
                                                        <div className="form-check mb-3">
                                                            <label className="form-check-label">
                                                                <input className="form-check-input" type="radio" name="zones" value="zoneC" onChange={(e) => onChangeShipping(e)} />
                                                            Highlands of Scotland and Northern Ireland</label>
                                                        </div>
                                                        <div className="form-check mb-3">
                                                            <label className="form-check-label">
                                                                <input className="form-check-input" type="radio" name="zones" value="zoneD" onChange={(e) => onChangeShipping(e)} />
                                                            Ireland off the Island</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table className="table table-bordered mt-3">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="form-check mb-3">
                                                            <label className="form-check-label">
                                                                <input className="form-check-input" type="radio" name="shipping-day" value="nextWorkingDay" onChange={(e) => onChangeShippingDay(e)} defaultChecked />
                                                            Next Working Day</label>
                                                        </div>
                                                        <div className="form-check mb-3">
                                                            <label className="form-check-label">
                                                                <input className="form-check-input" type="radio" name="shipping-day" value="saturday" onChange={(e) => onChangeShippingDay(e)} />
                                                                Saturday</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table className="table table-bordered mt-3">
                                            <tbody>
                                                <tr style={{backgroundColor: '#ededed'}}><td>Preferred Payment</td></tr>

                                                <tr>
                                                    <td>
                                                        <div className="form-check mb-3">
                                                            <label className="form-check-label">
                                                                <input className="form-check-input" type="radio" name="payment-processor" value="stripe" onChange={(e) => onChangePayment(e)} defaultChecked />
                                                            Stripe</label>
                                                        </div>
                                                        {/* <div className="form-check mb-3">
                                                            <label className="form-check-label">
                                                                <input className="form-check-input" type="radio" name="payment-processor" value="flutterwave" onChange={(e) => onChangePayment(e)} />
                                                                FlutterWave</label>
                                                        </div>
                                                        <div className="form-check mb-3">
                                                            <label className="form-check-label">
                                                                <input className="form-check-input" type="radio" name="payment-processor" value="paypal" onChange={(e) => onChangePayment(e)} />
                                                                PayPal</label>
                                                        </div> */}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </section>
                                    <section className="col-md-3">
                                        <div className="table-responsive mt-3">
                                            <table className="table table-bordered table-striped table-cart">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className="">
                                                                <span className="font-weight-bold">Products:&nbsp;</span> 
                                                                {
                                                                    cart && cart.length > 0 ? cart.map((item, index) => (
                                                                        <div key={index.toString()} className="mt-2">{`${item.name} (${item.quantity}), £${item.subTotal} `}</div>
                                                                    )) : null
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className="font-weight-bold">Subtotal:&nbsp;</span>&pound;{parseFloat(overallSubTotal).toFixed(2)}
                                                        </td>
                                                        <td>
                                                            <span className="font-weight-bold">Net Kg:&nbsp;</span>{kg}
                                                        </td>
                                                        <td>
                                                            <span className="font-weight-bold">Shipping:&nbsp;</span>&pound;{parseFloat(shippingCost).toFixed(2)}
                                                        </td>
                                                        <td>
                                                            <span className="font-weight-bold">Total:&nbsp;</span>&pound;{parseFloat(total + paymentCost).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <button type="button" className="btn btn-block btn-secondary mt-2" 
                                            disabled={
                                                !!email && !!mobile && !!street && !!city && !!state && !!zipCode 
                                                    ? false : true}
                                            onClick={() => submitOrder()}
                                        >Place Order</button>
                                    </section>
                                </section>
                            </div>
                        </section>
                    </main>
                    )
            }
        </AppLayout>
    )
}

export default withRouter(CheckoutView);
