import React from 'react';
import NoImage from '../../../../../assets/NoImage.jpg';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const NonOrgsCard = ({ nonOrg, deleteOrgImage }) => {
    // debugger
    return (
        <div className="card">
            <a className="image"
                href={nonOrg.org_web_address ? nonOrg.org_web_address : '/no_web_address'}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img src={nonOrg.orgImagePath ? nonOrg.orgImagePath : NoImage} alt={nonOrg.orgImageAlt} />
            </a>

            <div className="content">
                <a className="header"
                    href={nonOrg.org_web_address ? nonOrg.org_web_address : '/no_web_address'}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                {nonOrg.org_name}
                </a>
                <div className="meta">
                    <span className="date">{nonOrg.createdDate }</span>
                </div>
            </div>

            <div className="extra content">
                <div className="ui two buttons ">
                    <Link to={`/image_panel/editNonOrgs/${nonOrg._id}`} className="ui basic button green">Edit</Link>
                    <div className="ui basic button red" onClick={() => deleteOrgImage(nonOrg._id)}>Delete</div>
                </div>
            </div>
        </div>
    )
}

NonOrgsCard.propTypes = {
    nonOrg: PropTypes.object.isRequired,
    deleteOrgImage: PropTypes.func.isRequired
}

export default NonOrgsCard;