import React from 'react';
import PropTypes from 'prop-types';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

function AppLayout({user, setUser, products, categories, cart, children}) {

    return (
        <div>
            <Header user={user} setUser={setUser} categories={categories} products={products} cart={cart} />
            <div className="view-wrapper">
                {children}
            </div>
            <Footer />
        </div>
    )
}

AppLayout.prototype = {
    children: PropTypes.element
};

export default AppLayout;
