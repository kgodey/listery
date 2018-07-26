import { normalize } from 'normalizr'

import { sync } from './base'
import { fetchActiveList } from './list'
import * as schema from './schema'


export const FETCH_LIST_ITEM_REQUEST = 'FETCH_LIST_ITEM_REQUEST'
export const FETCH_LIST_ITEM_SUCCESS = 'FETCH_LIST_ITEM_SUCCESS'
export const DELETE_LIST_ITEM_REQUEST = 'DELETE_LIST_ITEM_REQUEST'
export const DELETE_LIST_ITEM_SUCCESS = 'DELETE_LIST_ITEM_SUCCESS'
export const REORDER_LIST_ITEM_REQUEST = 'REORDER_LIST_ITEM_REQUEST'
export const REORDER_LIST_ITEM_SUCCESS = 'REORDER_LIST_ITEM_SUCCESS'


const LIST_ITEM_API_URL = '/api/v2/list_items/'


const fetchListItemRequest = (data, id) => ({
	type: FETCH_LIST_ITEM_REQUEST,
	data,
	id
})


const fetchListItemSuccess = (data) => ({
	type: FETCH_LIST_ITEM_SUCCESS,
	data: normalize(data, schema.listItemSchema)
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


export const createListItem = (title, listID) => (dispatch) => {
	let itemData = {
		title: title,
		list_id: listID
	}
	dispatch(fetchListItemRequest(itemData))
	return sync(LIST_ITEM_API_URL, {
		method: 'POST',
		body: JSON.stringify(itemData)
	})
	.then(
		response => response.json())
	.then(
		data => dispatch(fetchListItemSuccess(data)))
	.then(
		response => dispatch(fetchActiveList(listID, listID))
	)
}


export const updateListItem = (id, data) => (dispatch) => {
	dispatch(fetchListItemRequest(data, id))
	return sync(LIST_ITEM_API_URL + id + '/', {
		method: 'PATCH',
		body: JSON.stringify(data)
	})
	.then(
		response => response.json())
	.then(
		data => dispatch(fetchListItemSuccess(data)))
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
	dispatch(fetchListItemRequest(data, id))
	return sync(LIST_ITEM_API_URL + id + '/', {
		method: 'PATCH',
		body: JSON.stringify(data)
	})
	.then(
		response => response.json())
	.then(
		response => {
			dispatch(deleteListItemSuccess(response.id))
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
		data => dispatch(deleteListItemSuccess(id))
	)
}


export const reorderListItem = (id, order, listID) => (dispatch) => {
	dispatch(reorderListItemRequest(id, order))
	return sync(LIST_ITEM_API_URL + id + '/reorder/', {
		method: 'POST',
		body: JSON.stringify({order: order})
	})
	.then(
		response => response.json())
	.then(
		data => dispatch(reorderListItemSuccess(id, order))
	)
}


export const previewListItemOrder = (dragID, dropOrder) => (dispatch) => {
	return dispatch(reorderListItemSuccess(dragID, dropOrder))
}
