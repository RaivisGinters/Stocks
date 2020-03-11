import React, { Component } from 'react';

const moment = require('moment');

export default class Statistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            dateFrom: '',
            dateTo: '',
            data: {},
            jsonData: [],
            chart: null,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const { jsonData } = this.props;

        if (prevProps.jsonData !== this.props.jsonData) {
            let data = {
                'open': {
                    highest: null,
                    highestDate: null,
                    lowest: null,
                    lowestDate: null,
                },
                'high': {
                    highest: null,
                    highestDate: null,
                    lowest: null,
                    lowestDate: null,
                },
                'low': {
                    highest: null,
                    highestDate: null,
                    lowest: null,
                    lowestDate: null,
                },
                'close': {
                    highest: null,
                    highestDate: null,
                    lowest: null,
                    lowestDate: null,
                },
            }

            const keys = Object.keys(data);

            for (let i = 0; i < jsonData.length; i++) {
                for (let j = 0; j < keys.length; j++) {
                    const currentValue = jsonData[i][keys[j]];
                    const eachDate = moment(jsonData[i].date, 'YYYY-MM-DD').format('DD.MM.YYYY');
                    const eachDatavalue = data[keys[j]];

                    if (eachDatavalue.highest && eachDatavalue.lowest) {
                        if (eachDatavalue.highest < currentValue) {
                            eachDatavalue.highest = currentValue;
                            eachDatavalue.highestDate = eachDate;
                        }

                        if (eachDatavalue.lowest > currentValue) {
                            eachDatavalue.lowest = currentValue;
                            eachDatavalue.lowestDate = eachDate;
                        }
                    } else {
                        eachDatavalue.highest = currentValue;
                        eachDatavalue.highestDate = eachDate;
                        eachDatavalue.lowest = currentValue;
                        eachDatavalue.lowestDate = eachDate;
                    }
                }
            }

            this.setState({
                data,
            });
        }
    }

    calculateChanges(highest, lowest) {
        let v1 = highest - lowest;
        let v2 = (highest + lowest) / 2;
        const result = (v1 / v2) * 100;

        return `${result.toFixed(2)}%`;
    }

    render() {
        const { errors, data, jsonData } = this.state;
        let key = 0;

        if (Object.keys(data).length < 1) {
            return null;
        }

        return (
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Value</th>
                        <th scope="col">Date</th>
                        <th scope="col">Period changes</th>
                    </tr>
                </thead>

                {Object.keys(data).map((eachKey) => {
                    return (
                        <tbody key={key++}>
                            <tr>
                                <td>
                                    {eachKey} highest
                                </td>
                                <td className="text-success">
                                    {data[eachKey].highest}
                                </td>
                                <td className="text-success">
                                    {data[eachKey].highestDate}
                                </td>
                                <td rowSpan="2" className="rowspan">{this.calculateChanges(data[eachKey].highest, data[eachKey].lowest)}</td>
                            </tr>
                            <tr>
                                <td>
                                    {eachKey} lowest
                                </td>
                                <td className="text-danger">
                                    {data[eachKey].lowest}
                                </td>
                                <td className="text-danger">
                                    {data[eachKey].lowestDate}
                                </td>
                            </tr>
                        </tbody>
                        )
                    }
                )}
            </table>
        );
    }
}
