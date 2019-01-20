import {
    GET_USERS_LIST,
    ADMIN_ADD_USER,
    USER_FETCHED,
    ADMIN_UPDATE_USER,
    DELETE_USER,
    SEARCH_PEOPLE,
    SORT_BY_SELECTION
} from '../../actions/types';


export default function(state = [], action = {}) {
    // console.log("action.users in userReducer: ", action)
    // console.log("state in userReducer: ", state);

    switch(action.type) {

        case ADMIN_ADD_USER:
            return [
                ...state,
                action.user
                // action.payload
            ];

        case DELETE_USER:
            return state.filter(item => 
                item._id !== action.userId._id
            );

        case USER_FETCHED:
            const index = state.findIndex(item => item._id === action.user._id);
            // console.log("index in usersReducer: ", index)
            // debugger
            // It means the user find in the array
            if(index > -1) {
                return state.map(item => {
                    // debugger
                    if(item._id === action.user._id) return action.user;
                    return item;
                });
            } else {
                return [
                    ...state,
                    action.user
                ];
            }

        case ADMIN_UPDATE_USER:
            return state.map(item => {
                if(item._id === action.user._id) {
                    return action.user;
                }
                return item;
            });
            
        case GET_USERS_LIST:
            return action.payload;

        case SEARCH_PEOPLE:
            return action.users;

        case SORT_BY_SELECTION:
            return action.users;

        default:
            return state;
    }
}