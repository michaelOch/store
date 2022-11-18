import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import './App.css';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Home from './pages/HomeView/HomeView';
import Shop from './pages/ShopView/ShopView';
import Product from './pages/ProductView/ProductView';
import Cart from './pages/CartView/CartView';
import Checkout from './pages/CheckoutView/CheckoutView';
import Payment from './pages/PaymentView/Index';
import Login from './pages/LoginView/LoginView';
import Register from './pages/RegisterView/RegisterView';
import Profile from './pages/ProfileView/ProfileView';
import RecoverPassword from './pages/RecoverPasswordView/RecoverPasswordView';
import ResetPassword from './pages/ResetPasswordView/ResetPasswordView';
import DashHome from './pages/Dashboard/DashHomeView/DashHomeView';
import SubCategory from './pages/Dashboard/SubCategoryView/SubCategoryView';
import Category from './pages/Dashboard/CategoryView/CategoryView';
import Group from './pages/Dashboard/GroupView/GroupView';
import Products from './pages/Dashboard/ProductsView/ProductsView';
import Users from './pages/Dashboard/UsersView/UsersView';
import Orders from './pages/Dashboard/OrdersView/OrdersView';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import UserProtected from './components/UserProtected/UserProtected';
import ReceiptView from './pages/ReceiptView/ReceiptView';
import util from './utils/util';

