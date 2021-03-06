import { normalize } from 'normalizr'

import { getNumTempItems } from '../reducers/activeListItems'
import { LIST_ITEM_API_URL } from '../utils/urls'
import { sync } from './base'
import { genericAPIActionFailure } from './common'
import { fetchActiveList } from './list'
import * as schema from './schema'


export const CREATE_LIST_ITEM_REQUEST = 'CREATE_LIST_ITEM_REQUEST'
export const CREATE_LIST_ITEM_SUCCESS = 'CREATE_LIST_ITEM_SUCCESS'
export const CREATE_LIST_ITEM_ERROR = 'CREATE_LIST_ITEM_ERROR'
export const UPDATE_LIST_ITEM_REQUEST = 'UPDATE_LIST_ITEM_REQUEST'
export const UPDATE_LIST_ITEM_SUCCESS = 'UPDATE_LIST_ITEM_SUCCESS'
export const UPDATE_LIST_ITEM_ERROR = 'UPDATE_LIST_ITEM_ERROR'
export const DELETE_LIST_ITEM_REQUEST = 'DELETE_LIST_ITEM_REQUEST'
export const DELETE_LIST_ITEM_SUCCESS = 'DELETE_LIST_ITEM_SUCCESS'
export const REORDER_LIST_ITEM_PREVIEW = 'REORDER_LIST_ITEM_PREVIEW'
export const REORDER_LIST_ITEM_REQUEST = 'REORDER_LIST_ITEM_REQUEST'
export const REORDER_LIST_ITEM_SUCCESS = 'REORDER_LIST_ITEM_SUCCESS'
export const MOVE_LIST_ITEM_REQUEST = 'MOVE_LIST_ITEM_REQUEST'
export const MOVE_LIST_ITEM_SUCCESS = 'MOVE_LIST_ITEM_SUCCESS'


const createListItemRequest = (data, tempID) => ({
	type: CREATE_LIST_ITEM_REQUEST,
	data,
	tempID
})


const createListItemSuccess = (data, id, tempID) => ({
	type: CREATE_LIST_ITEM_SUCCESS,
	data: normalize(data, schema.listItemSchema),
	tempID,
	id
})


const createListItemError = (tempID, errorMessage) => ({
	type: CREATE_LIST_ITEM_ERROR,
	tempID,
	errorMessage
})


const updateListItemRequest = (id, data) => ({
	type: UPDATE_LIST_ITEM_REQUEST,
	data,
	id
})


const updateListItemSuccess = (data, id, tempID) => ({
	type: UPDATE_LIST_ITEM_SUCCESS,
	data: normalize(data, schema.listItemSchema),
	id,
	tempID
})


const updateListItemError = (id, errorMessage, data) => ({
	type: UPDATE_LIST_ITEM_ERROR,
	id,
	data: normalize(data, schema.listItemSchema),
	errorMessage
})


const deleteListItemRequest = (id) => ({
	type: DELETE_LIST_ITEM_REQUEST,
	id
})


const deleteListItemSuccess = (id) => ({
	type: DELETE_LIST_ITEM_SUCCESS,
	id
})


const reorderListItemPreview = (id, order) => ({
	type: REORDER_LIST_ITEM_PREVIEW,
	id,
	order
})


const reorderListItemRequest = (id, order) => ({
	type: REORDER_LIST_ITEM_REQUEST,
	id,
	order
})


const reorderListItemSuccess = (id, order) => ({
	type: REORDER_LIST_ITEM_SUCCESS,
	id,
	order
})


const moveListItemRequest = (id, listID) => ({
	type: MOVE_LIST_ITEM_REQUEST,
	id,
	listID
})


const moveListItemSuccess = (id, listID) => ({
	type: MOVE_LIST_ITEM_SUCCESS,
	id,
	listID
})


export const createListItem = (title, listID) => (dispatch, getState) => {
	let itemData = {
		title: title,
		list_id: listID,
		tags: []
	}
	let tempID = getNumTempItems(getState()) - 1
	let requestData = {}
	requestData[tempID] = itemData
	dispatch(createListItemRequest(requestData, tempID))
	return sync(LIST_ITEM_API_URL, {
		method: 'POST',
		body: JSON.stringify(itemData)
	})
		.then(
			response => {
				dispatch(createListItemSuccess(response, response.id, tempID))
				dispatch(fetchActiveList({id: null, reload: false, useCurrentFilters: true}))
			},
			error => dispatch(createListItemError(tempID, error.message))
		)
}


export const updateListItem = (id, data, originalData) => (dispatch) => {
	dispatch(updateListItemRequest(id, data))
	return sync(LIST_ITEM_API_URL + id + '/', {
		method: 'PATCH',
		body: JSON.stringify(data)
	})
		.then(
			response => {
				dispatch(updateListItemSuccess(response, id)),
				dispatch(fetchActiveList({id: null, reload: false, useCurrentFilters: true}))
			},
			error => dispatch(id, updateListItemError(error.message, originalData))
		)
}


export const moveListItem = (id, listID, initialOrder) => (dispatch) => {
	let data = {list_id: listID}
	dispatch(moveListItemRequest(id, listID))
	return sync(LIST_ITEM_API_URL + id + '/', {
		method: 'PATCH',
		body: JSON.stringify(data)
	})
		.then(
			response =>  {
				dispatch(moveListItemSuccess(response.id, response.list_id))
				dispatch(fetchActiveList({id: null, reload: false, useCurrentFilters: true}))
			},
			error => {
				dispatch(reorderListItemPreview(id, initialOrder))
				dispatch(genericAPIActionFailure(error.message))
			}
		)
}


export const deleteListItem = (id) => (dispatch) => {
	dispatch(deleteListItemRequest(id))
	return sync(LIST_ITEM_API_URL + id + '/', {
		method: 'DELETE'
	})
		.then(
			response => {
				dispatch(deleteListItemSuccess(id)),
				dispatch(fetchActiveList({id: null, reload: false, useCurrentFilters: true}))
			},
			error => dispatch(genericAPIActionFailure(error.message))
		)
}


export const reorderListItem = (id, order, initialOrder) => (dispatch) => {
	dispatch(reorderListItemRequest(id, order))
	return sync(LIST_ITEM_API_URL + id + '/reorder/', {
		method: 'POST',
		body: JSON.stringify({order: order})
	})
		.then(
			response => {
				dispatch(reorderListItemSuccess(id, order))
				dispatch(fetchActiveList({id: null, reload: false, useCurrentFilters: true}))
			},
			error => {
				dispatch(reorderListItemPreview(id, initialOrder))
				dispatch(genericAPIActionFailure(error.message))
			}
		)
}


export const previewListItemOrder = (dragID, dropOrder) => (dispatch) => {
	return dispatch(reorderListItemPreview(dragID, dropOrder))
}
