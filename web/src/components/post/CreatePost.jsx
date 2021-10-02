import React from 'react';
import autoBind from 'auto-bind';
import { createPost } from '../../service/post.js';
import Msg from '../other/Msg.jsx';
import findUser from '../../service/user.js';
import { Grid, Input, TextField } from '@mui/material';

// Vendeglo letrehozasa
export default class CreatePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            post: {},
            user: {},
        };
        autoBind(this);
    }

    // Adatok inicializalasa
    async componentDidMount() {
        const user = await findUser();
        this.setState({ user });
    }

    // vendeglo felepitese mint objektum
    onChange(event) {
        const { post } = this.state;
        post[event.target.name] = event.target.value;
        this.setState({ post });
    }

    // bekuldes eseten
    async onSubmit(event) {
        event.preventDefault();
        this.state.post.adminID = this.state.user.id;
        const msg = await createPost(this.state.post);
        if (msg === 'OK') {
            this.props.history.push('/');
        } else {
            this.setState({ msg });
        }
    }

    // Oldal betoltese
    render() {
        const {
            msg, post, user,
        } = this.state;

        if (JSON.stringify(user) === '{}') {
            return (
                <Msg msg={'Unauthorized'}/>
            );
        }

        if (user.role !== 'admin') {
            return (
                <Msg msg={'Forbidden'}/>
            );
        }
        return (
                <Grid container alignItems="center" justifyContent="center" justify="center" direction="column">
                    <Grid item>
                        <Msg msg={msg}/>
                    </Grid>
                    <Grid item>
                        <h1>Create Post</h1>
                    </Grid>
                    <Grid item>
                        <form method="POST">
                            <label htmlFor="name">Post Name: </label>
                            <TextField id="name" type="text" name="name" placeholder="Post name" value={post.name} onChange={this.onChange} required/>
                            <br/>

                            <label htmlFor="genre"> Genre name: </label>
                            <TextField id="genre" type="text" name="genre" placeholder="Genre name" value={post.genre} onChange={this.onChange} required/>
                            <br/>

                            <label htmlFor="game"> Game name: </label>
                            <TextField id="game" type="text" name="game" placeholder="Game name" value={post.game} onChange={this.onChange} required/>
                            <br/>

                            <label htmlFor="city"> City name: </label>
                            <TextField id="city" type="text" name="city" placeholder="City name" value={post.city} onChange={this.onChange} required/>
                            <br/>

                            <label htmlFor="email"> Email: </label>
                            <TextField id="email" type="text" name="email" placeholder="Email" value={post.email} onChange={this.onChange} required/>
                            <br/>

                            <label htmlFor="telefon">Telefon number: </label>
                            <TextField id="telefon" type="tel" name="telefon" placeholder="Telefon number" value={post.telefon} onChange={this.onChange} required/>
                            <br/>

                            <label htmlFor="description"> Description: </label>
                            <TextField multiline rows='5' id="description" type="text" name="description" placeholder="description" value={post.description} onChange={this.onChange} required/>
                            <br/>

                            
                            <Input type="button" onClick={this.onSubmit} value="Create Post" />
                        </form>
                    </Grid>
                </Grid>
        );
    }
}
