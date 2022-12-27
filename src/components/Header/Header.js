import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import logo from '../../utils/assets/logo.jpeg';

import { faBars, faUser, faSearch, faShoppingBasket, faTimes, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from '../../utils/theme';
import util from '../../utils/util';

import './Header.css';

function Header({ user, setUser, categories, products, cart }) {

    const apiBaseUrl = util.apiBaseUrl;

    const [filteredData, setFilteredData] = useState();
    const [isScrolled, setIsScrolled] = useState(false);
    const [groups, setGrouping] = useState([]);

    const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 150) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', () => handleScroll)
          }
    }, [])

    useEffect(() => {
        axios.get(`${apiBaseUrl}v1/group/all`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => {
            // console.log(res.data.groups)
            setGrouping(res.data.groups)
        })
        .catch(err => console.log(err))
    }, [apiBaseUrl]);

    let stickyClass;
    // let hideClass;

    if (isScrolled) {
        // hideClass = 'hide';
        stickyClass = 'scrolled';
    } else {
        // hideClass = '';
        stickyClass = 'not-scrolled';
    }

    const handleClose = (e) => {
        const element = e.target.parentElement.parentElement.parentElement;
        
        if(element) {
            if(element.classList.contains('show')) {
                element.classList.remove('show')
            }
        }
    }

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
    }

    const handleSearch = (e) => {
        if (e.target.value !== '') {
            const searchString = e.target.value.toLowerCase();
            const filteredProducts = products.filter(product => {
                return (
                    product.name.toLowerCase().includes(searchString)
                )
            })
            setFilteredData(filteredProducts);
        } else {
            setFilteredData(null);
        }
    }

    return (
        <header className="header-section">
            {/* <div className="header-top"></div> */}
            <div className="container">
                <div className="p-3 header-middle">
                    <div className="d-flex align-items-center header-middle_brand mr-2">
                        <img src={logo} alt="logo" className="d-block mr-1 logo" />
                        {/* <h3 className="mb-0 brand">Cherry's Store</h3> */}
                    </div>
                    <div className="d-flex search-container">
                        <div className="position-relative input-group">
                            <input type="text" className="form-control form-control-lg form-control-custom" placeholder="Search for products" onChange={handleSearch} />
                            <div className="input-group-append">
                                <span className="input-group-text" id="basic-addon2">
                                <FontAwesomeIcon icon={faSearch} color={theme.colors.dark} />
                                </span>
                            </div>
                            <div className="search-result-container">
                                <ul className="list-group list-group-flush">
                                    {
                                        filteredData ? 
                                            filteredData.length > 0 ? 
                                                filteredData.map(data => (
                                                    <li key={data._id} className="list-group-item">
                                                        <Link to={{
                                                            pathname: `/product/${data.name}`,
                                                            state: {product: data}
                                                        }}>
                                                            <span className="dropdown-item" onClick={() => setFilteredData(null)}>{data.name}</span>
                                                        </Link>
                                                    </li>
                                                ))
                                                : null
                                            : null
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className={`d-flex header-middle_account ${stickyClass}`}>
                        <div className="">
                            <div className="d-flex align-items-center account-wrapper p-2">
                                <div className="mx-2">
                                    <FontAwesomeIcon icon={faUser} color={theme.colors.primary} />
                                </div>
                                {
                                    user ? 
                                        <div className="d-flex align-items-center">
                                            <p className="mb-0 mx-2">
                                                <Link to='/profile'>
                                                    <span className="">Profile</span>
                                                </Link>
                                            </p>
                                            <p className="mb-0 slash">/</p>
                                            <p className="mb-0 mx-2">
                                                <Link to='/'>
                                                    <span className="" onClick={handleLogout}>Logout</span>
                                                </Link>
                                            </p>
                                        </div>
                                        : <div className="d-flex align-items-center">
                                            <p className="mb-0 mx-2">
                                                <Link to='/login'>
                                                    <span className="">LOGIN</span>
                                                </Link>
                                            </p>
                                            <p className="mb-0 slash">/</p>
                                            <p className="mb-0 mx-2">
                                                <Link to='/register'>
                                                    <span className="">REGISTER</span>
                                                </Link>
                                            </p>
                                        </div>
                                }
                            </div>
                        </div>
                        <div className="position-relative d-flex justify-content-center align-items-center ml-3 cart-wrapper">
                            <Link to='/cart'>
                                <FontAwesomeIcon icon={faShoppingBasket} color={theme.colors.primary} />
                                <span className="header-middle_item px-1">{ cart ? cart.length : 0}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <nav className={`navbar navbar-expand-lg py-0 ${stickyClass}`}>
                <div className="container">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <FontAwesomeIcon icon={faBars} color={theme.colors.light} />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <div className="close">
                            <FontAwesomeIcon 
                                icon={faTimes} 
                                color={theme.colors.black} 
                                style={{fontSize: "24px"}} 
                                onClick={function(e) {
                                    e.preventDefault();
                                    e.nativeEvent.stopPropagation();
                                    handleClose(e);
                                }}
                            />
                        </div>
                        <ul className="navbar-nav pt-2">
                            <li className="nav-item py-3">
                                <Link to='/'>
                                    <span className={`nav-link px-3`}>HOME</span>
                                </Link>
                            </li>
                        </ul>
                        {
                            groups &&
                                groups.length > 0 &&
                                    groups.map((group, i) => (
                                        <div key={group.name} className={`dropdown pt-2`}>
                                            <div className="menu-dropdown py-3 px-2" style={{textTransform: "uppercase"}}>
                                                {group.name}
                                                <FontAwesomeIcon 
                                                    icon={faCaretDown} 
                                                    color={theme.colors.light} 
                                                    style={{marginLeft: '0.5rem'}} 
                                                />
                                            </div>
                                            {
                                                group.categories ? 
                                                    group.categories.length > 0 ? 
                                                        <div className={`menu-dropdown-item-${i + 1} hidden`}>
                                                            <div className="category-container">
                                                                {
                                                                    group.categories ? 
                                                                        group.categories.length > 0 ? 
                                                                            group.categories.map(category => (
                                                                                <div key={category.name} className="mx-3 my-1">
                                                                                    <h5 className="">
                                                                                        <span className="cat-name" style={{color: theme.colors.primary}}>{category.name}</span>
                                                                                    </h5>
                                                                                    {
                                                                                        category.subcategories.map(subCat => (
                                                                                            <p key={subCat._id}>
                                                                                                <Link to={`/shop/${subCat.name}`}>
                                                                                                    <span className="">
                                                                                                        {subCat.name}
                                                                                                    </span>
                                                                                                </Link>
                                                                                            </p>
                                                                                        ))
                                                                                    }
                                                                                </div>
                                                                            ))
                                                                            : null
                                                                        : null
                                                                }
                                                            </div>
                                                        </div>
                                                        : null
                                                    : null
                                            }
                                        </div>
                                    ))
                        }
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header;
