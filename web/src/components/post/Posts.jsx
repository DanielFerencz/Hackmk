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
            cityFilter: '',
            cityDict: {},
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
    cityChange(event) {
        let { cityFilter } = this.state;
        cityFilter = event.target.value;
        this.setState({ cityFilter });
    }

    // Varos szamozasa
    makeDict(nameFilter) {
        const dict = {};
        const { posts } = this.state;
        const filteredPosts = posts
            .filter((pst) => (pst.name.toLowerCase().includes(nameFilter.toLowerCase())));
        filteredPosts.forEach((pst) => {
            dict[pst.city] = 0;
        });
        filteredPosts.forEach((pst) => {
            dict[pst.city] += 1;
        });
        this.setState({ cityDict: dict });
    }

    // Oldal betoltese
    render() {
        const { nameFilter, cityFilter, cityDict } = this.state;
        const { posts } = this.state;

        if (!posts) {
            return <div>Posts not loaded yet...</div>;
        }

        const filteredPosts = posts
            .filter((pst) => (pst.name.toLowerCase().includes(nameFilter.toLowerCase())
            && (pst.city === cityFilter || cityFilter === '')));

        if (filteredPosts.length === 0) {
            return (
                <>
                    <Msg msg={this.state.msg} />
                    <h1>Posts</h1>
                    <input type="text" placeholder="Search.." value={nameFilter} onChange={this.onChange}></input>
                    <label htmlFor="city">Choose a city:</label>
                    <select id="city" name="city" onChange={this.cityChange}>
                        <option value="" key="none"> Show every city </option>
                        {Object.keys(cityDict).map((key) => (
                            <option value={`${key}`} key={key}> {`${key} (${cityDict[key]})`} </option>
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
                <label htmlFor="city">Choose a city:</label>
                <select id="city" name="city" onChange={this.cityChange}>
                    <option value="" key="none"> Show every city </option>
                    {Object.keys(cityDict).map((key) => (
                        <option value={`${key}`} key={key}> {`${key} (${cityDict[key]})`} </option>
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
