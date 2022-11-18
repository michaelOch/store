import React, {useMemo, useState} from 'react';
import axios from 'axios';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
import { Link, useHistory, withRouter } from "react-router-dom";
import './CardSectionStyles.css'
import useResponsiveFontSize from "./useResponsiveFontSize";
import AppLayout from '../../layout/AppLayout/AppLayout';
import logo from '../../utils/assets/logo.jpeg';
import util from '../../utils/util';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import Spinner from '../../components/Spinner/Spinner';


const useOptions = () => {
    const fontSize = useResponsiveFontSize();
    const options = useMemo(
      () => ({
        style: {
          base: {
            fontSize,
            color: "#424770",
            letterSpacing: "0.025em",
            fontFamily: "Source Code Pro, monospace",
            "::placeholder": {
              color: "#aab7c4"
            }
          },
          invalid: {
            color: "#9e2146"
          }
        }
      }),
      [fontSize]
    );
  
    return options;
  };
  


  const CardForm = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();
    const history = useHistory();

    const apiBaseUrl = util.apiBaseUrl;

    const {secret, order} = props.location.state

    const [isLoading, setIsLoading] = useState(false);



    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)

        if (!stripe || !elements) {
            setIsLoading(false)
            alert("Please retry")
            return;
        }

        const result = await stripe.confirmCardPayment(secret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });

        if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            setIsLoading(false)
            alert(result.error.message);
        } else {
            // The payment has been processed!
            setIsLoading(false)
            if (result.paymentIntent.status === 'succeeded') {
                postOrder(result.paymentIntent.id)
            }
        }
    };

    const postOrder = async (ref) => {
        setIsLoading(true)

        try {
            
            const result = await axios.post(`${apiBaseUrl}v1/order/submit/${ref}`, order);
        
            if(!!result.data.status) {
                setIsLoading(false)
                alert("Your order was successful")
                history.push({
                    pathname: '/receipt',
                    state: {
                        order: result.data.order
                    }
                })
            }

        } catch (error) {
            setIsLoading(false)
            alert(error.message)
        }

    }

    return (
        <ErrorBoundary>
            {
                isLoading ? 
                    (
                        <div className="w-100 d-flex flex-column justify-content-center align-items-center" style={{opacity: '0.5', height: '100vh'}}>
                            <Spinner />
                        </div>
                    )
                    : 
                    (
                        <main className="pay-section">
                            <header className="pay-header">
                                <nav className="navbar navbar-expand-lg fixed-top py-3">
                                    <div className="container-fluid">
                                        <div className="d-flex align-items-center">
                                            <Link to='/'>
                                                <div className="d-flex align-items-center">
                                                    <img src={logo} alt="logo" className="d-block mr-1 logo" />
                                                    <h3 className="mb-0 brand"></h3>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </nav>
                            </header>
                            <section className="pay-content">
                                <form onSubmit={handleSubmit}>
                                    <label>
                                        Card details
                                        <CardElement options={options} />
                                    </label>
                                    <button disabled={!stripe || !elements}>Confirm order</button>
                                </form>
                            </section>
                        </main>
                    
                    )
            }
        </ErrorBoundary>
    );
};

export default CardForm;