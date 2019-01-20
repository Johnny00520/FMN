import React from 'react';
import { NavLink } from 'react-router-dom';
import './common.css';

const UsersNav = props => (
    <div className="navbar-container">
        <div className="ui container">
            <div className="ui two item menu">
                
                <NavLink 
                    className="item" 
                    activeClassName="active" 
                    to="/users/existingUser"
                >
                    User List
                </NavLink>
                <NavLink 
                    className="item" 
                    activeClassName="active" 
                    to="/users/AddNewUsers"
                >
                    Add New User
                </NavLink>
            </div>
        </div>
    </div>
)

export default UsersNav;