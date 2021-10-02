import React from 'react';
import autoBind from 'auto-bind';
import { findAllPosts } from '../../service/post.js';
import findUser from '../../service/user.js';
import { createInvitation, findInvitations } from '../../service/invitation.js';
import Msg from '../other/Msg.jsx';

// Create invitation oldal-form
export default class CreateInvitation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            posts: [],
            selectedPost: null,
            user: null,
            tableRows: [],
            tableColumns: [],
            tables: [],
            selectedTable: -1,
            invitations: [],
            invitationDate: '',
            selectedDateTables: [],
        };
        autoBind(this);
    }

    // Kezdeti adatok betoltese, user, vendeglok, azokra meg a foglalasok
    async componentDidMount() {
        const posts = await findAllPosts();
        let { invitations } = this.state;
        const { tableColumns } = this.state;
        for (let i = 0; i < 10; i += 1) {
            tableColumns.push(i);
        }
        this.setState({ posts, tableColumns });
        if (posts.length > 0) {
            const selectedPost = posts[0];
            invitations = await findInvitations(selectedPost._id);
            this.setState({ invitations });
            this.setState({ selectedPost });
            this.setTables(selectedPost);
            this.invitationFilter('');
        }
        const user = await findUser();
        this.setState({ user });
    }

    // Submit kezelese, adatok ellenorzese es tovabbkuldese
    async onSubmit(event) {
        event.preventDefault();
        if (this.state.selectedTable === -1) {
            this.setState({ msg: 'No selected table!' });
        } else {
            const msg = await createInvitation(this.state.selectedTable);
            if (msg === 'OK') {
                this.props.history.push(`/post_details/${document.getElementById('id').value}`);
            } else {
                this.setState({ msg });
            }
        }
    }

    // Az asztalok sorrendje
    setTables(selectedPost) {
        const tableRows = [];
        const tables = [];
        let rowCount = 0;
        for (let i = 0; i < 100; i += 1) {
            tables.push(selectedPost.structure[i]);
            if (selectedPost.structure[i] === 1) {
                rowCount = Math.floor(i / 10) + 1;
            }
        }
        for (let i = 0; i < rowCount; i += 1) {
            tableRows.push(i);
        }
        this.setState({
            tableRows,
            tables,
        });
    }

    // Ha valtoztatunk vendeglot...
    async postChange(event) {
        const { posts } = this.state;
        let { selectedPost } = this.state;
        const pstID = event.target.value;
        for (let i = 0; i < posts.length; i += 1) {
            if (posts[i]._id === parseInt(pstID, 10)) {
                selectedPost = posts[i];
            }
        }
        const invitations = await findInvitations(selectedPost._id);
        const selectedTable = -1;
        this.setState({ invitations });
        this.setState({ selectedTable });
        this.setState({ selectedPost });
        this.setTables(selectedPost);
        this.invitationFilter(this.state.invitationDate);
    }

    // Ha rakattintunk egy asztalra
    clickOnCanvas(index) {
        let { selectedTable } = this.state;
        const { selectedDateTables } = this.state;
        if (selectedTable === -1) {
            selectedDateTables[index] = 2;
            document.getElementById(`bt${index}`).style.backgroundColor = 'green';
            selectedTable = index;
            this.setState({ selectedDateTables, selectedTable });
        } else if (selectedTable === index) {
            document.getElementById(`bt${index}`).style.backgroundColor = 'grey';
            selectedDateTables[index] = 1;
            selectedTable = -1;
            this.setState({ selectedDateTables, selectedTable });
        } else {
            document.getElementById(`bt${selectedTable}`).style.backgroundColor = 'grey';
            selectedDateTables[selectedTable] = 1;
            selectedDateTables[index] = 2;
            document.getElementById(`bt${index}`).style.backgroundColor = 'green';
            selectedTable = index;
            this.setState({ selectedDateTables, selectedTable });
        }
    }

    // Ha a datumot kicsereljuk, betolti a foglaltakat
    invitationFilter(invitationDate) {
        const { tables } = this.state;
        const selectedDateTables = [];
        if (invitationDate === '') {
            for (let i = 0; i < 100; i += 1) {
                selectedDateTables.push(tables[i]);
            }
            this.setState({ selectedDateTables });
        } else {
            const dateInvitations = this.state.invitations.filter((inv) => (inv.date === invitationDate && inv.status === 'accepted'));
            for (let i = 0; i < 100; i += 1) {
                selectedDateTables.push(tables[i]);
            }
            for (let i = 0; i < dateInvitations.length; i += 1) {
                selectedDateTables[dateInvitations[i].table] = 3;
            }
            this.setState({ selectedDateTables });
        }
    }

    // Datum csere
    changeInvitationDate(event) {
        const selectedTable = -1;
        this.setState({ selectedTable });
        let { invitationDate } = this.state;
        invitationDate = event.target.value;
        this.setState({ invitationDate });
        this.invitationFilter(invitationDate);
    }

    // Asztalok szine..
    renderTable(row, col, selectedDateTables) {
        if (selectedDateTables[row * 10 + col] === 0) {
            return (
                <td key={col}>
                    <input type="button" id={`bt${row * 10 + col}`} className='tables' key={row * 10 + col} style={{ visibility: 'hidden' }}/>
                </td>
            );
        }
        if (selectedDateTables[row * 10 + col] === 2) {
            return (
                <td key={col}>
                    <input type="button" id={`bt${row * 10 + col}`} className='tables' key={row * 10 + col} onClick={() => this.clickOnCanvas(row * 10 + col)} style={{ backgroundColor: 'green' }}/>
                </td>
            );
        }
        if (selectedDateTables[row * 10 + col] === 3) {
            return (
                <td key={col}>
                    <input type="button" id={`bt${row * 10 + col}`} className='tables' key={row * 10 + col} style={{ backgroundColor: 'red' }}/>
                </td>
            );
        }
        return (
            <td key={col}>
                <input type="button" id={`bt${row * 10 + col}`} className='tables' key={row * 10 + col} onClick={() => this.clickOnCanvas(row * 10 + col)} style={{ backgroundColor: 'grey' }}/>
            </td>
        );
    }

    // oldal kinezete
    render() {
        const {
            msg, posts, user, tableRows, tableColumns,
            selectedDateTables, invitationDate, selectedPost,
        } = this.state;

        if (!user || !selectedPost) {
            return <div>Create invitation not loaded yet...</div>;
        }

        if (posts.length === 0) {
            return (
                <Msg msg={'No posts in the database'}/>
            );
        }

        if (JSON.stringify(user) === '{}') {
            return (
                <Msg msg={'Unauthorized'}/>
            );
        }
        return (
            <>
                <Msg msg={msg}/>
                <h1>Create Invitation</h1>
                <form method="POST">
                    <label htmlFor="name">Name: {user.username} </label>
                    <input id="name" name="name" type="hidden" value={user.username}/>
                    <br/>

                    <label htmlFor="id">Choose a post:</label>
                    <select id="id" name="id" onChange={this.postChange}>
                        {posts.map((pst) => (
                            <option value={`${pst._id}`} key={pst._id}> {`${pst.name}`} </option>
                        ))}
                    </select>

                    <label htmlFor="date">Invitation date: </label>
                    <input id="date" type="date" name="date" value={invitationDate} onChange={this.changeInvitationDate} required/>
                    <br/>

                    <label htmlFor="time">Invitation time: </label>
                    <input id="time" type="time" name="time" required/>
                    <br/>

                    <h2>Select a table</h2>

                    <table>
                        <tbody>
                            {tableRows.map((row) => <tr key={row}>
                                {tableColumns
                                    .map((col) => (this.renderTable(row, col, selectedDateTables)))}
                            </tr>)}
                        </tbody>
                    </table>

                    <input type="button" value="Send Invitation" onClick={this.onSubmit} />
                </form>
            </>
        );
    }
}
