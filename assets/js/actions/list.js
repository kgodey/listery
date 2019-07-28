import createHistory from 'history/createBrowserHistory'
import { normalize } from 'normalizr'

import { getActiveListFetchStatus, getActiveListID } from '../reducers/activeList'
import { getAllListsFetchStatus } from '../reducers/allLists'
import { LIST_API_URL, ROOT_URL, QUICK_SORT_URL_SUFFIX, CHECK_ALL_URL_SUFFIX, UNCHECK_ALL_URL_SUFFIX } from '../utils/urls'
import { sync } from './base'
import { genericAPIActionFailure } from './common'
import * as schema from './schema'

export const FETCH_ALL_LISTS_REQUEST = 'FETCH_ALL_LISTS_REQUEST'
export const FETCH_ALL_LISTS_SUCCESS = 'FETCH_ALL_LISTS_SUCCESS'
export const FETCH_ALL_LISTS_ERROR = 'FETCH_ALL_LISTS_ERROR'
export const CREATE_LIST_REQUEST = 'CREATE_LIST_REQUEST'
export const CREATE_LIST_SUCCESS = 'CREATE_LIST_SUCCESS'
export const FETCH_ACTIVE_LIST_REQUEST = 'FETCH_ACTIVE_LIST_REQUEST'
export const FETCH_ACTIVE_LIST_SUCCESS = 'FETCH_ACTIVE_LIST_SUCCESS'
export const FETCH_ACTIVE_LIST_ERROR = 'FETCH_ACTIVE_LIST_ERROR'
export const UPDATE_ACTIVE_LIST_REQUEST = 'UPDATE_ACTIVE_LIST_REQUEST'
export const UPDATE_ACTIVE_LIST_SUCCESS = 'UPDATE_ACTIVE_LIST_SUCCESS'
export const UPDATE_ACTIVE_LIST_ERROR = 'UPDATE_ACTIVE_LIST_ERROR'
export const NO_ACTIVE_LIST_AVAILABLE = 'NO_ACTIVE_LIST_AVAILABLE'
export const ARCHIVE_LIST_REQUEST = 'ARCHIVE_LIST_REQUEST'
export const ARCHIVE_LIST_SUCCESS = 'ARCHIVE_LIST_SUCCESS'
export const DOWNLOAD_LIST_REQUEST = 'DOWNLOAD_LIST_REQUEST'
export const REORDER_LIST_PREVIEW = 'REORDER_LIST_PREVIEW'
export const REORDER_LIST_REQUEST = 'REORDER_LIST_REQUEST'
export const REORDER_LIST_SUCCESS = 'REORDER_LIST_SUCCESS'
export const TOGGLE_FILTER_INTERFACE_REQUEST = 'TOGGLE_FILTER_INTERFACE_REQUEST'

const history = createHistory()


const fetchAllListsRequest = (reload) => ({
	type: FETCH_ALL_LISTS_REQUEST,
	reload
})


const fetchAllListsSuccess = (data) => ({
	type: FETCH_ALL_LISTS_SUCCESS,
	data: normalize(data, schema.listListSchema)
})


const fetchAllListsError = (errorMessage) => ({
	type: FETCH_ALL_LISTS_ERROR,
	errorMessage
})


const fetchActiveListRequest = (id, reload) => ({
	type: FETCH_ACTIVE_LIST_REQUEST,
	id,
	reload
})


const fetchActiveListSuccess = (data) => ({
	type: FETCH_ACTIVE_LIST_SUCCESS,
	data: normalize(data, schema.listSchema)
})


const fetchActiveListError = (errorMessage) => ({
	type: FETCH_ACTIVE_LIST_ERROR,
	errorMessage
})


const updateActiveListRequest = (id) => ({
	type: UPDATE_ACTIVE_LIST_REQUEST,
	id
})


const updateActiveListSuccess = (data) => ({
	type: UPDATE_ACTIVE_LIST_SUCCESS,
	data: normalize(data, schema.listSchema)
})


