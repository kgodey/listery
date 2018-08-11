import { normalize } from 'normalizr'

import { sync } from './base'
import { genericAPIActionFailure } from './common'
import { fetchActiveList } from './list'
import * as schema from './schema'


export const CREATE_LIST_ITEM_REQUEST = 'CREATE_LIST_ITEM_REQUEST'
export const CREATE_LIST_ITEM_SUCCESS = 'CREATE_LIST_ITEM_SUCCESS'
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


const LIST_ITEM_API_URL = '/api/v2/list_items/'


const createListItemRequest = (data) => ({
	type: CREATE_LIST_ITEM_REQUEST,
	data
})


const createListItemSuccess = (data, id) => ({
	type: CREATE_LIST_ITEM_SUCCESS,
	data: normalize(data, schema.listItemSchema),
	id
})


const updateListItemRequest = (id, data) => ({
	type: UPDATE_LIST_ITEM_REQUEST,
	data,
	id
})


const updateListItemSuccess = (data, id) => ({
	type: UPDATE_LIST_ITEM_SUCCESS,
	data: normalize(data, schema.listItemSchema),
	id
})


const updateListItemError = (id, errorMessage, data) => ({
	type: UPDATE_LIST_ITEM_ERROR,
	id,
	data: normalize(data, schema.listItemSchema),
	errorMessage
})


const deleteListItemRequest = (id, listID) => ({
	type: DELETE_LIST_ITEM_REQUEST,
	id,
	listID
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


export const createListItem = (title, listID) => (dispatch) => {
	let itemData = {
		title: title,
		list_id: listID
	}
	dispatch(createListItemRequest(itemData))
	return sync(LIST_ITEM_API_URL, {
		method: 'POST',
		body: JSON.stringify(itemData)
	})
	.then(
		response => {
			dispatch(createListItemSuccess(response, response.id))
			dispatch(fetchActiveList(listID, false))
		},
		error => dispatch(genericAPIActionFailure(error.message))
	)
}


export const updateListItem = (id, data, originalData) => (dispatch) => {
	dispatch(updateListItemRequest(id, data))
	return sync(LIST_ITEM_API_URL + id + '/', {
		method: 'PATCH',
		body: JSON.stringify(data)
	})
	.then(
		response => dispatch(updateListItemSuccess(response, id)),
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
			dispatch(fetchActiveList(listID, false))
		},
		error => {
			dispatch(reorderListItemPreview(id, initialOrder))
			dispatch(genericAPIActionFailure(error.message))
		}
	)
}


export const deleteListItem = (id, listID) => (dispatch) => {
	dispatch(deleteListItemRequest(id, listID))
	return sync(LIST_ITEM_API_URL + id + '/', {
		method: 'DELETE'
	})
	.then(
		response => {
			dispatch(deleteListItemSuccess(id)),
			dispatch(fetchActiveList(listID, false))
		},
		error => dispatch(genericAPIActionFailure(error.message))
	)
}


export const reorderListItem = (id, order, listID, initialOrder) => (dispatch) => {
	dispatch(reorderListItemRequest(id, order))
	return sync(LIST_ITEM_API_URL + id + '/reorder/', {
		method: 'POST',
		body: JSON.stringify({order: order})
	})
	.then(
		response => {
			dispatch(reorderListItemSuccess(id, order))
			dispatch(fetchActiveList(listID, false))
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
