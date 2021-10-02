import autoBind from 'auto-bind';
import React from 'react';
import { uploadPhoto, findPictures } from '../../service/picture.js';
import Pictures from './Pictures.jsx';
import Msg from '../other/Msg.jsx';

// Fenykep feltoltese
export default class UploadPhoto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            pictures: [],
        };
        autoBind(this);
    }

    // Adatok betoltese
    async componentDidMount() {
        const pictures = await findPictures(this.props.restaurant._id);
        this.setState({ pictures });
    }

    // Bekuldes ellenorzese, es elkuldese
    async onSubmit(event) {
        event.preventDefault();
        const msg = await uploadPhoto();
        if (msg === 'OK') {
            this.componentDidMount();
            this.setState({ msg: 'Photo uploaded!' });
        } else {
            this.setState({ msg });
        }
    }

    // A szerkezet renderelese
    render() {
        const { msg } = this.state;
        const { restaurant } = this.props;
        const { user } = this.props;

        if (JSON.stringify(user) === '{}') {
            return (
                <>
                    <Pictures pictures={this.state.pictures}/>
                </>
            );
        }
        if (user.role !== 'admin' || user.id !== restaurant.adminID) {
            return (
                <>
                    <Pictures pictures={this.state.pictures}/>
                </>
            );
        }
        return (
            <>
                <Pictures pictures={this.state.pictures} />
                <Msg msg={msg}/>
                <h3>Upload Photo</h3>
                <form method="POST" id='photoForm' encType="multipart/form-data">
                    <input id="id" type="hidden" name="id" placeholder="Restaurant ID" value= {restaurant._id} />
                    <label htmlFor="photo"> Photo: </label>
                    <input id="photo" type="file" name="photo" required/>
                    <br/>

                    <input type="button" onClick={this.onSubmit} value="Upload"/>
                </form>
            </>
        );
    }
}
