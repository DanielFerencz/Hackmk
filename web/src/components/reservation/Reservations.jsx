import React from 'react';
import autoBind from 'auto-bind';
import Msg from '../other/Msg.jsx';
import { findReservations } from '../../service/reservation.js';
import findUser from '../../service/user.js';
import { deleteReservation, acceptReservation, declineReservation } from '../../service/deleteReservation.js';

// a foglalasok a vendegloknel
export default class Reservations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reservations: [],
            user: {},
            msg: '',
            statusFilter: '',
            statusDict: '',
            firstDate: '',
            secondDate: '',
        };
        autoBind(this);
    }

    // Adatok betoltese
    async componentDidMount() {
        const { restaurant } = this.props;
        const reservations = await findReservations(restaurant._id);
        this.setState({ reservations });
        const user = await findUser();
        this.setState({ user });
        this.makeDict('', '');
    }

    // statusz szerinti filter
    statusChange(event) {
        let { statusFilter } = this.state;
        statusFilter = event.target.value;
        this.setState({ statusFilter });
    }

    // Datum szerinti filter
    firstDateChange(event) {
        let { firstDate } = this.state;
        const { secondDate } = this.state;
        firstDate = event.target.value;
        this.setState({ firstDate });
        this.makeDict(firstDate, secondDate);
    }

    secondDateChange(event) {
        let { secondDate } = this.state;
        const { firstDate } = this.state;
        secondDate = event.target.value;
        this.setState({ secondDate });
        this.makeDict(firstDate, secondDate);
    }

    // status osszegzes adminnak
    makeDict(firstDate, secondDate) {
        const dict = {};
        let { reservations } = this.state;
        reservations = reservations.filter((reser) => (firstDate === '' || Date.parse(reser.date) >= Date.parse(firstDate))
            && (secondDate === '' || Date.parse(reser.date) <= Date.parse(secondDate)));
        reservations.forEach((reser) => {
            dict[reser.status] = 0;
        });
        reservations.forEach((reser) => {
            dict[reser.status] += 1;
        });
        this.setState({ statusDict: dict });
    }

    // foglalas elfogadasa
    async acceptReser(id) {
        const msg = await acceptReservation(id);
        if (msg === 'OK') {
            const reservations = await findReservations(this.props.restaurant._id);
            this.setState({ reservations });
        } else {
            this.setState({ msg: 'Error' });
        }
    }

    // foglalas elutasitasa event
    async declineReser(id) {
        const msg = await declineReservation(id);
        if (msg === 'OK') {
            const reservations = await findReservations(this.props.restaurant._id);
            this.setState({ reservations });
        } else {
            this.setState({ msg: 'Error' });
        }
    }

    // Ha ures a foglalasok szama
    empty(msg) {
        return (
            <>
                <h2>Reservations: </h2>
                <div id="reservations">
                    <div className="reservation">
                        {msg}
                    </div>
                </div>
            </>
        );
    }

    // Ha valaki nem admin nezi a foglalasokat
    notAdmin(user, reservations) {
        if (reservations.filter((reser) => reser.name === user.username).length === 0) {
            return this.empty('You have no registered reservations.');
        }
        return (
            <>
                <h2>Reservations: </h2>
                <div id="reservations">
                    {reservations.filter((reser) => reser.name === user.username)
                        .map((reser) => (
                            <div className="reservation" key={reser._id} id={`${reser._id}`}> Name:  {reser.name} , date:  {reser.date} ,
                             time:  {reser.time}, status: <b>{reser.status}</b>&nbsp;
                            <a href="#" onClick={() => deleteReservation(reser._id) }>delete Reservation</a>
                            </div>
                        ))}
                </div>
            </>
        );
    }

    // Oldal betoltese
    render() {
        const { restaurant } = this.props;
        let { reservations } = this.state;
        const {
            statusFilter, statusDict, firstDate, secondDate, msg, user,
        } = this.state;
        if (JSON.stringify(user) === '{}')    return this.empty('Log in to make reservations.');
        if (user.role === 'user' || restaurant.adminID !== user.id) {
            return this.notAdmin(user, reservations);
        }
        reservations = reservations.filter((reser) => (reser.status === statusFilter || statusFilter === '')
            && (firstDate === '' || Date.parse(reser.date) >= Date.parse(firstDate))
            && (secondDate === '' || Date.parse(reser.date) <= Date.parse(secondDate)));
        if (reservations.length === 0) {
            return (
                <>
                    <h2>Reservations: </h2>
                    <label htmlFor="status">Choose a status:</label>
                    <select id="status" name="status" onChange={this.statusChange}>
                        <option value="" key="none"> Show every status </option>
                        {Object.keys(statusDict).map((key) => (
                            <option value={`${key}`} key={key}> {`${key} (${statusDict[key]})`} </option>
                        ))}
                    </select>
                    <label htmlFor="date">Reservations from: </label>
                    <input id="date" type="date" name="date" value={firstDate} onChange={this.firstDateChange} required/>
                    <label htmlFor="date">Reservations until: </label>
                    <input id="date" type="date" name="date" value={secondDate} onChange={this.secondDateChange} required/>
                    <div id="reservations">
                        <div className="reservation">
                            No registered reservations in the database.
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                <Msg msg={msg}/>
                <h2>Reservations: </h2>
                <label htmlFor="status">Choose a status:</label>
                <select id="status" name="status" onChange={this.statusChange}>
                    <option value="" key="none"> Show every status </option>
                    {Object.keys(statusDict).map((key) => (
                        <option value={`${key}`} key={key}> {`${key} (${statusDict[key]})`} </option>
                    ))}
                </select>
                <label htmlFor="date">Reservations from: </label>
                <input id="date" type="date" name="date" value={firstDate} onChange={this.firstDateChange} required/>
                <label htmlFor="date">Reservations until: </label>
                <input id="date" type="date" name="date" value={secondDate} onChange={this.secondDateChange} required/>
                <div id="reservations">
                    {reservations.filter((reser) => reser.status === 'pending').map((reser) => (
                        <div className="reservation" key={reser._id} id={`${reser._id}`}> Name:  {reser.name} , date:  {reser.date} , time:  {reser.time}, table number: {reser.table}, status: <b>{reser.status}</b> &nbsp;
                            <a href="#" onClick={() => this.acceptReser(reser._id)}>ACCEPT &nbsp;</a>
                            <a href="#" onClick={() => this.declineReser(reser._id)}>DECLINE</a>
                            { reser.name === user.username ? (
                                <a href="#" onClick={() => deleteReservation(reser._id) }>&nbsp; delete Reservation</a>
                            ) : (<></>)}
                        </div>
                    ))}
                    {reservations.filter((reser) => reser.status === 'accepted').map((reser) => (
                        <div className="reservation" key={reser._id} id={`${reser._id}`}> Name:  {reser.name} , date:  {reser.date} , time:  {reser.time}, table number: {reser.table}, status: <b>{reser.status}</b>
                            { reser.name === user.username ? (
                                <a href="#" onClick={() => deleteReservation(reser._id) }>&nbsp; delete Reservation</a>
                            ) : (<></>)}
                        </div>
                    ))}
                    {reservations.filter((reser) => reser.status === 'declined').map((reser) => (
                        <div className="reservation" key={reser._id} id={`${reser._id}`}> Name:  {reser.name} , date:  {reser.date} , time:  {reser.time}, table number: {reser.table}, status: <b>{reser.status}</b>
                            { reser.name === user.username ? (
                                <a href="#" onClick={() => deleteReservation(reser._id) }>&nbsp; delete Reservation</a>
                            ) : (<></>)}
                        </div>
                    ))}
                </div>
            </>
        );
    }
}
