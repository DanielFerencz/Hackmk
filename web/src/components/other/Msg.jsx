import React from 'react';

// Sima uzenet kiirasa
export default class Msg extends React.Component {
    render() {
        if (this.props.msg.length > 0) {
            return (
                <div className="msg">
                    <label id="msg">{this.props.msg} </label>
                </div>
            );
        }
        return (
            <>
            </>
        );
    }
}
