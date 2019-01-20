import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import ImagesList from './ImagesList';
import AdminImageForm from './adminsImage/AdminImageForm';
import ArtistsImageForm from './artistsImage/ArtistsImageForm';
import NonOrgsImageForm from './nonOrgsImage/NonOrgsImageForm';

import { fetchExistingAdmins } from '../../../../actions/adminImageCRUD';
import { fetchExistingNonOrgs } from '../../../../actions/nonOrgImageCRUD';
import { fetchExistingArtists } from '../../../../actions/artistImageCRUD';

import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

const ImagePanelNav = props => (
    <div>
        <div className="ui container">
            <div className="ui four item menu">
                <NavLink 
                    className="item" 
                    activeClassName="active" 
                    to="/image_panel/allImagesList"
                >
                    All Images List
                </NavLink>
                <NavLink 
                    className="item" 
                    activeClassName="active" 
                    to="/image_panel/editAdminImage"
                >
                    Edit/Add Admin Info
                </NavLink>
                <NavLink 
                    className="item" 
                    activeClassName="active" 
                    to="/image_panel/editArtists"
                >
                    Edit/Add Artist Info
                </NavLink>
                <NavLink 
                    className="item" 
                    activeClassName="active" 
                    to="/image_panel/editNonOrgs"
                >
                    Edit/Add Organization Info
                </NavLink>
            </div>
        </div>
    </div>
)

const routes = [
    { path: '/image_panel/artWorksList', exact: true },
    { path: '/image_panel/addNewArtWorks', exact: true },

    { path: '/image_panel/allImagesList', exact: true, main: () => <ImagesList /> },

    { path: '/image_panel/editAdminImage', exact: true, main: () => <AdminImageForm /> },
    { path: '/image_panel/editAdminImage/:_id', exact: true, main: (routerProps) => <AdminImageForm params={routerProps.match.params._id} /> },

    { path: '/image_panel/editNonOrgs', exact: true, main: () => <NonOrgsImageForm /> },
    { path: '/image_panel/editNonOrgs/:_id', exact: true, main: (routerProps) => <NonOrgsImageForm params={routerProps.match.params._id} /> },

    { path: '/image_panel/editArtists', exact: true, main: () => <ArtistsImageForm /> },
    { path: '/image_panel/editArtists/:_id', exact: true, main: (routerProps) => <ArtistsImageForm params={routerProps.match.params._id} />}
]

class ImagePanelPage extends Component {

    componentDidMount() {
        this.props.fetchExistingAdmins();
        this.props.fetchExistingNonOrgs();
        this.props.fetchExistingArtists();
    }

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <h1 style={{ textAlign: 'center', paddingTop: '3rem' }}>
                        Image Panel
                        </h1>
                        <ImagePanelNav />

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
        )
    }
}

ImagePanelPage.propTypes = {
    fetchExistingAdmins: PropTypes.func.isRequired,
    fetchExistingNonOrgs: PropTypes.func.isRequired,
    fetchExistingArtists: PropTypes.func.isRequired
}

export default connect(null, { 
    fetchExistingAdmins,
    fetchExistingNonOrgs,
    fetchExistingArtists
})(ImagePanelPage)

