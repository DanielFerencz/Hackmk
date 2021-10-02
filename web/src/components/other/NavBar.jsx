import autoBind from 'auto-bind';
import React from 'react';
import findUser from '../../service/user.js';
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

// Navbar letrehozasa, logout eseten cookie torlese
export default class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        };
        autoBind(this);
    }

    async componentDidMount() {
        const user = await findUser();
        this.setState({ user });
    }

    onSubmit() {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        this.setState({ user: {} });
    }

    render() {
        const { user } = this.state;
        if (JSON.stringify(user) === '{}') {
            return (
                <>
                    <AppBar>
                        <Toolbar>
                            <Typography variant="h6">
                                <Button color='inherit' href="/">Posts</Button>
                                <Button color='inherit' href="/login"> Login</Button>
                                <Button color='inherit' href="/register"> Register</Button>
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Toolbar />
                </>
            );
        }
        return (
            <>
                <AppBar>
                    <Toolbar>
                        <Typography variant="h6">
                            <Button color='inherit' href="/">Posts</Button>
                            {(user.role === 'admin') ? <Button color='inherit' href="/create_post">Create Post</Button> : ''}
                            {(user.role === 'user') ? <Button color='inherit' href="/create_invitation">Create Invitation</Button> : ''}
                            {(user.role === 'user') ? <Button color='inherit' href="/my_invitations">Sent Invitations</Button> : ''}
                            <Button color='inherit' href="/login" onClick={this.onSubmit}>Logout: {user.username} ({(user.role === 'admin') ? 'player' : 'team'})</Button>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar />
            </>
        );
    }
}
