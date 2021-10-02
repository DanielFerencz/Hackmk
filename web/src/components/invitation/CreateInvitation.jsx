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
            invitations: [],
            invitationDate: '',
        };
        autoBind(this);
    }

    // Kezdeti adatok betoltese, user, vendeglok, azokra meg a foglalasok
    async componentDidMount() {
        const posts = await findAllPosts();
        let { invitations } = this.state;
        this.setState({ posts });
        if (posts.length > 0) {
            const selectedPost = posts[0];
            invitations = await findInvitations(selectedPost._id);
            this.setState({ invitations });
            this.setState({ selectedPost });
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
        this.setState({ invitations });
        this.setState({ selectedPost });
    }

    // Datum csere
    changeInvitationDate(event) {
        let { invitationDate } = this.state;
        invitationDate = event.target.value;
        this.setState({ invitationDate });
    }

    // oldal kinezete
    render() {
        const {
            msg, posts, user, invitationDate, selectedPost,
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
        if (user &&  user.role === 'admin') {
            return (
                <Msg msg={'No permission'}/>
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

                    <input type="button" value="Send Invitation" onClick={this.onSubmit} />
                </form>
            </>
        );
    }
}
