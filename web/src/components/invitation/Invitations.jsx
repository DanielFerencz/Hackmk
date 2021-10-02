import React from 'react';
import autoBind from 'auto-bind';
import Msg from '../other/Msg.jsx';
import { findInvitations } from '../../service/invitation.js';
import findUser from '../../service/user.js';
import { deleteInvitation, acceptInvitation, declineInvitation } from '../../service/deleteInvitation.js';

// a foglalasok a vendegloknel
export default class Invitations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invitations: [],
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
        const { post } = this.props;
        const invitations = await findInvitations(post._id);
        this.setState({ invitations });
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
        let { invitations } = this.state;
        invitations = invitations.filter((inv) => (firstDate === '' || Date.parse(inv.date) >= Date.parse(firstDate))
            && (secondDate === '' || Date.parse(inv.date) <= Date.parse(secondDate)));
        invitations.forEach((inv) => {
            dict[inv.status] = 0;
        });
        invitations.forEach((inv) => {
            dict[inv.status] += 1;
        });
        this.setState({ statusDict: dict });
    }

    // foglalas elfogadasa
    async acceptInv(id) {
        const msg = await acceptInvitation(id);
        if (msg === 'OK') {
            const invitations = await findInvitations(this.props.post._id);
            this.setState({ invitations });
        } else {
            this.setState({ msg: 'Error' });
        }
    }

    // foglalas elutasitasa event
    async declineInv(id) {
        const msg = await declineInvitation(id);
        if (msg === 'OK') {
            const invitations = await findInvitations(this.props.post._id);
            this.setState({ invitations });
        } else {
            this.setState({ msg: 'Error' });
        }
    }

    // Ha ures a foglalasok szama
    empty(msg) {
        return (
            <>
                <h2>Invitations: </h2>
                <div id="invitations">
                    <div className="invitation">
                        {msg}
                    </div>
                </div>
            </>
        );
    }

    // Ha valaki nem admin nezi a foglalasokat
    notAdmin(user, invitations) {
        if (invitations.filter((inv) => inv.name === user.username).length === 0) {
            return this.empty('You have no registered invitations.');
        }
        return (
            <>
                <h2>Invitations: </h2>
                <div id="invitations">
                    {invitations.filter((inv) => inv.name === user.username)
                        .map((inv) => (
                            <div className="invitation" key={inv._id} id={`${inv._id}`}> Name:  {inv.name} , date:  {inv.date} ,
                             time:  {inv.time}, status: <b>{inv.status}</b>&nbsp;
                            <a href="#" onClick={() => deleteInvitation(inv._id) }>delete Invitation</a>
                            </div>
                        ))}
                </div>
            </>
        );
    }

    // Oldal betoltese
    render() {
        const { post } = this.props;
        let { invitations } = this.state;
        const {
            statusFilter, statusDict, firstDate, secondDate, msg, user,
        } = this.state;
        if (JSON.stringify(user) === '{}')    return this.empty('Log in to make invitations.');
        if (user.role === 'user' || post.adminID !== user.id) {
            return this.notAdmin(user, invitations);
        }
        invitations = invitations.filter((inv) => (inv.status === statusFilter || statusFilter === '')
            && (firstDate === '' || Date.parse(inv.date) >= Date.parse(firstDate))
            && (secondDate === '' || Date.parse(inv.date) <= Date.parse(secondDate)));
        if (invitations.length === 0) {
            return (
                <>
                    <h2>Invitations: </h2>
                    <label htmlFor="status">Choose a status:</label>
                    <select id="status" name="status" onChange={this.statusChange}>
                        <option value="" key="none"> Show every status </option>
                        {Object.keys(statusDict).map((key) => (
                            <option value={`${key}`} key={key}> {`${key} (${statusDict[key]})`} </option>
                        ))}
                    </select>
                    <label htmlFor="date">Invitations from: </label>
                    <input id="date" type="date" name="date" value={firstDate} onChange={this.firstDateChange} required/>
                    <label htmlFor="date">Invitations until: </label>
                    <input id="date" type="date" name="date" value={secondDate} onChange={this.secondDateChange} required/>
                    <div id="invitations">
                        <div className="invitation">
                            No registered invitations in the database.
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                <Msg msg={msg}/>
                <h2>Invitations: </h2>
                <label htmlFor="status">Choose a status:</label>
                <select id="status" name="status" onChange={this.statusChange}>
                    <option value="" key="none"> Show every status </option>
                    {Object.keys(statusDict).map((key) => (
                        <option value={`${key}`} key={key}> {`${key} (${statusDict[key]})`} </option>
                    ))}
                </select>
                <label htmlFor="date">Invitations from: </label>
                <input id="date" type="date" name="date" value={firstDate} onChange={this.firstDateChange} required/>
                <label htmlFor="date">Invitations until: </label>
                <input id="date" type="date" name="date" value={secondDate} onChange={this.secondDateChange} required/>
                <div id="invitations">
                    {invitations.filter((inv) => inv.status === 'pending').map((inv) => (
                        <div className="invitation" key={inv._id} id={`${inv._id}`}> <b>Name:</b>  {inv.name} , date:  {inv.date} , time:  {inv.time}
                        <br/> <b>Description:</b> {inv.description} <br/> <b>Requirements:</b> {inv.requirements} <br/> <b>Status:</b> <b>{inv.status}</b> &nbsp;
                            <a href="#" onClick={() => this.acceptInv(inv._id)}>ACCEPT &nbsp;</a>
                            <a href="#" onClick={() => this.declineInv(inv._id)}>DECLINE</a>
                            { inv.name === user.username ? (
                                <a href="#" onClick={() => deleteInvitation(inv._id) }>&nbsp; delete Invitation</a>
                            ) : (<></>)}
                        </div>
                    ))}
                    {invitations.filter((inv) => inv.status === 'accepted').map((inv) => (
                        <div className="invitation" key={inv._id} id={`${inv._id}`}> <b>Name:</b>  {inv.name} , date:  {inv.date} , time:  {inv.time}
                        <br/> <b>Description:</b> {inv.description} <br/> <b>Requirements:</b> {inv.requirements} <br/> <b>Status:</b> <b>{inv.status}</b>
                            { inv.name === user.username ? (
                                <a href="#" onClick={() => deleteInvitation(inv._id) }>&nbsp; delete Invitation</a>
                            ) : (<></>)}
                        </div>
                    ))}
                    {invitations.filter((inv) => inv.status === 'declined').map((inv) => (
                        <div className="invitation" key={inv._id} id={`${inv._id}`}> <b>Name:</b>  {inv.name} , date:  {inv.date} , time:  {inv.time}
                        <br/> <b>Description:</b> {inv.description} <br/> <b>Requirements:</b> {inv.requirements} <br/> <b>Status:</b> <b>{inv.status}</b>
                            { inv.name === user.username ? (
                                <a href="#" onClick={() => deleteInvitation(inv._id) }>&nbsp; delete Invitation</a>
                            ) : (<></>)}
                        </div>
                    ))}
                </div>
            </>
        );
    }
}
