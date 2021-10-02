import React from 'react';
import autoBind from 'auto-bind';
import { findAllPosts } from '../../service/post.js';
import findUser from '../../service/user.js';
import { createInvitation, findInvitations } from '../../service/invitation.js';
import Msg from '../other/Msg.jsx';
import { invitation } from '../../service/script.js';

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
            invitationTime: '',
            description: '',
            requirements: 'Stable internet connection',
            invit: '',
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
        const msg = await createInvitation(this.state.selectedTable);
        if (msg === 'OK') {
            this.props.history.push(`/post_details/${document.getElementById('id').value}`);
        } else {
            this.setState({ msg });
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
        let { description, invitationDate, invitationTime, invit } = this.state;

        if (invitationDate === '') {
            description = 'Hello ' + selectedPost.name + ' ' + invitation;
            invit = 'Hello ' + selectedPost.name + ' ' + invitation;
        } else {
            if ( invitationTime === '' ) {
                description = 'Hello ' + selectedPost.name + ' ' + invitation + ' on ' + invitationDate;
            } else {
                description = 'Hello ' + selectedPost.name + ' ' + invitation + ' on ' + invitationDate + ' at ' + invitationTime;
            }
            
            invit = 'Hello ' + selectedPost.name + ' ' + invitation;
        }
        this.setState({ description, invit });
        this.setState({ invitations });
        this.setState({ selectedPost });
    }

    // Datum csere
    changeInvitationDate(event) {
        let { invitationDate, invitationTime, description, invit } = this.state;
        invitationDate = event.target.value;
        this.setState({ invitationDate });
        if(invitationTime === '' ){
            description = invit + ' on ' + invitationDate;
        } else {
            description = invit + ' on ' + invitationDate + ' at ' + invitationTime;
        }
        this.setState({ description })
    }

    changeInvitationTime(event) {
        let { invitationDate, invitationTime, description, invit } = this.state;
        invitationTime = event.target.value;
        this.setState({ invitationTime });
        if(invitationDate === '' ){
            description = invit + ' at ' + invitationTime;
        } else {
            description = invit + ' on ' + invitationDate + ' at ' + invitationTime;
        }
        
        this.setState({ description })
    }

    // oldal kinezete
    render() {
        const {
            msg, posts, user, invitationDate, invitationTime, selectedPost, description, requirements
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
                        <option value=''> Choose... </option>
                        {posts.map((pst) => (
                            <option value={`${pst._id}`} key={pst._id}> {`${pst.name}`} </option>
                        ))}
                    </select>

                    <label htmlFor="date">Invitation date: </label>
                    <input id="date" type="date" name="date" value={invitationDate} onChange={this.changeInvitationDate} required/>
                    <br/>

                    <label htmlFor="time">Invitation time: </label>
                    <input id="time" type="time" name="time" value={invitationTime} onChange={this.changeInvitationTime} required/>
                    <br/>

                    <label htmlFor="description"> Description: </label>
                    <textarea rows="5" cols="50" id="description" type="text" name="description" value={description} placeholder="description" required/>
                    <br/>

                    <label htmlFor="requirements"> Requirements: </label>
                    <textarea id="requirements" type="text" name="requirements" value={requirements} placeholder="requirements" required/>
                    <br/>

                    <input type="button" value="Send Invitation" onClick={this.onSubmit} />
                </form>
            </>
        );
    }
}
