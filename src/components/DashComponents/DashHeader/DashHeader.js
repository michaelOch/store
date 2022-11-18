import React from 'react';
import { Link } from "react-router-dom";

import { faBars, faBell, faUserAlt, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import theme from '../../../utils/theme';

import './DashHeader.css';

function DashHeader({ click, title, hideBackIcon }) {
    return (
        <header className="dash-header">
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" onClick={click}>
                        <FontAwesomeIcon icon={faBars} color={theme.colors.dark} />
                    </button>
                    <div className="">
                        <h3 className="d-flex align-items-center mb-0">
                            {
                                hideBackIcon ? 
                                    null
                                    : <Link to='/dashboard'>
                                        <FontAwesomeIcon icon={faAngleLeft} color={theme.colors.dark} />
                                    </Link>
                            }
                            &nbsp;
                            {title}
                        </h3>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <Link to='/' className="position-relative mr-3" href="">
                            <FontAwesomeIcon icon={faBell} color={theme.colors.secondary} />
                            <div className="badge badge-pill badge-secondary notification">0</div>
                        </Link>
                        <Link to='/' className="" href="">
                            <FontAwesomeIcon icon={faUserAlt} color={theme.colors.secondary} className="ml-1" />
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default DashHeader;
