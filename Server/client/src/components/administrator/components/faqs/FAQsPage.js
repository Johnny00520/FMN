import React from 'react';
import FAQsForm from './FAQsForm';
import { NavLink } from 'react-router-dom';
import FAQsExisting from './FAQsExisting';
import './common.css';

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

const FaqsNav = (props) => {
    return (
        <div>
            <div className="ui container">
                <div className="ui two item menu">
                    <NavLink 
                        className="item" 
                        activeClassName="active" 
                        to="/faqs/currentList"
                    >
                        FAQs List
                    </NavLink>
                    <NavLink 
                        className="item" 
                        activeClassName="active" 
                        to="/faqs/addNewFAQ"
                    >
                        Add New FAQ
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

const routes = [ 
    { path: '/faqs/currentList', exact: true, main: () => <FAQsExisting />},
    { path: '/faqs/addNewFAQ', exact: true, main: () => <FAQsForm />},
    { path: '/faqs/addNewFAQ/:_id', exact: true, main: (routerProps) => <FAQsForm params={routerProps.match.params._id}/>},

]

const FAQsPage = () => (
    <Router>
        <div className="faqs-page">
            <h1>FAQs page</h1>
            <FaqsNav />

            {routes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                    component={route.main}
                >    
                </Route>
            ))}
        </div>
    </Router>
)

export default FAQsPage;
