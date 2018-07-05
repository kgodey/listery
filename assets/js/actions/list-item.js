import { sync } from './base'
import { fetchActiveList } from './list'

export const REQUEST_NEW_LIST_ITEM = 'REQUEST_NEW_LIST_ITEM'
export const RECEIVE_NEW_LIST_ITEM = 'RECEIVE_NEW_LIST_ITEM'
export const REQUEST_LIST_ITEM_UPDATE = 'REQUEST_LIST_ITEM_UPDATE'
export const RECEIVE_UPDATED_LIST_ITEM = 'RECEIVE_UPDATED_LIST_ITEM'
export const REQUEST_LIST_ITEM_DELETION = 'REQUEST_LIST_ITEM_DELETION'
export const RECEIVE_DELETED_LIST_ITEM = 'RECEIVE_DELETED_LIST_ITEM'
export const REQUEST_LIST_ITEM_REORDER = 'REQUEST_LIST_ITEM_REORDER'
export const RECEIVE_REORDERED_LIST_ITEM = 'RECEIVE_REORDERED_LIST_ITEM'
export const RECEIVE_MOVED_LIST_ITEM = 'RECEIVE_MOVED_LIST_ITEM'

const LIST_ITEM_API_URL = '/api/v2/list_items/'


const requestNewListItem = (data) => ({
	type: REQUEST_NEW_LIST_ITEM,
	data
})


const receiveNewListItem = (data) => ({
	type: RECEIVE_NEW_LIST_ITEM,
	data
})


const requestListItemUpdate = (id, data) => ({
	type: REQUEST_LIST_ITEM_UPDATE,
	id,
	data
})


const receiveUpdatedListItem = (data) => ({
	type: RECEIVE_UPDATED_LIST_ITEM,
	data
})


const requestListItemDeletion = (id, listID) => ({
	type: REQUEST_LIST_ITEM_DELETION,
	id,
	listID
})


const receiveDeletedListItem = (id) => ({
	type: RECEIVE_DELETED_LIST_ITEM,
	id
})


const requestListItemReorder = (id, order) => ({
	type: REQUEST_LIST_ITEM_REORDER,
	id,
	order
})


const receiveReorderedListItem = (id, order) => ({
	type: RECEIVE_REORDERED_LIST_ITEM,
	id,
	order
})


const receiveMovedListItem = (id, data) => ({
	type: RECEIVE_MOVED_LIST_ITEM,
	id,
	data
})


export const createListItem = (title, listID) => {
	let itemData = {
		title: title,
		list_id: listID
	}
	return function(dispatch) {
		dispatch(requestNewListItem(itemData))
		return sync(LIST_ITEM_API_URL, {
			method: 'POST',
			body: JSON.stringify(itemData)
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveNewListItem(data)))
		.then(
			response => dispatch(fetchActiveList(listID, listID))
		)
	}
}


export const updateListItem = (id, data) => {
	return function(dispatch) {
		dispatch(requestListItemUpdate(id, data))
		return sync(LIST_ITEM_API_URL + id + '/', {
			method: 'PATCH',
			body: JSON.stringify(data)
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveUpdatedListItem(data)))
		.then(
			response => {
				let listID = response.data.list_id
				dispatch(fetchActiveList(listID, listID))
			}
		)
	}
}


export const moveListItem = (id, listID, oldListID) => {
	return function(dispatch) {
		let data = {list_id: listID}
		dispatch(requestListItemUpdate(id, data))
		return sync(LIST_ITEM_API_URL + id + '/', {
			method: 'PATCH',
			body: JSON.stringify(data)
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveMovedListItem(data)))
		.then(
			response => dispatch(fetchActiveList(oldListID, oldListID))
		)
	}
}


export const deleteListItem = (id, listID) => {
	return function(dispatch) {
		dispatch(requestListItemDeletion(id, listID))
		return sync(LIST_ITEM_API_URL + id + '/', {
			method: 'DELETE'
		})
		.then(
			response => dispatch(fetchActiveList(listID, listID)))
		.then(
			data => dispatch(receiveDeletedListItem(id))
		)
	}
}


export const reorderListItem = (id, order, listID) => {
	return function(dispatch) {
		dispatch(requestListItemReorder(id, order))
		return sync(LIST_ITEM_API_URL + id + '/reorder/', {
			method: 'POST',
			body: JSON.stringify({order: order})
		})
		.then(
			response => response.json())
		.then(
			data => dispatch(receiveReorderedListItem(id, order))
		)
	}
}


export const previewListItemOrder = (dragID, dropOrder) => {
	return function(dispatch) {
		return dispatch(receiveReorderedListItem(dragID, dropOrder))
	}
}
