import React from 'react';
import autoBind from 'auto-bind';
import findUser from '../../service/user.js';
import { deleteReservation } from '../../service/deleteReservation.js';
import { findMyReservations } from '../../service/reservation.js';

// Sajat foglalasok betoltese
export default class MyReservations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reservations: [],
            user: {},
            msg: '',
            statusFilter: '',
            statusDict: '',
        };
        autoBind(this);
    }

    async componentDidMount() {
        const user = await findUser();
        this.setState({ user });
        const reservations = await findMyReservations();
        this.setState({ reservations });
        this.makeDict();
    }

    // Status szerinti filter
    statusChange(event) {
        let { statusFilter } = this.state;
        statusFilter = event.target.value;
        this.setState({ statusFilter });
    }

    // A statushoz tartozo szamok
    makeDict() {
        const dict = {};
        const { reservations } = this.state;
        reservations.forEach((reser) => {
            dict[reser.status] = 0;
        });
        reservations.forEach((reser) => {
            dict[reser.status] += 1;
        });
        this.setState({ statusDict: dict });
    }

    // Oldal betoltese
    render() {
        const { statusFilter } = this.state;
        const { statusDict } = this.state;
        const { user } = this.state;
        const reservations = this.state.reservations.filter((reser) => (reser.status === statusFilter || statusFilter === ''));

        if (JSON.stringify(user) === '{}') {
            return (
                <>
                    <h1>Reservations: </h1>
                    <div id="reservations">
                        <div className="reservation">
                            Log in to make reservations.
                        </div>
                    </div>
                </>
            );
        }
        if (reservations.length === 0) {
            return (
                <>
                    <h1>Reservations: </h1>
                    <div id="reservations">
                        <div className="reservation">
                            You have no registered reservations.
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                <h1>Reservations: </h1>
                <label htmlFor="status">Choose a status:</label>
                <select id="status" name="status" onChange={this.statusChange}>
                    <option value="" key="none"> Show every status </option>
                    {Object.keys(statusDict).map((key) => (
                        <option value={`${key}`} key={key}> {`${key} (${statusDict[key]})`} </option>
                    ))}
                </select>
                <div id="reservations">
                    {reservations.map((reser) => (
                        <div className="reservation" key={reser._id} id={`${reser._id}`}>Restaurant: <b>{reser.restName}</b>, Name:  {reser.name} , date:  {reser.date} , time:  {reser.time}, status: <b>{reser.status}</b>&nbsp;
                            <a href="#" onClick={() => deleteReservation(reser._id) }>delete Reservation</a>
                        </div>
                    ))}
                </div>
            </>
        );
    }
}
