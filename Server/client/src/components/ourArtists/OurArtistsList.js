import React from 'react';

const OurArtistsList = ({ artist }) => {
    const empty = (
        <p>No Artists</p>
    )

    const onlyShowArtistName = (artist) => {
        if(artist.isArtist) {
            return (
                <div className="item">
                    {artist.firstname}
                </div>
            )
        }
    }

    return (
        <div className="artist-name-list-container">
            {artist.length ? empty : onlyShowArtistName(artist)}
        </div>
    )
}

export default OurArtistsList;