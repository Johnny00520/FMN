import React from 'react';
import './Footer.css';
import { Link, withRouter } from 'react-router-dom';

const footerMenuItems = [
    {
        id: 1,
        defaultMessage: '© 2018 For Mother Nature All Rights Reserved'
    },
    {
        id: 2,
        defaultMessage: 'Saving Earth'
    },
    {
        id: 3,
        defaultMessage: 'Contact Us'
    }
]

const Footer = (props) => {

    const listFooterMenuItem = footerMenuItems.map((footerMenuItem) => {
        if (footerMenuItem.id === 3){
            return (
                // <li key={footerMenuItem.id.toString()} onClick={() => window.scrollTo(0, 0)}>{footerMenuItem.defaultMessage}</li>
                <li key={footerMenuItem.id.toString()}>
                    <Link to="/contact" className="linkToContact">
                        {footerMenuItem.defaultMessage}
                    </Link>
                </li>
            )
        }

        return <li key={footerMenuItem.id.toString()}>{footerMenuItem.defaultMessage}</li>
    });

    return (
        // <div className="footer">
        <div className= { props.location.pathname === "/" ? 'footer-home' : 'footer-others' }>
            {listFooterMenuItem}
        </div>
    );
};

export default withRouter(Footer);
