import React, { Component } from 'react';
import ApexCharts from 'apexcharts';

const moment = require('moment');

export default class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            chart: null,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const { jsonData } = this.props;

        if (prevProps.jsonData !== this.props.jsonData) {
            let { chart } = this.state;
            let data = [];

            for (let i = 0; i < jsonData.length; i++) {
                data.push({
                    x: moment(jsonData[i].date, 'YYYY-MM-DD').format('DD.MM.YYYY'),
                    y: [jsonData[i].open, jsonData[i].high, jsonData[i].low, jsonData[i].close]
                });
            }

            if (chart) {
                chart.updateSeries([{
                    data,
                }]);
            } else {
                var options = {
                    chart: {
                        type: 'candlestick'
                    },
                    series: [{
                        data,
                    }],
                }

                chart = new ApexCharts(document.querySelector("#myChart"), options);
                chart.render();
            }

            this.setState({
                chart,
            });
        }
    }

    render() {
        const { errors} = this.state;
        const { jsonData } = this.props;
        let key = 0;

        if (errors.length > 0) {
            return (
                <div className="alert alert-danger" role="alert">
                    <ul>
                        {errors.map((each) =>
                            <li key={key++}>{each}</li>
                        )}
                    </ul>
                </div>
            )
        }

        if (jsonData.length < 1) {
            return null;
        }

        return (
            <div id="myChart"></div>
        );
    }
}
