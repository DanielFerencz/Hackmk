import React from 'react';
import { Link } from 'react-router-dom';
import showMore from '../../service/showMore.js';

// Egy vendeglo nemi adatai
export default class Post extends React.Component {
    render() {
        const { pst } = this.props;

        return (
            <div className="post">
                <div id={`informations${pst._id}`}>
                    <h2>
                        <Link to={`post_details/${pst._id}`}> {pst.name}</Link>
                    </h2>
                    <div>Opening hours: {pst.open} - {pst.close} </div>
                    <div className="city">City: {pst.city}</div>
                </div>
                <div><a href="#" onClick={() => showMore(pst._id)}>Show more</a></div>
            </div>
        );
    }
}
