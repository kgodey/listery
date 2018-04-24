import { sync } from './base'


export const REQUEST_ACTIVE_LIST = 'REQUEST_ACTIVE_LIST'
export const RECEIVE_ACTIVE_LIST = 'RECEIVE_ACTIVE_LIST'
export const REQUEST_ALL_LISTS = 'REQUEST_ALL_LISTS'
export const RECEIVE_ALL_LISTS = 'RECEIVE_ALL_LISTS'
export const ADD_NEW_LIST = 'ADD_NEW_LIST'
export const RECEIVE_NEW_LIST = 'RECEIVE_NEW_LIST'
export const UPDATE_LIST = 'UPDATE_LIST'
export const RECEIVE_UPDATED_LIST = 'RECEIVE_UPDATED_LIST'

const LIST_API_URL = '/api/v2/lists/'
export const QUICK_SORT = '/actions/quick_sort/'
export const CHECK_ALL = '/actions/complete_all/'
export const UNCHECK_ALL = '/actions/uncomplete_all/'


const requestActiveList = () => {
	return {
		type: REQUEST_ACTIVE_LIST,
	}
}


const receiveActiveList = (data) => {
	return {
		type: RECEIVE_ACTIVE_LIST,
		data
	}
}


const requestAllLists = () => {
	return {
		type: REQUEST_ALL_LISTS,
	}
}


const receiveAllLists = (data) => {
	return {
		type: RECEIVE_ALL_LISTS,
		data
	}
}


const addNewList = (data) => {
	return {
		type: ADD_NEW_LIST,
		data
	}
}


const receiveNewList = (data) => {
	return {
		type: RECEIVE_NEW_LIST,
		data
	}
}


const updateList = (id, data) => {
	return {
		type: UPDATE_LIST,
		id,
		data
	}
}


const receiveUpdatedList = (data) => {
	return {
		type: RECEIVE_UPDATED_LIST,
		data
	}
}



export const fetchActiveList = (id = firstListID) => {
	return function (dispatch) {
		dispatch(requestActiveList())
		return sync(LIST_API_URL + id + '/')
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveActiveList(data))
		)
	}
}


export const fetchAllLists = () => {
	return function (dispatch) {
		dispatch(requestAllLists())
		return sync(LIST_API_URL)
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveAllLists(data))
		)
	}
}


export const createNewList = (listName) => {
	let listData = {
		name: listName
	}
	return function(dispatch) {
		dispatch(addNewList(listData))
		return sync(LIST_API_URL, {
			method: 'POST',
			body: JSON.stringify(listData)
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveNewList(data))
		)
	}
}


export const patchList = (id, data) => {
	return function(dispatch) {
		dispatch(updateList(id, data))
		return sync(LIST_API_URL + id + '/', {
			method: 'PATCH',
			body: JSON.stringify(data)
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveUpdatedList(data))
		)
	}
}


export const performActionOnList = (id, actionURL) => {
	return function(dispatch) {
		if (![QUICK_SORT, CHECK_ALL, UNCHECK_ALL].includes(actionURL)) {
			return Promise.resolve()
		}
		dispatch(updateList(id, {}))
		return sync(LIST_API_URL + id + actionURL, {
			method: 'POST',
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveUpdatedList(data))
		)
	}
}
