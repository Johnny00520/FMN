import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    searchPeople,
    fetchExistingUsers,
    usersListSelectSort
} from '../../../../actions/usersListCRUD';

class UsersSearchBar extends Component {
    state = {
        searchTerm: '',
        errors: {},
        checked: false,
        sortSelection: ''
    }

    onInputChange = (e) => {
        this.setState({ searchTerm: e.target.value }, () => {
            if(this.state.searchTerm.length > 0) {
                this.props.searchPeople(this.state.searchTerm.trim().toLowerCase());
            } else {
                this.props.fetchExistingUsers();
            }
        });
    }

    onSelectionChange = (e) => {
        const { value } = e.target
        this.setState({ sortSelection: value });
        this.props.usersListSelectSort(value);
    }

    render() {
        return (
            <div style={{ textAlign: 'center', height: '50%' }}>
                <div className="ui right action left icon input" style={{width: '85%'}}>
                    <i className="search icon" style={{ height: '90%'}}></i>

                    <input 
                        type="text" 
                        placeholder="Search first name..."
                        onChange={this.onInputChange}
                        className="search-input-field"
                    />

                    <div className="ui form">
                        <div className="inline fields">
                            <div className="field">
                                <select
                                    className="ui dropdown" 
                                    value={this.state.sortSelection} 
                                    onChange={this.onSelectionChange}
                                >
                                    <option value="">Sort By Time</option>
                                    <option value="aescending">Aescending</option>
                                    <option value="descending">Descending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                {!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
}

export default connect(mapStateToProps, {
    searchPeople,
    fetchExistingUsers,
    usersListSelectSort
    }
)(UsersSearchBar);
