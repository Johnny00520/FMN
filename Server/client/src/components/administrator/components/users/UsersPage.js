import React, { Component } from 'react';
import UsersNav from './UsersNav';
import UsersForm from './UsersForm';
import UsersExist from './UsersExist';

import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

const routes = [
    {
        path: '/users/existingUser',
        exact: true,
        main: () => <UsersExist />
    },
    {
        path: '/users/AddNewUsers',
        exact: true,
        main: () => <UsersForm />
    },
    {
        path: '/user/:_id',
        exact: true,
        main:((routerProps) => <UsersForm paramsMatch={routerProps.match.params._id} />)
    }
]

class UsersPage extends Component {

    render() {

        return(
            <Router>
                <div className="users-page">
                    <UsersNav />

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
        );
    }
}

export default UsersPage;

