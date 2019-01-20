import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchExistingUsers } from '../../actions/usersListCRUD';
import OurArtistList from './OurArtistsList';
import OurArtistContent from './OurArtistsContent';
import './common.css';

class OurArtist extends Component {

    componentDidMount() {
        this.props.fetchExistingUsers();
    }

    render() {
        let artistsArray = [];
        this.props.artists.forEach(user => {
            if(user.isArtist) {
                artistsArray.push(user);
            }
        })

        return(
            <div>
                <div className="our-artists-page">
                    <div className="our-artists-container">
                        <div className="ui blue ribbon label">
                            <i className="users icon"></i>Artist Stores
                        </div>

                        <p className="our-artists-title-description">
                        These are the stores of artists who are committed to saveing nature. You will find wonderful, amazing, and fun
                        homemade items for sale at these store. The artists contribute a portion of their sale proceeds to their favorite
                        environmental nonprofit. Their donations are based on the sale price of each item not including tax or shipping.
                        Through their art they support projects and preserve wildlife and wide places.</p>

                        <div className="our-artist-subcontainer"> 
                            <div className="our-artist-list-container">
                                <div className="our-artist-list">
                                    <div className="ui list">
                                        {artistsArray.map(artist => 
                                            <OurArtistList 
                                                artist={artist} 
                                                key={artist._id} 
                                            />)}
                                    </div>
                                </div>
                            </div>


                            <div className="artist-list-content">
                                {artistsArray.map(artist => 
                                    <OurArtistContent 
                                        artist={artist} 
                                        key={artist._id} 
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    // console.log("user", state.user)
    // console.log("state in OurArtist: ", state.users)
    return {
        artists: state.users
    }
}

export default connect(mapStateToProps, { fetchExistingUsers })(OurArtist)