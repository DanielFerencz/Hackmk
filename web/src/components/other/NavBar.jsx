import autoBind from 'auto-bind';
import React from 'react';
import { Link } from 'react-router-dom';
import findUser from '../../service/user.js';

// Navbar letrehozasa, logout eseten cookie torlese
export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        };
        autoBind(this);
    }

    async componentDidMount() {
        const user = await findUser();
        this.setState({ user });
    }

    onSubmit() {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        this.setState({ user: {} });
    }

    render() {
        const { user } = this.state;
        if (JSON.stringify(user) === '{}') {
            return (
                <nav>
                    <Link to="/">Restaurants</Link>
                    <Link to="/login"> Login</Link>
                    <Link to="/register"> Register</Link>
                </nav>
            );
        }
        return (
            <nav>
                <Link to="/">Restaurants</Link>
                {(user.role === 'admin') ? <Link to="/create_restaurant">Create Restaurant</Link> : ''}
                <Link to="/create_reservation">Create Reservation</Link>
                <Link to="/my_reservations">My Reservations</Link>
                <Link to="/login" onClick={this.onSubmit}>Logout: {user.username} ({user.role})</Link>
            </nav>
        );
    }
}
