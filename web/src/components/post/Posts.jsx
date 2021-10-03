/* eslint-disable no-unused-vars */
import React from 'react';
import autoBind from 'auto-bind';
import Post from './Post.jsx';
import Msg from '../other/Msg.jsx';
import { findAllPosts } from '../../service/post.js';
import {
	Typography,
	Grid,
} from "@mui/material";

// Az osszes bejegyzes listazasa
export default class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: null,
            msg: '',
            nameFilter: '',
            genreFilter: '',
            genreDict: {},
        };
        autoBind(this);
    }

    // Adatok betoltese
    async componentDidMount() {
        const posts = await findAllPosts();
        this.setState({ posts });
        this.makeDict('');
    }

    // Kereses filter
    onChange(event) {
        let { nameFilter } = this.state;
        nameFilter = event.target.value;
        this.setState({ nameFilter });
        this.makeDict(nameFilter);
    }

    // Tipus filter
    genreChange(event) {
        let { genreFilter } = this.state;
        genreFilter = event.target.value;
        this.setState({ genreFilter });
    }

    // Varos szamozasa
    makeDict(nameFilter) {
        const dict = {};
        const { posts } = this.state;
        const filteredPosts = posts
            .filter((pst) => (pst.name.toLowerCase().includes(nameFilter.toLowerCase())));
        filteredPosts.forEach((pst) => {
            dict[pst.genre] = 0;
        });
        filteredPosts.forEach((pst) => {
            dict[pst.genre] += 1;
        });
        this.setState({ genreDict: dict });
    }

    // Oldal betoltese
    render() {
        const { nameFilter, genreFilter, genreDict } = this.state;
        const { posts } = this.state;

        if (!posts) {
            return <div>Posts not loaded yet...</div>;
        }

        const filteredPosts = posts
            .filter((pst) => (pst.name.toLowerCase().includes(nameFilter.toLowerCase())
            && (pst.genre === genreFilter || genreFilter === '')));

        if (filteredPosts.length === 0) {
            return (
                <>
                    <Grid container alignItems="center" justifyContent="center" justify="center" direction="column">
                    <Grid item>
                        <Typography variant="h6" align="left" paragraph>
                            <Msg msg={this.state.msg} />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" align="left" paragraph>
                            <h1>Posts</h1>
                        </Typography>
                    </Grid>
                    <Grid container justifyContent="center" direction="row">
                        <Grid item>
                            <Typography variant="h6" align="left" paragraph>
                            <label htmlFor="search">Search a player:</label>
                            <input id="search" type="text" placeholder="Search.." value={nameFilter} onChange={this.onChange} ></input>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" align="left" paragraph>
                                <label htmlFor="genre">Choose a genre:</label>
                                <select id="genre" name="genre" onChange={this.genreChange}>
                                    <option value="" key="none"> Show every genre </option>
                                    {Object.keys(genreDict).map((key) => (
                                        <option value={`${key}`} key={key}> {`${key} (${genreDict[key]})`} </option>
                                    ))}
                                </select>
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container alignItems="left" justifyContent="center" justify="center" direction="column">
                    <Grid item>
                        <Typography variant="h6" align="left" paragraph>
                        <div id="container">
                            <div className="post">
                                    No posts in the database.
                            </div>
                        </div>
                        </Typography>
                    </Grid>
                </Grid>
                </>
                
            );
        }
        return (
            <>
                <Grid container alignItems="center" justifyContent="center" justify="center" direction="column">
                    <Grid item>
                        <Typography variant="h6" align="left" paragraph>
                            <Msg msg={this.state.msg} />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" align="left" paragraph>
                            <h1>Posts</h1>
                        </Typography>
                    </Grid>
                    <Grid container justifyContent="center" direction="row">
                        <Grid item>
                            <Typography variant="h6" align="left" paragraph>
                            <label htmlFor="search">Search a player:</label>
                            <input id="search" type="text" placeholder="Search.." value={nameFilter} onChange={this.onChange} ></input>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" align="left" paragraph>
                                <label htmlFor="genre">Choose a genre:</label>
                                <select id="genre" name="genre" onChange={this.genreChange}>
                                    <option value="" key="none"> Show every genre </option>
                                    {Object.keys(genreDict).map((key) => (
                                        <option value={`${key}`} key={key}> {`${key} (${genreDict[key]})`} </option>
                                    ))}
                                </select>
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justifyContent="center" direction="row">
                            {filteredPosts.map((pst) => (
                                <Grid item key={pst._id} >
                                    <Post pst={pst} key={pst._id}/>
                                </Grid>
                            ))}
                </Grid>
            </>
        );
    }
}
