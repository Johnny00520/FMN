import React from 'react';
// import PropTypes from 'prop-types';
// import UsersCard from './UsersCard';
import UsersListTable from './UsersListTable';
import UsersSearchBar from './UsersSearch';
import { Table } from 'react-bootstrap';
import './common.css';


const UsersList = ({ users, deleteUser }) => {
    const emptyMessages = ( 
        <p> There is no users in the collection</p>
    )
    // debugger
    const A_UsersList = (
        <div className="table-page">
            <UsersSearchBar />

            <div className="table-container">
                <Table responsive striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Date Created</th>
                            <th>Website</th>
                            <th>Other Links</th>
                            <th colSpan="2">Pleage 1</th>
                            <th colSpan="2">Pleage 2</th>
                            <th colSpan="2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.map(user => <UsersListTable user={user} key={user._id} deleteUser={deleteUser} />)}
                    </tbody>
                </Table>
            </div>
        </div>
    )

    return (
        <div className="userList-page">
            {users.length === 0 ? emptyMessages : A_UsersList}
        </div>
    );
};


export default UsersList;