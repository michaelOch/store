import React from 'react';
import { Redirect } from 'react-router-dom';

function ProtectedRoute({ component, token, user, setUser }) {

    const Component = component;
    let isAuthenticated;

    if(user) {
        if (user.type === "admin") {
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
        <div>
            {
                isAuthenticated ?
                    (
                        <Component user={user} setUser={setUser} />
                    )
                    : (
                        <Redirect to={{pathname: '/login'}} />
                    )
            }
        </div>
    )
}

export default ProtectedRoute;
