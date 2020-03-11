import React, { Component } from 'react';
import ApexCharts from 'apexcharts';

import Chart from './components/Chart.jsx';
import Statistics from './components/Statistics.jsx';
import Table from './components/Table.jsx';

const moment = require('moment');

export default class Stocks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            loading: false,
            dateFrom: '',
            dateTo: '',
            jsonData: [],
        };

        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        window.$('.datepicker').datepicker({
            orientation: "bottom left",
            format: 'dd.mm.yyyy',
            autoclose: true,
            weekStart: 1,
            startDate: moment().subtract(4, 'years').format('DD.MM.YYYY'),
            endDate: moment().format('DD.MM.YYYY'),
        }).on('changeDate', (event) => {
            const { name, value } = event.target;

            this.setState({
                [name]: value,
            });
        });
    }

    getRandomRgb() {
        const num = Math.round(0xffffff * Math.random());
        const r = num >> 16;
        let g = num >> 12;
        g = g & 255;
        const b = num & 255;

        return `rgba(${r}, ${g}, ${b}, 0.15)`;
    }

    fetchData(event) {
        event.preventDefault();

        let { dateFrom, dateTo, chart } = this.state;

        let errors = [];

        if (!dateFrom) {
            errors.push('Date from is mandatory field');
        } else {
            dateFrom = moment(dateFrom, 'DD.MM.YYYY').format('YYYY-MM-DD');
        }

        if (!dateTo) {
            errors.push('Date to is mandatory field');
        } else {
            dateTo = moment(dateTo, 'DD.MM.YYYY').format('YYYY-MM-DD');
        }

        if (dateFrom && dateTo && dateFrom > dateTo) {
            errors.push('Date from must be greater or same as Date to');
            this.setState({
                errors,
            });

            return;
        }

        if (errors.length > 0) {
            this.setState({
                errors,
            });

            return;
        }

        this.setState({
            loading: true,
            errors: false,
        });

        fetch(`/request-data?dateFrom=${dateFrom}&dateTo=${dateTo}`)
        .then(res => res.json())
        .then(jsonResponse => {
            const jsonData = JSON.parse(jsonResponse.content);

            if (jsonData.length < 1) {
                this.setState({
                    errors: [`No data found from ${moment(dateFrom, 'YYYY-MM-DD').format('DD.MM.YYYY')} to ${moment(dateTo, 'YYYY-MM-DD').format('DD.MM.YYYY')}`],
                    loading: false,
                });
                return;
            }

            this.setState({
                jsonData,
                chart,
                loading: false,
            });
        }).catch(error => {
            this.setState({
                errors: ['API service is unavailable'],
                loading: false,
            });
        });
    }

    render() {
        const { loading, errors, data, jsonData } = this.state;
        let key = 0;

        return (
            <div className="container-fluid">
                <h1>Chart</h1>

                <form className="row" onSubmit={this.fetchData}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 col-md-4 col-lg-4 col-xl-3">
                                <div className="form-group">
                                    <label htmlFor="dateFrom">Company</label>
                                    <select className="form-control">
                                        <option value="AAPL.US">Apple Inc</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-4 col-lg-4 col-xl-3">
                        <div className="form-group">
                            <label htmlFor="dateFrom">Date from</label>
                            <input type="text" name="dateFrom" className="form-control datepicker" autoComplete="off" />
                        </div>
                    </div>

                    <div className="col-12 col-md-4 col-lg-4 col-xl-3">
                        <div className="form-group">
                            <label htmlFor="dateTo">Date to</label>
                            <input type="text" name="dateTo" className="form-control datepicker" autoComplete="off" />
                        </div>
                    </div>

                    <div className="col-12">
                        {errors.length > 0 ? (
                                <div className="alert alert-danger" role="alert">
                                    <ul>
                                        {errors.map((each) =>
                                            <li key={key++}>{each}</li>
                                        )}
                                    </ul>
                                </div>
                            )
                            : null
                        }
                    </div>

                    <div className="col-12">
                        {loading
                            ? (
                                <button type="button" className="btn btn-primary" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </button>
                            )
                            : <button type="submit" className="btn btn-primary">Request data</button>
                        }
                    </div>
                </form>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-xl-8">
                            <Chart jsonData={jsonData} />
                        </div>
                        <div className="col-12 col-xl-4">
                            <Statistics jsonData={jsonData} />
                        </div>
                    </div>
                </div>

                <div className="container-fluid">
                    <Table jsonData={jsonData} />
                </div>
            </div>
        );
    }
}
