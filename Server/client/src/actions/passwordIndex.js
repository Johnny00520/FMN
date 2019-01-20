import axios from 'axios';
import { 
    FETCH_USER,
    // INCORRECT_PASSWORD, 
    USER_SIGNIN ,
    FORGOT_PASSWORD,
    // TOKEN_INVALID,
    SUCCESSFULLY_CHANGE_PASSWORD,
    // HASH_FUNCTION_ERROR,
    // ADMIN_LOGIN,
    // UNREGISTERED_EMAIL,
    // SOMETHING_WENT_WRONG,
    // TOO_MANY_REQUEST,
    PASSWORD_SUBMIT,
    // PW_SIMILIAR
} from './types';

function handleResponse(response) {
    // debugger
    if(response.ok) {
        return response.json()

    } else {
        let error = new Error(response.statusText);

        error.response = response;
        throw error;
    }
}

// import actions from 'redux-form/lib/actions';
/*
export const fetchUser = () => {
    return function(dispatch) {
        axios
            .get('/api/current_user)
            .then(res => disptach({ type: FETCH_USER, payload: res }));
    }
}
*/

export const fetchUser = () => async (dispatch) => { 
    const res = await axios.get('/api/current_user');

    // res.data: axios returns an object contains data property, which is the only we care
    dispatch({ type: FETCH_USER, payload: res.data });
}


////////////////////////////////////////////////////////////////////////////////////////////////////


export const userLogin = (data) => {
    return {
        type: USER_SIGNIN,
        data
    }
}
export const userSubmitSignin = (userData) => {
    return dispatch => {
        return fetch('/api/login', {
            method: 'post',
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(userLogin(data)))
    }
}


export const submittedPasswd = (data) => {
    return {
        type: FORGOT_PASSWORD,
        data
    }
}

export const passwdSubmit = (userData) => {
    return dispatch => {
        return fetch('/api/passwd_forgot', {
            method: 'post',
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(submittedPasswd(data)))
    }
}

////////////////////////////////////////////////////////////////////////////////////

export const submittedResetPW = (userData) => {
    // debugger
    return {
        type: SUCCESSFULLY_CHANGE_PASSWORD,
        userData
    }
}
export const resetPasswdSubmit = (userData) => {
    // debugger
    return dispatch => {
        return fetch(`/api/passwd_reset/${userData.token}`, {
            method: 'post',
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(user => dispatch(submittedResetPW(user)))
    }
}

// export const resetPasswdSubmit = (userData, token, history) => async dispatch => {
//     try {
        
//         // const res = await axios.post(`http://localhost:5005/api/passwd_reset/${token}`, userData);
//         const res = await axios.post(`/api/passwd_reset/${token}`, userData);
//         debugger
//         setTimeout( () =>
//             history.push('/')
//         , 1500);
//         // dispatch({ type: SUCCESSFULLY_CHANGE_PASSWORD, payload: res.data });
//         dispatch({ type: SUCCESSFULLY_CHANGE_PASSWORD, payload: res.data.user });
//         // debugger
        

//     } catch (err) {
//         console.log("err.response in resetPasswdSubmit: ", err.response)
//         if(err.response.status === 400) {
//             // debugger
//             dispatch({ type: PW_SIMILIAR, payload: err.response.data.error })
//         }
//         if(err.response.status === 401) {
//             // debugger
//             // dispatch({ type: TOKEN_INVALID, payload: 'This Token is invalid, or your password not fit requirement' });
//             dispatch({ type: TOKEN_INVALID, payload: err.response.data });
//             // debugger
//         }

//         if(err.response.status === 500) {
//             // debugger
//             dispatch({ type: HASH_FUNCTION_ERROR, payload: 'Hash function error, contact your administrator' });
//             // dispatch({ type: HASH_FUNCTION_ERROR, payload: err.response.data });
//         }

//         if(err.response.status === 422) {
//             // debugger
//             dispatch({ type: SOMETHING_WENT_WRONG, payload: err.response.data });
//         }
//         if(err.response.status === 429) {
//             // debugger
//             dispatch({ type: TOO_MANY_REQUEST, payload: err.response.data });
//         }
//     }
// }
////////////////////////////////////////////////////////////////////////////////////

export function addPW(message) {
    return {
        type: PASSWORD_SUBMIT,
        message
    }
}
// const res = await axios.post(`/api/passwd_reset/${token}`, userData);

export function firstLogin(pwData) {
    // debugger
    return dispatch => {
        return fetch(`/api/user/first-login/${pwData.token}`, {
            method: 'post',
            body: JSON.stringify(pwData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(message => dispatch(addPW(message)));
    }
}

