import createHistory from 'history/createBrowserHistory'
import { normalize } from 'normalizr'

import { getActiveListFetchStatus } from '../reducers/activeList'
import { getAllListsFetchStatus } from '../reducers/allLists'
import { sync } from './base'
import * as schema from './schema'


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
	data: normalize(data, schema.listListSchema)
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
	data: normalize(data, schema.listSchema),
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


export const activeListChanged = () => ({
	type: ACTIVE_LIST_CHANGED
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
		dispatch(activeListChanged())
	}
	return sync(LIST_API_URL + id + '/')
	.then(
		response => {
			dispatch(fetchListSuccess(response, true))
			history.push('/new/' + response.id)
		},
		error => {
			dispatch(fetchActiveListError(error.response))
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
		response => dispatch(fetchAllListsSuccess(response)),
		error => dispatch(fetchAllListsError(error.response))
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
		response => {
			dispatch(fetchListSuccess(response))
			history.push('/new/' + response.id)
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
		response => dispatch(fetchListSuccess(response))
	)
}


export const performActionOnList = (id, actionURL) => (dispatch) => {
	if (![QUICK_SORT, CHECK_ALL, UNCHECK_ALL].includes(actionURL)) {
		return Promise.resolve()
	}
	dispatch(fetchListRequest(id, {}))
	dispatch(activeListChanged())
	return sync(LIST_API_URL + id + actionURL, {
		method: 'POST',
	})
	.then(
		response => dispatch(fetchListSuccess(response))
	)
}


export const archiveList = (id, nextListID) => (dispatch) => {
	dispatch(archiveListRequest(id))
	return sync(LIST_API_URL + id + '/', {
		method: 'DELETE'
	})
	.then(
		response => {
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
		response => dispatch(reorderListSuccess(id, order))
	)
}


export const previewListOrder = (dragID, dropOrder) => (dispatch) => {
	return dispatch(reorderListSuccess(dragID, dropOrder))
}
