import fetch from 'isomorphic-fetch'
import Cookie from 'js-cookie'


export const REQUEST_ACTIVE_LIST = 'REQUEST_ACTIVE_LIST'
export const RECEIVE_ACTIVE_LIST = 'RECEIVE_ACTIVE_LIST'
export const REQUEST_ALL_LISTS = 'REQUEST_ALL_LISTS'
export const RECEIVE_ALL_LISTS = 'RECEIVE_ALL_LISTS'
export const ADD_NEW_LIST_ITEM = 'ADD_NEW_LIST_ITEM'
export const RECEIVE_NEW_LIST_ITEM = 'RECEIVE_NEW_LIST_ITEM'
export const ADD_NEW_LIST = 'ADD_NEW_LIST'
export const RECEIVE_NEW_LIST = 'RECEIVE_NEW_LIST'
export const UPDATE_LIST_ITEM = 'UPDATE_LIST_ITEM'
export const RECEIVE_UPDATED_LIST_ITEM = 'RECEIVE_UPDATED_LIST_ITEM'


const LIST_API_URL = '/api/v2/lists/'
const LIST_ITEM_API_URL = '/api/v2/list_items/'


const fetchFromServer = (url, params = {}) => {
	// Wraps fetch to add the parameters that DRF expects
	params.credentials = 'same-origin'
	params.headers = {
		...params.headers,
		'X-CSRFToken': Cookie.get('csrftoken'),
		'Content-Type': 'application/json'
	}
	return fetch(url, params)
}


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

const addNewListItem = (data) => {
	return {
		type: ADD_NEW_LIST_ITEM,
		data
	}
}


const receiveNewListItem = (data) => {
	return {
		type: RECEIVE_NEW_LIST_ITEM,
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

const updateListItem = (id, data) => {
	return {
		type: UPDATE_LIST_ITEM,
		id,
		data
	}
}


const receiveUpdatedListItem = (data) => {
	return {
		type: RECEIVE_UPDATED_LIST_ITEM,
		data
	}
}


export const fetchActiveList = (id = firstListId) => {
	return function (dispatch) {
		dispatch(requestActiveList())
		return fetchFromServer(LIST_API_URL + id + '/')
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
		return fetchFromServer(LIST_API_URL)
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveAllLists(data))
		)
	}
}


export const createNewListItem = (title, listId) => {
	let itemData = {
		title: title,
		list_id: listId
	}
	return function(dispatch) {
		dispatch(addNewListItem(itemData))
		return fetchFromServer(LIST_ITEM_API_URL, {
			method: 'POST',
			body: JSON.stringify(itemData)
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveNewListItem(data))
		)
	}
}


export const createNewList = (listName) => {
	let listData = {
		name: listName
	}
	return function(dispatch) {
		dispatch(addNewList(listData))
		return fetchFromServer(LIST_API_URL, {
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


export const patchListItem = (id, data) => {
	return function(dispatch) {
		dispatch(updateListItem(id, data))
		return fetchFromServer(LIST_ITEM_API_URL + id + '/', {
			method: 'PATCH',
			body: JSON.stringify(data)
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveUpdatedListItem(data))
		)
	}
}
