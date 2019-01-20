import {
    USER_SIGN_UP
} from './types';

function handleResponse(response) {
    // debugger
    if(response.ok) {
        return response.json();
    } else {
         let error = new Error(response.statusText);
         error.response = response;
        //  debugger
         throw error;
    }
}

// export const userSignUpSubmit = (userData, history) => async(dispatch) => {
//     const res = await axios.post('/api/signup', userData)
//     dispatch({ type: USER_SIGN_UP, user: res.data.user })
// }

export const userSignup = (user) => {
    return {
        type: USER_SIGN_UP,
        user
    }
}

export function userSignUpSubmit(userData) {
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
    userData.phoneNum = userData.phoneNum.trim();

    const data = new FormData();
    data.append('file', userData.selectedFile);
    data.append('userData', JSON.stringify(userData))

    return dispatch => {
        return fetch('/api/signup', {
            method: 'post',
            body: data,
        })
        .then(handleResponse)
        .then(userResData => dispatch(userSignup(userResData)));
    }
}