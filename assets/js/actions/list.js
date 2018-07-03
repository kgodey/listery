import createHistory from 'history/createBrowserHistory'

import { sync } from './base'


export const REQUEST_ACTIVE_LIST = 'REQUEST_ACTIVE_LIST'
export const RECEIVE_ACTIVE_LIST = 'RECEIVE_ACTIVE_LIST'
export const REQUEST_ALL_LISTS = 'REQUEST_ALL_LISTS'
export const RECEIVE_ALL_LISTS = 'RECEIVE_ALL_LISTS'
export const ADD_NEW_LIST = 'ADD_NEW_LIST'
export const RECEIVE_NEW_LIST = 'RECEIVE_NEW_LIST'
export const UPDATE_LIST = 'UPDATE_LIST'
export const RECEIVE_UPDATED_LIST = 'RECEIVE_UPDATED_LIST'
export const REMOVE_LIST = 'REMOVE_LIST'
export const RECEIVE_REMOVED_LIST = 'RECEIVE_REMOVED_LIST'
export const DOWNLOAD_LIST = 'DOWNLOAD_LIST'
export const REORDER_LIST = 'REORDER_LIST'
export const RECEIVE_REORDERED_LIST = 'RECEIVE_REORDERED_LIST'
export const REQUEST_ACTIVE_LIST_CHANGE = 'REQUEST_ACTIVE_LIST_CHANGE'
export const ACTIVE_LIST_ERROR = 'ACTIVE_LIST_ERROR'

const LIST_API_URL = '/api/v2/lists/'
export const QUICK_SORT = '/actions/quick_sort/'
export const CHECK_ALL = '/actions/complete_all/'
export const UNCHECK_ALL = '/actions/uncomplete_all/'


const history = createHistory()


const requestActiveList = (id) => ({
	type: REQUEST_ACTIVE_LIST,
	id
})


const receiveActiveList = (data) => ({
	type: RECEIVE_ACTIVE_LIST,
	data
})


const activeListError = (errorData) => ({
	type: ACTIVE_LIST_ERROR,
	errorData
})


const requestAllLists = () => ({
	type: REQUEST_ALL_LISTS
})


const receiveAllLists = (data) => ({
	type: RECEIVE_ALL_LISTS,
	data
})


const addNewList = (data) => ({
	type: ADD_NEW_LIST,
	data
})


const receiveNewList = (data) => ({
	type: RECEIVE_NEW_LIST,
	data
})


const updateList = (id, data) => ({
	type: UPDATE_LIST,
	id,
	data
})


const receiveUpdatedList = (data) => ({
	type: RECEIVE_UPDATED_LIST,
	data
})


const removeList = (id, nextListID) => ({
	type: REMOVE_LIST,
	id,
	nextListID
})


const receiveRemovedList = (id, nextListID) => ({
	type: RECEIVE_REMOVED_LIST,
	id,
	nextListID
})


const downloadList = (id, downloadFormID) => ({
	type: DOWNLOAD_LIST,
	id,
	downloadFormID
})


const reorderList = (id, order) => ({
	type: REORDER_LIST,
	id,
	order
})


const receiveReorderedList = (id, order) => ({
	type: RECEIVE_REORDERED_LIST,
	id,
	order
})


const requestActiveListChange = (id) => ({
	type: REQUEST_ACTIVE_LIST_CHANGE,
	id
})


export const fetchActiveList = (id = firstListID, oldActiveListID) => {
	return function (dispatch) {
		dispatch(requestActiveList(id))
		if (oldActiveListID != id) {
			dispatch(requestActiveListChange(id))
		}
		return sync(LIST_API_URL + id + '/')
		.then(
			response => response.json().then(json => ({
				status: response.status,
				json
			})
		))
		.then(
			({ status, json }) => {
				if (status == 200) {
					dispatch(receiveActiveList(json))
					history.push('/new/' + json.id)
				} else {
					dispatch(activeListError(json))
				}
			}
		)
	}
}


export const fetchAllLists = () => {
	return function (dispatch) {
		dispatch(requestAllLists())
		return sync(LIST_API_URL)
		.then(
			response => response.json().then(json => ({
				status: response.status,
				json
			})
		))
		.then(
			({ status, json }) => {
				dispatch(receiveAllLists(json))
			}
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
			response => response.json().then(json => ({
				status: response.status,
				json
			})
		))
		.then(
			({ status, json }) => {
				if (status == 201) {
					dispatch(receiveNewList(json))
					history.push('/new/' + json.id)
				} else {
					console.log('handle me!')
				}
			}
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

export const archiveList = (id, nextListID) => {
	return function(dispatch) {
		dispatch(removeList(id, nextListID))
		return sync(LIST_API_URL + id + '/', {
			method: 'DELETE'
		})
		.then(
			data => dispatch(receiveRemovedList(id, nextListID))
		)
	}
}

export const downloadPlaintextList = (id, downloadFormID) => {
	var jQueryFormID = '#' + downloadFormID
	return function(dispatch) {
		$(jQueryFormID).attr('action', LIST_API_URL + id + '/plaintext/')
		$(jQueryFormID).submit()
		dispatch(downloadList(id, downloadFormID))
	}
}


export const updateListOrder = (id, order) => {
	return function(dispatch) {
		dispatch(reorderList(id, order))
		return sync(LIST_API_URL + id + '/reorder/', {
			method: 'POST',
			body: JSON.stringify({order: order})
		})
		.then(
			data => dispatch(receiveReorderedList(id, order))
		)
	}
}

export const changeUIListSwitcherOrder = (dragID, dropOrder) => {
	return function(dispatch) {
		return dispatch(receiveReorderedList(dragID, dropOrder))
	}
}
