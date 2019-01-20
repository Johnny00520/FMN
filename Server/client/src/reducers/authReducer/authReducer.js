import { FETCH_USER, 
    EMAIL_REGISTERED, 
    ADMIN_LOGIN, 
    ADMIN_SIGNUP, 
    RECAPTCHA_FAILED,
    INCORRECT_PASSWORD,
    RESET_PASSWORD,
    FORGOT_PASSWORD,
    SUCCESSFULLY_CHANGE_PASSWORD,
    HASH_FUNCTION_ERROR,
    USER_SIGNIN,
    UNREGISTERED_EMAIL,
    SOMETHING_WENT_WRONG,
    STATUS_EMPTY,
    TOO_MANY_REQUEST,
    PASSWORD_SUBMIT,
    PW_SIMILIAR
} from '../../actions/types';

export default function( state = { user: null, error: ''}, action ) {
    // console.log("state: ", state );

    switch (action.type) {
        case FETCH_USER:
            // action.payload = user model (res.data) in /actions/index.
            // When the app boots up, the state will be either null, action.payload, or false
            // return action.payload || false; 
            return { ...state, user: action.payload || false }

        case EMAIL_REGISTERED:
            // return action.payload || false;
            return { ...state, error: action.payload }

        case ADMIN_SIGNUP:
            return { ...state, error: action.payload }

        case ADMIN_LOGIN:
            // return { ...state, error: action.payload }
            return { ...state, user: action.payload || false }

        case USER_SIGNIN:
            // return { ...state, user: action.payload || false }
            return { ...state, user: action.data || false }

        case RECAPTCHA_FAILED:
            return { ...state, error: action.payload }
        
        case INCORRECT_PASSWORD:

            return { ...state, error: action.payload }
            // return { ...state, error: '' }

        case TOO_MANY_REQUEST:
            return { ...state, error: action.payload }

        case UNREGISTERED_EMAIL:
            return { ...state, error: action.payload }

        case FORGOT_PASSWORD:
            return { ...state, error: action.data }

        case SUCCESSFULLY_CHANGE_PASSWORD:
            // return { ...state, error: action.payload }
            return { ...state, error: action.userData }

        case HASH_FUNCTION_ERROR:
            return { ...state, error: action.payload }

        case RESET_PASSWORD:
            return { ...state, error: action.payload }

        case STATUS_EMPTY:
            return { ...state, error: action.payload }

        case SOMETHING_WENT_WRONG:
            return { ...state, error: action.payload }
            
        case PW_SIMILIAR:
            return { ...state, error: action.payload }

        case PASSWORD_SUBMIT:
            return { ...state, user: action.message || false}

        default:
            return state;
    }
}