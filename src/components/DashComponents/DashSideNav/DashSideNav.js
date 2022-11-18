import React from 'react';
import { Link } from "react-router-dom";

import { faList, faTh, faUsers, faShoppingBasket, faCartPlus, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from '../../../utils/theme';

import './DashSideNav.css';

function DashSideNav({ setUser, sidebarClass }) {

    const pages = [
        { title: "Groups", icon: faTh, link: "/dashboard/group" },
        { title: "Categories", icon: faTh, link: "/dashboard/category" },
        { title: "Subcategories", icon: faList, link: "/dashboard/subcategory" },
        { title: "Products", icon: faShoppingBasket, link: "/dashboard/products" },
        { title: "Orders", icon: faCartPlus, link: "/dashboard/orders" },
        { title: "Users", icon: faUsers, link: "/dashboard/users" },
      ];

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setUser(null);
    }

    return (
        <div className="dashboard-sidenav">
            <section className="sidebar-overlay"></section>
            <aside className={`${sidebarClass} px-4 py-3`}>
                <div className="">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to='/dashboard'>DASHBOARD</Link>
                        </li>
                        <hr />
                    </ul>
                    <ul className="navbar-nav">
                        {
                            pages.map((page, i) => (
                                <li key={i + 1} className="nav-item mb-2">
                                    <Link to={`${page.link}`}>
                                        <FontAwesomeIcon icon={page.icon} color={theme.colors.light} /> &nbsp; {page.title}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <ul className="navbar-nav">
                    <li className="nav-item" onClick={handleLogout}>
                        <Link to='/'>
                            <FontAwesomeIcon icon={faPowerOff} color={theme.colors.light} /> &nbsp; Logout
                        </Link>
                    </li>
                </ul>
            </aside>
        </div>
    )
}

export default DashSideNav;
