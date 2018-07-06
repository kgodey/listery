import createHistory from 'history/createBrowserHistory'

import { sync } from './base'


export const REQUEST_ACTIVE_LIST = 'REQUEST_ACTIVE_LIST'
export const RECEIVE_ACTIVE_LIST = 'RECEIVE_ACTIVE_LIST'
export const REQUEST_ALL_LISTS = 'REQUEST_ALL_LISTS'
export const RECEIVE_ALL_LISTS = 'RECEIVE_ALL_LISTS'
export const REQUEST_NEW_LIST = 'REQUEST_NEW_LIST'
export const RECEIVE_NEW_LIST = 'RECEIVE_NEW_LIST'
export const REQUEST_LIST_UPDATE = 'REQUEST_LIST_UPDATE'
export const RECEIVE_UPDATED_LIST = 'RECEIVE_UPDATED_LIST'
export const REQUEST_LIST_ARCHIVAL = 'REQUEST_LIST_ARCHIVAL'
export const RECEIVE_ARCHIVED_LIST = 'RECEIVE_ARCHIVED_LIST'
export const REQUEST_LIST_DOWNLOAD = 'REQUEST_LIST_DOWNLOAD'
export const REQUEST_LIST_REORDER = 'REQUEST_LIST_REORDER'
export const RECEIVE_REORDERED_LIST = 'RECEIVE_REORDERED_LIST'
export const REQUEST_ACTIVE_LIST_CHANGE = 'REQUEST_ACTIVE_LIST_CHANGE'
export const RECEIVE_ACTIVE_LIST_ERROR = 'RECEIVE_ACTIVE_LIST_ERROR'

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


const receiveActiveListError = (errorData) => ({
	type: RECEIVE_ACTIVE_LIST_ERROR,
	errorData
})


const requestAllLists = () => ({
	type: REQUEST_ALL_LISTS
})


const receiveAllLists = (data) => ({
	type: RECEIVE_ALL_LISTS,
	data
})


const requestNewList = (data) => ({
	type: REQUEST_NEW_LIST,
	data
})


const receiveNewList = (data) => ({
	type: RECEIVE_NEW_LIST,
	data
})


const requestListUpdate = (id, data) => ({
	type: REQUEST_LIST_UPDATE,
	id,
	data
})


const receiveUpdatedList = (data) => ({
	type: RECEIVE_UPDATED_LIST,
	data
})


const requestListArchival = (id) => ({
	type: REQUEST_LIST_ARCHIVAL,
	id
})


const receiveArchivedList = (id, nextListID) => ({
	type: RECEIVE_ARCHIVED_LIST,
	id,
	nextListID
})


const requestListDownload = (id, downloadFormID) => ({
	type: REQUEST_LIST_DOWNLOAD,
	id,
	downloadFormID
})


const requestListReorder = (id, order) => ({
	type: REQUEST_LIST_REORDER,
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
					dispatch(receiveActiveListError(json))
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


export const createList = (listName) => {
	let listData = {
		name: listName
	}
	return function(dispatch) {
		dispatch(requestNewList(listData))
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


export const updateList = (id, data) => {
	return function(dispatch) {
		dispatch(requestListUpdate(id, data))
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
		dispatch(requestListUpdate(id, {}))
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
		dispatch(requestListArchival(id))
		return sync(LIST_API_URL + id + '/', {
			method: 'DELETE'
		})
		.then(
			data => dispatch(receiveArchivedList(id, nextListID))
		)
	}
}

export const downloadPlaintextList = (id, downloadFormID) => {
	var jQueryFormID = '#' + downloadFormID
	return function(dispatch) {
		$(jQueryFormID).attr('action', LIST_API_URL + id + '/plaintext/')
		$(jQueryFormID).submit()
		dispatch(requestListDownload(id, downloadFormID))
	}
}


export const reorderList = (id, order) => {
	return function(dispatch) {
		dispatch(requestListReorder(id, order))
		return sync(LIST_API_URL + id + '/reorder/', {
			method: 'POST',
			body: JSON.stringify({order: order})
		})
		.then(
			data => dispatch(receiveReorderedList(id, order))
		)
	}
}

export const previewListOrder = (dragID, dropOrder) => {
	return function(dispatch) {
		return dispatch(receiveReorderedList(dragID, dropOrder))
	}
}