function App() {

    const apiBaseUrl = util.apiBaseUrl;

    const setInitialUser = () => {
        if (sessionStorage.getItem('user')) {
            return JSON.parse(sessionStorage.getItem('user'));
        }
        
        return
    }
    
    const[user, setUser] = useState(setInitialUser);
    const [groups, setGroups] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [secret, setSecret] = useState();
    const token = sessionStorage.getItem('token');

    useEffect(() => {

        //  Fetch Products
        axios.get(`${apiBaseUrl}v1/group`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            // console.log(res.data.product)
            setGroups(res.data.groups)
        })
        .catch(err => console.log(err))

        //  Fetch Products
        axios.get(`${apiBaseUrl}v1/product`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            // console.log(res.data.product)
            setProducts(res.data.product)
        })
        .catch(err => console.log(err))

        //  Fetch Categories
        axios.get(`${apiBaseUrl}v1/subcategory`, {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
        .then(res => {
            // console.log(res.data.category)
            setCategories(res.data.subcategory)
        })
        .catch(err => console.log(err))

    }, [setUser, apiBaseUrl]);

    const setInitialCart = () => {
        // console.log("Checking Cart Products 3: ")

        if (Cookies.get('cart')) {
            return JSON.parse(Cookies.get('cart'));
        }
        
        return null
    }

    const [cart, setCart] = useState(setInitialCart());

    const addToCart = (product, itemIndex) => {
        
        if (!cart) {
            const newCart = [];
            // product["quantity"] = 1;
            // product["subTotal"] = !itemIndex ? product.sizing[0].price : product.sizing[itemIndex].price;
            // product["price"] = !itemIndex ? product.sizing[0].price : product.sizing[itemIndex].price;
            newCart.push(product);
            Cookies.set('cart', JSON.stringify(newCart), { expires: 30 });
            setCart(JSON.parse(Cookies.get('cart')));
        } else {
            // alert(JSON.stringify(product))
            const newCart = cart;
            // product["quantity"] = 1;
            // product["subTotal"] = !itemIndex ? product.sizing[0].price : product.sizing[itemIndex].price;
            // product["price"] = !itemIndex ? product.sizing[0].price : product.sizing[itemIndex].price;
            const isInCart = newCart.filter(item => item._id === product._id);
            if (isInCart.length <= 0) {
                newCart.push(product);
                Cookies.set('cart', JSON.stringify(newCart), { expires: 30 });
                setCart(JSON.parse(Cookies.get('cart')));
            }
        }

    }

    const removeFromCart = (product) => {
        const oldCart = cart;
        const newCart = oldCart.filter(value => value._id !== product._id);
        Cookies.set('cart', JSON.stringify(newCart), { expires: 30 });
        setCart(JSON.parse(Cookies.get('cart')));
    }

    return (
        <div className="App">
            <Router>
                <ScrollToTop />
                <Switch>
                    <Route 
                        exact path="/" 
                        render={(props) => <Home {...props} user={user} setUser={setUser} products={products} categories={categories} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />} 
                    />
                    <Route 
                        exact 
                        path="/shop" 
                        render={(props) => <Shop {...props} user={user} setUser={setUser} products={products} categories={categories} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />} 
                    />
                    <Route 
                        exact 
                        path="/shop/:category" 
                        render={(props) => <Shop {...props} user={user} setUser={setUser} products={products} categories={categories} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />} 
                    />
                    <Route 
                        exact 
                        path="/product/:product" 
                        render={(props) => <Product {...props} user={user} setUser={setUser} products={products} categories={categories} cart={cart} setCart={setCart} addToCart={addToCart} removeFromCart={removeFromCart} />} 
                    />
                    <Route 
                        exact 
                        path="/cart" 
                        render={(props) => <Cart {...props} user={user} setUser={setUser} products={products} categories={categories} cart={cart} setCart={setCart} addToCart={addToCart} removeFromCart={removeFromCart} />} 
                    />
                    <Route 
                        exact path="/recover-password" 
                        component={RecoverPassword} 
                        token={token} 
                        user={user} 
                        setUser={setUser}
                        products={products} 
                        categories={categories} 
                        cart={cart} 
                    />
                    <Route 
                        exact path="/resetpassword/:resetLink" 
                        component={ResetPassword} 
                        token={token} 
                        user={user} 
                        setUser={setUser}
                        products={products} 
                        categories={categories} 
                        cart={cart} 
                    />
                    <Route 
                        exact 
                        path="/login" 
                        render={(props) => <Login {...props} setUser={setUser} />} 
                    />
                    <Route 
                        exact 
                        path="/register" 
                        render={(props) => <Register {...props} setUser={setUser} />} 
                    />
                    <Route 
                        exact path="/checkout" 
                        component={Checkout} 
                        token={token} 
                        user={user} 
                        setSecret={setSecret}
                        cart={cart}
                    />
                    <Route 
                        exact path="/pay" 
                        component={Payment} 
                        token={token} 
                        user={user} 
                        secret={secret}
                    />
                    <UserProtected 
                        exact path="/profile" 
                        component={Profile} 
                        token={token} 
                        user={user} 
                        setUser={setUser}
                        products={products} 
                        categories={categories} 
                        cart={cart} 
                    />
                    <Route 
                        exact path="/receipt" 
                        component={ReceiptView} 
                        token={token} 
                        user={user} 
                        setUser={setUser}
                        products={products} 
                        categories={categories} 
                        cart={cart} 
                    />
                    <ProtectedRoute 
                        exact path="/dashboard" 
                        component={DashHome} 
                        token={token} 
                        user={user} 
                        setUser={setUser} 
                    />
                    <ProtectedRoute 
                        exact 
                        path="/dashboard/group" 
                        component={Group} 
                        token={token} 
                        user={user} 
                        setUser={setUser} 
                    />
                    <ProtectedRoute 
                        exact 
                        path="/dashboard/subcategory" 
                        component={SubCategory} 
                        token={token} 
                        user={user} 
                        setUser={setUser} 
                    />
                    <ProtectedRoute 
                        exact 
                        path="/dashboard/category" 
                        component={Category} 
                        token={token} 
                        user={user} 
                        setUser={setUser} 
                    />
                    <ProtectedRoute 
                        exact 
                        path="/dashboard/products" 
                        component={Products} 
                        token={token} 
                        user={user} 
                        setUser={setUser} 
                    />
                    <ProtectedRoute 
                        exact 
                        path="/dashboard/users" 
                        component={Users} 
                        token={token} 
                        user={user} 
                        setUser={setUser} 
                    />
                    <ProtectedRoute 
                        exact 
                        path="/dashboard/orders" 
                        component={Orders} 
                        token={token} 
                        user={user} 
                        setUser={setUser} 
                    />
                    <Route 
                        render={(props) => <Home {...props} user={user} setUser={setUser} products={products} categories={categories} cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />} 
                    />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
