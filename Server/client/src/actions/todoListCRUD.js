import axios from 'axios';

import {
    GET_TODOS_LIST,
    SAVE_ITEM_TO_LIST,
    TODO_FETCHED,
    TASK_ITEM_UPDATED,
    TASK_DELETED,
    SAVE_TASK,
    SEARCH_TASKS,
    SORT_BY
} from './types';

////////////////////////////////////////////////////////////////

export const getTodosList = () => async(dispatch) => {
    const res = await axios.get('/api/todoTasks');
    // dispatch({ type: GET_TODOS_LIST, payload: res.data.tasks })
    dispatch({ type: GET_TODOS_LIST, tasks: res.data.tasks })
}

// export function setTasks(tasks) {
//     return {
//         type: GET_TODOS_LIST,
//         tasks
//     }
// }

// export function getTodosList() {
//     return dispatch => {
//         fetch('/api/todoTasks')
//             .then(res => res.json())
//             .then(data => dispatch(setTasks(data.tasks)));
//     }
// }

////////////////////////////////////////////////////////////////

// export const getTodoList = (id) => async(dispatch) => {
//     const res = await axios.get(`/api/todoTasks/${id}`)

//     dispatch({ type: TODO_FETCHED, user: res.data.user });
// }

export function todoItemFetched(task) {
    return {
        type: TODO_FETCHED,
        task
    }
}

export function getTodoList(id) {
    return dispatch => {
        fetch(`/api/todoTasks/${id}`)
            .then(res => res.json())
            .then(data => dispatch(todoItemFetched(data.task)));
    }
}

////////////////////////////////////////////////////////////////

// export const addTodoList = (data) => async(dispatch) => {
//     const res = await axios.post('api/todoTasks');
//     dispatch({ type: SAVE_ITEM_TO_LIST, payload: res.data.task })
// }

function addTask(task) {
    return {
        type: SAVE_ITEM_TO_LIST,
        task
    }
}

function handleResponse(response) {

    if(response.ok) {
        return response.json();
    } else {
         let error = new Error(response.statusText);
         error.response = response;
         throw error;
    }
}

export function addTodoList(data) {
    return dispatch => {
        return fetch('/api/todoTasks', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(addTask(data.task)));
    }
}


////////////////////////////////////////////////////////////////

export function taskUpdated(task) {
    return {
        type: TASK_ITEM_UPDATED,
        task
    }
}

export function updateTask(data) {

    return dispatch => {
        return fetch(`/api/todoTasks/${data._id}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(taskUpdated(data.task)));

    }
}

////////////////////////////////////////////////////////////////

export function taskDeleted(taskId) {
    return {
        type: TASK_DELETED,
        taskId
    }
}

export const deleteTask = id => {
    return dispatch => {
        return fetch(`/api/todoTasks/${id}`, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(taskDeleted(id)))
    }
}

////////////////////////////////////////////////////////////////

export function AllUpdated(task) {
    return {
        type: SAVE_TASK,
        task
    }
}

export function saveTask(data){
    return dispatch => {
        return fetch(`/api/saveTodoTask/${data._id}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(AllUpdated(data.task)))
    }
}

// export const saveTask = (data) => async(dispatch) => {
//     const res = await axios.put(`/api/saveTodoTask/${data._id}`);
//     dispatch({ type: SAVE_TASK, task: res.data });
// }

////////////////////////////////////////////////////////////////

export const searchTasks = (data) => async(dispatch) => {

    const res = await axios.get(`/api/todoTasksSearch/${data}`);

    // dispatch({ type: GET_TODOS_LIST, tasks: res.data.tasks })
    dispatch({ type: SEARCH_TASKS, tasks: res.data.tasks })
}

/* Search bar */
// export function searchTasksName(data) {
//     debugger
//     return {
//         type: SEARCH_TASKS,
//         data
//     }
// }

// export function searchTasks(data) {
//     debugger
//     return dispatch => {
//         return fetch(`/api/todoTasksSearch/${data}`, {
//         // return fetch('/api/todoTasksSearch', {
//             method: 'get',
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         })
//         .then(handleResponse)
//         .then(data => dispatch(searchTasksName(data.task)))
//     }
// }

////////////////////////////////////////////////////////////////

export const selectSort = (selection) => async(dispatch) => {
    const res = await axios.get(`/api/todoTasksSortBy/${selection}`);

    // const res = await axios.get(`/api/todoTasksSearch/${data}`);
    dispatch({ type: SORT_BY, tasks: res.data.tasks })
}