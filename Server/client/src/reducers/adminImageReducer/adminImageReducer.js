
import {
    SET_ADMIN_LIST,
    ADD_ADMIN,
    ADMIN_FETCHED,
    UPDATE_ADMIN,
    ADMIN_IMAGE_DELETED
} from '../../actions/adminImageCRUD';


export default function(state = [], action = {}) {
    // console.log("state in adminImageReducer: ", state)
    switch(action.type) {

        case SET_ADMIN_LIST:
            return action.admins;

        case ADD_ADMIN:
            return [
                ...state,
                action.admin
            ]

        case UPDATE_ADMIN:
            return state.map(item => {
                if(item._id === action.admin._id) { 
                    return action.admin; 
                }
                return item
            });

        case ADMIN_FETCHED:
            const index = state.findIndex(item => item._id === action.admin._id)
            // console.log("index in adminImageReducer: ", index)
            if(index > -1) {
                return state.map(item => {
                    if(item._id === action.admin._id) return action.admin;
                    return item;
                })
            } else {
                return [
                    ...state,
                    action.admin
                ]
            }

        case ADMIN_IMAGE_DELETED:
            return state.filter(item => item._id !== action.adminId);

            // const adminIndex = state.findIndex(item => item._id === action.admin._id)
            // if(adminIndex > -1) {
            //     return state.map(item => {
            //         if(item._id === action.admin._id) {
            //             item = action.admin;
            //             return item
            //         }
            //         return item
            //     })
            // } else {
            //     return [
            //         ...state,
            //         action.admin
            //     ]
            // }
            

        default:
            return state;
    }
}