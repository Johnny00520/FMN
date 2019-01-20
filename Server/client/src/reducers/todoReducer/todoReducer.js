import {
    GET_TODOS_LIST,
    SAVE_ITEM_TO_LIST,
    TODO_FETCHED,
    TASK_ITEM_UPDATED,
    TASK_DELETED,
    SAVE_TASK,
    SEARCH_TASKS,
    SORT_BY
} from '../../actions/types';

export default function(state = [], action = {}) {
    // console.log("state in todoReducer: ", state);

    switch(action.type) {

        case SAVE_ITEM_TO_LIST:
            return [
                ...state,
                action.task
            ];

        case TODO_FETCHED:
            const index = state.findIndex(item => item._id === action.task._id);

            // It means the user find in the array
            if(index > -1) {
                return state.map(item => {
                    // debugger
                    if(item._id === action.task._id) return action.task;
                    return item;
                });
            } else {
                return [
                    ...state,
                    action.task
                ];
            }

        case TASK_ITEM_UPDATED:
            return state.map(item => {
                if(item._id === action.task._id) return action.task;
                return item;
            });

        case TASK_DELETED:
            return state.filter(item => item._id !== action.taskId )

        case GET_TODOS_LIST:
            // return action.payload;
            return action.tasks;

        case SAVE_TASK:
            return state.map(item => {
                if(item._id === action.task._id) return action.task;
                return item;
            });

        case SEARCH_TASKS:
            return action.tasks

        case SORT_BY:
            return action.tasks

        default:
            return state;
    }
}