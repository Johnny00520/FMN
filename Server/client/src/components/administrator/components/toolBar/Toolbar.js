import React from 'react';
import { Link } from 'react-router-dom';
import DrawerToggleButton from '../sideDrawer/DrawerToggleButton';
import './Toolbar.css';

const toolbar = props => (
    <header className="toolbar">
        <nav className="toolbar_navigation">
            <div className="toolbar_toggle-button">
                <DrawerToggleButton click={props.drawerToggleClickHandler} />
            </div>
            <div className="toolbar_logo">
                <Link to="/">FMN</Link>
            </div>
            <div className="spacer" />
            <div className="toolbar_navigation-items">
                <ul>
                    <li><Link to="/">Dashboard</Link></li>
                    <li><Link to="/users">Users</Link></li>
                    <li><Link to="/image_panel">Images</Link></li>
                    <li><Link to="/faqs">FAQs</Link></li>
                    {/* <li><Link to="/posts">Posts</Link></li> */}
                    <li><Link to="/todosList">Todo</Link></li>
                    <li><a href="/api/logout">Log out</a></li>
                </ul>
            </div>
        </nav>
    </header>
)

export default toolbar;