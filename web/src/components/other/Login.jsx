import React from 'react';
import { Link } from 'react-router-dom';
import autoBind from 'auto-bind';
import Msg from './Msg.jsx';
import { loginSubmit } from '../../service/script.js';
import findUser from '../../service/user.js';
import {
	Grid,
} from "@mui/material";

// Login main szerkezete
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            user: {},
        };
        autoBind(this);
    }

    // User betoltese
    async componentDidMount() {
        const user = await findUser();
        this.setState({ user });
    }

    // submit kezelese
    async onSubmit(event) {
        event.preventDefault();
        const msg = await loginSubmit();

        if (msg === 'OK') {
            window.location.href = '/';
        } else {
            this.setState({ msg });
        }
    }

    // A kinezet
    render() {
        const { msg, user } = this.state;

        if (JSON.stringify(user) !== '{}') {
            return (
                <>
                    <Grid container direction="column" justifyContent="center" justify="center" alignItems="center"> 
                        <Grid Item> 
                            <h1>Login: </h1>
                            <div id="login">
                                <div className="login">
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
                <Grid container direction="column" justifyContent="center" justify="center" alignItems="center"> 
                    <Grid Item> 
                        <Msg msg={msg}/>
                    </Grid>
                    <Grid Item>  
                        <h1>Login</h1>
                    </Grid> 
                        <form method="POST" id="login">
                            <label htmlFor="username">Username: </label>
                            <input id="username" type="text" name="username" required/>
                            <label htmlFor="password">Password: </label>
                            <input id="password" type="password" name="password" required/>
                            <input type="button" onClick={this.onSubmit} value="Login"/>                               
                        </form>
                   
                    <Grid Item> 
                        <div>
                            Don&apos;t have an account? <Link to="./register">Register now</Link>
                        </div>
                    </Grid>
                </Grid> 
            </>
        );
    }
}
