import React from 'react';
import './common.css';
import NoImage from '../../assets/NoImage.jpg';

const OurArtistsContent = ({ artist }) => {
    const empty = (
        <p>No Artists</p>
    )

    const onlyShowArtistContent = (artist) => {
        return (
            <div className="content-section-container">

                <div className="content-section">
                    <div className="section-name-img">
                        <div key={artist._id} className="artist-name">
                            <b>
                                {artist.firstname}
                            </b>
                        </div>
                        <div className="section-img">
                            <img 
                                src={artist.userImagePath ? artist.userImagePath : NoImage} 
                                alt={artist.userImagePathAlt} 
                                className="ui medium image"    
                            />
                        </div>
                        
                    </div>

                    <hr/>

                    <div className="artist-desciption-container">
                        <div className="artist-desciption">

                            <p>Shop at <a href={artist.websiteAddress}>{artist.websiteAddress} and at {artist.firstname} store</a></p>
                            <p>Supported Organization(s):</p>
                        </div>
                    </div>

                </div>

                <div className="abt-artist">
                    <div className="abt-artist-section">
                        <b>About the Artist</b>
                        <div className="artist-img-description">
                            <img
                                src={artist.userImagePath}
                                alt={artist.userImagePathAlt}
                                className="ui small image"
                                style={{ height: '50%'}}
                            />
                            <div className="artist-introduction">

                                <p>"I love creating colorful, empathy inducing artowrk on nature themes. My work consists of bright colors, flat lines, and surrealist themes."</p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        )
    }

    return (
        <div className="our-artist-content-container">
            {artist.length ? empty : onlyShowArtistContent(artist)}
        </div>
    )
}

export default OurArtistsContent;