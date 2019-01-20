import React from 'react';
import './SideDrawer.css';
import { Link } from 'react-router-dom';


const sideDrawer = props => {
    let drawerClasses = 'side-drawer';
    if(props.show) {
        drawerClasses = 'side-drawer open';
    }

    return (
        <nav className={drawerClasses}>
            <ul className="side-drawer-list">
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/image_panel">Images</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
                {/* <li><Link to="/posts">Posts</Link></li> */}
                <li><Link to="/todosList">Todo</Link></li>
                <li><Link to="/artwork_images">ArtWork</Link></li>
                <li><a href="/api/logout">Log out</a></li>
            </ul>
        </nav>
    )
};

export default sideDrawer;