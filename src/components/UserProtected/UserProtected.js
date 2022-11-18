import React from 'react';
import { Route, Redirect} from 'react-router-dom';

function UserProtected({ component, token, user, setUser, products, categories, cart }) {

    const Component = component;
    let isAuthenticated;

    if(user) {
        if (user.type === "user" || user.type === "admin") {
            if(!token || token === "undefined" || token === "") {
                isAuthenticated = false;
            } else {
                isAuthenticated = true;
            }
        } else {
            isAuthenticated = false;
        }
    }

    return (
        <Route 
            render = {(props) => {
                if (isAuthenticated) {
                    return <Component user={user} setUser={setUser} products={products} categories={categories} cart={cart} />
                } else {
                    return <Redirect to={{
                            pathname: '/login',
                            state: {
                                referrer: props.location.pathname
                            }
                        }} 
                    />
                }
            }}
        />
        // <div>
        //     {
        //         isAuthenticated ?
        //             (
        //                 <Component user={user} setUser={setUser} products={products} categories={categories} cart={cart} />
        //             )
        //             : (
        //                 <Redirect 
        //                     to={{
        //                         pathname: '/login',
        //                         state: {
        //                             referrer: '/'
        //                         }
        //                     }} 
        //                 />
        //             )
        //     }
        // </div>
    )
}

export default UserProtected;
