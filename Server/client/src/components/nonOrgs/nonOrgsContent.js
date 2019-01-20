import React from 'react';
import PropTypes from 'prop-types';

const NonOrgsContent = ({ nonOrgs, artists }) => {
    // debugger
    const empty = (
        <p>You have no Non-Profit Organization in your collection</p>
    )

    const orgList = (
        <div className="content-section-container">
            {nonOrgs.map((nonOrg) => {
                // debugger
                return (
                    <div className="content-section">
                        <div className="section-name-img">
                            <div key={nonOrg._id} className="nonOrg-name">
                                <b>
                                    {nonOrg.org_name}
                                </b>
                            </div>
                            <div className="section-img">
                                <img 
                                    src={nonOrg.orgImagePath} 
                                    alt={nonOrg.orgImageAlt} 
                                    className="ui medium image"    
                                />
                            </div>
                            <br/>
                            <b>Supporting Artist/Store</b>
                            <br/>
                            {artists.map((artist) => {
                                if(artist.pleage1 === nonOrg.org_name) {
                                    return (
                                        <a 
                                            href={artist.websiteAddress} alt={artist.userImagePathAlt}
                                        >{artist.firstname},</a>
                                    )
                                }
                                return ''
                            })}
                            <br/>
                        </div>

                        <div className="org-desciption">
                            <p>{nonOrg.org_description}</p>
                            <p>Visit us to learn more at 
                                <a href={nonOrg.org_web_address}> {nonOrg.org_web_address}</a>
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )

    return (
        <div>
            {nonOrgs.length === 0 ? empty : orgList}
        </div>
    )
}

NonOrgsContent.propTypes = {
    nonOrgs: PropTypes.array.isRequired
}

export default NonOrgsContent;