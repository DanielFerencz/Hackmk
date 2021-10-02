import React from 'react';
import autoBind from 'auto-bind';
import Restaurant from './Restaurant.jsx';
import Msg from '../other/Msg.jsx';
import { findAllRestaurants } from '../../service/restaurant.js';

// Az osszes vendeglo listazasa
export default class Restaurants extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurants: null,
            msg: '',
            nameFilter: '',
            cityFilter: '',
            cityDict: {},
        };
        autoBind(this);
    }

    // Adatok betoltese
    async componentDidMount() {
        const restaurants = await findAllRestaurants();
        this.setState({ restaurants });
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
        const { restaurants } = this.state;
        const filteredRestaurants = restaurants
            .filter((rest) => (rest.name.toLowerCase().includes(nameFilter.toLowerCase())));
        filteredRestaurants.forEach((rest) => {
            dict[rest.city] = 0;
        });
        filteredRestaurants.forEach((rest) => {
            dict[rest.city] += 1;
        });
        this.setState({ cityDict: dict });
    }

    // Oldal betoltese
    render() {
        const { nameFilter, cityFilter, cityDict } = this.state;
        const { restaurants } = this.state;

        if (!restaurants) {
            return <div>Restaurants not loaded yet...</div>;
        }

        const filteredRestaurants = restaurants
            .filter((rest) => (rest.name.toLowerCase().includes(nameFilter.toLowerCase())
            && (rest.city === cityFilter || cityFilter === '')));

        if (filteredRestaurants.length === 0) {
            return (
                <>
                    <Msg msg={this.state.msg} />
                    <h1>Restaurants</h1>
                    <input type="text" placeholder="Search.." value={nameFilter} onChange={this.onChange}></input>
                    <label htmlFor="city">Choose a city:</label>
                    <select id="city" name="city" onChange={this.cityChange}>
                        <option value="" key="none"> Show every city </option>
                        {Object.keys(cityDict).map((key) => (
                            <option value={`${key}`} key={key}> {`${key} (${cityDict[key]})`} </option>
                        ))}
                    </select>
                    <div id="container">
                        <div className="restaurant">
                                No restaurants in the database.
                        </div>
                    </div>
                </>
            );
        }
        return (
            <>
                <Msg msg={this.state.msg} />
                <h1>Restaurants</h1>
                <input type="text" placeholder="Search.." value={nameFilter} onChange={this.onChange} ></input>
                <label htmlFor="city">Choose a city:</label>
                <select id="city" name="city" onChange={this.cityChange}>
                    <option value="" key="none"> Show every city </option>
                    {Object.keys(cityDict).map((key) => (
                        <option value={`${key}`} key={key}> {`${key} (${cityDict[key]})`} </option>
                    ))}
                </select>
                <div id="container">
                    {filteredRestaurants.map((rest) => (
                        <Restaurant rest={rest} key={rest._id}/>
                    ))}
                </div>
            </>
        );
    }
}