const updateActiveListError = (id, errorMessage, data) => ({
	type: UPDATE_ACTIVE_LIST_ERROR,
	data: normalize(data, schema.listSchema),
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


const reorderListPreview = (id, order) => ({
	type: REORDER_LIST_PREVIEW,
	id,
	order
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


const toggleFilterInterfaceRequest = () => ({
	type: TOGGLE_FILTER_INTERFACE_REQUEST,
})



export const fetchActiveList = (id, reload=true) => (dispatch, getState) => {
	const state = getState()
	let currentLocation = history.location.pathname
	let newLocation

	// if there's no ID passed, use the current active ID or the first list ID provided by the HTML page.
	if (!id) {
		id = getActiveListID(state) || firstListID
	}

	if (getActiveListFetchStatus(state)) {
		return Promise.resolve()
	}
	if (!id) {
		newLocation = ROOT_URL
		if (currentLocation !== newLocation) history.push(newLocation)
		dispatch(noActiveListAvailable())
		return Promise.resolve()
	}

	dispatch(fetchActiveListRequest(id, reload))
	newLocation = ROOT_URL + id
	if (currentLocation !== newLocation) history.push(newLocation)
	return sync(LIST_API_URL + id + '/')
		.then(
			response => dispatch(fetchActiveListSuccess(response)),
			error => dispatch(fetchActiveListError(error.message))
		)
}


export const fetchAllLists = (reload=true) => (dispatch, getState) => {
	if (getAllListsFetchStatus(getState())) {
		return Promise.resolve()
	}
	dispatch(fetchAllListsRequest(reload))
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
				history.push(ROOT_URL + response.id)
			},
			error => dispatch(genericAPIActionFailure(error.message))
		)
}


export const updateActiveList = (id, data, originalData) => (dispatch) => {
	dispatch(updateActiveListRequest(id))
	return sync(LIST_API_URL + id + '/', {
		method: 'PATCH',
		body: JSON.stringify(data)
	})
		.then(
			response => dispatch(updateActiveListSuccess(response)),
			error => dispatch(updateActiveListError(id, error.message, originalData))
		)
}


export const performActionOnList = (id, actionURL, originalData) => (dispatch) => {
	if (![QUICK_SORT_URL_SUFFIX, CHECK_ALL_URL_SUFFIX, UNCHECK_ALL_URL_SUFFIX].includes(actionURL)) {
		return Promise.resolve()
	}
	dispatch(fetchActiveListRequest(id, true))
	return sync(LIST_API_URL + id + actionURL, {
		method: 'POST',
	})
		.then(
			response => dispatch(fetchActiveListSuccess(response)),
			error => dispatch(updateActiveListError(id, error.message, originalData))
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
			error => dispatch(genericAPIActionFailure(error.message))
		)
}


export const downloadPlaintextList = (id, downloadFormID) => (dispatch) => {
	var formElement = document.querySelector('#' + downloadFormID)
	formElement.setAttribute('action', LIST_API_URL + id + '/plaintext/')
	formElement.submit()
	dispatch(downloadListRequest(id, downloadFormID))
}


export const reorderList = (id, order, initialOrder) => (dispatch) => {
	dispatch(reorderListRequest(id, order))
	return sync(LIST_API_URL + id + '/reorder/', {
		method: 'POST',
		body: JSON.stringify({order: order})
	})
		.then(
			response => {
				dispatch(reorderListSuccess(id, order))
				dispatch(fetchAllLists(false))
			},
			error => {
				dispatch(reorderListPreview(id, initialOrder))
				dispatch(genericAPIActionFailure(error.message))
			}
		)
}


export const previewListOrder = (dragID, dropOrder) => (dispatch) => {
	return dispatch(reorderListPreview(dragID, dropOrder))
}


export const toggleFilterInterface = () => (dispatch) => {
	return dispatch(toggleFilterInterfaceRequest())
}
