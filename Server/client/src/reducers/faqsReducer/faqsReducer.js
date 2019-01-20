import { SET_FAQS, ADD_FAQ, FAQ_FETCHED, FAQ_UPDATED, DELETE_FAQ } from '../../actions/faqsCRUD';

export default function faqs(state = [], action = {}) {
    switch(action.type) {

        case SET_FAQS:
            return action.faqs;

        case ADD_FAQ:
            return [
                ...state,
                action.faq
            ]

        case FAQ_FETCHED:
            const index = state.findIndex(item => item._id === action.faq._id);
            if(index > -1) {
                return state.map(item => {
                    if(item._id === action.faq._id) return action.faq;
                    return item;
                });
            } else {
                return [
                    ...state,
                    action.faq
                ] 
            }

        case FAQ_UPDATED:
            return state.map(item => {
                if(item._id === action.faq._id) return action.faq;
                return item;
            })

        case DELETE_FAQ:
            return state.filter(item => item._id !== action.faqId)

        default:
            return state;
    }
}