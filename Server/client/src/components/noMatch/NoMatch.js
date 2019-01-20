import React from 'react';

const NoMatch = ({ location }) => {
    // debugger
    return (
        <div style={{ textAlign: 'center'}} >
            <h3>
                Sorry, but 404: {location.pathname} was not found
            </h3>
        </div>
    );
}

export default NoMatch;