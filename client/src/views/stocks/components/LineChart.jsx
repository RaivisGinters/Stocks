import React, { Component } from 'react';
import ApexCharts from 'apexcharts';

const moment = require('moment');

export default class LineChart extends Component {
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
        let lineData = [];
        let columnData = [];

        for (let i = 0; i < jsonData.length; i++) {
            lineData.push({
                x: moment(jsonData[i].date, 'YYYY-MM-DD').format('DD.MM.YYYY'),
                y: jsonData[i].close
            });

            columnData.push({
                x: moment(jsonData[i].date, 'YYYY-MM-DD').format('DD.MM.YYYY'),
                y: jsonData[i].open
            });
        }

        const options = {
            chart: {
                type: 'line'
            },
            series: [
                {
                    type: 'line',
                    name: 'close',
                    data: lineData,
                },
                {
                    type: 'column',
                    name: 'open',
                    data: columnData,
                }
            ],
        }

        if (chart) {
            chart.updateSeries([
                {
                    type: 'line',
                    name: 'close',
                    data: lineData,
                },
                {
                    type: 'column',
                    name: 'open',
                    data: columnData,
                }
            ]);
        } else {
            chart = new ApexCharts(document.querySelector("#lineChart"), options);
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
            <div id="lineChart"></div>
        );
    }
}
