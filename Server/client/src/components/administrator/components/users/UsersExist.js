import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import UsersList from './UsersList';
import * as actions from '../../../../actions/usersListCRUD';
import './common.css';

class UsersExist extends Component {

    componentDidMount() {
        this.props.fetchExistingUsers();
    }

    render() {
        return(
            <div className="users-exits-container">
                <h1 style={{ textAlign: 'center' }}>Users List</h1>
                <UsersList users={this.props.usersList} deleteUser={this.props.deleteUser} />
            </div>
        )
    }
}

UsersExist.propTypes = {
    fetchExistingUsers: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
    return {
        usersList: state.users
    }
}

export default connect(mapStateToProps, actions)(UsersExist);