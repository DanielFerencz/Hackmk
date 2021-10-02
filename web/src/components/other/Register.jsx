import React from 'react';
import autoBind from 'auto-bind';
import Msg from './Msg.jsx';
import { registerSubmit } from '../../service/script.js';
import findUser from '../../service/user.js';
import {
	Grid,
} from "@mui/material";
// Registracios oldal kinezete
export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            user: {},
        };
        autoBind(this);
    }

    async componentDidMount() {
        const user = await findUser();
        this.setState({ user });
    }

    async onSubmit(event) {
        event.preventDefault();
        const msg = await registerSubmit();

        if (msg === 'OK') {
            this.props.history.push('/login');
        } else {
            this.setState({ msg });
        }
    }

    render() {
        const { msg, user } = this.state;

        if (JSON.stringify(user) !== '{}') {
            return (
                <>
                    <Grid container direction="column" alignItems="center" justifyContent="center" justify="center">
                        <Grid Item> 
                            <h1>Register: </h1>
                        </Grid> 
                        <Grid Item> 
                            <div id="register">
                                <div className="register">
                                    You are already logged in!
                                </div>
                            </div>
                        </Grid> 
                    </Grid>
                </>
            );
        }

        return (
            <>
                <Grid container direction="column" alignItems="center" justifyContent="center" justify="center">
                    <Grid Item> 
                        <Msg msg={msg}/>
                    </Grid> 
                    <Grid Item> 
                        <h1>Register</h1>
                    </Grid> 
                    <form method="POST" id="register">
                        <label htmlFor="username">Username: </label>
                        <input id="username" type="text" name="username" required/>

                        <label htmlFor="password1">Password: </label>
                        <input id="password1" type="password" name="password1" required/>

                        <label htmlFor="password2">Password again: </label>
                        <input id="password2" type="password" name="password2" required/>

                        <input type="button" onClick={this.onSubmit} value="Register"/>
                    </form>
                </Grid>
            </>
        );
    }
}
