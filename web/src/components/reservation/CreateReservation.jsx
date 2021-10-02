import React from 'react';
import autoBind from 'auto-bind';
import { findAllRestaurants } from '../../service/restaurant.js';
import findUser from '../../service/user.js';
import { createReservation, findReservations } from '../../service/reservation.js';
import Msg from '../other/Msg.jsx';

// Create reservation oldal-form
export default class CreateReservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            restaurants: [],
            selectedRestaurant: null,
            user: null,
            tableRows: [],
            tableColumns: [],
            tables: [],
            selectedTable: -1,
            reservations: [],
            reservationDate: '',
            selectedDateTables: [],
        };
        autoBind(this);
    }

    // Kezdeti adatok betoltese, user, vendeglok, azokra meg a foglalasok
    async componentDidMount() {
        const restaurants = await findAllRestaurants();
        let { reservations } = this.state;
        const { tableColumns } = this.state;
        for (let i = 0; i < 10; i += 1) {
            tableColumns.push(i);
        }
        this.setState({ restaurants, tableColumns });
        if (restaurants.length > 0) {
            const selectedRestaurant = restaurants[0];
            reservations = await findReservations(selectedRestaurant._id);
            this.setState({ reservations });
            this.setState({ selectedRestaurant });
            this.setTables(selectedRestaurant);
            this.reservationFilter('');
        }
        const user = await findUser();
        this.setState({ user });
    }

    // Submit kezelese, adatok ellenorzese es tovabbkuldese
    async onSubmit(event) {
        event.preventDefault();
        if (this.state.selectedTable === -1) {
            this.setState({ msg: 'No selected table!' });
        } else {
            const msg = await createReservation(this.state.selectedTable);
            if (msg === 'OK') {
                this.props.history.push(`/restaurant_details/${document.getElementById('id').value}`);
            } else {
                this.setState({ msg });
            }
        }
    }

    // Az asztalok sorrendje
    setTables(selectedRestaurant) {
        const tableRows = [];
        const tables = [];
        let rowCount = 0;
        for (let i = 0; i < 100; i += 1) {
            tables.push(selectedRestaurant.structure[i]);
            if (selectedRestaurant.structure[i] === 1) {
                rowCount = Math.floor(i / 10) + 1;
            }
        }
        for (let i = 0; i < rowCount; i += 1) {
            tableRows.push(i);
        }
        this.setState({
            tableRows,
            tables,
        });
    }

    // Ha valtoztatunk vendeglot...
    async restaurantChange(event) {
        const { restaurants } = this.state;
        let { selectedRestaurant } = this.state;
        const restID = event.target.value;
        for (let i = 0; i < restaurants.length; i += 1) {
            if (restaurants[i]._id === parseInt(restID, 10)) {
                selectedRestaurant = restaurants[i];
            }
        }
        const reservations = await findReservations(selectedRestaurant._id);
        const selectedTable = -1;
        this.setState({ reservations });
        this.setState({ selectedTable });
        this.setState({ selectedRestaurant });
        this.setTables(selectedRestaurant);
        this.reservationFilter(this.state.reservationDate);
    }

    // Ha rakattintunk egy asztalra
    clickOnCanvas(index) {
        let { selectedTable } = this.state;
        const { selectedDateTables } = this.state;
        if (selectedTable === -1) {
            selectedDateTables[index] = 2;
            document.getElementById(`bt${index}`).style.backgroundColor = 'green';
            selectedTable = index;
            this.setState({ selectedDateTables, selectedTable });
        } else if (selectedTable === index) {
            document.getElementById(`bt${index}`).style.backgroundColor = 'grey';
            selectedDateTables[index] = 1;
            selectedTable = -1;
            this.setState({ selectedDateTables, selectedTable });
        } else {
            document.getElementById(`bt${selectedTable}`).style.backgroundColor = 'grey';
            selectedDateTables[selectedTable] = 1;
            selectedDateTables[index] = 2;
            document.getElementById(`bt${index}`).style.backgroundColor = 'green';
            selectedTable = index;
            this.setState({ selectedDateTables, selectedTable });
        }
    }

    // Ha a datumot kicsereljuk, betolti a foglaltakat
    reservationFilter(reservationDate) {
        const { tables } = this.state;
        const selectedDateTables = [];
        if (reservationDate === '') {
            for (let i = 0; i < 100; i += 1) {
                selectedDateTables.push(tables[i]);
            }
            this.setState({ selectedDateTables });
        } else {
            const dateReservations = this.state.reservations.filter((reser) => (reser.date === reservationDate && reser.status === 'accepted'));
            for (let i = 0; i < 100; i += 1) {
                selectedDateTables.push(tables[i]);
            }
            for (let i = 0; i < dateReservations.length; i += 1) {
                selectedDateTables[dateReservations[i].table] = 3;
            }
            this.setState({ selectedDateTables });
        }
    }

    // Datum csere
    changeReservationDate(event) {
        const selectedTable = -1;
        this.setState({ selectedTable });
        let { reservationDate } = this.state;
        reservationDate = event.target.value;
        this.setState({ reservationDate });
        this.reservationFilter(reservationDate);
    }

    // Asztalok szine..
    renderTable(row, col, selectedDateTables) {
        if (selectedDateTables[row * 10 + col] === 0) {
            return (
                <td key={col}>
                    <input type="button" id={`bt${row * 10 + col}`} className='tables' key={row * 10 + col} style={{ visibility: 'hidden' }}/>
                </td>
            );
        }
        if (selectedDateTables[row * 10 + col] === 2) {
            return (
                <td key={col}>
                    <input type="button" id={`bt${row * 10 + col}`} className='tables' key={row * 10 + col} onClick={() => this.clickOnCanvas(row * 10 + col)} style={{ backgroundColor: 'green' }}/>
                </td>
            );
        }
        if (selectedDateTables[row * 10 + col] === 3) {
            return (
                <td key={col}>
                    <input type="button" id={`bt${row * 10 + col}`} className='tables' key={row * 10 + col} style={{ backgroundColor: 'red' }}/>
                </td>
            );
        }
        return (
            <td key={col}>
                <input type="button" id={`bt${row * 10 + col}`} className='tables' key={row * 10 + col} onClick={() => this.clickOnCanvas(row * 10 + col)} style={{ backgroundColor: 'grey' }}/>
            </td>
        );
    }

    // oldal kinezete
    render() {
        const {
            msg, restaurants, user, tableRows, tableColumns,
            selectedDateTables, reservationDate, selectedRestaurant,
        } = this.state;

        if (!user || !selectedRestaurant) {
            return <div>Create reservation not loaded yet...</div>;
        }

        if (restaurants.length === 0) {
            return (
                <Msg msg={'No restaurants in the database'}/>
            );
        }

        if (JSON.stringify(user) === '{}') {
            return (
                <Msg msg={'Unauthorized'}/>
            );
        }
        return (
            <>
                <Msg msg={msg}/>
                <h1>Create Reservation</h1>
                <form method="POST">
                    <label htmlFor="name">Name: {user.username} </label>
                    <input id="name" name="name" type="hidden" value={user.username}/>
                    <br/>

                    <label htmlFor="id">Choose a restaurant:</label>
                    <select id="id" name="id" onChange={this.restaurantChange}>
                        {restaurants.map((rest) => (
                            <option value={`${rest._id}`} key={rest._id}> {`${rest.name}`} </option>
                        ))}
                    </select>

                    <label htmlFor="date">Reservation date: </label>
                    <input id="date" type="date" name="date" value={reservationDate} onChange={this.changeReservationDate} required/>
                    <br/>

                    <label htmlFor="time">Reservation time: </label>
                    <input id="time" type="time" name="time" required/>
                    <br/>

                    <h2>Select a table</h2>

                    <table>
                        <tbody>
                            {tableRows.map((row) => <tr key={row}>
                                {tableColumns
                                    .map((col) => (this.renderTable(row, col, selectedDateTables)))}
                            </tr>)}
                        </tbody>
                    </table>

                    <input type="button" value="Send Reservation" onClick={this.onSubmit} />
                </form>
            </>
        );
    }
}
