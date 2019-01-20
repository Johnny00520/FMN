import React, { Component } from 'react';
import Contact from './contact/Contact';
import ArtistNavbar from './artistNavbar/ArtistNavbar';

import {
    BrowserRouter as Router,
    Route,
    // Link
} from 'react-router-dom';

const routes = [
    {
        path: '/',
        exact: true,
        // main: () => <Home />
    },
    {
        path: '/shop'
        // main: () => <Shop />
    },
    {
        path: '/artists',
        // main: () => <Artists />
    },
    {
        path: '/contact',
        main: () => <Contact />
    }
]

class ArtistApp extends Component {
    render() {
        return (
            <div className="artist-app">
                <Router>
                    <div>
                        <ArtistNavbar />
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
            </div>
        );
    }
}

export default ArtistApp;