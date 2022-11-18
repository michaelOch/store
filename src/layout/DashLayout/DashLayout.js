import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DashHeader from '../../components/DashComponents/DashHeader/DashHeader';
import DashSideNav from '../../components/DashComponents/DashSideNav/DashSideNav';

import './DashLayout.css';

function DashLayout({ user, setUser, title, hideBackIcon, children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarToggleHandler = () => {
        if (!sidebarOpen) {
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
        }
    }

    let sidebarClass;
    if (sidebarOpen) {
        sidebarClass = 'sidebar-nav sidebar-show';
    } else {
        sidebarClass = 'sidebar-nav';
    }

    return (
        <div className="">
            <DashHeader click={sidebarToggleHandler} title={title} hideBackIcon={hideBackIcon} />
            <DashSideNav setUser={setUser} sidebarClass={sidebarClass} />
            <div className="view-container">
                {children}
            </div>
        </div>
    )
}

DashLayout.prototype = {
    children: PropTypes.element
};

export default DashLayout;
