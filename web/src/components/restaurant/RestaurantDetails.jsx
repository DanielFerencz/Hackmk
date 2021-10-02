import React from 'react';
import { findRestaurant } from '../../service/restaurant.js';
import Msg from '../other/Msg.jsx';
import Reservations from '../reservation/Reservations.jsx';
import UploadPhoto from './UploadPhoto.jsx';
import findUser from '../../service/user.js';

// egy vendeglo osszes adata
export default class RestaurantDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: {},
            msg: '',
            reservations: [],
            user: {},
        };
    }

    // betoltes...
    async componentDidMount() {
        const { restID } = this.props.match.params;
        const restaurant = await findRestaurant(restID);
        if (JSON.stringify(restaurant) === '{}') {
            this.setState({ msg: 'Not found' });
        } else {
            this.setState({ restaurant });
        }
        const user = await findUser();
        this.setState({ user });
    }

    render() {
        const { restaurant } = this.state;
        const { user } = this.state;

        if (JSON.stringify(restaurant) === '{}') {
            return (<Msg msg={this.state.msg} />);
        }
        return (
            <>
                <Msg msg={this.state.msg} />

                <h1>{restaurant.name}</h1>
                <div className="restaurant">
                    <div className="city">City:  {restaurant.city} </div>
                    <div>Str.  {restaurant.street} </div>
                    <div>Nr.  {restaurant.number} </div>
                    <div>Tel:  {restaurant.telefon} </div>
                    <div>Opening hours:  {restaurant.open}  -  {restaurant.close}  </div>
                </div>

                <Reservations restaurant={restaurant}/>
                <UploadPhoto user={user} restaurant={restaurant} details={this}/>
            </>
        );
    }
}
