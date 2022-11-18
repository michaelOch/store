import React from 'react';
import { Link } from "react-router-dom";

import { faMobileAlt, faEnvelope, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { faCcMastercard, faCcVisa, faCcStripe} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from '../../utils/theme';

import './Footer.css';

function Footer() {

    // const toggleContent = (e) => {
    //     const element = e.target.parentElement.parentElement.parentElement.childNodes[1];
    //     if(element) {
    //         if(element.classList.contains('show')) {
    //             element.classList.remove('show')
    //         } else {
    //             element.classList.add('show')
    //         }
    //     }
    // }

    return (
        <footer className="footer-section">
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mt-2">
                        <div className="">
                            <div className="d-flex align-items-center mb-4">
                                {/* <img src="./images/logo.jpeg" alt="logo" className="d-block mr-1 logo" /> */}
                                <h3 className="mb-0 brand">Cherry's Store</h3>
                            </div>
                            <p className="brand-info">
                                We are the UK’s one-stop Online Superstore. We are specialists in groceries and original products of the highest quality, at the best prices.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-3 mt-2">
                        <div className="content-wrapper">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0">
                                    INFORMATION
                                </h5>
                                {/* <FontAwesomeIcon 
                                    icon={faAngleDown} 
                                    color={theme.colors.secondary}
                                    className="toggle-btn" 
                                    onClick={ function(e){
                                            e.preventDefault(); 
                                            e.nativeEvent.stopPropagation(); 
                                            toggleContent(e);
                                        }
                                    } 
                                /> */}
                            </div>
                            <ul className="content">
                                <li className="">
                                    <Link to='/shop'>
                                        <span className="d-block mb-3">Shop</span>
                                    </Link>
                                </li>
                                {/* <li className="">
                                    <Link to='/'>
                                        <span className="d-block mb-3">About Us</span>
                                    </Link>
                                </li> */}
                                <li className="">
                                    <Link to='/'>
                                        <span className="d-block mb-3">Privacy Policy</span>
                                    </Link>
                                </li>
                                <li className="">
                                    <Link to='/'>
                                        <span className="d-block mb-3">Terms &amp; Conditions</span>
                                    </Link>
                                </li>
                                <li className="">
                                    <Link to='/'>
                                        <span className="d-block mb-3">Return/Refund Policy</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-5 mt-2">
                        <div className="content-wrapper">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h5 className="mb-0">
                                    CONTACT US
                                </h5>
                                {/* <FontAwesomeIcon 
                                    icon={faAngleDown} 
                                    color={theme.colors.dark}
                                    className="toggle-btn" 
                                    onClick={ function(e){
                                            e.preventDefault(); 
                                            e.nativeEvent.stopPropagation(); 
                                            toggleContent(e);
                                        }
                                    } 
                                /> */}
                            </div>
                            <div className="content">
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <FontAwesomeIcon icon={faMapMarker} color={theme.colors.dark} />
                                            </td>
                                            <td>
                                                <p className="mb-0">North Yorkshire.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <FontAwesomeIcon icon={faMobileAlt} color={theme.colors.dark} />
                                            </td>
                                            <td>
                                                <p className="mb-0">+442222222222</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <FontAwesomeIcon icon={faEnvelope} color={theme.colors.dark} />
                                            </td>
                                            <td>
                                                <p className="mb-0">hello@cherrystore.com</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="content-wrapper mt-2">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                {/* <FontAwesomeIcon 
                                    icon={faAngleDown} 
                                    color={theme.colors.secondary}
                                    className="toggle-btn" 
                                    onClick={ function(e){
                                            e.preventDefault(); 
                                            e.nativeEvent.stopPropagation(); 
                                            toggleContent(e);
                                        }
                                    } 
                                /> */}
                            </div>
                            <div className="content">
                                <div className="d-flex">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <FontAwesomeIcon icon={faCcStripe} style={{fontSize: '36px'}} />
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center ml-2">
                                        <FontAwesomeIcon icon={faCcMastercard} style={{fontSize: '36px'}} />
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center ml-2">
                                        <FontAwesomeIcon icon={faCcVisa} style={{fontSize: '36px'}} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 py-4 footer-bottom">
                    {/* <ul className="d-flex flex-wrap justify-content-center align-items-center mb-0">
                        <li className="">
                            <Link to='/'>
                                <span className="px-3">Home</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to='/shop'>
                                <span className="left-bar px-3">Shop</span>
                            </Link>
                        </li>
                        <li className="">
                            <Link to='/'>
                                <span className="left-bar px-3">Contact Us</span>
                            </Link>
                        </li>
                    </ul> */}

                    <div className="d-flex align-items-center">
                        <p className="mb-0">Copyright &copy; 2020 Cherry's Store | <a style={{fontSize: 13, color: theme.colors.secondary}} href="https://michaeloch.github.io/resume" target="_blank" rel="noopener noreferrer">Developed by Och</a></p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
