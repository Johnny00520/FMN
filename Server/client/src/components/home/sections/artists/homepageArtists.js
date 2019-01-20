import React, { Component } from 'react';
import './homepageArtists.css';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchExistingArtists } from '../../../../actions/artistImageCRUD';
import ArtWorksSlider from './artworksSlides';

class HomepageArtists extends Component {

    componentDidMount() {
        this.props.fetchExistingArtists();
    }

    render() { 
        let imagesArray = []
        this.props.artistsAndartworksImages.forEach(artist => {
            if(artist.artWorkImagesPath !== undefined){
                if(artist.artWorkImagesPath.length > 0) {
                    imagesArray.push(artist.artWorkImagesPath[0])
                }
            }
        });

        return (
            <div className="artists-section">
                <div className="artistsSection-title">
                    <u>
                        <h1>Artist Showcase</h1>
                    </u>
                </div>
                
                <div className="sliders">
                    <ArtWorksSlider imagesArray={imagesArray}/>
                </div>

                <div className="pledge-description-container">
                    <div className="pledge-description-subtitle">
                        Artist Pledge
                    </div>
                    <div className="pledge-description">
                        <p>Our artists pldege to donate money from their sales to their chosen environmental nonprofit, they'va
                            decided to save something. Their donations are based on the sales price of each item, not just on their
                            profit. And the pledge applies to their sales from all sources, whether the customer originated from
                            this site or not.
                        </p>
                    </div>
                    <div className="contact-cathy">
                        <Link to="">contact Cathy</Link>
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        artistsAndartworksImages: state.artistsAndartworksImages
    }
}
export default connect(mapStateToProps, { fetchExistingArtists })(HomepageArtists);
