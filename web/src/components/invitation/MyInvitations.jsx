import React from 'react';
import autoBind from 'auto-bind';
import findUser from '../../service/user.js';
import { deleteInvitation } from '../../service/deleteInvitation.js';
import { findMyInvitations } from '../../service/invitation.js';

// Sajat foglalasok betoltese
export default class MyInvitations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            invitations: [],
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
        const invitations = await findMyInvitations();
        this.setState({ invitations });
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
        const { invitations } = this.state;
        invitations.forEach((inv) => {
            dict[inv.status] = 0;
        });
        invitations.forEach((inv) => {
            dict[inv.status] += 1;
        });
        this.setState({ statusDict: dict });
    }

    // Oldal betoltese
    render() {
        const { statusFilter } = this.state;
        const { statusDict } = this.state;
        const { user } = this.state;
        const invitations = this.state.invitations.filter((inv) => (inv.status === statusFilter || statusFilter === ''));

        if (JSON.stringify(user) === '{}') {
            return (
                <>
                    <h1>Invitations: </h1>
                    <div id="invitations">
                        <div className="invitation">
                            Log in to make invitations.
                        </div>
                    </div>
                </>
            );
        }
        if (invitations.length === 0) {
            return (
                <>
                    <h1>Invitations: </h1>
                    <div id="invitations">
                        <div className="invitation">
                            You have no registered invitations.
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                <h1>Invitations: </h1>
                <label htmlFor="status">Choose a status:</label>
                <select id="status" name="status" onChange={this.statusChange}>
                    <option value="" key="none"> Show every status </option>
                    {Object.keys(statusDict).map((key) => (
                        <option value={`${key}`} key={key}> {`${key} (${statusDict[key]})`} </option>
                    ))}
                </select>
                <div id="invitations">
                    {invitations.map((inv) => (
                        <div className="invitation" key={inv._id} id={`${inv._id}`}> <b>Name:</b>  {inv.name} , date:  {inv.date} , time:  {inv.time}
                        <br/> <b>Description:</b> {inv.description} <br/> <b>Requirements:</b> {inv.requirements} <br/> <b>Status:</b> <b>{inv.status}</b>&nbsp;
                            <a href="#" onClick={() => deleteInvitation(inv._id) }>delete Invitation</a>
                        </div>
                    ))}
                </div>
            </>
        );
    }
}
