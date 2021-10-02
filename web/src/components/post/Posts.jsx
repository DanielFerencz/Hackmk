import React from 'react';
import autoBind from 'auto-bind';
import Post from './Post.jsx';
import Msg from '../other/Msg.jsx';
import { findAllPosts } from '../../service/post.js';

// Az osszes vendeglo listazasa
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

    // Varos filter
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
                    <Msg msg={this.state.msg} />
                    <h1>Posts</h1>
                    <input type="text" placeholder="Search.." value={nameFilter} onChange={this.onChange}></input>
                    <label htmlFor="genre">Choose a genre:</label>
                    <select id="genre" name="genre" onChange={this.genreChange}>
                        <option value="" key="none"> Show every genre </option>
                        {Object.keys(genreDict).map((key) => (
                            <option value={`${key}`} key={key}> {`${key} (${genreDict[key]})`} </option>
                        ))}
                    </select>
                    <div id="container">
                        <div className="post">
                                No posts in the database.
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                <Msg msg={this.state.msg} />
                <h1>Posts</h1>
                <input type="text" placeholder="Search.." value={nameFilter} onChange={this.onChange} ></input>
                <label htmlFor="genre">Choose a genre:</label>
                <select id="genre" name="genre" onChange={this.genreChange}>
                    <option value="" key="none"> Show every genre </option>
                    {Object.keys(genreDict).map((key) => (
                        <option value={`${key}`} key={key}> {`${key} (${genreDict[key]})`} </option>
                    ))}
                </select>
                <div id="container">
                    {filteredPosts.map((pst) => (
                        <Post pst={pst} key={pst._id}/>
                    ))}
                </div>
            </>
        );
    }
}
