import createHistory from 'history/createBrowserHistory'

import { getActiveListFetchStatus } from '../reducers/activeList'
import { getAllListsFetchStatus } from '../reducers/allLists'
import { sync } from './base'


export const ACTIVE_LIST_CHANGED = 'ACTIVE_LIST_CHANGED'
export const FETCH_ALL_LISTS_REQUEST = 'FETCH_ALL_LISTS_REQUEST'
export const FETCH_ALL_LISTS_SUCCESS = 'FETCH_ALL_LISTS_SUCCESS'
export const FETCH_ALL_LISTS_ERROR = 'FETCH_ALL_LISTS_ERROR'
export const FETCH_LIST_REQUEST = 'FETCH_LIST_REQUEST'
export const FETCH_LIST_SUCCESS = 'FETCH_LIST_SUCCESS'
export const FETCH_ACTIVE_LIST_ERROR = 'FETCH_ACTIVE_LIST_ERROR'
export const NO_LIST_AVAILABLE = 'NO_LIST_AVAILABLE'
export const ARCHIVE_LIST_REQUEST = 'ARCHIVE_LIST_REQUEST'
export const ARCHIVE_LIST_SUCCESS = 'ARCHIVE_LIST_SUCCESS'
export const DOWNLOAD_LIST_REQUEST = 'DOWNLOAD_LIST_REQUEST'
export const REORDER_LIST_REQUEST = 'REORDER_LIST_REQUEST'
export const REORDER_LIST_SUCCESS = 'REORDER_LIST_SUCCESS'


const LIST_API_URL = '/api/v2/lists/'
export const QUICK_SORT = '/actions/quick_sort/'
export const CHECK_ALL = '/actions/complete_all/'
export const UNCHECK_ALL = '/actions/uncomplete_all/'


const history = createHistory()


const fetchAllListsRequest = () => ({
	type: FETCH_ALL_LISTS_REQUEST
})


const fetchAllListsSuccess = (data) => ({
	type: FETCH_ALL_LISTS_SUCCESS,
	data
})


const fetchAllListsError = (data) => ({
	type: FETCH_ALL_LISTS_ERROR,
	errorData
})


const fetchListRequest = (id, data) => ({
	type: FETCH_LIST_REQUEST,
	id,
	data
})


const fetchListSuccess = (data, isActive) => ({
	type: FETCH_LIST_SUCCESS,
	data,
	isActive
})


const fetchActiveListError = (errorData) => ({
	type: FETCH_ACTIVE_LIST_ERROR,
	errorData
})


const noListAvailable = () => ({
	type: NO_LIST_AVAILABLE
})


const archiveListRequest = (id) => ({
	type: ARCHIVE_LIST_REQUEST,
	id
})


const archiveListSuccess = (id, nextListID) => ({
	type: ARCHIVE_LIST_SUCCESS,
	id,
	nextListID
})


const downloadListRequest = (id, downloadFormID) => ({
	type: DOWNLOAD_LIST_REQUEST,
	id,
	downloadFormID
})


const reorderListRequest = (id, order) => ({
	type: REORDER_LIST_REQUEST,
	id,
	order
})


const reorderListSuccess = (id, order) => ({
	type: REORDER_LIST_SUCCESS,
	id,
	order
})


const activeListChanged = (id) => ({
	type: ACTIVE_LIST_CHANGED,
	id
})


export const fetchActiveList = (id = firstListID, oldActiveListID) => (dispatch, getState) => {
	if (getActiveListFetchStatus(getState())) {
		return Promise.resolve()
	}
	if (!Boolean(id)) {
		history.push('/new/')
		dispatch(noListAvailable())
		return Promise.resolve()
	}
	dispatch(fetchListRequest(id))
	if (oldActiveListID != id) {
		dispatch(activeListChanged(id))
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
				dispatch(fetchListSuccess(json, true))
				history.push('/new/' + json.id)
			} else {
				dispatch(fetchActiveListError(json))
			}
		}
	)
}


export const fetchAllLists = () => (dispatch, getState) => {
	if (getAllListsFetchStatus(getState())) {
		return Promise.resolve()
	}
	dispatch(fetchAllListsRequest())
	return sync(LIST_API_URL)
	.then(
		response => response.json().then(json => ({
			status: response.status,
			json
		})
	))
	.then(
		({ status, json }) => {
			if (status == 200) {
				dispatch(fetchAllListsSuccess(json))
			} else {
				dispatch(fetchAllListsError(json))
			}
		}
	)
}


export const createList = (listName) => (dispatch) => {
	let listData = {
		name: listName
	}
	dispatch(fetchListRequest(null, listData))
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
				dispatch(fetchListSuccess(json))
				history.push('/new/' + json.id)
			} else {
				console.log('handle me!')
			}
		}
	)
}


export const updateList = (id, data) => (dispatch) => {
	dispatch(fetchListRequest(id, data))
	return sync(LIST_API_URL + id + '/', {
		method: 'PATCH',
		body: JSON.stringify(data)
	})
	.then(
		response => response.json())
	.then(
		data => dispatch(fetchListSuccess(data))
	)
}


export const performActionOnList = (id, actionURL) => (dispatch) => {
	if (![QUICK_SORT, CHECK_ALL, UNCHECK_ALL].includes(actionURL)) {
		return Promise.resolve()
	}
	dispatch(fetchListRequest(id, {}))
	return sync(LIST_API_URL + id + actionURL, {
		method: 'POST',
	})
	.then(
		response => response.json())
	.then(
		data => dispatch(fetchListSuccess(data))
	)
}


export const archiveList = (id, nextListID) => (dispatch) => {
	dispatch(archiveListRequest(id))
	return sync(LIST_API_URL + id + '/', {
		method: 'DELETE'
	})
	.then(
		data => {
			dispatch(archiveListSuccess(id, nextListID))
			if (id == nextListID || nextListID === null) {
				dispatch(fetchActiveList(nextListID, id))
			}
		}
	)
}


export const downloadPlaintextList = (id, downloadFormID) => (dispatch) => {
	var jQueryFormID = '#' + downloadFormID
	$(jQueryFormID).attr('action', LIST_API_URL + id + '/plaintext/')
	$(jQueryFormID).submit()
	dispatch(downloadListRequest(id, downloadFormID))
}


export const reorderList = (id, order) => (dispatch) => {
	dispatch(reorderListRequest(id, order))
	return sync(LIST_API_URL + id + '/reorder/', {
		method: 'POST',
		body: JSON.stringify({order: order})
	})
	.then(
		data => dispatch(reorderListSuccess(id, order))
	)
}


export const previewListOrder = (dragID, dropOrder) => (dispatch) => {
	return dispatch(reorderListSuccess(dragID, dropOrder))
}
