import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Login from './views/Login.jsx';
import Main from './layouts/Main.jsx';

import authorized from './withAuth';

export default class App extends Component {
    render() {
        return (
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/" component={authorized(Main)} />
            </Switch>
        );
    }
}
