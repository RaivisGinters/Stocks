import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            username : '',
            password: '',
            error: '',
            loggingIn: true,
            authorized: false,
        };

        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {
        fetch('/api/checkToken', {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(jsonResponse => {
            if (jsonResponse.status === 'success') {
                this.setState({
                    loggingIn: false,
                    authorized: true,
                })
            } else {
                this.setState({
                    loggingIn: false,
                    authorized: false,
                })
            }
        })
        .catch(err => {
            this.setState({
                error: err.toString(),
                loggingIn: false,
                authorized: false,
            });
        });
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;

        this.setState({
            [name]: value
        });
    }

    submitForm(event){
        event.preventDefault();
        const { username, password } = this.state;

        this.setState({
            loading: true,
        });

        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
        })
        .then(res => res.json())
        .then(jsonResponse => {
            if (jsonResponse.status === 'success') {
                this.setState({
                    loggingIn: false,
                    authorized: true,
                });
            } else {
                this.setState({
                    loggingIn: false,
                    authorized: false,
                    error: jsonResponse.content,
                    loading: false,
                });
            }
        })
        .catch(err => {
            this.setState({
                error: 'API service is unavailable',
                loggingIn: false,
                authorized: false,
                loading: false,
            });
        });
    }

    render() {
        const { loading, error, authorized, loggingIn } = this.state;

        if (loggingIn) {
            return (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Ielāde...</span>
                    </div>
                </div>
            )
        }

        if (authorized) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container">
                <form onSubmit={this.submitForm} className="row justify-content-center">
                        <div className="col-12 col-sm-7">
                            <h1>Login Below!</h1>
                        </div>
                        <div className="col-12 col-sm-7">
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="username"
                                    className="form-control"
                                    name="username"
                                    placeholder="Enter username"
                                    value={this.state.username}
                                    onChange={this.handleInputChange}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-12 col-sm-7">
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Enter password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12 col-sm-7">
                            {error
                                ? (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )
                                : null
                            }

                            {loading
                                ? (
                                    <button type="button" className="btn btn-primary" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    </button>
                                )
                                : <button type="submit" className="btn btn-primary">Log in</button>
                            }
                        </div>
                </form>
            </div>
        );
    }
}
