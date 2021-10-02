import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavBar from './components/other/NavBar.jsx';
import Posts from './components/post/Posts.jsx';
import Footer from './components/other/Footer.jsx';
import Login from './components/other/Login.jsx';
import Register from './components/other/Register.jsx';
import PostDetails from './components/post/PostDetails.jsx';
import CreatePost from './components/post/CreatePost.jsx';
import CreateInvitation from './components/invitation/CreateInvitation.jsx';
import MyInvitations from './components/invitation/MyInvitations.jsx';

// Az alap applikacio, main betoltese
export default function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <main>
                <Switch>
                    <Route exact path="/" component={Posts} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/my_invitations" component={MyInvitations} />
                    <Route exact path="/create_post" component={CreatePost} />
                    <Route exact path="/create_invitation" component={CreateInvitation} />
                    <Route path="/post_details/:pstID" component={PostDetails} />
                </Switch>
            </main>
            <Footer />
        </BrowserRouter>
    );
}
