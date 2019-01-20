import {
    SET_ARTIST_LIST,
    ADD_ARTIST,
    ARTIST_FETCHED,
    ARTIST_UPDATED,
    ARTIST_DELETED,
    ARTWORK_DELETED
} from '../../actions/artistImageCRUD';

export default function(state = [], action = {}) {
    switch(action.type) {
        case SET_ARTIST_LIST:
            return action.artists;

        case ADD_ARTIST:
            return [
                ...state,
                action.artist
            ]
        
        case ARTIST_FETCHED:
            const index = state.findIndex(item => item._id === action.artist._id);
            // debugger
            if(index > -1) {
                return state.map(item => {
                    if(item._id === action.artist._id) return action.artist;
                    return item
                })
            } else {
                return [
                    ...state,
                    action.artist
                ]
            }

        case ARTIST_UPDATED:
            return state.map(item => {
                // debugger
                if(item._id === action.artist._id) return action.artist;
                return item;
            })

        case ARTIST_DELETED:
            return state.filter(item => item._id !== action.artistId);

        case ARTWORK_DELETED:
            return state.map(item => {
                if(item._id === action.artist._id) return action.artist
                return item;
            })

        default:
            return state;
    }
}