import React from 'react';
import './sideDrawer.css';
import { Link } from 'react-router-dom';

const sideDrawer = props => {
    let drawerClasses = 'side-drawer';
    if(props.show) {
        drawerClasses = 'side-drawer open';
    }

    return (
        <nav className={drawerClasses}>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/artists">Artists</Link></li>
                <li><Link to="/environmentalOrg">Environmental Organizations</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
                <li><Link to="/faqs">Blogs</Link></li>
                <li><Link to="/user/login">Login</Link></li>
            </ul>
        </nav>
    )
}

export default sideDrawer;