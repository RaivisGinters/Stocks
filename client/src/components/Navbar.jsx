import React, { Component } from 'react';

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            routes: [
                {
                    href: '/',
                    name: 'Chart',
                    icon: 'fas fa-chart-area',
                }
            ],
            activeRoute: 'Chart',
        };

        this.logout = this.logout.bind(this);
    }

    logout(event) {
        event.preventDefault();

        fetch('/logout', {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(jsonResponse => {
            this.props.history.push("/login");
        })
        .catch(error => {
            this.setState({
                error: error.toString(),
                loading: false,
            });
        });
    }

    render() {
        const { activeRoute, routes } = this.state;

        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/">Navbar</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        {routes.map((each) =>
                            <li key={each.name} className={each.name === activeRoute ? "nav-item active" : "nav-item"}>
                                <a className="nav-link" href={each.route}>
                                    {each.name}
                                </a>
                            </li>
                        )}
                    </ul>

                    <form className="form-inline my-2 my-lg-0" onSubmit={this.logout}>
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Log out</button>
                    </form>
                </div>
            </nav>
        );
    }
}
