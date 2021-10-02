import React from 'react';
import url from '../../service/restaurant.js';

// Kepek megjelenitese
export default class Pictures extends React.Component {
    render() {
        const { pictures } = this.props;

        if (pictures.length === 0) {
            return (
                <>
                    <h2>Pictures: </h2>
                    <div>
                        <div className="picture">
                                No pictures in the database.
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                <h2>Pictures: </h2>
                <div>
                    {pictures.map((pic) => (
                        <div className="picture" key={pic.photo}>
                            <img src={`${url}/picture?photo=${pic.photo}`} alt={pic.name} key={pic.name}/>
                        </div>
                    ))}
                </div>
            </>
        );
    }
}
