import fetch from 'isomorphic-fetch'
import Cookie from 'js-cookie'


export const REQUEST_ACTIVE_LIST = 'REQUEST_ACTIVE_LIST'
export const RECEIVE_ACTIVE_LIST = 'RECEIVE_ACTIVE_LIST'
export const REQUEST_ALL_LISTS = 'REQUEST_ALL_LISTS'
export const RECEIVE_ALL_LISTS = 'RECEIVE_ALL_LISTS'


const fetchFromServer = (url, params = {}) => {
	// Wraps fetch to add the parameters that DRF expects
	params.credentials = 'same-origin'
	params.headers = {
		...params.headers,
		'X-CSRFToken': Cookie.get('csrftoken')
	}
	return fetch(url, params)
}


const requestActiveList = (id) => {
	return {
		type: REQUEST_ACTIVE_LIST,
		id
	}
}


const receiveActiveList = (id, json) => {
	return {
		type: RECEIVE_ACTIVE_LIST,
		id,
		json
	}
}


const requestAllLists = () => {
	return {
		type: REQUEST_ALL_LISTS,
	}
}


const receiveAllLists = (json) => {
	return {
		type: RECEIVE_ALL_LISTS,
		json
	}
}


// TODO: remove hardcoded ID and move to v2 list_items API
export const fetchActiveList = (id = 6) => {
	return function (dispatch) {
		dispatch(requestActiveList('id'));
		return fetchFromServer('/api/v1/lists/' + id + '/')
		.then(
			response => response.json())
		.then(
			json => dispatch(receiveActiveList(id, json))
		)
	}
}


export const fetchAllLists = () => {
	return function (dispatch) {
		dispatch(requestAllLists());
		return fetchFromServer('/api/v2/lists/')
		.then(
			response => response.json())
		.then(
			json => dispatch(receiveAllLists(json))
		)
	}
}
