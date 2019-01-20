import {
    USER_SIGN_UP
} from '../../actions/types';

export default function(state = {}, action = {}) {
    // console.log("state in userAuthReducer: ", state)
    switch(action.type) {

        case USER_SIGN_UP:
            // return { ...state, user: action.payload || false }
            return {
                ...state, 
                // action.user || false
                user: action.user
            };

        default:
            return state;
    }
}