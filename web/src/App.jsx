import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavBar from './components/other/NavBar.jsx';
import Restaurants from './components/restaurant/Restaurants.jsx';
import Footer from './components/other/Footer.jsx';
import Login from './components/other/Login.jsx';
import Register from './components/other/Register.jsx';
import RestaurantDetails from './components/restaurant/RestaurantDetails.jsx';
import CreateRestaurant from './components/restaurant/CreateRestaurant.jsx';
import CreateReservation from './components/reservation/CreateReservation.jsx';
import MyReservations from './components/reservation/MyReservations.jsx';

// Az alap applikacio, main betoltese
export default function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <main>
                <Switch>
                    <Route exact path="/" component={Restaurants} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/my_reservations" component={MyReservations} />
                    <Route exact path="/create_restaurant" component={CreateRestaurant} />
                    <Route exact path="/create_reservation" component={CreateReservation} />
                    <Route path="/restaurant_details/:restID" component={RestaurantDetails} />
                </Switch>
            </main>
            <Footer />
        </BrowserRouter>
    );
}
