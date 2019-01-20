import React, { Component } from 'react';
import Toolbar from './components/toolBar/Toolbar';
import SideDrawer from './components/sideDrawer/SideDrawer';
import BackDrop from './components/backDrop/BackDrop';
import UsersPage from './components/users/UsersPage';
import TodosPage from './components/todos/TodosPage';
import FAQsPage from './components/faqs/FAQsPage';
import ImagePanelPage from './components/imagePanel/ImagePanelPage';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <div>Dashboard!</div>
    },
    {
        path: '/users',
        exact: true,
        main: () => <UsersPage />
    },
    {
        path: '/faqs',
        main: () => <FAQsPage />
    },
    {
        path: '/todosList',
        exact: true,
        main: () => <TodosPage />
    },
    {
        path: '/image_panel',
        main: () => <ImagePanelPage />
    }
]


class AdminApp extends Component {
    state = {
        sideDrawerOpen: false
    };

    drawerToggleClickHandler = () => {
        this.setState((prevState) => {
            return { sideDrawerOpen: !prevState.sideDrawerOpen };
        });
    };

    backdropClickHanlder = () => {
        this.setState({ sideDrawerOpen: false })
    }

    render() {

        let backDrop;

        if(this.state.sideDrawerOpen) {
            backDrop = <BackDrop click={this.backdropClickHanlder} />
        }

        return (
            <div className="admin-App" style={{ height: '100%'}}>
                <Router>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <Toolbar drawerToggleClickHandler={this.drawerToggleClickHandler} />
                        <SideDrawer show={this.state.sideDrawerOpen} />
                        {backDrop}

                        <main style={{ marginTop: '64px', width: '100%', height: '100%' }}>
                            {routes.map((route) => (
                                <Route 
                                    key={route.path}
                                    path={route.path}
                                    exact={route.exact}
                                    component={route.main}
                                >
                                </Route>
                            ))}
                        </main>
                    </div>
                </Router>
            </div>
        );
    }
}

export default AdminApp;
