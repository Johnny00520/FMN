import React from 'react';
import { Link } from 'react-router-dom';

export default function UsersCard({ user, deleteUser }) {
    // debugger
    return ( 
        <div className="ui card">
            <div className="image">
                {/* <img src={user.cover} alt="user cover" /> */}
            </div>
            <div className="content">
                <div className="header">{user.title}</div>
                <div className="header">First Name: {user.givenName}</div>
                <div className="header">Last Name: {user.familyName}</div>
                <div className="header">Full name: {user.displayName}</div>
                <div className="header">Email: {user.email}</div>
                <div className="header">Status: {user.contributor}</div>
            </div>
            <div className="extra content">
                <div className="ui basic button">
                    <Link to={`/user/${user._id}`} className="ui basic button green">Edit</Link>
                    <div className="ui basic button red" onClick={() => deleteUser(user._id)} >Delete</div>
                </div>
            </div>
        </div>
    );
}


