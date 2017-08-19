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


const requestActiveList = () => {
	return {
		type: REQUEST_ACTIVE_LIST,
	}
}


const receiveActiveList = (json) => {
	return {
		type: RECEIVE_ACTIVE_LIST,
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


export const fetchActiveList = (id = firstListID) => {
	return function (dispatch) {
		dispatch(requestActiveList());
		return fetchFromServer('/api/v2/lists/' + id + '/')
		.then(
			response => response.json())
		.then(
			json => dispatch(receiveActiveList(json))
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
