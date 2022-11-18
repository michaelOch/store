import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import {Elements} from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51IEpG6LPBlahm7Q4CiGS3gnkDkcpgLWLM2rOXi2RpzhM196bahABxLfF0ou5A3uy4kHYVy0BfJSWeg6eH5uuzuna00LMWNjcGU");


ReactDOM.render(
  <React.StrictMode>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </React.StrictMode>,
  document.getElementById('root')
);
