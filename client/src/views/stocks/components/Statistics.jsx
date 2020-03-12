import React, { Component } from 'react';

const moment = require('moment');

export default class Statistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
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
                    start: null,
                    end: null,
                },
                'high': {
                    highest: null,
                    highestDate: null,
                    lowest: null,
                    lowestDate: null,
                    start: null,
                    end: null,
                },
                'low': {
                    highest: null,
                    highestDate: null,
                    lowest: null,
                    lowestDate: null,
                    start: null,
                    end: null,
                },
                'close': {
                    highest: null,
                    highestDate: null,
                    lowest: null,
                    lowestDate: null,
                    start: null,
                    end: null,
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

                    if (i === 0) {
                        eachDatavalue.start = currentValue;
                        eachDatavalue.startDate = eachDate;
                    }

                    if (i + 1 === jsonData.length) {
                        eachDatavalue.end = currentValue;
                        eachDatavalue.endDate = eachDate;
                    }
                }
            }

            this.setState({
                data,
            });
        }
    }

    calculateChanges(start, end) {
        const v1 = end - start;
        const v2 = (end + start) / 2;
        const v3 = (v1 / v2) * 100;
        const result = v3.toFixed(2);

        if (start < end) {
            return (
                <p className="text-success">{`${result}%`}</p>
            )
        } else {
            return (
                <p className="text-danger">{`${result}%`}</p>
            )
        }
    }

    render() {
        const { errors, data, jsonData } = this.state;
        let key = 0;

        if (Object.keys(data).length < 1) {
            return null;
        }

        return (
            <div className="table-responsive">
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
                                        {eachKey} start
                                    </td>
                                    <td className="text-success">
                                        {data[eachKey].start}
                                    </td>
                                    <td className="text-success">
                                        {data[eachKey].startDate}
                                    </td>
                                    <td rowSpan="2" className="rowspan">{this.calculateChanges(data[eachKey].start, data[eachKey].end)}</td>
                                </tr>
                                <tr>
                                    <td>
                                        {eachKey} end
                                    </td>
                                    <td className="text-danger">
                                        {data[eachKey].end}
                                    </td>
                                    <td className="text-danger">
                                        {data[eachKey].endDate}
                                    </td>
                                </tr>
                            </tbody>
                        )
                    })}
                </table>
            </div>
        );
    }
}
