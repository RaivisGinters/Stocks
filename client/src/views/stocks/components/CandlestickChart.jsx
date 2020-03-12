import React, { Component } from 'react';
import ApexCharts from 'apexcharts';

const moment = require('moment');

export default class CandlestickChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chart: null,
        };
    }

    componentDidMount() {
        const { jsonData } = this.props;

        if (jsonData.length > 0) {
            this.loadChart();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { jsonData } = this.props;

        if (prevProps.jsonData !== this.props.jsonData) {
            this.loadChart();
        }
    }

    componentWillUnmount() {
        let { chart } = this.state;

        if (chart) {
            chart.destroy();
        }
    }

    loadChart() {
        const { jsonData } = this.props;
        let { chart } = this.state;
        let data = [];

        // Push empty data, just to make visual padding, so the first block could be fully visible
        data.push({
            x: "",
            y: [null, null, null, null]
        });

        for (let i = 0; i < jsonData.length; i++) {
            data.push({
                x: moment(jsonData[i].date, 'YYYY-MM-DD').format('DD.MM.YYYY'),
                y: [jsonData[i].open, jsonData[i].high, jsonData[i].low, jsonData[i].close]
            });
        }

        // Push empty data, just to make visual padding, so the last block could be fully visible
        data.push({
            x: "",
            y: [null, null, null, null]
        });

        const options = {
            chart: {
                type: 'candlestick'
            },
            stroke: {
                curve: 'smooth',
            },
            series: [{
                data,
            }],
        }

        if (chart) {
            chart.updateSeries([{
                data,
            }]);
        } else {
            chart = new ApexCharts(document.querySelector("#candlestickChart"), options);
            chart.render();
        }

        this.setState({
            chart,
        });
    }

    render() {
        const { jsonData } = this.props;
        let key = 0;

        if (jsonData.length < 1) {
            return null;
        }

        return (
            <div id="candlestickChart"></div>
        );
    }
}
