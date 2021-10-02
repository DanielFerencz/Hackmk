import React from 'react';
import autoBind from 'auto-bind';
import { createPost } from '../../service/post.js';
import Msg from '../other/Msg.jsx';
import findUser from '../../service/user.js';

// Vendeglo letrehozasa
export default class CreatePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            post: {},
            user: {},
            tableRows: [],
            tableColumns: [],
            tables: [],
        };
        autoBind(this);
    }

    // Adatok inicializalasa
    async componentDidMount() {
        const tableRows = [];
        for (let i = 0; i < 10; i += 1) {
            tableRows.push(i);
        }
        this.setState({ tableRows });

        const tableColumns = [];
        for (let i = 0; i < 10; i += 1) {
            tableColumns.push(i);
        }
        this.setState({ tableColumns });

        const tables = [];
        for (let i = 0; i < 100; i += 1) {
            tables.push(0);
        }
        this.setState({ tables });
        const user = await findUser();
        this.setState({ user });
    }

    // vendeglo felepitese mint objektum
    onChange(event) {
        const { post } = this.state;
        post[event.target.name] = event.target.value;
        this.setState({ post });
    }

    // az asztalokra valo kattintas
    clickOnCanvas(index) {
        const { tables } = this.state;
        tables[index] = 1 - tables[index];
        this.setState({ tables });
        if (tables[index] === 1) {
            document.getElementById(`bt${index}`).style.backgroundColor = 'green';
        } else {
            document.getElementById(`bt${index}`).style.backgroundColor = 'grey';
        }
    }

    // bekuldes eseten
    async onSubmit(event) {
        event.preventDefault();
        const { tables } = this.state;
        let structure = 0;
        for (let i = 0; i < 100; i += 1) {
            structure += tables[i];
        }
        if (structure === 0) {
            this.setState({ msg: 'You have to select at least 1 table!' });
        } else {
            this.state.post.structure = this.state.tables;
            this.state.post.adminID = this.state.user.id;
            const msg = await createPost(this.state.post);
            if (msg === 'OK') {
                this.props.history.push('/');
            } else {
                this.setState({ msg });
            }
        }
    }

    // Oldal betoltese
    render() {
        const {
            msg, post, user, tableRows, tableColumns,
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
            <>
                <Msg msg={msg}/>
                <h1>Create Post</h1>
                <form method="POST">
                    <label htmlFor="name">Post Name: </label>
                    <input id="name" type="text" name="name" placeholder="Post name" value={post.name} onChange={this.onChange} required/>
                    <br/>

                    <label htmlFor="city"> City name: </label>
                    <input id="city" type="text" name="city" placeholder="City name" value={post.city} onChange={this.onChange} required/>
                    <br/>

                    <label htmlFor="street"> Street name: </label>
                    <input id="street" type="text" name="street" placeholder="Street name" value={post.street} onChange={this.onChange} required/>
                    <br/>

                    <label htmlFor="number"> Street number: </label>
                    <input id="number" type="number" name="number" placeholder="Street number" value={post.number} onChange={this.onChange} required/>
                    <br/>

                    <label htmlFor="telefon">Telefon number: </label>
                    <input id="telefon" type="tel" name="telefon" placeholder="Telefon number" value={post.telefon} onChange={this.onChange} required/>
                    <br/>

                    <label htmlFor="open">Opening hour: </label>
                    <input id="open" type="time" name="open" value={post.open} onChange={this.onChange} required/>
                    <br/>

                    <label htmlFor="close">Closing hour: </label>
                    <input id="close" type="time" name="close" value={post.close} onChange={this.onChange} required/>
                    <br/>
                    <h2>Create the structure of the post</h2>
                    <table>
                        <tbody>
                            {tableRows.map((row) => <tr key={row}>
                                {tableColumns.map((col) => <td key={col}>
                                    <input type="button" id={`bt${row * 10 + col}`} className='tables' key={row * 10 + col} onClick={() => this.clickOnCanvas(row * 10 + col)} />
                                </td>)}
                            </tr>)}
                        </tbody>
                    </table>

                    <input type="button" onClick={this.onSubmit} value="Create Post" />
                </form>
            </>
        );
    }
}
