export const SET_ARTIST_LIST = 'set_artist_list';
export const ADD_ARTIST = 'add_artist';
export const ARTIST_FETCHED = 'artist_fetched';
export const ARTIST_UPDATED = 'artist_updated';
export const ARTIST_DELETED = 'artist_deleted';
export const ARTWORK_DELETED = 'artwork_deleted';

function handleResponse(response) {
    if(response.ok) {
        return response.json()

    } else {
        let error = new Error(response.statusText);

        error.response = response;
        throw error;
    }
}

export function setArtists(artists) {
    return {
        type: SET_ARTIST_LIST,
        artists
    }
}

export function fetchExistingArtists() {
    return dispatch => {
        fetch('/api/image_panel/allArtist')
            .then(res => res.json())
            .then(data => dispatch(setArtists(data.artists)))
    }
}

export function artistFetched(artist) {
    return {
        type: ARTIST_FETCHED,
        artist
    }
}

export function fetchExistingArtist(id) {
    return dispatch => {
        fetch(`/api/image_panel/allArtist/${id}`)
            .then(res => res.json())
            .then(data => dispatch(artistFetched(data.artist)))
    }
}


export function addArtist(artist) {
    return {
        type: ADD_ARTIST,
        artist
    }
}

export function saveArtist(userData) {
    // debugger
    userData.email = userData.email.trim().toLowerCase();
    userData.firstname = userData.firstname.trim();
    userData.lastname = userData.lastname.trim();
    userData.websiteAddress = userData.websiteAddress.trim();
    userData.facebook = userData.facebook.trim();
    userData.otherLink1 = userData.otherLink1.trim();
    userData.otherLink2 = userData.otherLink2.trim();
    userData.otherLink3 = userData.otherLink3.trim();
    userData.pleage1 = userData.pleage1.trim();
    userData.pleage2 = userData.pleage2.trim();

    // with profile img but no artworks
    if(userData.profileImage && userData.artworkImages.length === 0) {
        // debugger
        const data = new FormData();
        data.append('file', userData.profileImage);
        data.append('userData', JSON.stringify(userData));

        return dispatch => {
            return fetch('/api/image_panel/allArtist', {
                method: 'post',
                body: data
            })
            .then(handleResponse)
            .then(data => dispatch(addArtist(data.artist)))
        }
        
        // with artworks but no profile img
    } else if(!userData.profileImage && userData.artworkImages.length > 0) {
        // debugger
        const data = new FormData();

        for(let i = 0; i < userData.artworkImages[0].length; i++) {
            data.append('file', userData.artworkImages[0][i]);
        }
        data.append('userData', JSON.stringify(userData));

        return dispatch => {
            return fetch('/api/image_panel/allArtist', {
                method: 'post',
                body: data
            })
            .then(handleResponse)
            .then(data => dispatch(addArtist(data.artist)))
        }

    } else if(!userData.profileImage && userData.artworkImages.length === 0) {
        // nothing at all (only text info)
        // debugger
        const data = new FormData();
        data.append('userData', JSON.stringify(userData));

        return dispatch => {
            return fetch('/api/image_panel/allArtist', {
                method: 'post',
                body: data
            })
            .then(handleResponse)
            .then(data => dispatch(addArtist(data.artist)))
        }
    } else if(userData.profileImage && userData.artworkImages[0].length > 0) {
        // got profile picture and artwork pictures
        // debugger
        const data = new FormData();
        data.append('file', userData.profileImage);

        for(let i = 0; i < userData.artworkImages[0].length; i++) {
            data.append('file', userData.artworkImages[0][i]);
        }
        data.append('userData', JSON.stringify(userData));
        return dispatch => {
            return fetch('/api/image_panel/allArtist', {
                method: 'post',
                body: data
            })
            .then(handleResponse)
            .then(data => dispatch(addArtist(data.artist)))
        }
    }
}

export function artistUpdated(artist) {
    return {
        type: ARTIST_UPDATED,
        artist
    }
}

export function updateArtist(userData) {
    userData.email = userData.email.trim().toLowerCase();
    userData.firstname = userData.firstname.trim();
    userData.lastname = userData.lastname.trim();
    userData.websiteAddress = userData.websiteAddress.trim();
    userData.facebook = userData.facebook.trim();
    userData.otherLink1 = userData.otherLink1.trim();
    userData.otherLink2 = userData.otherLink2.trim();
    userData.otherLink3 = userData.otherLink3.trim();
    userData.pleage1 = userData.pleage1.trim();
    userData.pleage2 = userData.pleage2.trim();

    // with profile img but no artworks
    if(userData.profileImage && userData.artworkImages.length === 0) {
        // debugger
        const data = new FormData();
        data.append('file', userData.profileImage);
        data.append('userData', JSON.stringify(userData));

        return dispatch => {
            return fetch(`/api/image_panel/allArtist/${userData._id}`, {
                method: 'put',
                body: data
            })
            .then(handleResponse)
            .then(data => dispatch(artistUpdated(data.artist)))
        }

    } else if(!userData.profileImage && userData.artworkImages.length > 0) {
        // with artworks but no profile img
        // debugger
        const data = new FormData();

        for(let i = 0; i < userData.artworkImages[0].length; i++) {
            data.append('file', userData.artworkImages[0][i]);
        }
        data.append('userData', JSON.stringify(userData));

        return dispatch => {
            return fetch(`/api/image_panel/allArtist/${userData._id}`, {
                method: 'put',
                body: data
            })
            .then(handleResponse)
            .then(data => dispatch(artistUpdated(data.artist)))
        }

    } else if(userData.profileImage && userData.artworkImages[0].length > 0) {
        // got profile picture and artwork pictures
        // debugger
        const data = new FormData();
        data.append('file', userData.profileImage);

        for(let i = 0; i < userData.artworkImages[0].length; i++) {
            data.append('file', userData.artworkImages[0][i]);
        }
        data.append('userData', JSON.stringify(userData));
        return dispatch => {
            return fetch(`/api/image_panel/allArtist/${userData._id}`, {
                method: 'put',
                body: data
            })
            .then(handleResponse)
            .then(data => dispatch(artistUpdated(data.artist)))
        }
    } else if(!userData.profileImage && userData.artworkImages.length === 0) {
        // nothing at all (only text info)
        // debugger
        const data = new FormData();
        data.append('userData', JSON.stringify(userData));

        return dispatch => {
            return fetch(`/api/image_panel/allArtist/${userData._id}`, {
                method: 'put',
                body: data
            })
            .then(handleResponse)
            .then(data => dispatch(artistUpdated(data.artist)))
        }
    }
}

export function artistDeleted(artistId) {
    return {
        type: ARTIST_DELETED,
        artistId
    }
}

export function deleteArtist(id) {
    debugger
    return dispatch => {
        return fetch(`/api/image_panel/allArtist/${id}`, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(artistDeleted(id)))
    }
}

/////////////////////////////////////////////////////////////
export function artworkDeleted(artist) {
    return {
        type: ARTWORK_DELETED,
        artist
    }
}

export function deleteArtistImage(id, url) {
    debugger
    return dispatch => {
        return fetch(`/api/image_panel/artistImage/${id}`, {
            method: 'delete',
            // body: JSON.stringify({ path: path, test: '123' }),
            body: JSON.stringify({ 
                url: url
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(artworkDeleted(data.artist)))
    }
}
