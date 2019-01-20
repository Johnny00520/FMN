import axios from 'axios';

import { 
    GET_USERS_LIST,
    ADMIN_ADD_USER,
    USER_FETCHED,
    ADMIN_UPDATE_USER,
    DELETE_USER,
    SEARCH_PEOPLE,
    SORT_BY_SELECTION
} from './types';

function handleResponse(response) {

    if(response.ok) {
        // debugger
        return response.json()

    } else {
        let error = new Error(response.statusText);

        error.response = response;
        throw error;
    }
}

export const fetchExistingUsers = () => async (dispatch) => {

    const res = await axios.get('/api/existingUsers');

    // Since I initialize state as array in usersReducer.js, so the pay.load is res.data.users
    dispatch({ type: GET_USERS_LIST, payload: res.data.users });
}

/* Two ways to approach fetchExistingUser */
export const fetchExistingUser = (id) => async (dispatch) => {
    const res = await axios.get(`/api/existingUsers/${id}`)

    dispatch({ type: USER_FETCHED, user: res.data.user });
}

// export function userFetched(user) {
//     // debugger
//     return {
//         type: USER_FETCHED,
//         user
//     }
// }

// export function fetchExistingUser(id) {
//     // debugger
//     return dispatch => {
//         fetch(`/api/existingUsers/${id}`)
//             .then(res => res.json())
//             .then(data => dispatch(userFetched(data.user)))
//     }
// }

////////////////////////////////////////////////////////////////////////////////

export function addUser(user) {

    return {
        type: ADMIN_ADD_USER,
        // Because I use action.payload in usersReducer, so it should be payload: user,
        // or the newUserAdd will be undefine
        user
    }
}

export function newUserSave(userData) {
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

    return dispatch => {
        return fetch('/api/existingUsers', {
            method: 'post',
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(userData => dispatch(addUser(userData)));
    }
    
}

// export const newUserSave = (userData) => async (dispatch) => {

//     debugger
//     const res = await axios.post('/api/existingUsers', userData);
//     debugger
//     dispatch({ type: ADMIN_ADD_USER, user: res.data.user });
// }

////////////////////////////////////////////////////////////////////////////////

function userUpdated(user) {
    return {
        type: ADMIN_UPDATE_USER,
        user
    }
}

export function updateUser(userData) {
    return dispatch => {
        // debugger
        return fetch(`/api/existingUsers/${userData._id}`, {
            method: 'put',
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(userData => dispatch(userUpdated(userData)));
    }
}


////////////////////////////////////////////////////////////////////////////////


function userDeleted(userId) {
    return {
        type: DELETE_USER,
        userId
    }
}

export function deleteUser(id) {
    // debugger
    return dispatch => {
        return fetch(`/api/existingUsers/${id}`, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(id => dispatch(userDeleted(id)))
    }
}


////////////////////////////////////////////////////////////////////////////////

export const searchPeople = (data) => async(dispatch) => {
    const res = await axios.get(`/api/searchPeople/${data}`);

    dispatch({ type: SEARCH_PEOPLE, users: res.data.users })
}

export const usersListSelectSort = (selection) => async(dispatch) => {

    const res = await axios.get(`/api/existingUsersSoryBy/${selection}`);

    dispatch({ type: SORT_BY_SELECTION, users:res.data.users });
}