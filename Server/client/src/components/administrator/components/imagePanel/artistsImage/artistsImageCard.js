import React from 'react';
import NoImage from '../../../../../assets/NoImage.jpg';
import { Link } from 'react-router-dom';
import './common.css';

const artistsImageCard = ({ user, deleteArtist, deleteArtistImage }) => (
    <div className="card-container" >
        <div className="card">
            <a className="image"
                href={user.websiteAddress ? user.websiteAddress : '/no_web_address'}
                target="_blank"
                rel="noopener noreferrer"
            >
            <img 
                src={user.userImagePath ? user.userImagePath : NoImage} 
                alt={user.userImagePathAlt} 
                className="ui medium image"
            />
            </a>

            <div className="content">
                <a className="header"
                    href={user.websiteAddress ? user.websiteAddress : '/no_web_address'}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                {user.firstname} {user.lastname}
                </a>
                <div className="meta">
                    <span className="date">{user.createdDate}</span>
                </div>
            </div>
            <div className="extra content">
                <div className="ui two buttons ">
                    <Link to={`/image_panel/editArtists/${user._id}`} className="ui basic button green">Edit info/Add artworks</Link>
                    <div className="ui basic button red" onClick={() => deleteArtist(user._id)}>Delete</div>
                </div>
            </div>
        </div>

        <div className="ui tiny images">
            {user.artWorkImagesPath.map(artwork => (
                <div className="image" key={artwork}>
                    <img src={artwork} alt=""/>
                    <div className="extra content">
                        <div className="ui one button ">
                            <div className="ui basic button red"
                                onClick={() => 
                                    deleteArtistImage(user._id, artwork)}
                            >
                                Delete
                            </div>
                        </div>
                    </div>
                </div>
                )
            )}
        </div>
    </div>
    
)

export default artistsImageCard;
