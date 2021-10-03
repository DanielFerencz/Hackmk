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
            selectedOption: 'player',
        };
        autoBind(this);
    }

    async componentDidMount() {
        const user = await findUser();
        this.setState({ user });
    }

    async onSubmit(event) {
        event.preventDefault();
        const { selectedOption } = this.state
        const msg = await registerSubmit(selectedOption);

        if (msg === 'OK') {
            this.props.history.push('/login');
        } else {
            this.setState({ msg });
        }
    }

    onValueChange(event) {
        this.setState({
        selectedOption: event.target.value
        });
    }

    render() {
        const { msg, user,selectedOption } = this.state;

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
                    <Grid item> 
                        <Msg msg={msg}/>
                    </Grid> 
                    <Grid item> 
                        <h1>Register</h1>
                    </Grid> 
                    <Grid item>
                    <form method="POST" id="register">
                        <label htmlFor="username">Username: </label>
                        <input id="username" type="text" name="username" required/>

                        <label htmlFor="password1">Password: </label>
                        <input id="password1" type="password" name="password1" required/>

                        <label htmlFor="password2">Password again: </label>
                        <input id="password2" type="password" name="password2" required/>

                        <label htmlFor="check"> Are you a player? Or do you represent a team? </label>
                        <div>
                            <label>
                            <input type="radio" id="player"
                            name="choice" value="player" checked={selectedOption==="player" } onChange={this.onValueChange}/>Player
                            </label>
                            <label>
                            <input type="radio" id="team"
                            name="choice" value="team" checked={selectedOption==="team"} onChange={this.onValueChange}/>Team
                            </label>
                        </div>
                        <input type="button" onClick={this.onSubmit} value="Register"/>
                    </form>
                    </Grid>
                </Grid>
            </>
        );
    }
}
