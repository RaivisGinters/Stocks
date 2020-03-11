import React, { Component } from 'react';

export default class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: [],
            data: null,
            sortBy: {
                key: 'date',
                type: 'up',
            }
        };

        this.sortData = this.sortData.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        const { jsonData } = this.props;

        if (jsonData != prevProps.jsonData) {
            this.setState({
                data: jsonData,
                sortBy: {
                    key: 'date',
                    type: 'up',
                },
            });
        }
    }

    sortData(key) {
        let { data, sortBy } = this.state;

        if (sortBy.type === 'up' && sortBy.key === key) {
            if (key === 'date') {
                data = data.sort((a, b) => b.date.localeCompare(a.date));
            } else {
                data = data.sort(function(a, b) {
                    return b[key] - a[key];
                });
            }

            sortBy.type = 'down';
            sortBy.key = key;
        } else if (sortBy.type === 'down' && sortBy.key !== key) {
            if (key === 'date') {
                data = data.sort((a, b) => b.date.localeCompare(a.date));
            } else {
                data = data.sort(function(a, b) {
                    return b[key] - a[key];
                });
            }

            sortBy.type = 'down';
            sortBy.key = key;
        } else {
            if (key === 'date') {
                data = data.sort((a, b) => a.date.localeCompare(b.date));
            } else {
                data = data.sort(function(a, b) {
                    return a[key] - b[key];
                });
            }

            sortBy.type = 'up';
            sortBy.key = key;
        }

        this.setState({
            data,
            sortBy,
        });
    }

    render() {
        const { data, sortBy } = this.state;
        let key = 0;

        if (!data) {
            return null;
        }

        return (
            <div className="table-responsive">
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            {data.length > 0 && Object.keys(data[0]).map((each) => {
                                return (
                                    <th key={key++} scope="col" className="sort" onClick={() => this.sortData(each)}>
                                        {each}
                                        {sortBy.key === each ? <i className={`sort-icon fas fa-sort-${sortBy.type}`}></i> : null}
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((each) => {
                            return (
                                <tr key={key++}>
                                    {Object.keys(each).map((eachKey) => {
                                        return (
                                            <td key={key++}>{each[eachKey]}</td>
                                        )
                                    }
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}
