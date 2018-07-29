import { normalize } from 'normalizr'

import { sync } from './base'
import { fetchActiveList } from './list'
import * as schema from './schema'


export const CREATE_LIST_ITEM_REQUEST = 'CREATE_LIST_ITEM_REQUEST'
export const CREATE_LIST_ITEM_SUCCESS = 'CREATE_LIST_ITEM_SUCCESS'
export const FETCH_LIST_ITEM_REQUEST = 'FETCH_LIST_ITEM_REQUEST'
export const FETCH_LIST_ITEM_SUCCESS = 'FETCH_LIST_ITEM_SUCCESS'
export const DELETE_LIST_ITEM_REQUEST = 'DELETE_LIST_ITEM_REQUEST'
export const DELETE_LIST_ITEM_SUCCESS = 'DELETE_LIST_ITEM_SUCCESS'
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


const fetchListItemRequest = (id) => ({
	type: FETCH_LIST_ITEM_REQUEST,
	id
})


const fetchListItemSuccess = (data, id) => ({
	type: FETCH_LIST_ITEM_SUCCESS,
	data: normalize(data, schema.listItemSchema),
	id
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
		})
	.then(
		response => dispatch(fetchActiveList(listID, listID))
	)
}


export const updateListItem = (id, data) => (dispatch) => {
	dispatch(fetchListItemRequest(id))
	return sync(LIST_ITEM_API_URL + id + '/', {
		method: 'PATCH',
		body: JSON.stringify(data)
	})
	.then(
		response => dispatch(fetchListItemSuccess(response, id)))
	.then(
		response => {
			const id = response.data.result
			const listID = response.data.entities.listItems[id].list_id
			dispatch(fetchActiveList(listID, listID))
		}
	)
}


export const moveListItem = (id, listID) => (dispatch) => {
	let data = {list_id: listID}
	dispatch(moveListItemRequest(id, listID))
	return sync(LIST_ITEM_API_URL + id + '/', {
		method: 'PATCH',
		body: JSON.stringify(data)
	})
	.then(
		response => {
			dispatch(moveListItemSuccess(response.id, response.list_id))
		}
	)
}


export const deleteListItem = (id, listID) => (dispatch) => {
	dispatch(deleteListItemRequest(id, listID))
	return sync(LIST_ITEM_API_URL + id + '/', {
		method: 'DELETE'
	})
	.then(
		response => dispatch(fetchActiveList(listID, listID)))
	.then(
		response => dispatch(deleteListItemSuccess(id))
	)
}


export const reorderListItem = (id, order, listID) => (dispatch) => {
	dispatch(reorderListItemRequest(id, order))
	return sync(LIST_ITEM_API_URL + id + '/reorder/', {
		method: 'POST',
		body: JSON.stringify({order: order})
	})
	.then(
		response => dispatch(reorderListItemSuccess(id, order))
	)
}


export const previewListItemOrder = (dragID, dropOrder) => (dispatch) => {
	return dispatch(reorderListItemSuccess(dragID, dropOrder))
}
