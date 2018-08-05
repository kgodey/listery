import createHistory from 'history/createBrowserHistory'
import { normalize } from 'normalizr'

import { getActiveListFetchStatus, getActiveListID } from '../reducers/activeList'
import { getAllListsFetchStatus } from '../reducers/allLists'
import { sync } from './base'
import { apiActionFailure } from './common'
import * as schema from './schema'

export const FETCH_ALL_LISTS_REQUEST = 'FETCH_ALL_LISTS_REQUEST'
export const FETCH_ALL_LISTS_SUCCESS = 'FETCH_ALL_LISTS_SUCCESS'
export const FETCH_ALL_LISTS_ERROR = 'FETCH_ALL_LISTS_ERROR'
export const CREATE_LIST_REQUEST = 'CREATE_LIST_REQUEST'
export const CREATE_LIST_SUCCESS = 'CREATE_LIST_SUCCESS'
export const FETCH_ACTIVE_LIST_REQUEST = 'FETCH_ACTIVE_LIST_REQUEST'
export const FETCH_ACTIVE_LIST_SUCCESS = 'FETCH_ACTIVE_LIST_SUCCESS'
export const FETCH_ACTIVE_LIST_ERROR = 'FETCH_ACTIVE_LIST_ERROR'
export const NO_ACTIVE_LIST_AVAILABLE = 'NO_ACTIVE_LIST_AVAILABLE'
export const UPDATE_ACTIVE_LIST_ERROR = 'UPDATE_ACTIVE_LIST_ERROR'
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


const fetchAllListsError = (errorMessage) => ({
	type: FETCH_ALL_LISTS_ERROR,
	errorMessage
})


const fetchActiveListRequest = (id, refreshList) => ({
	type: FETCH_ACTIVE_LIST_REQUEST,
	id,
	refreshList
})


const fetchActiveListSuccess = (data, isActive) => ({
	type: FETCH_ACTIVE_LIST_SUCCESS,
	data: normalize(data, schema.listSchema),
	isActive
})


const fetchActiveListError = (errorMessage) => ({
	type: FETCH_ACTIVE_LIST_ERROR,
	errorMessage
})


const noActiveListAvailable = () => ({
	type: NO_ACTIVE_LIST_AVAILABLE
})


const createListRequest = (data) => ({
	type: CREATE_LIST_REQUEST,
	data
})


const createListSuccess = (data, id) => ({
	type: CREATE_LIST_SUCCESS,
	data: normalize(data, schema.listSchema),
	id
})


const updateActiveListError = (errorMessage, data) => ({
	type: UPDATE_ACTIVE_LIST_ERROR,
	data: normalize(data, schema.listSchema),
	errorMessage
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


export const fetchActiveList = (id = firstListID, refreshList = true) => (dispatch, getState) => {
	const state = getState()
	const oldActiveListID = getActiveListID(state)

	if (getActiveListFetchStatus(state)) {
		return Promise.resolve()
	}
	if (!Boolean(id)) {
		history.push('/new/')
		dispatch(noActiveListAvailable())
		return Promise.resolve()
	}
	dispatch(fetchActiveListRequest(id, refreshList))
	if (refreshList) {
		history.push('/new/' + id)
	}
	return sync(LIST_API_URL + id + '/')
	.then(
		response => {
			dispatch(fetchActiveListSuccess(response, true))
		},
		error => {
			dispatch(fetchActiveListError(error.message))
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
		error => dispatch(fetchAllListsError(error.message))
	)
}


export const createList = (listName) => (dispatch) => {
	let listData = {
		name: listName
	}
	dispatch(createListRequest(listData))
	return sync(LIST_API_URL, {
		method: 'POST',
		body: JSON.stringify(listData)
	})
	.then(
		response => {
			dispatch(createListSuccess(response, response.id))
			history.push('/new/' + response.id)
		},
		error => dispatch(apiActionFailure(error.message))
	)
}


export const updateList = (id, data, originalData) => (dispatch) => {
	dispatch(fetchActiveListRequest(id, false))
	return sync(LIST_API_URL + id + '/', {
		method: 'PATCH',
		body: JSON.stringify(data)
	})
	.then(
		response => dispatch(fetchActiveListSuccess(response)),
		error => dispatch(updateActiveListError(error.message, originalData))
	)
}


export const performActionOnList = (id, actionURL) => (dispatch) => {
	if (![QUICK_SORT, CHECK_ALL, UNCHECK_ALL].includes(actionURL)) {
		return Promise.resolve()
	}
	dispatch(fetchActiveListRequest(id))
	return sync(LIST_API_URL + id + actionURL, {
		method: 'POST',
	})
	.then(
		response => dispatch(fetchActiveListSuccess(response))
	)
}


export const archiveList = (id, nextListID) => (dispatch, getState) => {
	dispatch(archiveListRequest(id))
	return sync(LIST_API_URL + id + '/', {
		method: 'DELETE'
	})
	.then(
		response => {
			let activeListID = getActiveListID(getState())
			if (id === activeListID) {
				dispatch(fetchActiveList(nextListID))
			}
			dispatch(archiveListSuccess(id, nextListID))
		},
		error => dispatch(apiActionFailure(error.message))
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
