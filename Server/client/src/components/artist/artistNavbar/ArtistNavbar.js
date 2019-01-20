import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IndexLinkContainer } from 'react-router-bootstrap';
// import './CustomNavbar.css';
// import pic from '../../assets/testHome.png';

export default class CustomNavbar extends Component {
    render() {
        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">
                            For Mother Nature
                            {/* <button>
                                <img src={pic} alt="For mother nature" />
                                For mother nature
                            </button> */}
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>

                <Navbar.Collapse>
                    <Nav activeKey="1" pullRight>
                        <IndexLinkContainer to="/" activeClassName="active">
                            <NavItem eventKey={1} componentClass={Link} href="/" to="/" >
                                Home
                            </NavItem>
                        </IndexLinkContainer>
                        <IndexLinkContainer to="/shop" activeClassName="active">
                            <NavItem eventKey={2} componentClass={Link} href="/shop" to="/shop">
                                Shop
                            </NavItem>
                        </IndexLinkContainer>
                        <IndexLinkContainer to="/artists" activeClassName="active">
                            <NavItem eventKey={3} componentClass={Link} href="/artists" to="/artists">
                                Our Artists
                            </NavItem>
                        </IndexLinkContainer>
                        <IndexLinkContainer to="/environmentalOrg" activeClassName="active">
                            <NavItem eventKey={4} componentClass={Link} href="/environmentalOrg" to="/environmentalOrg">
                                Environmental Orgs
                            </NavItem>
                        </IndexLinkContainer>
                        <IndexLinkContainer to="/about" activeClassName="active">
                            <NavItem eventKey={5} componentClass={Link} href="/about" to="/about">
                                About
                            </NavItem>
                        </IndexLinkContainer>
                        <IndexLinkContainer to="/faqs" activeClassName="active">
                            <NavItem eventKey={6} componentClass={Link} href="/faqs" to="/faqs">
                                FAQs
                            </NavItem>
                        </IndexLinkContainer>
                        <IndexLinkContainer to="/contact" activeClassName="active">
                            <NavItem eventKey={7} componentClass={Link} href="/contact" to="/contact">
                                Contact
                            </NavItem>
                        </IndexLinkContainer>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}