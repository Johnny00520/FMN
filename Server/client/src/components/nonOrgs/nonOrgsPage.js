import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchExistingNonOrgs } from '../../actions/nonOrgImageCRUD';
import { fetchExistingArtists } from '../../actions/artistImageCRUD';
import NonOrgsList from './nonOrgsList';
import NonOrgsContent from './nonOrgsContent';
import './common.css';

export class nonOrgsPage extends Component {

    componentDidMount = () => {
        this.props.fetchExistingNonOrgs();
        this.props.fetchExistingArtists();
    }

    render() {
        return (
            <div>
                <div className="nonOrgs-page">
                    <div className="nonOrgs-page-container">
                        <div className="ui blue ribbon label">
                            <i className="users icon"></i>Non Profit Organizations
                        </div>

                        <p className="nonOrgs-title-description">
                        These are the stores of artists who are committed to saveing nature. You will find wonderful, amazing, and fun
                        homemade items for sale at these store. The artists contribute a portion of their sale proceeds to their favorite
                        environmental nonprofit. Their donations are based on the sale price of each item not including tax or shipping.
                        Through their art they support projects and preserve wildlife and wide places.</p>

                        <div className="nonOrgs-sub-container">
                            <div className="nonOrgs-list-container">
                                <div className="nonOrgs-list">
                                    <div className="ui list">
                                        <NonOrgsList nonOrgs={this.props.nonOrgs}/>
                                    </div>
                                </div>
                            </div>

                            <div className="nonOrgs-list-content-container">
                                <div className="nonOrgs-list-content">
                                    <NonOrgsContent 
                                        nonOrgs={this.props.nonOrgs} 
                                        artists={this.props.artists}/>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

nonOrgsPage.propTypes = {
    nonOrgs: PropTypes.array.isRequired
}

const mapStateToProps = (state) => {
    // debugger
    return {
        nonOrgs: state.nonOrgsImages,
        artists: state.artistsAndartworksImages
    }
}

export default connect(mapStateToProps, { 
    fetchExistingNonOrgs,
    fetchExistingArtists
})(nonOrgsPage)