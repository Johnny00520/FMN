import {
    SET_NON_PROF_ORGS,
    ADD_ORG,
    NON_ORG_FETCHED,
    NON_ORG_UPDATED,
    DELETE_ORG
} from '../../actions/nonOrgImageCRUD';

export default function orgs(state = [], action = {}) {

    switch(action.type) {

        case ADD_ORG:
            return [
                ...state,
                action.nonOrg
            ]

        case SET_NON_PROF_ORGS:
            return action.nonOrgs;

        case NON_ORG_FETCHED:
            const index = state.findIndex(item => item._id === action.nonOrg._id);
            if(index > -1) {
                return state.map(item => {
                    if(item._id === action.nonOrg._id) return action.nonOrg;
                    return item;
                })
            } else {
                return [
                    ...state,
                    action.nonOrg
                ];
            }

        case NON_ORG_UPDATED:
            return state.map(item => {
                if(item._id === action.nonOrg._id) return action.nonOrg;
                return item;
            })

        case DELETE_ORG:
            return state.filter(item => item._id !== action.orgId);
        
        default:
            return state;
    }
}