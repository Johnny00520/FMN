export const SET_FAQS = 'SET_FAQS';
export const ADD_FAQ = 'ADD_FAQ';
export const FAQ_FETCHED = 'FAQ_FETCHED';
export const FAQ_UPDATED = 'FAQ_UPDATED';
export const DELETE_FAQ = 'DELETE_FAQ';

function handleResponse(response) {

    if(response.ok) {
        return response.json();
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error
    }
}

export function setFAQs(faqs) {
    return {
        type: SET_FAQS,
        faqs
    }
}
export function fetchFAQs() {
    return dispatch => {
        fetch('/api/faqs')
        .then(res => res.json())
        .then(data => dispatch(setFAQs(data.faqs)));
    }
}

export function faqFetched(faq) {
    return {
        type: FAQ_FETCHED,
        faq
    }
}

export function fetchFAQ(id) {
    return dispatch => {
        fetch(`/api/faqs/${id}`)
        .then(res => res.json())
        .then(data => dispatch(faqFetched(data.faq)));
    }
}

export function addFaq(faq) {
    return {
        type: ADD_FAQ,
        faq
    }
}

export function saveFAQ(data) {
    return dispatch => {
        return fetch('/api/faqs', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(addFaq(data.faq)))
    }
}

export function faqUpdated(faq) {
    return {
        type: FAQ_UPDATED,
        faq
    }
}

export function updateFAQ(data) {
    return dispatch => {
        return fetch(`/api/faqs/${data._id}`, {
            method: 'put',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(faqUpdated(data.faq)))
    }
}

export function faqDeleted(faqId) {
    return {
        type: DELETE_FAQ,
        faqId
    }
}

export function deleteFAQ(id) {
    return dispatch => {
        return fetch(`/api/faqs/${id}`, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(faqDeleted(id)))
    }
}