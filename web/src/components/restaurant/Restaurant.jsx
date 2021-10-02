import React from 'react';
import { Link } from 'react-router-dom';
import showMore from '../../service/showMore.js';

// Egy vendeglo nemi adatai
export default class Restaurant extends React.Component {
    render() {
        const { rest } = this.props;

        return (
            <div className="restaurant">
                <div id={`informations${rest._id}`}>
                    <h2>
                        <Link to={`restaurant_details/${rest._id}`}> {rest.name}</Link>
                    </h2>
                    <div>Opening hours: {rest.open} - {rest.close} </div>
                    <div className="city">City: {rest.city}</div>
                </div>
                <div><a href="#" onClick={() => showMore(rest._id)}>Show more</a></div>
            </div>
        );
    }
}
