export const SET_ADMIN_LIST = 'set_admin_list';
export const ADD_ADMIN = 'add_admin';
export const ADMIN_FETCHED = "admin_fetched";
export const UPDATE_ADMIN = 'admin_updated';
export const ADMIN_IMAGE_DELETED = 'admin_delete';

function handleResponse(response) {
    if(response.ok) {
        return response.json()

    } else {
        let error = new Error(response.statusText);

        error.response = response;
        throw error;
    }
}

//////////////////////////////////////////////////////////////////

export function setAdmins(admins) {
    return {
        type: SET_ADMIN_LIST,
        admins
    }
}

export function fetchExistingAdmins(){
    return dispatch => {
        fetch('/api/image_panel/allAdmin')
        .then(res => res.json())
        .then(data => dispatch(setAdmins(data.admins)));
    }
}

//////////////////////////////////////////////////////////////////

// export const fetchExistingUsers = () => async (dispatch) => {

//     const res = await axios.get('/api/existingUsers');
//     debugger
//     // Since I initialize state as array in usersReducer.js, so the pay.load is res.data.users
//     dispatch({ type: GET_USERS_LIST, payload: res.data.users });
// }

//////////////////////////////////////////////////////////////////
function adminUpdated(admin) {
    return {
        type: UPDATE_ADMIN,
        admin
    }
}

export function updateAdmin(userData) {
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
    
    if(userData.selectedFile) {
        // debugger
        const data = new FormData();
        data.append('file', userData.selectedFile);
        data.append('userData', JSON.stringify(userData));
    
        return dispatch => {
            return fetch(`/api/image_panel/admin/${userData._id}`, {
                method: 'put',
                body: data
            })
            .then(handleResponse)
            .then(userData => dispatch(adminUpdated(userData.admin)));
        }
    } else {
        const data = new FormData();
        data.append('userData', JSON.stringify(userData));

        return dispatch => {
            return fetch(`/api/image_panel/admin/${userData._id}`, {
                method: 'put',
                body: data
            })
            .then(handleResponse)
            .then(userData => dispatch(adminUpdated(userData.admin)));
        }
    }
}
//////////////////////////////////////////////////////////////////

// export const fetchExistingAdmin = (id) => async (dispatch) => {
//     // debugger
//     const res = await axios.get(`/api/image_panel/existingAdmin/${id}`)
//     dispatch({ type: ADMIN_FETCHED, admin: res.data.admin });
// }

export function adminFetched(admin) {
    return {
        type: ADMIN_FETCHED,
        admin
    }
}

export function fetchExistingAdmin(id) {
    return dispatch => {
        fetch(`/api/image_panel/existingAdmin/${id}`)
            .then(res => res.json())
            .then(data => dispatch(adminFetched(data.admin)))
    }
}

//////////////////////////////////////////////////////////////////

// export const deleteAdmin = (id) => async (dispatch) => {

//     const res = await axios.delete(`/api/image_panel/admin/${id}`);
//     // debugger
//     // Since I initialize state as array in usersReducer.js, so the pay.load is res.data.users
//     dispatch({ type: ADMIN_IMAGE_DELETED, admin: res.data.admin });
// }

export function adminDeleted(adminId) {
    // debugger
    return {
        type: ADMIN_IMAGE_DELETED,
        adminId
    }
}

export function deleteAdmin(id) {
    return dispatch => {
        return fetch(`/api/image_panel/admin/${id}`, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(userData => dispatch(adminDeleted(id)));
    }
}

//////////////////////////////////////////////////////////////////

export function addAdmin(admin) {
    return {
        type: ADD_ADMIN,
        admin
    }
}

export function saveAdmin(userData) {
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

    if(userData.selectedFile) {

        const data = new FormData();
        data.append('file', userData.selectedFile);
        data.append('userData', JSON.stringify(userData));

        return dispatch => {
            return fetch('/api/image_panel/admin', {
                method: 'post',
                body: data 
            })
            .then(handleResponse)
            .then(data => dispatch(addAdmin(data.admin)))
        }

    } else {

        const data = new FormData();
        data.append('userData', JSON.stringify(userData))
        return dispatch => {
            return fetch('/api/image_panel/admin', {
                method: 'post',
                body: data,
            })
            .then(handleResponse)
            .then(data => dispatch(addAdmin(data.admin)))
        }
    }
}