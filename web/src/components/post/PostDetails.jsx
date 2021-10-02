import React from 'react';
import { findPost } from '../../service/post.js';
import Msg from '../other/Msg.jsx';
import Invitations from '../invitation/Invitations.jsx';
import UploadPhoto from './UploadPhoto.jsx';
import findUser from '../../service/user.js';

// egy vendeglo osszes adata
export default class PostDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {},
            msg: '',
            invitations: [],
            user: {},
        };
    }

    // betoltes...
    async componentDidMount() {
        const { pstID } = this.props.match.params;
        const post = await findPost(pstID);
        if (JSON.stringify(post) === '{}') {
            this.setState({ msg: 'Not found' });
        } else {
            this.setState({ post });
        }
        const user = await findUser();
        this.setState({ user });
    }

    render() {
        const { post } = this.state;
        const { user } = this.state;

        if (JSON.stringify(post) === '{}') {
            return (<Msg msg={this.state.msg} />);
        }
        return (
            <>
                <Msg msg={this.state.msg} />

                <h1>{post.name}</h1>
                <div className="post">
                    <div>Game:  {post.game} </div>
                    <div>Genre:  {post.genre} </div>
                    <div>City:  {post.city} </div>
                    <div>Email: {post.email} </div>
                    <div>Tel:  {post.telefon} </div>
                    <div>Description: <br/> <textarea rows="5" cols="50" value={post.description}/> </div>
                </div>

                <Invitations post={post}/>
                <UploadPhoto user={user} post={post} details={this}/>
            </>
        );
    }
}
