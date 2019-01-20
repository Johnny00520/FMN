import React from 'react';
import PropTypes from 'prop-types';


const NonOrgsList = ({ nonOrgs }) => {
    // debugger
    const empty = (
        <p>You have no Non-Profit Organization in your collection</p>
    )

    const orgList = (
        <div className="item">
            {nonOrgs.map((nonOrg) => {
                // debugger
                return (
                    <div key={nonOrg._id}>{nonOrg.org_name}</div>
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

NonOrgsList.propTypes = {
    nonOrgs: PropTypes.array.isRequired
}

export default NonOrgsList;
