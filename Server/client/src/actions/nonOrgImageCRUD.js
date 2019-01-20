export const SET_NON_PROF_ORGS = 'set_non_prof_orgs';
export const ADD_ORG = 'add_org';
export const NON_ORG_FETCHED = 'non_org_fetched';
export const NON_ORG_UPDATED = 'non_org_updated';
export const DELETE_ORG = 'delete_non_org';

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

export function setNonOrgs(nonOrgs) {
    return {
        type: SET_NON_PROF_ORGS,
        nonOrgs
    }
}

export function fetchExistingNonOrgs(){
    return dispatch => {
        fetch('/api/nonProfOrgs')
        .then(res => res.json())
        .then(data => dispatch(setNonOrgs(data.nonOrgs)));
    }
}

export function NonOrgFetched(nonOrg) {
    return {
        type: NON_ORG_FETCHED,
        nonOrg
    }
}

export function fetchExistingNonOrg(id) {
    return dispatch => {
        fetch(`/api/nonProfOrgs/${id}`)
        .then(res => res.json())
        .then(data => dispatch(NonOrgFetched(data.nonOrg)));
    }
}

export function addOrg(nonOrg) {
    return {
        type: ADD_ORG,
        nonOrg
    }
}

export function saveOrg(orgData) {
    if(orgData.selectedFile) {

        const data = new FormData();
        data.append('file', orgData.selectedFile);
        data.append('orgData', JSON.stringify(orgData))

        return dispatch => {
            return fetch('/api/nonProfOrgs', {
                method: 'post',
                body: data 
            })
            .then(handleResponse)
            .then(data => dispatch(addOrg(data.nonOrg)))
        }
    } else {

        const data = new FormData();
        data.append('orgData', JSON.stringify(orgData))
        return dispatch => {
            return fetch('/api/nonProfOrgs', {
                method: 'post',
                body: data,
            })
            .then(handleResponse)
            .then(data => dispatch(addOrg(data.nonOrg)))
        }
    }
}

export function orgUpdated(nonOrg) {
    // debugger
    return {
        type: NON_ORG_UPDATED,
        nonOrg
    }
}

export function updateOrg(orgData) {
    if(orgData.selectedFile) {
        const data = new FormData();
        data.append('file', orgData.selectedFile);
        data.append('orgData', JSON.stringify(orgData))

        return dispatch => {
            return fetch(`/api/nonProfOrgs/${orgData._id}`, {
                method: 'put',
                body: data 
            })
            .then(handleResponse)
            .then(data => dispatch(orgUpdated(data.nonOrg)))
        }
    } else {

        const data = new FormData();
        data.append('orgData', JSON.stringify(orgData))
        return dispatch => {
            return fetch(`/api/nonProfOrgs/${orgData._id}`, {
                method: 'put',
                body: data,
            })
            .then(handleResponse)
            .then(data => dispatch(orgUpdated(data.nonOrg)))
        }
    }
}

export function orgDeleted(orgId) {
    return {
        type: DELETE_ORG,
        orgId
    }
}

export function deleteOrgImage(id) {
    return dispatch => {
        return fetch(`/api/nonProfOrgs/${id}`, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(handleResponse)
        .then(data => dispatch(orgDeleted(id)))
    }
}