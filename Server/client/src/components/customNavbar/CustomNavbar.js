import React from 'react';
import NavbarToggleButton from './navbarToggleButton/navbarToggleButton';
import { Link } from 'react-router-dom';
import './CustomNavbar.css';
import { withRouter } from 'react-router-dom';


const navPaths = [
    {
        path: '/',
        main: 'Home'
    },
    {
        path: '/artists',
        main: "Our Artists"
    },
    {
        path: '/enviromentalOrgs',
        main: "Environmental Organizations"
    },
    {
        path: '/faqs',
        main: "FAQs"
    },
    {
        path: '/blogs',
        main: "Blogs"
    },
    {
        path: '/user/login',
        main: "Login"
    }
]

    
const CustomNavbar = props => {
    // debugger
    return (
        <header className= { props.location.pathname === "/" 
                            || props.location.pathname === "/user/login" 
                            // || props.location.pathname === "/faqs"
                            ? 'navbar' : "navbar-black"}
        >
            <nav className={props.scrollYvalue > 761 || props.scrollYvalue > 568 ? 'navbar-navigation-change' : 'navbar-navigation'}>
                
                <div className="navbar-logo">
                    <Link to="/">
                        For Mother Nature
                    </Link>

                </div>
                {/* spacer separate logo and navigation */}
                <div className="spacer" />
                <div className="navbar-navigation-items">
                    <ul>
                        {navPaths.map((navPath) => (
                            <li key={navPath.path}>
                                <Link to={navPath.path} >{navPath.main}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="navbar-toggle-button">
                    <NavbarToggleButton click={props.drawerClickHandler}/>
                </div>
            </nav>
        </header>
    )
}

export default withRouter(CustomNavbar);