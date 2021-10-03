import { Grid } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

// Egy bejegyzes nemi adatai
export default class Post extends React.Component {
    render() {
        const { pst } = this.props;

        return (
            <Grid item>
                <div className="post">
                    <div id={`informations${pst._id}`}>
                        <h2>
                            <Link to={`post_details/${pst._id}`}> {pst.name}</Link>
                        </h2>
                        <div>Game: {pst.game} </div>
                        <div className="genre">Genre: {pst.genre}</div>
                    </div>
                </div>
            </Grid>
        );
    }
}
