import React from 'react';
import NoImage from '../../../../../assets/NoImage.jpg';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


const adminImageCard = ({ user, deleteAdmin }) => {
    // debugger
    return (
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
                    <Link to={`/image_panel/editAdminImage/${user._id}`} className="ui basic button green">Edit</Link>
                    <div className="ui basic button red" onClick={() => deleteAdmin(user._id)}>Delete</div>
                </div>
            </div>
        </div>
    )
}

adminImageCard.propTypes = {
    user: PropTypes.object.isRequired,
}

export default adminImageCard;