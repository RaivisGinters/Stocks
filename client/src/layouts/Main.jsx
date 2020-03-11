import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import Stocks from '../views/stocks/index.jsx';

import Navbar from '../components/Navbar.jsx';

export default class Main extends Component {
    render() {
        const { history } = this.props;

        return (
            <div>
                <Navbar history={history} />

                <Route exact path="/" component={Stocks} />
            </div>
        );
    }
}
