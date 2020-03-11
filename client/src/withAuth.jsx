import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default function withAuth(ComponentToProtect) {
    return class extends Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                authorized: false,
                error: '',
            };
        }

        componentDidMount() {
            fetch('/checkToken', {
                credentials: 'include',
            })
            .then(res => res.json())
            .then(jsonResponse => {
                if (jsonResponse.status === 'success') {
                    this.setState({
                        loggingIn: false,
                        loading: false,
                        authorized: true,
                    })
                } else {
                    this.setState({
                        loggingIn: false,
                        loading: false,
                        authorized: false,
                    })
                }
            })
            .catch(err => {
                this.setState({
                    error: 'API service is unavailable',
                    loggingIn: false,
                    loading: false,
                    authorized: false,
                });
            });
        }

        render() {
            const { loading, error, authorized } = this.state;

            if (loading) {
                return (
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                )
            }

            if (error) {
                return (
                    <div className="container">
                        <div className="alert alert-danger" role="alert">
                            <p>{error}</p>
                        </div>
                    </div>
                )
            }

            if (!authorized) {
                return <Redirect to="/login" />;
            }

            return <ComponentToProtect {...this.props} />;
        }
    }
}
